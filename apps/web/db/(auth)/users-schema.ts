// import { integer } from "drizzle-orm/gel-core";
import {
  pgTable,
  varchar,
  integer,
  date,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  wallet: varchar("wallet", { length: 64 }).notNull().unique(),
  name: varchar({ length: 255 }),
  username: varchar({ length: 20 }).unique(),
  role: varchar({ length: 20 }).default("user").notNull(), // 'user', 'organizer', 'admin'
  bio: text(),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
