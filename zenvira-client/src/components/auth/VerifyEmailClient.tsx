"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiCheck, FiLoader, FiMail } from "react-icons/fi";

const VerifyEmailClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Invalid verification link");
      return;
    }

    const verifyEmail = async () => {
      try {
        const { error } = await authClient.verifyEmail({
          token,
        });

        if (error) {
          setError(error.message || "Failed to verify email");
        } else {
          setSuccess(true);
          setTimeout(() => router.push("/login"), 3000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLoader className="animate-spin text-primary" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Your Email
            </h1>
            <p className="text-sm text-gray-500">
              Please wait while we verify your email address...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="text-red-600" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  Go to Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  className="w-full border-gray-200 hover:bg-gray-50"
                >
                  Create New Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-green-600" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Email Verified!
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Your email has been verified successfully. Redirecting to login...
          </p>
          <Link href="/login">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailClient;
