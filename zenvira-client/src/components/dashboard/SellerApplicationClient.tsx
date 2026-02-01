"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { apiUrl } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

interface SellerApplication {
  id: string;
  storeName: string;
  phone: string;
  address: string;
  note: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function SellerApplicationClient() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [application, setApplication] = useState<SellerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    phone: "",
    address: "",
    note: "",
  });

  useEffect(() => {
    // If user is already a seller, redirect to dashboard
    if (user?.role === "seller") {
      router.push("/dashboard");
      return;
    }

    fetchApplication();
  }, [user, router]);

  const fetchApplication = async () => {
    try {
      const response = await fetch(apiUrl("/api/user/seller/application"), {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setApplication(data.data);
      }
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.storeName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(apiUrl("/api/user/seller/apply"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setApplication(data.data);
        addToast("Application submitted successfully!", "success");
      } else {
        addToast(data.message || "Failed to submit application", "error");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      addToast("Failed to submit application", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show application status if already submitted
  if (application) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border p-8 text-center">
          {application.status === "pending" && (
            <>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="text-yellow-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Application Under Review
              </h2>
              <p className="text-gray-600 mb-6">
                Your seller application is being reviewed by our team. We'll notify you once a decision has been made.
              </p>
            </>
          )}

          {application.status === "approved" && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Application Approved!
              </h2>
              <p className="text-gray-600 mb-6">
                Congratulations! Your seller application has been approved. Please refresh the page or log in again to access your seller dashboard.
              </p>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </>
          )}

          {application.status === "rejected" && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiXCircle className="text-red-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Application Rejected
              </h2>
              <p className="text-gray-600 mb-6">
                Unfortunately, your seller application was not approved. Please contact support for more information.
              </p>
            </>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Application Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Store Name:</span> {application.storeName}</p>
              <p><span className="text-gray-500">Phone:</span> {application.phone}</p>
              <p><span className="text-gray-500">Address:</span> {application.address}</p>
              {application.note && (
                <p><span className="text-gray-500">Note:</span> {application.note}</p>
              )}
              <p><span className="text-gray-500">Submitted:</span> {new Date(application.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show application form
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Become a Seller</h1>
        <p className="text-gray-600 mt-1">
          Fill out the form below to apply for a seller account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store Name *
          </label>
          <input
            type="text"
            value={formData.storeName}
            onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
            placeholder="Your pharmacy or store name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 234 567 8900"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Address *
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Full address of your business"
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Note (Optional)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Any additional information you'd like to share"
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </div>
  );
}
