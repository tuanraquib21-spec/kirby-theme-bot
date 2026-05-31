import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  type Interaction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { logger } from "./logger";

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const APP_ID = "1494267274222370916";

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

async function registerCommands() {
  if (!TOKEN || !GUILD_ID) return;
  const rest = new REST().setToken(TOKEN);
  const commands = [
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
  ];
  try {
    await rest.put(Routes.applicationGuildCommands(APP_ID, GUILD_ID), { body: commands });
    logger.info("Discord slash commands registered");
  } catch (err) {
    logger.error({ err }, "Failed to register slash commands");
  }
}

export function startDiscordBot() {
  if (!TOKEN) {
    logger.warn("DISCORD_BOT_TOKEN not set — Discord bot disabled");
    return;
  }

  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildEmojisAndStickers] });

  client.once(Events.ClientReady, async (c) => {
    logger.info({ tag: c.user.tag }, "Discord bot connected");
    await registerCommands();
  });

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "rules") {
      const embed = new EmbedBuilder()
        .setTitle("✨ The Sacred Principles of /ashura ✨")
        .setDescription("These are the laws of Dream Land. Violating them may result in consequences from the High Council.")
        .setColor(0xFF5C8D)
        .addFields(RULES.map(r => ({ name: `${r.num}. ${r.title}`, value: r.desc, inline: false })))
        .setFooter({ text: "Add dsc.gg/ashuracommunity to your status for a special role! ⭐" });

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (interaction.commandName === "emojis") {
      const guild = interaction.guild;
      if (!guild) {
        await interaction.reply({ content: "This command only works in a server.", ephemeral: true });
        return;
      }

      const kirbyEmojis = guild.emojis.cache
        .filter(e => e.name?.startsWith("kirby_"))
        .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));

      if (kirbyEmojis.size === 0) {
        await interaction.reply({ content: "No Kirby emojis found!", ephemeral: true });
        return;
      }

      const emojiList = kirbyEmojis.map(e => `${e.toString()} \`:${e.name}:\``).join("\n");

      const embed = new EmbedBuilder()
        .setTitle("🌟 Kirby Emojis — /ashura")
        .setDescription(`Use these anywhere in the server!\n\n${emojiList}`)
        .setColor(0xFF5C8D)
        .setFooter({ text: `${kirbyEmojis.size} Kirby emojis available` });

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (interaction.commandName === "server") {
      const guild = interaction.guild;
      if (!guild) {
        await interaction.reply({ content: "This command only works in a server.", ephemeral: true });
        return;
      }

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
        )
        .addFields({ name: "🔗 Join", value: "[dsc.gg/ashura](https://dsc.gg/ashura)", inline: false })
        .setFooter({ text: "Owned by RealAsh • Created by Alpy" });

      await interaction.reply({ embeds: [embed], ephemeral: true });
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
