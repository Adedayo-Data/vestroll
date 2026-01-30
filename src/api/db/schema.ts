import { pgTable, uuid, varchar, timestamp, integer, boolean, pgEnum, text } from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", ["pending_verification", "active", "suspended"]);
export const twoFactorMethodEnum = pgEnum("two_factor_method", ["totp", "backup_code"]);
export const oauthProviderEnum = pgEnum("oauth_provider", ["google", "apple"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  status: userStatusEnum("status").default("pending_verification").notNull(),
  // Two-factor authentication fields
  twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
  twoFactorSecret: text("two_factor_secret"),
  twoFactorEnabledAt: timestamp("two_factor_enabled_at"),
  // Account lockout fields
  failedTwoFactorAttempts: integer("failed_two_factor_attempts").default(0).notNull(),
  twoFactorLockoutUntil: timestamp("two_factor_lockout_until"),
  failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
  lockedUntil: timestamp("locked_until"),
  // OAuth fields
  oauthProvider: oauthProviderEnum("oauth_provider"),
  oauthId: varchar("oauth_id", { length: 255 }),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const emailVerifications = pgTable("email_verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  otpHash: varchar("otp_hash", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const backupCodes = pgTable("backup_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  codeHash: varchar("code_hash", { length: 255 }).notNull(),
  used: boolean("used").default(false).notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const twoFactorAttempts = pgTable("two_factor_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  success: boolean("success").notNull(),
  method: twoFactorMethodEnum("method").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trustedDevices = pgTable("trusted_devices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  deviceToken: varchar("device_token", { length: 255 }).notNull().unique(),
  deviceName: varchar("device_name", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at").notNull(),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  refreshTokenHash: varchar("refresh_token_hash", { length: 255 }).notNull(),
  deviceInfo: text("device_info"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at"),
});

export const loginAttempts = pgTable("login_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  success: boolean("success").notNull(),
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
