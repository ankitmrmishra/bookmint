import {
  pgTable,
  varchar,
  integer,
  text,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema";

export const eventsTable = pgTable("events", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  category: varchar({ length: 100 }).notNull(), // NEW: Event category
  imageUrl: text("image_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(), // UPDATED: Made required
  date: timestamp().notNull(),
  venue: varchar({ length: 255 }).notNull(), // CHANGED: from 'location' to 'venue'
  city: varchar({ length: 100 }).notNull(), // NEW: Separate city field
  price: decimal({ precision: 10, scale: 2 }).notNull(), // NEW: Ticket price
  organizerId: integer("organizer_id")
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Event = typeof eventsTable.$inferSelect;
export type NewEvent = typeof eventsTable.$inferInsert;
