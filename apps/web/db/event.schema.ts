import {
  pgTable,
  varchar,
  integer,
  text,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const eventsTable = pgTable("events", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  category: varchar({ length: 100 }).notNull(),
  imageUrl: text("image_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  date: timestamp().notNull(),
  venue: varchar({ length: 255 }).notNull(),
  city: varchar({ length: 100 }).notNull(),
  price: decimal({ precision: 10, scale: 2 }).notNull(),
  // FIXED: Changed from integer to text to match users.id
  organizerId: text("organizer_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Event = typeof eventsTable.$inferSelect;
export type NewEvent = typeof eventsTable.$inferInsert;
