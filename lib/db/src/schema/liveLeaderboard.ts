import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const liveLeaderboardTable = pgTable("live_leaderboard_config", {
  id: serial("id").primaryKey(),
  guildId: text("guild_id").notNull().unique(),
  channelId: text("channel_id").notNull(),
  messageId: text("message_id"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type LiveLeaderboard = typeof liveLeaderboardTable.$inferSelect;
