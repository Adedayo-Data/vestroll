import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/api/services/auth.service";
import { LoginSchema } from "@/api/validations/login.schema";
import { ApiResponse } from "@/api/utils/api-response";
import { AuthUtils } from "@/api/utils/auth";
import { AppError, ValidationError } from "@/api/utils/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = LoginSchema.safeParse(body);
    if (!validatedData.success) {
      throw new ValidationError("Invalid request body", validatedData.error.flatten().fieldErrors as any);
    }

    const ipAddress = AuthUtils.getClientIp(request);
    const userAgent = AuthUtils.getUserAgent(request);

    const result = await AuthService.login(validatedData.data, {
      ipAddress,
      userAgent,
    });

    const response = ApiResponse.success(result, "Login successful");

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge: validatedData.data.rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
    };

    response.cookies.set("refreshToken", result.refreshToken, cookieOptions);

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      return ApiResponse.error(error.message, error.statusCode, error.errors);
    }
    
    console.error("Login route error:", error);
    return ApiResponse.error("Internal server error", 500);
  }
}
