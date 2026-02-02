import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { prisma } from "./prisma.js";

// Initialize Nodemailer transporter with Google SMTP
let transporter: nodemailer.Transporter | null = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

}

// Email sending function using Nodemailer
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!transporter) {
    return;
  }

  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    return result;
  } catch (error) {
    // Email failures shouldn't break auth
  }
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.TRUSTED_ORIGIN || "http://localhost:3000"],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "active",
        input: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // Email verification

    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }: any, request: any) => {
      // Extract token from URL - handle different URL formats
      const urlObj = new URL(url);
      const token =
        urlObj.searchParams.get("token") || urlObj.pathname.split("/").pop();
      const frontendUrl = `${process.env.TRUSTED_ORIGIN || "http://localhost:3000"}/verify-email?token=${token}`;

      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify Email</title>
  </head>

  <body style="margin:0; padding:0; background:#f5f7fb; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px;">

          <table width="480" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
            <tr>
              <td align="left">
                <img
                  src="https://i.ibb.co.com/39ySSmQd/logo-zenvin.png"
                  alt="Zenvira"
                  width="140"
                  style="display:block;"
                />
              </td>

              <td align="right">
                  <img
                    src="https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png&color=000000"
                    alt="Facebook"
                    width="24"
                    style="margin-left:8px; display:inline-block;"
                  />
                  <img
                    src="https://img.icons8.com/?size=100&id=13930&format=png&color=000000"
                    alt="LinkedIn"
                    width="24"
                    style="margin-left:8px; display:inline-block;"
                  />
              </td>
            </tr>
          </table>

          <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:24px;">

            <tr>
              <td style="font-size:20px; font-weight:600; padding-bottom:16px;">
                Verify Your Email
              </td>
            </tr>

            <tr>
              <td style="font-size:14px; color:#333; line-height:1.6;">
                Hi There,<br><br>
                Welcome to Zenvira! Please verify your email address to complete your registration
                and start exploring our products.
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:24px 0;">
                <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td align="center" bgcolor="#4f46e5" style="border-radius:6px;">
                      <a
                        href="${frontendUrl}"
                        target="_blank"
                        style="display:inline-block; padding:14px 28px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:6px;"
                      >
                        Verify Email
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="font-size:13px; color:#555;">
                This link will expire in 24 hours for security reasons.<br>
                If you didn't create an account, you can safely ignore this email.
              </td>
            </tr>

            <tr>
              <td style="padding-top:24px; font-size:13px; color:#777;">
                Thanks,<br>
                Zenvira Team
              </td>
            </tr>

          </table>

          <div style="max-width:480px; margin-top:16px; font-size:12px; color:#888; text-align:left; line-height:1.6;">
            Want to know more? Contact us at
            <a href="mailto:info@abnahid.com" style="color:#4f46e5; text-decoration:none;">
              info@abnahid.com
            </a><br>

            If you no longer wish to receive emails from Zenvira, you can
            <a href="{{UNSUBSCRIBE_LINK}}" style="color:#4f46e5; text-decoration:none;">
              unsubscribe
            </a>.<br><br>

            500 Medical Park Drive, Sylhet<br>
            © 2025 Zenvira
          </div>

        </td>
      </tr>
    </table>
  </body>
</html>
        `,
      });
    },
    // Password reset
    sendResetPassword: async ({ user, url }: any, request: any) => {
      // Extract token from URL - handle different URL formats
      const urlObj = new URL(url);
      const token =
        urlObj.searchParams.get("token") || urlObj.pathname.split("/").pop();
      const frontendUrl = `${process.env.TRUSTED_ORIGIN || "http://localhost:3000"}/reset-password?token=${token}`;

      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset Password</title>
  </head>

  <body style="margin:0; padding:0; background:#f5f7fb; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px;">

          <table width="480" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
            <tr>
              <td align="left">
                <img
                  src="https://i.ibb.co.com/39ySSmQd/logo-zenvin.png"
                  alt="Zenvira"
                  width="140"
                  style="display:block;"
                />
              </td>

              <td align="right">
                  <img
                    src="https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png&color=000000"
                    alt="Facebook"
                    width="24"
                    style="margin-left:8px; display:inline-block;"
                  />
                  <img
                    src="https://img.icons8.com/?size=100&id=13930&format=png&color=000000"
                    alt="LinkedIn"
                    width="24"
                    style="margin-left:8px; display:inline-block;"
                  />
              </td>
            </tr>
          </table>

          <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:24px;">

            <tr>
              <td style="font-size:20px; font-weight:600; padding-bottom:16px;">
                Reset Your Password
              </td>
            </tr>

            <tr>
              <td style="font-size:14px; color:#333; line-height:1.6;">
                Hi There,<br><br>
                We received a request to reset your password for your Zenvira account.
                Click the button below to create a new one.
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:24px 0;">
                <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td align="center" bgcolor="#4f46e5" style="border-radius:6px;">
                      <a
                        href="${frontendUrl}"
                        target="_blank"
                        style="display:inline-block; padding:14px 28px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:6px;"
                      >
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="font-size:13px; color:#555;">
                This link will expire in 1 hour for security reasons.<br>
                If you didn't request this, you can safely ignore this email.
              </td>
            </tr>

            <tr>
              <td style="padding-top:24px; font-size:13px; color:#777;">
                Thanks,<br>
                Zenvira Team
              </td>
            </tr>

          </table>

          <div style="max-width:480px; margin-top:16px; font-size:12px; color:#888; text-align:left; line-height:1.6;">
            Want to know more? Contact us at
            <a href="mailto:info@abnahid.com" style="color:#4f46e5; text-decoration:none;">
              info@abnahid.com
            </a><br>

            If you no longer wish to receive emails from Zenvira, you can
            <a href="{{UNSUBSCRIBE_LINK}}" style="color:#4f46e5; text-decoration:none;">
              unsubscribe
            </a>.<br><br>

            500 Medical Park Drive, Sylhet<br>
            © 2025 Zenvira
          </div>

        </td>
      </tr>
    </table>
  </body>
</html>
        `,
      });
    },
    onPasswordReset: async ({ user }: any, request: any) => {},
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }: any, request: any) => {
      // Extract token from URL - handle different URL formats
      const urlObj = new URL(url);
      const token =
        urlObj.searchParams.get("token") || urlObj.pathname.split("/").pop();
      const frontendUrl = `${process.env.TRUSTED_ORIGIN || "http://localhost:3000"}/verify-email?token=${token}`;

      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify Email</title>
  </head>

  <body style="margin:0; padding:0; background:#f5f7fb; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px;">

          <table width="480" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
            <tr>
              <td align="left">
                <img
                  src="https://i.ibb.co.com/39ySSmQd/logo-zenvin.png"
                  alt="Zenvira"
                  width="140"
                  style="display:block;"
                />
              </td>

              <td align="right">
                  <img
                    src="https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png&color=000000"
                    alt="Facebook"
                    width="24"
                    style="margin-left:8px; display:inline-block;"
                  />
                  <img
                    src="https://img.icons8.com/?size=100&id=13930&format=png&color=000000"
                    alt="LinkedIn"
                    width="24"
                    style="margin-left:8px; display:inline-block;"
                  />
              </td>
            </tr>
          </table>

          <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:24px;">

            <tr>
              <td style="font-size:20px; font-weight:600; padding-bottom:16px;">
                Verify Your Email
              </td>
            </tr>

            <tr>
              <td style="font-size:14px; color:#333; line-height:1.6;">
                Hi There,<br><br>
                Welcome to Zenvira! Please verify your email address to complete your registration
                and start exploring our products.
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:24px 0;">
                <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td align="center" bgcolor="#4f46e5" style="border-radius:6px;">
                      <a
                        href="${frontendUrl}"
                        target="_blank"
                        style="display:inline-block; padding:14px 28px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:6px;"
                      >
                        Verify Email
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="font-size:13px; color:#555;">
                This link will expire in 24 hours for security reasons.<br>
                If you didn't create an account, you can safely ignore this email.
              </td>
            </tr>

            <tr>
              <td style="padding-top:24px; font-size:13px; color:#777;">
                Thanks,<br>
                Zenvira Team
              </td>
            </tr>

          </table>

          <div style="max-width:480px; margin-top:16px; font-size:12px; color:#888; text-align:left; line-height:1.6;">
            Want to know more? Contact us at
            <a href="mailto:info@abnahid.com" style="color:#4f46e5; text-decoration:none;">
              info@abnahid.com
            </a><br>

            If you no longer wish to receive emails from Zenvira, you can
            <a href="{{UNSUBSCRIBE_LINK}}" style="color:#4f46e5; text-decoration:none;">
              unsubscribe
            </a>.<br><br>

            500 Medical Park Drive, Sylhet<br>
            © 2025 Zenvira
          </div>

        </td>
      </tr>
    </table>
  </body>
</html>
        `,
      });
    },
  },
  callbacks: {
    async onUserCreate({ user }: { user: { email: string; id: string } }) {
      try {
        await prisma.user.update({
          where: { email: user.email },
          data: { emailVerified: true },
        });
      } catch (err) {
        // Auto-verify failed silently
      }
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    disableCSRFCheck: true,
    crossSubDomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
    },
  },
});
