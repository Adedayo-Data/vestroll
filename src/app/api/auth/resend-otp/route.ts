import { NextRequest } from "next/server";
import { ResendOTPSchema } from "@/api/validations/auth.schema";
import { OTPResendService } from "@/api/services/otp-resend.service";
import { ApiResponse } from "@/api/utils/api-response";
import { AppError, TooManyRequestsError } from "@/api/utils/errors";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate input
    const body = await req.json();
    const validatedData = ResendOTPSchema.parse(body);

    // 2. Process OTP resend
    const result = await OTPResendService.resendOTP(validatedData.email);

    // 3. Return success response
    return ApiResponse.success(result, result.message, 200);
  } catch (error) {
    // 4. Handle errors
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      return ApiResponse.error("Validation failed", 400, { fieldErrors });
    }

    if (error instanceof TooManyRequestsError) {
      // Include retry-after information in response
      const retryAfter = error.retryAfter || 300;
      console.warn(
        `[Rate Limit] OTP resend rate limit exceeded. Retry after: ${retryAfter}s`
      );

      return new Response(
        JSON.stringify({
          success: false,
          message: error.message,
          errors: { retryAfter },
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": retryAfter.toString(),
          },
        }
      );
    }

    if (error instanceof AppError) {
      // Log security-relevant errors
      if (error.statusCode === 404 || error.statusCode === 400) {
        console.warn(`[OTP Resend] ${error.message}`);
      }
      return ApiResponse.error(error.message, error.statusCode, error.errors);
    }

    // Log internal errors for debugging
    console.error("[OTP Resend Error]", error);

    return ApiResponse.error("Internal server error", 500);
  }
}
