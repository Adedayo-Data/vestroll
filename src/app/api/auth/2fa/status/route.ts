import { NextRequest } from "next/server";
import { ApiResponse } from "@/api/utils/api-response";
import { AppError } from "@/api/utils/errors";
import { AuthUtils } from "@/api/utils/auth";
import { TwoFactorService } from "@/api/services/two-factor.service";

/**
 * GET /api/auth/2fa/status
 * Check 2FA status (authenticated)
 *
 * Returns: { enabled: boolean, backupCodesRemaining: number }
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate request
    const { userId } = await AuthUtils.authenticateRequest(req);

    // 2. Get 2FA status
    const status = await TwoFactorService.getStatus(userId);

    // 3. Return status
    return ApiResponse.success(
      {
        enabled: status.enabled,
        backupCodesRemaining: status.backupCodesRemaining,
      },
      "2FA status retrieved successfully.",
      200
    );
  } catch (error) {
    // Handle app errors
    if (error instanceof AppError) {
      return ApiResponse.error(error.message, error.statusCode, error.errors);
    }

    // Log internal error for debugging
    console.error("[2FA Status Error]", error);

    return ApiResponse.error("Internal server error", 500);
  }
}
