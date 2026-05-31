import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!TOKEN || !GUILD_ID) {
  console.error("Missing DISCORD_BOT_TOKEN or DISCORD_GUILD_ID");
  process.exit(1);
}

const BASE = "https://discord.com/api/v10";

const headers = {
  Authorization: `Bot ${TOKEN}`,
  "Content-Type": "application/json",
};

async function api(method: string, endpoint: string, body?: object) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json: unknown;
  try { json = JSON.parse(text); } catch { json = text; }
  if (!res.ok) {
    console.error(`[${method} ${endpoint}] ${res.status}:`, JSON.stringify(json));
  }
  return { ok: res.ok, status: res.status, data: json };
}

const KIRBY_PALETTE = [
  0xFF5C8D, // Kirby pink
  0xFFD700, // Star gold
  0xA8D8F0, // Dream sky blue
  0xC8A2E8, // Lilac
  0xFF9ED2, // Light pink
  0x98E8B0, // Mint green
  0xFFB347, // Peach
  0xDDA0DD, // Plum
  0xFF6EB4, // Hot pink
  0xB0E0E6, // Powder blue
];

const KIRBY_CHANNEL_TOPICS: Record<string, string> = {
  general: "Welcome to Dream Land! Chat freely here in the language of the realm.",
  announcements: "Official decrees from the High Council of /ashura.",
  rules: "The sacred principles of /ashura — read before entering Dream Land.",
  introductions: "Share your story, traveler! Tell us who you are.",
  "off-topic": "Anything goes here — just keep it within the sacred principles.",
  memes: "Share your finest star-powered memes and pixel art.",
  media: "Images, clips, and creative works from across Dream Land.",
  music: "Share the soundtrack of your journey.",
  gaming: "Talk games, share clips, and find party members.",
  art: "Showcase your creative work — Dream Land celebrates artists.",
  bots: "Bot commands go here. Keep the noise out of the main channels.",
  "bot-commands": "Use your bot commands here. Keep the main chat clean.",
  suggestions: "Got ideas to improve /ashura? Drop them here!",
  support: "Need help? The High Council will assist you.",
};

async function applyKirbyRoles() {
  console.log("\n[Roles] Fetching roles...");
  const { ok, data } = await api("GET", `/guilds/${GUILD_ID}/roles`);
  if (!ok) return;

  const roles = data as Array<{ id: string; name: string; color: number; managed: boolean; position: number }>;
  const sortedRoles = roles
    .filter(r => r.name !== "@everyone" && !r.managed && r.position > 0)
    .sort((a, b) => b.position - a.position);

  console.log(`[Roles] Found ${sortedRoles.length} editable roles`);

  for (let i = 0; i < sortedRoles.length; i++) {
    const role = sortedRoles[i];
    const color = KIRBY_PALETTE[i % KIRBY_PALETTE.length];
    const { ok: updated } = await api("PATCH", `/guilds/${GUILD_ID}/roles/${role.id}`, { color });
    console.log(`  ${updated ? "✓" : "✗"} ${role.name} → #${color.toString(16).padStart(6, "0")}`);
    await new Promise(r => setTimeout(r, 300));
  }
}

async function applyKirbyChannelTopics() {
  console.log("\n[Channels] Fetching channels...");
  const { ok, data } = await api("GET", `/guilds/${GUILD_ID}/channels`);
  if (!ok) return;

  const channels = data as Array<{ id: string; name: string; type: number; topic?: string }>;
  const textChannels = channels.filter(c => c.type === 0);

  console.log(`[Channels] Found ${textChannels.length} text channels`);

  for (const ch of textChannels) {
    const nameLower = ch.name.toLowerCase().replace(/[-_]/g, "-");
    const topic = Object.entries(KIRBY_CHANNEL_TOPICS).find(
      ([key]) => nameLower.includes(key)
    )?.[1];

    if (topic && ch.topic !== topic) {
      const { ok: updated } = await api("PATCH", `/channels/${ch.id}`, { topic });
      console.log(`  ${updated ? "✓" : "✗"} #${ch.name}`);
      await new Promise(r => setTimeout(r, 500));
    } else {
      console.log(`  - #${ch.name} (skipped)`);
    }
  }
}

async function applyGuildDescription() {
  console.log("\n[Guild] Updating description...");
  const description = "Welcome to /ashura — a Dream Land community built on respect, creativity, and good vibes. Owned by RealAsh. Add dsc.gg/ashura to your status for a special role!";
  const { ok } = await api("PATCH", `/guilds/${GUILD_ID}`, { description });
  console.log(ok ? "  ✓ Description updated" : "  ✗ Failed (requires Community server)");
}

async function main() {
  console.log("=== Kirby Ashura Discord Theming Script ===");
  console.log(`Guild: ${GUILD_ID}`);

  await applyKirbyRoles();
  await applyKirbyChannelTopics();
  await applyGuildDescription();

  console.log("\n=== Done! Your server is now Kirby-themed ===");
  console.log("Note: To change the server icon/banner, go to Server Settings -> Overview in Discord");
  console.log("      (Banners require Boost Level 1+)");
}

main().catch(console.error);
