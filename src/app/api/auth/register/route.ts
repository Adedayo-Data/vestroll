import { NextRequest } from "next/server";
import { RegisterSchema } from "@/api/validations/auth.schema";
import { AuthService } from "@/api/services/auth.service";
import { ApiResponse } from "@/api/utils/api-response";
import { AppError } from "@/api/utils/errors";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and sanitize input
    const body = await req.json();
    const validatedData = RegisterSchema.parse(body);

    // 2. Map frontend field name 'businessEmail' to backend 'email'
    const registrationData = {
      firstName: validatedData.firstName.trim(),
      lastName: validatedData.lastName.trim(),
      email: validatedData.businessEmail.trim().toLowerCase(),
    };

    // 3. Process registration
    const result = await AuthService.register(registrationData);

    // 4. Return success response
    return ApiResponse.success(result, "Verification email sent", 201);
  } catch (error) {
    // 5. Handle errors
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      return ApiResponse.error("Validation failed", 400, { fieldErrors });
    }

    if (error instanceof AppError) {
      return ApiResponse.error(error.message, error.statusCode, error.errors);
    }

    // Log internal error for debugging
    console.error("[Registration Error]", error);

    return ApiResponse.error("Internal server error", 500);
  }
}
