import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";
import { prisma } from "./prisma.js";

// Initialize Resend with error handling
let resend: Resend | null = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log("✓ Resend email service initialized");
} else {
  console.warn(
    "⚠ RESEND_API_KEY not set - email sending will not work. Add it to .env",
  );
}

// Email sending function using Resend
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.warn(`Email not sent to ${to}: Resend API key not configured`);
    return;
  }

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    if (result.error) {
      console.error("Failed to send email:", result.error);
      return;
    }

    console.log(`✓ Email sent to ${to}:`, result.data?.id);
    return result.data;
  } catch (error) {
    console.error("Email error:", error);
    // Don't throw, just log - email failures shouldn't break auth
  }
}

console.log("🔧 Initializing Better Auth...");

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.TRUSTED_ORIGIN || "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // Email verification
    sendVerificationEmail: async ({ user, url }: any, request: any) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `
          <h1>Verify Your Email</h1>
          <p>Click the link below to verify your email address:</p>
          <a href="${url}">Verify Email</a>
          <p>If you didn't sign up, you can ignore this email.</p>
        `,
      });
    },
    // Password reset
    sendResetPassword: async ({ user, url }: any, request: any) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `
          <h1>Reset Your Password</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${url}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can ignore this email.</p>
        `,
      });
    },
    onPasswordReset: async ({ user }: any, request: any) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  // Email verification settings
  emailVerification: {
    sendVerificationEmail: async ({ user, url }: any, request: any) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `
          <h1>Verify Your Email</h1>
          <p>Click the link below to verify your email address:</p>
          <a href="${url}">Verify Email</a>
          <p>If you didn't sign up, you can ignore this email.</p>
        `,
      });
    },
  },
  advanced: {
    useSecureCookies: false,
    disableCSRFCheck: true,
  },
});
