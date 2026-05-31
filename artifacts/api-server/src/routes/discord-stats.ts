import { Router, type IRouter } from "express";

const router: IRouter = Router();

let cache: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 60_000; // 1 minute

router.get("/discord-stats", async (req, res) => {
  const token = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !guildId) {
    res.status(503).json({ error: "Discord not configured" });
    return;
  }

  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    res.json(cache.data);
    return;
  }

  try {
    const r = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}?with_counts=true`,
      { headers: { Authorization: `Bot ${token}` } }
    );

    if (!r.ok) {
      req.log.error({ status: r.status }, "Discord API error");
      res.status(502).json({ error: "Discord API error" });
      return;
    }

    const guild = await r.json() as {
      name: string;
      approximate_member_count: number;
      approximate_presence_count: number;
      icon: string | null;
    };

    const data = {
      name: guild.name,
      memberCount: guild.approximate_member_count,
      onlineCount: guild.approximate_presence_count,
      icon: guild.icon
        ? `https://cdn.discordapp.com/icons/${guildId}/${guild.icon}.webp?size=128`
        : null,
    };

    cache = { data, ts: Date.now() };
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch Discord stats");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
