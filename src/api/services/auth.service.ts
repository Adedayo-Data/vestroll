import { db, emailVerifications } from "../db";
import { UserService } from "./user.service";
import { OTPService } from "./otp.service";
import { ConflictError } from "../utils/errors";

export class AuthService {
  static async register(data: {
    firstName: string;
    lastName: string;
    email: string;
  }) {
    // 1. Check if user already exists
    const existingUser = await UserService.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    // 2. Start transaction (Drizzle transaction)
    return await db.transaction(async (tx) => {
      // 3. Create user with pending_verification status
      const user = await UserService.create(data);

      // 4. Generate and hash OTP
      const otp = OTPService.generateOTP();
      const otpHash = await OTPService.hashOTP(otp);

      // 5. Store OTP with 15-minute expiration
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      await tx.insert(emailVerifications).values({
        userId: user.id,
        otpHash,
        expiresAt,
      });

      // 6. Mock send verification email (In real app, call EmailService here)
      console.log(`[Email Mock] Sending OTP ${otp} to ${data.email}`);

      return {
        userId: user.id,
        email: user.email,
        message: "Verification email sent",
      };
    });
  }
}
