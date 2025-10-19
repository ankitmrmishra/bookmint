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
  email: varchar({ length: 20 }).unique(),
  password: varchar({ length: 20 }).unique(), // passwword will hashed and then stored

  bio: text(),
  profileImage: text("profile_image"),
  coverImage: text("profile_image"),

  country: varchar({ length: 100 }),
  city: varchar({ length: 100 }),

  currency: varchar({ length: 3 }).notNull().default("INR"),

  timezone: varchar({ length: 100 }).default("UTC"),
  lastPasswordChange: timestamp("last_password_change"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});
