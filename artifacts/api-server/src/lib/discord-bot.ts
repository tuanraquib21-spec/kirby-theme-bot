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

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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
    }
  });

  client.on(Events.Error, (err) => {
    logger.error({ err }, "Discord client error");
  });

  client.login(TOKEN).catch((err) => {
    logger.error({ err }, "Discord bot failed to login");
  });
}
