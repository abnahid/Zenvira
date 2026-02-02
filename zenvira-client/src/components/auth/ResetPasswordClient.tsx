"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiCheck, FiLoader, FiLock } from "react-icons/fi";

const ResetPasswordClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.resetPassword(
        {
          newPassword: password,
          token: token!,
        },
        {
          onSuccess: () => {
            setSuccess(true);
            setLoading(false);
            setTimeout(() => router.push("/auth/login"), 2000);
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Failed to reset password");
            setLoading(false);
          },
        },
      );

      if (error) {
        throw new Error(error.message || "Failed to reset password");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  // Invalid token state
  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock className="text-red-600" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Reset Link
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <Link href="/auth/forgot-password">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Request New Link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {success ? (
            // Success State
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="text-green-600" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Password Reset Successful
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Your password has been reset successfully. Redirecting to
                login...
              </p>
              <Link href="/auth/login">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  Go to Login
                </Button>
              </Link>
            </div>
          ) : (
            // Form State
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiLock className="text-primary" size={28} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Reset Your Password
                </h1>
                <p className="text-sm text-gray-500">
                  Enter your new password below.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError(null);
                    }}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" size={18} />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>

              {/* Password Requirements */}
              <p className="mt-4 text-xs text-gray-400 text-center">
                Password must be at least 8 characters long.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordClient;
