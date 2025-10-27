import {
  pgTable,
  varchar,
  integer,
  timestamp,
  text,
  primaryKey,
  boolean,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  wallet: varchar("wallet", { length: 64 }).unique(), // Made optional since OAuth users might not have wallet initially
  name: varchar({ length: 255 }),
  username: varchar({ length: 20 }).unique(),
  email: varchar({ length: 255 }).notNull().unique(), // Added notNull
  emailVerified: timestamp("emailVerified", { mode: "date" }), // Changed to timestamp (NextAuth standard)
  password: varchar({ length: 255 }),
  image: text("image"),
  bio: text(),
  profileImage: text("profile_image"),
  coverImage: text("cover_image"),

  country: varchar({ length: 100 }),
  city: varchar({ length: 100 }),

  currency: varchar({ length: 3 }).notNull().default("INR"),

  timezone: varchar({ length: 100 }).default("UTC"),
  lastPasswordChange: timestamp("last_password_change"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

// New table for OTP verification
export const emailVerificationTable = pgTable("email_verification", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  email: varchar({ length: 255 }).notNull(),
  otp: varchar({ length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer().notNull().default(0),
  verified: boolean().notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);
