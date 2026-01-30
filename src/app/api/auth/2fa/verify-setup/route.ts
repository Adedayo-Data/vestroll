import { NextRequest } from "next/server";
import { ApiResponse } from "@/api/utils/api-response";
import { AppError } from "@/api/utils/errors";
import { AuthUtils } from "@/api/utils/auth";
import { TwoFactorService } from "@/api/services/two-factor.service";
import { EmailService } from "@/api/services/email.service";
import { VerifySetupSchema } from "@/api/validations/two-factor.schema";
import { ZodError } from "zod";

/**
 * POST /api/auth/2fa/verify-setup
 * Complete 2FA setup (authenticated)
 *
 * Request body: { totpCode: string }
 * Returns: { message: "2FA enabled successfully", backupCodes: string[] }
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate request
    const { userId, email, user } = await AuthUtils.authenticateRequest(req);

    // 2. Parse and validate request body
    const body = await req.json();
    const validatedData = VerifySetupSchema.parse(body);

    // 3. Verify setup with TOTP code
    const result = await TwoFactorService.verifySetup(userId, validatedData.totpCode);

    // 4. Send notification email
    await EmailService.sendTwoFactorEnabledEmail(email, user.firstName);

    // 5. Return success with backup codes
    return ApiResponse.success(
      {
        message: "2FA enabled successfully",
        backupCodes: result.backupCodes,
      },
      "Two-factor authentication has been enabled on your account.",
      200
    );
  } catch (error) {
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

    // Handle app errors
    if (error instanceof AppError) {
      return ApiResponse.error(error.message, error.statusCode, error.errors);
    }

    // Log internal error for debugging
    console.error("[2FA Verify Setup Error]", error);

    return ApiResponse.error("Internal server error", 500);
  }
}
