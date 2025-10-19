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

  // Identity Verification Documents
  //   idDocumentType: varchar("id_document_type", { length: 50 }), // Passport, Driver's License, National ID
  //   idDocumentNumber: varchar("id_document_number", { length: 100 }),
  //   idDocumentUrl: text("id_document_url"), // Cloudinary URL

  //   // Business Documents (if applicable)
  //   businessRegistrationNumber: varchar("business_registration_number", {
  //     length: 100,
  //   }),
  //   taxIdNumber: varchar("tax_id_number", { length: 100 }),
  //   businessDocumentUrl: text("business_document_url"), // Cloudinary URL

  //   // Bank/Payout Information
  //   bankName: varchar("bank_name", { length: 255 }),
  //   accountHolderName: varchar("account_holder_name", { length: 255 }),
  //   accountNumber: varchar("account_number", { length: 255 }), // Should be encrypted in production
  //   routingNumber: varchar("routing_number", { length: 100 }),
  //   swiftCode: varchar("swift_code", { length: 50 }),

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
  //   agreedToFees: boolean("agreed_to_fees").notNull().default(false), // Platform fee agreement

  // Status & Verification
  status: creatorStatusEnum().notNull().default("pending"),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  isPhoneVerified: boolean("is_phone_verified").notNull().default(false),
  //   isIdentityVerified: boolean("is_identity_verified").notNull().default(false),

  //   // Approval Process
  //   approvedAt: timestamp("approved_at"),
  //   approvedBy: integer("approved_by"), // Admin user ID who approved
  //   rejectionReason: text("rejection_reason"),
  //   rejectedAt: timestamp("rejected_at"),

  // Profile Completion
  //   profileCompleted: boolean("profile_completed").notNull().default(false),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

// Type exports
export type Creator = typeof creatorsTable.$inferSelect;
export type NewCreator = typeof creatorsTable.$inferInsert;
