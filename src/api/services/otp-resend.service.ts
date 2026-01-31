import { db } from "../db";
import { emailVerifications } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { OTPService } from "./otp.service";
import { UserService } from "./user.service";
import { RateLimitService } from "./rate-limit.service";
import {
  NotFoundError,
  BadRequestError,
  TooManyRequestsError,
} from "../utils/errors";

export class OTPResendService {
  private static readonly OTP_EXPIRATION_MINUTES = 15;

  /**
   * Resend OTP verification code to user's email
   * @param email - User's email address
   * @returns Success message and user info
   */
  static async resendOTP(email: string): Promise<{
    message: string;
    email: string;
    userId: string;
  }> {
    // 1. Validate user exists
    const user = await UserService.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // 2. Check user status - only allow for pending_verification
    if (user.status !== "pending_verification") {
      throw new BadRequestError("User is already verified");
    }

    // 3. Check rate limiting
    const rateLimitResult = await RateLimitService.checkResendLimit(user.id);
    if (rateLimitResult.isLimited) {
      const retryAfterSeconds = rateLimitResult.retryAfter
        ? Math.ceil(
            (rateLimitResult.retryAfter.getTime() - Date.now()) / 1000
          )
        : 300;

      throw new TooManyRequestsError(
        "Too many OTP requests. Please try again later.",
        retryAfterSeconds
      );
    }

    // 4. Start transaction to invalidate old OTP and create new one
    return await db.transaction(async (tx) => {
      // 5. Invalidate all previous EmailVerification records for this user
      await tx
        .update(emailVerifications)
        .set({ verified: false })
        .where(
          and(
            eq(emailVerifications.userId, user.id),
            eq(emailVerifications.verified, false)
          )
        );

      // 6. Generate new OTP
      const otp = OTPService.generateOTP();
      const otpHash = await OTPService.hashOTP(otp);

      // 7. Create new EmailVerification record with reset attempts
      const expiresAt = new Date(
        Date.now() + this.OTP_EXPIRATION_MINUTES * 60 * 1000
      );
      await tx.insert(emailVerifications).values({
        userId: user.id,
        otpHash,
        expiresAt,
        attempts: 0,
      });

      // 8. Send verification email (mocked for now)
      console.log(`[Email Mock] Resending OTP ${otp} to ${email}`);
      // TODO: Replace with actual email service
      // await EmailService.sendVerificationEmail(email, otp);

      return {
        message: "Verification code resent",
        email: user.email,
        userId: user.id,
      };
    });
  }
}
