import {
  pgTable,
  varchar,
  integer,
  text,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enum for creator status
export const creatorStatusEnum = pgEnum("creator_status", [
  "pending",
  "approved",
  "rejected",
  "suspended",
]);

// ==================== CREATORS TABLE ====================
// Separate entity for event creators with complete signup details
export const creatorsTable = pgTable("creators", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  // Wallet Authentication (Primary identifier)
  walletAddress: varchar("wallet_address", { length: 255 }).notNull().unique(),

  // Personal Information
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  phone: varchar({ length: 50 }),

  // Business Information
  businessName: varchar("business_name", { length: 255 }),
  businessType: varchar("business_type", { length: 100 }), // Individual, Company, Organization, Non-Profit
  bio: text(),
  website: varchar({ length: 500 }),

  // Location
  country: varchar({ length: 100 }).notNull(),
  city: varchar({ length: 100 }).notNull(),
  address: text(),
  zipCode: varchar("zip_code", { length: 20 }),

  // Social Media Links
  facebookUrl: varchar("facebook_url", { length: 500 }),
  twitterUrl: varchar("twitter_url", { length: 500 }),
  instagramUrl: varchar("instagram_url", { length: 500 }),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),

  // Terms & Agreements
  acceptedTerms: boolean("accepted_terms").notNull().default(false),
  acceptedPrivacyPolicy: boolean("accepted_privacy_policy")
    .notNull()
    .default(false),

  // Status & Verification
  status: creatorStatusEnum().notNull().default("pending"),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  isPhoneVerified: boolean("is_phone_verified").notNull().default(false),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

// Type exports
export type Creator = typeof creatorsTable.$inferSelect;
export type NewCreator = typeof creatorsTable.$inferInsert;
