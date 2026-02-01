"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/context/ToastContext";
import { apiUrl } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import { FiCheck, FiUser, FiX } from "react-icons/fi";

interface SellerApplication {
  id: string;
  storeName: string;
  phone: string;
  address: string;
  note: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "approved", label: "Approved", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
];

export default function SellerApplicationsClient() {
  const { addToast } = useToast();
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(apiUrl(`/api/user/seller-applications?${params}`), {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();
      setApplications(data.data || []);
      setPagination(data.pagination);
      setIsInitialLoad(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
      setPagination(null);
      setIsInitialLoad(false);
      addToast("Failed to fetch applications", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, addToast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleUpdateStatus = async (appId: string, status: "approved" | "rejected") => {
    setProcessingId(appId);

    try {
      const response = await fetch(apiUrl(`/api/user/seller-applications/${appId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        setApplications(
          applications.map((app) =>
            app.id === appId ? { ...app, status } : app
          )
        );
        addToast(`Application ${status}`, "success");
      } else {
        addToast(data.message || "Failed to update application", "error");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      addToast("Failed to update application", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === status);
    return option?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seller Applications</h1>
        <p className="text-gray-600 mt-1">Review and manage seller applications</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value === "all" ? "" : value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Stats */}
          {pagination && (
            <div className="flex items-center justify-end text-sm text-gray-600">
              Total: {pagination.total} applications
            </div>
          )}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {isInitialLoad ? (
          <div className="p-8 text-center text-gray-500">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No applications found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto relative">
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Store Info
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {app.user.image ? (
                          <img
                            src={app.user.image}
                            alt={app.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FiUser className="text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{app.user.name}</p>
                          <p className="text-sm text-gray-500">{app.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{app.storeName}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{app.address}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{app.phone}</p>
                      {app.note && (
                        <p className="text-xs text-gray-500 line-clamp-1" title={app.note}>
                          Note: {app.note}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {app.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(app.id, "approved")}
                            disabled={processingId === app.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <FiCheck size={14} className="mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(app.id, "rejected")}
                            disabled={processingId === app.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <FiX size={14} className="mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={!pagination.hasPrevPage}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={!pagination.hasNextPage}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
