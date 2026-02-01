"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import SellerDashboard from "./SellerDashboard";

export default function DashboardClient() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (!isMounted || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Role-based rendering
  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  if (user.role === "seller") {
    return <SellerDashboard />;
  }

  // Default fallback
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600 text-lg mb-4">
          Your role is not authorized to access dashboard
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}
