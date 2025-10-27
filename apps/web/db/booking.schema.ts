// bookings.schema.ts
import {
  pgTable,
  varchar,
  integer,
  timestamp,
  uuid,
  text,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { eventsTable } from "./event.schema";

export const bookingsTable = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventId: integer("event_id")
      .references(() => eventsTable.id, { onDelete: "cascade" })
      .notNull(),
    // FIXED: Changed from uuid to text to match users.id
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    status: varchar({ length: 20 }).default("confirmed").notNull(),
    numberOfTickets: integer("number_of_tickets").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("bookings_user_id_idx").on(table.userId),
    index("bookings_event_id_idx").on(table.eventId),
  ]
);

export type Booking = typeof bookingsTable.$inferSelect;
export type NewBooking = typeof bookingsTable.$inferInsert;
