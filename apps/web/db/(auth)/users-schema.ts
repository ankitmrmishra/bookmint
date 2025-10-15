// import { integer } from "drizzle-orm/gel-core";
import {
  pgTable,
  varchar,
  integer,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  wallet: varchar("wallet", { length: 64 }).notNull().unique(),
  name: varchar({ length: 255 }),
  username: varchar({ length: 20 }).unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
