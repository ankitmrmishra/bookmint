import {
  pgTable,
  varchar,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "../(auth)/users-schema";

export const eventsTable = pgTable("events", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  imageUrl: text("image_url").notNull(),
  date: timestamp().notNull(),
  location: varchar({ length: 255 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  organizerId: integer("organizer_id")
    .references(() => usersTable.id)
    .notNull(), // References same users table
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Event = typeof eventsTable.$inferSelect;
export type NewEvent = typeof eventsTable.$inferInsert;
