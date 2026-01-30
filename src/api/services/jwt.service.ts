import jwt from "jsonwebtoken";
import { InvalidTokenError, TokenExpiredError } from "../utils/errors";

export interface JWTPayload {
    userId: string;
    email: string;
}

export class JWTService {
    private static readonly ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "";
    private static readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";
    private static readonly ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || "15m";
    private static readonly REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || "7d";

    static generateAccessToken(payload: JWTPayload): string {
        if (!this.ACCESS_SECRET) {
            throw new Error("JWT_ACCESS_SECRET is not configured");
        }

        return jwt.sign(payload, this.ACCESS_SECRET, {
            expiresIn: this.ACCESS_EXPIRATION as string,
        } as jwt.SignOptions);
    }

    static generateRefreshToken(payload: JWTPayload): string {
        if (!this.REFRESH_SECRET) {
            throw new Error("JWT_REFRESH_SECRET is not configured");
        }

        return jwt.sign(payload, this.REFRESH_SECRET, {
            expiresIn: this.REFRESH_EXPIRATION as string,
        } as jwt.SignOptions);
    }

    static verifyAccessToken(token: string): JWTPayload {
        if (!this.ACCESS_SECRET) {
            throw new Error("JWT_ACCESS_SECRET is not configured");
        }

        try {
            const decoded = jwt.verify(token, this.ACCESS_SECRET) as JWTPayload;
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new TokenExpiredError("Access token has expired");
            }
            throw new InvalidTokenError("Invalid access token");
        }
    }

    static verifyRefreshToken(token: string): JWTPayload {
        if (!this.REFRESH_SECRET) {
            throw new Error("JWT_REFRESH_SECRET is not configured");
        }

        try {
            const decoded = jwt.verify(token, this.REFRESH_SECRET) as JWTPayload;
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new TokenExpiredError("Refresh token has expired");
            }
            throw new InvalidTokenError("Invalid refresh token");
        }
    }
}
