import { db, users } from "../db";
import { eq } from "drizzle-orm";

export class UserService {
  static async findByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user || null;
  }

  static async create(data: {
    firstName: string;
    lastName: string;
    email: string;
  }) {
    const [user] = await db
      .insert(users)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        status: "pending_verification",
      })
      .returning();

    return user;
  }
}
