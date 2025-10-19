import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema";
import { eventsTable } from "./event.schema";

export const bookingsTable = pgTable("bookings", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  eventId: integer("event_id")
    .references(() => eventsTable.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => usersTable.id)
    .notNull(),
  status: varchar({ length: 20 }).default("confirmed").notNull(),
  numberOfTickets: integer("number_of_tickets").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
