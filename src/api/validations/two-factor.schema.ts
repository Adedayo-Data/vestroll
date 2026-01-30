import { z } from "zod";

// TOTP code validation - exactly 6 digits
const totpCodeSchema = z
  .string()
  .length(6, "TOTP code must be exactly 6 digits")
  .regex(/^\d{6}$/, "TOTP code must contain only digits");

// Backup code validation - format: XXXX-XXXX-XXXX
const backupCodeSchema = z
  .string()
  .regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/, "Invalid backup code format. Expected format: XXXX-XXXX-XXXX");

// POST /api/auth/2fa/verify-setup - Complete 2FA setup
export const VerifySetupSchema = z.object({
  totpCode: totpCodeSchema,
});

// POST /api/auth/2fa/verify - Verify 2FA during login
export const VerifyTwoFactorSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  totpCode: totpCodeSchema.optional(),
  backupCode: backupCodeSchema.optional(),
}).refine(
  (data) => data.totpCode || data.backupCode,
  { message: "Either totpCode or backupCode is required" }
);

// POST /api/auth/2fa/disable - Disable 2FA
export const DisableTwoFactorSchema = z.object({
  password: z.string().min(1, "Password is required"),
  totpCode: totpCodeSchema,
});

// POST /api/auth/2fa/regenerate-backup-codes - Regenerate backup codes
export const RegenerateBackupCodesSchema = z.object({
  totpCode: totpCodeSchema,
});

// Type exports
export type VerifySetupInput = z.infer<typeof VerifySetupSchema>;
export type VerifyTwoFactorInput = z.infer<typeof VerifyTwoFactorSchema>;
export type DisableTwoFactorInput = z.infer<typeof DisableTwoFactorSchema>;
export type RegenerateBackupCodesInput = z.infer<typeof RegenerateBackupCodesSchema>;
