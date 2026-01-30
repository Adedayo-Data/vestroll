import { db, users } from "../db";
import { eq } from "drizzle-orm";
import { GoogleUserInfo } from "./google-oauth.service";

export class OAuthUserProvisioningService {
    static async provisionUser(googleUserInfo: GoogleUserInfo) {
        const { email, firstName, lastName, oauthId } = googleUserInfo;

        let user = await this.findByOAuthId(oauthId);

        if (user) {
            await this.updateLastLoginAt(user.id);
            return user;
        }

        user = await this.findByEmail(email);

        if (user) {
            const updatedUser = await this.updateOAuthInfo(user.id, {
                oauthProvider: "google",
                oauthId,
            });
            await this.updateLastLoginAt(updatedUser.id);
            return updatedUser;
        }

        const newUser = await this.createOAuthUser({
            email,
            firstName,
            lastName,
            oauthProvider: "google",
            oauthId,
        });

        return newUser;
    }

    static async findByOAuthId(oauthId: string) {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.oauthId, oauthId))
            .limit(1);

        return user || null;
    }

    static async findByEmail(email: string) {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        return user || null;
    }

    static async updateOAuthInfo(
        userId: string,
        oauthInfo: { oauthProvider: string; oauthId: string }
    ) {
        const [updatedUser] = await db
            .update(users)
            .set({
                oauthProvider: oauthInfo.oauthProvider,
                oauthId: oauthInfo.oauthId,
                status: "active",
                updatedAt: new Date(),
            })
            .where(eq(users.id, userId))
            .returning();

        return updatedUser;
    }

    static async updateLastLoginAt(userId: string) {
        await db
            .update(users)
            .set({
                lastLoginAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
    }

    private static async createOAuthUser(data: {
        email: string;
        firstName: string;
        lastName: string;
        oauthProvider: string;
        oauthId: string;
    }) {
        const [user] = await db
            .insert(users)
            .values({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                oauthProvider: data.oauthProvider,
                oauthId: data.oauthId,
                passwordHash: null,
                status: "active",
                lastLoginAt: new Date(),
            })
            .returning();

        return user;
    }
}
