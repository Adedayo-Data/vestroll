import { db } from "../db";
import { loginAttempts } from "../db/schema";
import { and, eq, gte, count } from "drizzle-orm";

export class RateLimitService {
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly WINDOW_MS = 15 * 60 * 1000;

  static async isRateLimited(ipAddress: string): Promise<boolean> {
    const startTime = new Date(Date.now() - this.WINDOW_MS);

    const [result] = await db
      .select({ value: count() })
      .from(loginAttempts)
      .where(
        and(
          eq(loginAttempts.ipAddress, ipAddress),
          eq(loginAttempts.success, false),
          gte(loginAttempts.createdAt, startTime)
        )
      );

    return (result?.value || 0) >= this.MAX_ATTEMPTS;
  }
}
