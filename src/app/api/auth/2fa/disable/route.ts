import { NextRequest } from "next/server";
import { ApiResponse } from "@/api/utils/api-response";
import { AppError } from "@/api/utils/errors";
import { AuthUtils } from "@/api/utils/auth";
import { TwoFactorService } from "@/api/services/two-factor.service";
import { EmailService } from "@/api/services/email.service";
import { DisableTwoFactorSchema } from "@/api/validations/two-factor.schema";
import { ZodError } from "zod";

/**
 * POST /api/auth/2fa/disable
 * Disable 2FA (authenticated)
 *
 * Request body: { password: string, totpCode: string }
 * Returns: { message: "2FA disabled successfully" }
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate request
    const { userId, email, user } = await AuthUtils.authenticateRequest(req);

    // 2. Parse and validate request body
    const body = await req.json();
    const validatedData = DisableTwoFactorSchema.parse(body);

    // 3. Disable 2FA (will verify password and TOTP code)
    await TwoFactorService.disableTwoFactor(
      userId,
      validatedData.password,
      validatedData.totpCode
    );

    // 4. Send notification email
    await EmailService.sendTwoFactorDisabledEmail(email, user.firstName);

    // 5. Return success
    return ApiResponse.success(
      {
        message: "2FA disabled successfully",
      },
      "Two-factor authentication has been disabled on your account.",
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
      // Map specific error messages to appropriate status codes
      if (error.message === "Invalid password") {
        return ApiResponse.error(error.message, 401, error.errors);
      }
      if (error.message === "Invalid TOTP code") {
        return ApiResponse.error(error.message, 400, error.errors);
      }
      return ApiResponse.error(error.message, error.statusCode, error.errors);
    }

    // Log internal error for debugging
    console.error("[2FA Disable Error]", error);

    return ApiResponse.error("Internal server error", 500);
  }
}
