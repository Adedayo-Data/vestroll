import { NextRequest } from "next/server";
import { ApiResponse } from "@/api/utils/api-response";
import { AppError } from "@/api/utils/errors";
import { AuthUtils } from "@/api/utils/auth";
import { TwoFactorService } from "@/api/services/two-factor.service";
import { EmailService } from "@/api/services/email.service";
import { VerifyTwoFactorSchema } from "@/api/validations/two-factor.schema";
import { ZodError } from "zod";
import { db } from "@/api/db";
import { users } from "@/api/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/auth/2fa/verify
 * Verify 2FA during login
 *
 * Request body: { userId: string, totpCode?: string, backupCode?: string }
 * Returns: { accessToken: string, refreshToken: string, user: object }
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await req.json();
    const validatedData = VerifyTwoFactorSchema.parse(body);

    // 2. Get client info for logging
    const ipAddress = AuthUtils.getClientIp(req);
    const userAgent = AuthUtils.getUserAgent(req);

    // 3. Verify 2FA
    const result = await TwoFactorService.verifyTwoFactor(
      validatedData.userId,
      validatedData.totpCode,
      validatedData.backupCode,
      ipAddress,
      userAgent
    );

    // 4. Fetch user data
    const [user] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        status: users.status,
        twoFactorEnabled: users.twoFactorEnabled,
      })
      .from(users)
      .where(eq(users.id, validatedData.userId));

    if (!user) {
      return ApiResponse.error("User not found", 404);
    }

    // 5. Generate tokens
    const accessToken = AuthUtils.generateToken(user.id, user.email);
    // In a real app, you'd also generate a refresh token with longer expiry
    const refreshToken = AuthUtils.generateToken(user.id, user.email);

    // 6. Return success with tokens and user
    return ApiResponse.success(
      {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          status: user.status,
          twoFactorEnabled: user.twoFactorEnabled,
        },
        method: result.method,
      },
      "2FA verification successful",
      200
    );
  } catch (error) {
    // Get user info for email notification if available
    if (error instanceof AppError) {
      // Send failed attempt email for rate limiting or lockout
      if (error.statusCode === 403 || error.statusCode === 429) {
        try {
          const body = await req.clone().json();
          if (body.userId) {
            const [user] = await db
              .select()
              .from(users)
              .where(eq(users.id, body.userId));

            if (user) {
              const ipAddress = AuthUtils.getClientIp(req);
              await EmailService.sendFailedTwoFactorAttemptEmail(
                user.email,
                user.firstName,
                ipAddress,
                user.failedTwoFactorAttempts
              );

              // Send account locked email if applicable
              if (error.message.includes("locked")) {
                await EmailService.sendAccountLockedEmail(user.email, user.firstName);
              }
            }
          }
        } catch {
          // Ignore email errors
        }
      }

      return ApiResponse.error(error.message, error.statusCode, error.errors);
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      return ApiResponse.error("Validation failed", 400, { fieldErrors });
    }

    // Log internal error for debugging
    console.error("[2FA Verify Error]", error);

    return ApiResponse.error("Internal server error", 500);
  }
}
