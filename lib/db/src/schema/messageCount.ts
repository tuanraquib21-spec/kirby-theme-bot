import { pgTable, serial, text, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const messageCountsTable = pgTable("message_counts", {
  id: serial("id").primaryKey(),
  guildId: text("guild_id").notNull(),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  count: integer("count").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [unique().on(t.guildId, t.userId)]);

export const insertMessageCountSchema = createInsertSchema(messageCountsTable).omit({ id: true, updatedAt: true });
export type InsertMessageCount = z.infer<typeof insertMessageCountSchema>;
export type MessageCount = typeof messageCountsTable.$inferSelect;
