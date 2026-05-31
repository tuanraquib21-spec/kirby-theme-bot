import { Router, type Request, type Response } from "express";

const router = Router();

const DISCORD_PUBLIC_KEY = "8e48648fd49ed561816d805477f373c527ac25b2ba692df502a5e46df2bf1a03";

async function verifySignature(rawBody: Buffer, signature: string, timestamp: string): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      Buffer.from(DISCORD_PUBLIC_KEY, "hex"),
      "Ed25519",
      false,
      ["verify"],
    );
    const message = Buffer.concat([Buffer.from(timestamp, "utf8"), rawBody]);
    return await crypto.subtle.verify("Ed25519", key, Buffer.from(signature, "hex"), message);
  } catch {
    return false;
  }
}

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

router.post("/discord/interactions", async (req: Request, res: Response) => {
  const signature = req.headers["x-signature-ed25519"] as string | undefined;
  const timestamp = req.headers["x-signature-timestamp"] as string | undefined;
  const rawBody = req.rawBody;

  if (!signature || !timestamp || !rawBody) {
    res.status(401).json({ error: "Missing signature headers" });
    return;
  }

  const valid = await verifySignature(rawBody, signature, timestamp);
  if (!valid) {
    res.status(401).json({ error: "Invalid request signature" });
    return;
  }

  const interaction = JSON.parse(rawBody.toString()) as {
    type: number;
    data?: { name: string };
  };

  if (interaction.type === 1) {
    res.json({ type: 1 });
    return;
  }

  if (interaction.type === 2 && interaction.data?.name === "rules") {
    res.json({
      type: 4,
      data: {
        embeds: [
          {
            title: "✨ The Sacred Principles of /ashura ✨",
            description: "These are the laws of Dream Land. Violating them may result in consequences from the High Council.",
            color: 0xFF5C8D,
            fields: RULES.map(r => ({
              name: `${r.num}. ${r.title}`,
              value: r.desc,
              inline: false,
            })),
            footer: { text: "Add dsc.gg/ashuracommunity to your status for a special role! ⭐" },
          },
        ],
        flags: 64,
      },
    });
    return;
  }

  res.status(400).json({ error: "Unknown interaction" });
});

export default router;
