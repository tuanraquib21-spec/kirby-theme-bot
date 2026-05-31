import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  type Interaction,
  type GuildMember,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { logger } from "./logger";

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const APP_ID = "1494267274222370916";

// In-memory warning store: userId -> list of { reason, date, moderator }
const warnings = new Map<string, Array<{ reason: string; date: string; moderator: string }>>();

const RULES = [
  { num: 1, title: "The Golden Gate", desc: "Keep it SFW. No explicit sexual content or 18+ media outside designated spaces." },
  { num: 2, title: "The Silver Shield", desc: "No hateful language, slurs, or harassment of any kind." },
  { num: 3, title: "The Copper Rule", desc: "No spamming, excessive pinging, or flooding channels." },
  { num: 4, title: "The Jade Pact", desc: "Keep drama, beef, and trauma dumps out of public channels." },
  { num: 5, title: "The Amber Warning", desc: "No doxxing or sharing personal info of others without consent." },
  { num: 6, title: "The Crimson Line", desc: "No piracy links, malware, or illegal content." },
  { num: 7, title: "The Great Taboo", desc: "Sexual jokes involving themes of violation or lack of consent are permanently forbidden." },
  { num: 8, title: "The Code of Originality", desc: "Do not replicate, plagiarize, or heavily take inspiration from ashura." },
];

function buildWelcomeEmbed(member: GuildMember) {
  return new EmbedBuilder()
    .setTitle("✨ Welcome to Dream Land!")
    .setDescription(
      `Hey ${member.user.username}, you just landed in **/ashura** — a cozy corner of the internet owned by **RealAsh**.\n\n` +
      `We're glad you're here! Here's everything you need to get started:`
    )
    .setColor(0xFF5C8D)
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: "📜 Read the Rules", value: "Use `/rules` in the server to see the sacred principles of Dream Land.", inline: false },
      { name: "⭐ Get a Special Role", value: "Add **dsc.gg/ashuracommunity** to your Discord status to earn a special Kirby-themed role!", inline: false },
      { name: "😄 Kirby Emojis", value: "Use `/emojis` to see all the custom Kirby emojis available in any channel.", inline: false },
      { name: "🔗 Invite Friends", value: "[dsc.gg/ashura](https://dsc.gg/ashura)", inline: true },
    )
    .setFooter({ text: "Owned by RealAsh • Created by Alpy • /ashura" })
    .setTimestamp();
}

async function registerCommands() {
  if (!TOKEN || !GUILD_ID) return;
  const rest = new REST().setToken(TOKEN);

  const MOD = PermissionFlagsBits.ModerateMembers;
  const KICK = PermissionFlagsBits.KickMembers;
  const BAN = PermissionFlagsBits.BanMembers;

  const commands = [
    // ── Info ────────────────────────────────────────────────────────────
    new SlashCommandBuilder()
      .setName("rules")
      .setDescription("Show the sacred principles of /ashura")
      .toJSON(),

    new SlashCommandBuilder()
      .setName("emojis")
      .setDescription("Show all Kirby emojis available in this server")
      .toJSON(),

    new SlashCommandBuilder()
      .setName("server")
      .setDescription("Show /ashura server info and stats")
      .toJSON(),

    new SlashCommandBuilder()
      .setName("welcome")
      .setDescription("Preview the welcome DM that new members receive")
      .toJSON(),

    // ── Moderation ───────────────────────────────────────────────────────
    new SlashCommandBuilder()
      .setName("warn")
      .setDescription("Issue a warning to a member")
      .setDefaultMemberPermissions(MOD)
      .addUserOption(o => o.setName("user").setDescription("Member to warn").setRequired(true))
      .addStringOption(o => o.setName("reason").setDescription("Reason for the warning").setRequired(true))
      .toJSON(),

    new SlashCommandBuilder()
      .setName("warnings")
      .setDescription("View all warnings for a member")
      .setDefaultMemberPermissions(MOD)
      .addUserOption(o => o.setName("user").setDescription("Member to check").setRequired(true))
      .toJSON(),

    new SlashCommandBuilder()
      .setName("clearwarnings")
      .setDescription("Clear all warnings for a member")
      .setDefaultMemberPermissions(MOD)
      .addUserOption(o => o.setName("user").setDescription("Member to clear").setRequired(true))
      .toJSON(),

    new SlashCommandBuilder()
      .setName("timeout")
      .setDescription("Timeout (mute) a member for a set duration")
      .setDefaultMemberPermissions(MOD)
      .addUserOption(o => o.setName("user").setDescription("Member to timeout").setRequired(true))
      .addIntegerOption(o =>
        o.setName("minutes")
          .setDescription("Duration in minutes (max 40320 = 4 weeks)")
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(40320)
      )
      .addStringOption(o => o.setName("reason").setDescription("Reason").setRequired(false))
      .toJSON(),

    new SlashCommandBuilder()
      .setName("untimeout")
      .setDescription("Remove timeout from a member")
      .setDefaultMemberPermissions(MOD)
      .addUserOption(o => o.setName("user").setDescription("Member to un-timeout").setRequired(true))
      .toJSON(),

    new SlashCommandBuilder()
      .setName("kick")
      .setDescription("Kick a member from the server")
      .setDefaultMemberPermissions(KICK)
      .addUserOption(o => o.setName("user").setDescription("Member to kick").setRequired(true))
      .addStringOption(o => o.setName("reason").setDescription("Reason").setRequired(false))
      .toJSON(),

    new SlashCommandBuilder()
      .setName("ban")
      .setDescription("Ban a member from the server")
      .setDefaultMemberPermissions(BAN)
      .addUserOption(o => o.setName("user").setDescription("Member to ban").setRequired(true))
      .addStringOption(o => o.setName("reason").setDescription("Reason").setRequired(false))
      .addIntegerOption(o =>
        o.setName("delete_days")
          .setDescription("Days of messages to delete (0-7)")
          .setRequired(false)
          .setMinValue(0)
          .setMaxValue(7)
      )
      .toJSON(),

    new SlashCommandBuilder()
      .setName("unban")
      .setDescription("Unban a user by their ID")
      .setDefaultMemberPermissions(BAN)
      .addStringOption(o => o.setName("user_id").setDescription("User ID to unban").setRequired(true))
      .addStringOption(o => o.setName("reason").setDescription("Reason").setRequired(false))
      .toJSON(),
  ];

  try {
    await rest.put(Routes.applicationGuildCommands(APP_ID, GUILD_ID), { body: commands });
    logger.info({ count: commands.length }, "Discord slash commands registered");
  } catch (err) {
    logger.error({ err }, "Failed to register slash commands");
  }
}

export function startDiscordBot() {
  if (!TOKEN) {
    logger.warn("DISCORD_BOT_TOKEN not set — Discord bot disabled");
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildMembers,
    ],
  });

  client.once(Events.ClientReady, async (c) => {
    logger.info({ tag: c.user.tag }, "Discord bot connected");
    await registerCommands();
  });

  // ── Auto welcome DM ──────────────────────────────────────────────────
  client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
    if (member.guild.id !== GUILD_ID) return;
    try {
      await member.send({ embeds: [buildWelcomeEmbed(member)] });
      logger.info({ userId: member.id }, "Welcome DM sent");
    } catch {
      logger.warn({ userId: member.id }, "Could not DM user (DMs likely disabled)");
    }
  });

  // ── Slash commands ───────────────────────────────────────────────────
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    // /rules
    if (commandName === "rules") {
      const embed = new EmbedBuilder()
        .setTitle("✨ The Sacred Principles of /ashura ✨")
        .setDescription("These are the laws of Dream Land. Violating them has consequences.")
        .setColor(0xFF5C8D)
        .addFields(RULES.map(r => ({ name: `${r.num}. ${r.title}`, value: r.desc, inline: false })))
        .setFooter({ text: "Add dsc.gg/ashuracommunity to your status for a special role! ⭐" });
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // /emojis
    if (commandName === "emojis") {
      const guild = interaction.guild;
      if (!guild) { await interaction.reply({ content: "Server only.", ephemeral: true }); return; }
      const kirbyEmojis = guild.emojis.cache
        .filter(e => e.name?.startsWith("kirby_"))
        .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      const list = kirbyEmojis.map(e => `${e.toString()} \`:${e.name}:\``).join("\n") || "No Kirby emojis found.";
      const embed = new EmbedBuilder()
        .setTitle("🌟 Kirby Emojis — /ashura")
        .setDescription(`Use these anywhere in the server!\n\n${list}`)
        .setColor(0xFF5C8D)
        .setFooter({ text: `${kirbyEmojis.size} Kirby emojis available` });
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // /server
    if (commandName === "server") {
      const guild = interaction.guild;
      if (!guild) { await interaction.reply({ content: "Server only.", ephemeral: true }); return; }
      await guild.fetch();
      const embed = new EmbedBuilder()
        .setTitle(`⭐ ${guild.name}`)
        .setDescription("Welcome to Dream Land — a community built on respect, creativity, and good vibes.")
        .setColor(0xFF5C8D)
        .setThumbnail(guild.iconURL({ size: 256 }))
        .addFields(
          { name: "👥 Members", value: guild.memberCount.toLocaleString(), inline: true },
          { name: "📅 Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
          { name: "🔒 Verification", value: ["None", "Low", "Medium", "High", "Very High"][guild.verificationLevel] ?? "Unknown", inline: true },
          { name: "🎭 Roles", value: guild.roles.cache.size.toString(), inline: true },
          { name: "💬 Channels", value: guild.channels.cache.size.toString(), inline: true },
          { name: "😄 Emojis", value: guild.emojis.cache.size.toString(), inline: true },
          { name: "🔗 Join", value: "[dsc.gg/ashura](https://dsc.gg/ashura)", inline: false },
        )
        .setFooter({ text: "Owned by RealAsh • Created by Alpy" });
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // /welcome
    if (commandName === "welcome") {
      const member = interaction.member as GuildMember;
      await interaction.reply({
        content: "📬 Preview of the welcome DM new members receive:",
        embeds: [buildWelcomeEmbed(member)],
        ephemeral: true,
      });
      return;
    }

    // /warn
    if (commandName === "warn") {
      const target = interaction.options.getMember("user") as GuildMember | null;
      const reason = interaction.options.getString("reason") ?? "No reason provided";
      if (!target) { await interaction.reply({ content: "User not found.", ephemeral: true }); return; }

      const entry = { reason, date: new Date().toISOString(), moderator: interaction.user.username };
      const userWarnings = warnings.get(target.id) ?? [];
      userWarnings.push(entry);
      warnings.set(target.id, userWarnings);

      try {
        await target.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("⚠️ You have been warned in /ashura")
              .setDescription(`**Reason:** ${reason}`)
              .setColor(0xFFD700)
              .addFields({ name: "Total warnings", value: userWarnings.length.toString(), inline: true })
              .setFooter({ text: "Please review the server rules with /rules" })
              .setTimestamp(),
          ],
        });
      } catch { /* user has DMs off */ }

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("⚠️ Warning Issued")
            .setColor(0xFFD700)
            .addFields(
              { name: "User", value: `${target.user.username} (${target.id})`, inline: true },
              { name: "Reason", value: reason, inline: false },
              { name: "Total warnings", value: userWarnings.length.toString(), inline: true },
            )
            .setFooter({ text: `Moderated by ${interaction.user.username}` })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
      return;
    }

    // /warnings
    if (commandName === "warnings") {
      const target = interaction.options.getUser("user");
      if (!target) { await interaction.reply({ content: "User not found.", ephemeral: true }); return; }
      const userWarnings = warnings.get(target.id) ?? [];
      if (userWarnings.length === 0) {
        await interaction.reply({ content: `✅ **${target.username}** has no warnings.`, ephemeral: true });
        return;
      }
      const embed = new EmbedBuilder()
        .setTitle(`⚠️ Warnings for ${target.username}`)
        .setColor(0xFFD700)
        .setDescription(userWarnings.map((w, i) =>
          `**${i + 1}.** ${w.reason}\n> <t:${Math.floor(new Date(w.date).getTime() / 1000)}:R> by **${w.moderator}**`
        ).join("\n\n"))
        .setFooter({ text: `${userWarnings.length} total warning(s)` });
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // /clearwarnings
    if (commandName === "clearwarnings") {
      const target = interaction.options.getUser("user");
      if (!target) { await interaction.reply({ content: "User not found.", ephemeral: true }); return; }
      warnings.delete(target.id);
      await interaction.reply({ content: `✅ Cleared all warnings for **${target.username}**.`, ephemeral: true });
      return;
    }

    // /timeout
    if (commandName === "timeout") {
      const target = interaction.options.getMember("user") as GuildMember | null;
      const minutes = interaction.options.getInteger("minutes", true);
      const reason = interaction.options.getString("reason") ?? "No reason provided";
      if (!target) { await interaction.reply({ content: "User not found.", ephemeral: true }); return; }
      try {
        await target.timeout(minutes * 60 * 1000, reason);
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("🔇 Member Timed Out")
              .setColor(0xFF9ED2)
              .addFields(
                { name: "User", value: `${target.user.username} (${target.id})`, inline: true },
                { name: "Duration", value: `${minutes} minute(s)`, inline: true },
                { name: "Reason", value: reason, inline: false },
              )
              .setFooter({ text: `Moderated by ${interaction.user.username}` })
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      } catch (err) {
        await interaction.reply({ content: `❌ Could not timeout this user. Do I have permission and is their role below mine?`, ephemeral: true });
      }
      return;
    }

    // /untimeout
    if (commandName === "untimeout") {
      const target = interaction.options.getMember("user") as GuildMember | null;
      if (!target) { await interaction.reply({ content: "User not found.", ephemeral: true }); return; }
      try {
        await target.timeout(null);
        await interaction.reply({ content: `✅ Timeout removed from **${target.user.username}**.`, ephemeral: true });
      } catch {
        await interaction.reply({ content: `❌ Could not remove timeout.`, ephemeral: true });
      }
      return;
    }

    // /kick
    if (commandName === "kick") {
      const target = interaction.options.getMember("user") as GuildMember | null;
      const reason = interaction.options.getString("reason") ?? "No reason provided";
      if (!target) { await interaction.reply({ content: "User not found.", ephemeral: true }); return; }
      if (!target.kickable) { await interaction.reply({ content: "❌ I cannot kick this user.", ephemeral: true }); return; }
      try {
        await target.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("👢 You have been kicked from /ashura")
              .setDescription(`**Reason:** ${reason}\n\nYou may rejoin at [dsc.gg/ashura](https://dsc.gg/ashura).`)
              .setColor(0xFF6EB4)
              .setTimestamp(),
          ],
        }).catch(() => {});
        await target.kick(reason);
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("👢 Member Kicked")
              .setColor(0xFF6EB4)
              .addFields(
                { name: "User", value: `${target.user.username} (${target.id})`, inline: true },
                { name: "Reason", value: reason, inline: false },
              )
              .setFooter({ text: `Moderated by ${interaction.user.username}` })
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      } catch {
        await interaction.reply({ content: "❌ Failed to kick.", ephemeral: true });
      }
      return;
    }

    // /ban
    if (commandName === "ban") {
      const target = interaction.options.getMember("user") as GuildMember | null;
      const reason = interaction.options.getString("reason") ?? "No reason provided";
      const deleteDays = interaction.options.getInteger("delete_days") ?? 0;
      if (!target) { await interaction.reply({ content: "User not found.", ephemeral: true }); return; }
      if (!target.bannable) { await interaction.reply({ content: "❌ I cannot ban this user.", ephemeral: true }); return; }
      try {
        await target.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("🔨 You have been banned from /ashura")
              .setDescription(`**Reason:** ${reason}`)
              .setColor(0xFF5C5C)
              .setTimestamp(),
          ],
        }).catch(() => {});
        await target.ban({ reason, deleteMessageDays: deleteDays as 0|1|2|3|4|5|6|7 });
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("🔨 Member Banned")
              .setColor(0xFF5C5C)
              .addFields(
                { name: "User", value: `${target.user.username} (${target.id})`, inline: true },
                { name: "Reason", value: reason, inline: false },
                { name: "Messages deleted", value: `${deleteDays} day(s)`, inline: true },
              )
              .setFooter({ text: `Moderated by ${interaction.user.username}` })
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      } catch {
        await interaction.reply({ content: "❌ Failed to ban.", ephemeral: true });
      }
      return;
    }

    // /unban
    if (commandName === "unban") {
      const userId = interaction.options.getString("user_id", true);
      const reason = interaction.options.getString("reason") ?? "No reason provided";
      const guild = interaction.guild;
      if (!guild) { await interaction.reply({ content: "Server only.", ephemeral: true }); return; }
      try {
        await guild.bans.remove(userId, reason);
        await interaction.reply({ content: `✅ User \`${userId}\` has been unbanned.`, ephemeral: true });
      } catch {
        await interaction.reply({ content: "❌ Could not unban. Make sure the ID is correct.", ephemeral: true });
      }
      return;
    }
  });

  client.on(Events.Error, (err) => {
    logger.error({ err }, "Discord client error");
  });

  client.login(TOKEN).catch((err) => {
    logger.error({ err }, "Discord bot failed to login");
  });
}
