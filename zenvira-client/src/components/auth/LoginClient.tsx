"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const LoginClient = () => {
  const router = useRouter();
  const { setUserFromData } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      // Use full URL for callback to ensure redirect to client, not server
      const callbackURL = `${window.location.origin}/`;
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message || "Login failed");
        setLoading(false);
        return;
      }

      if (!data || !data.user) {
        setError("No user data received");
        setLoading(false);
        return;
      }

      // Use the user data returned from login API directly
      setUserFromData(data.user, data.token);

      // Redirect to home after user data is set
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
          <p className="text-gray-600">
            Please login using account detail below.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gray-600 hover:text-primary transition"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" size={16} />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Login Button */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition flex items-center justify-center gap-3 border border-gray-300"
          >
            {googleLoading ? (
              <>
                <FiLoader className="animate-spin" size={16} />
                Connecting...
              </>
            ) : (
              <>
                <FcGoogle size={20} />
                Continue with Google
              </>
            )}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Don't Have an Account?{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:text-primary/90 font-medium transition"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginClient;
