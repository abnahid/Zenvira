export declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    baseURL: string;
    secret: string | undefined;
    trustedOrigins: string[];
    emailAndPassword: {
        enabled: true;
        minPasswordLength: number;
        maxPasswordLength: number;
        sendVerificationEmail: ({ user, url }: any, request: any) => Promise<void>;
        sendResetPassword: ({ user, url }: any, request: any) => Promise<void>;
        onPasswordReset: ({ user }: any, request: any) => Promise<void>;
    };
    emailVerification: {
        sendVerificationEmail: ({ user, url }: any, request: any) => Promise<void>;
    };
    advanced: {
        useSecureCookies: false;
        disableCSRFCheck: true;
    };
}>;
//# sourceMappingURL=auth.d.ts.map