import { NextRequest } from "next/server";
import { ApiResponse } from "@/api/utils/api-response";
import { AppError } from "@/api/utils/errors";
import { AuthUtils } from "@/api/utils/auth";
import { TwoFactorService } from "@/api/services/two-factor.service";
import { EmailService } from "@/api/services/email.service";

/**
 * POST /api/auth/2fa/setup
 * Initialize 2FA setup (authenticated)
 *
 * Returns: { secret, qrCodeUrl, backupCodes: string[] }
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate request
    const { userId, email, user } = await AuthUtils.authenticateRequest(req);

    // 2. Setup 2FA
    const result = await TwoFactorService.setupTwoFactor(userId, email);

    // 3. Return setup data
    return ApiResponse.success(
      {
        secret: result.secret, // For manual entry if QR code doesn't work
        qrCodeUrl: result.qrCodeUrl,
        backupCodes: result.backupCodes,
      },
      "2FA setup initialized. Please verify with your authenticator app.",
      200
    );
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      return ApiResponse.error(error.message, error.statusCode, error.errors);
    }

    // Log internal error for debugging
    console.error("[2FA Setup Error]", error);

    return ApiResponse.error("Internal server error", 500);
  }
}
