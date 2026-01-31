import { z } from "zod";

export const RegisterSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  businessEmail: z.string().email("Invalid email format"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const ResendOTPSchema = z.object({
  email: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
    z.string().email("Invalid email format")
  ),
});

export type ResendOTPInput = z.infer<typeof ResendOTPSchema>;

export const GoogleOAuthSchema = z.object({
  idToken: z.string().min(1, "ID token is required"),
});

export type GoogleOAuthInput = z.infer<typeof GoogleOAuthSchema>;
