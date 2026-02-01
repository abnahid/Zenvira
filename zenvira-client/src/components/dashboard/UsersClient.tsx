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
import { FiEdit2, FiSearch, FiTrash2, FiUser } from "react-icons/fi";

interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "seller" | "admin";
  image: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  _count: {
    medicines: number;
    orders: number;
    reviews: number;
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

const ROLE_OPTIONS = [
  { value: "customer", label: "Customer", color: "bg-blue-100 text-blue-800" },
  { value: "seller", label: "Seller", color: "bg-green-100 text-green-800" },
  { value: "admin", label: "Admin", color: "bg-purple-100 text-purple-800" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
  { value: "inactive", label: "Inactive", color: "bg-gray-100 text-gray-800" },
  { value: "banned", label: "Banned", color: "bg-red-100 text-red-800" },
];

export default function UsersClient() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (roleFilter) params.append("role", roleFilter);
      if (statusFilter) params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(apiUrl(`/api/user?${params}`), {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.data || []);
      setPagination(data.pagination);
      setIsInitialLoad(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setPagination(null);
      setIsInitialLoad(false);
      addToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, roleFilter, statusFilter, searchQuery, addToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const response = await fetch(apiUrl(`/api/user/${userId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, ...data.data } : u)));
        addToast("User updated successfully", "success");
        setEditingUser(null);
      } else {
        addToast(data.message || "Failed to update user", "error");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      addToast("Failed to update user", "error");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(apiUrl(`/api/user/${userId}`), {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.filter((u) => u.id !== userId));
        addToast("User deleted successfully", "success");
        setDeleteConfirm(null);
      } else {
        addToast(data.message || "Failed to delete user", "error");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      addToast("Failed to delete user", "error");
    }
  };

  const getRoleColor = (role: string) => {
    const option = ROLE_OPTIONS.find((opt) => opt.value === role);
    return option?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === status);
    return option?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-gray-600 mt-1">Manage all platform users</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Role Filter */}
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value === "all" ? "" : value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
              Total: {pagination.total} users
            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {isInitialLoad ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No users found.</p>
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
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FiUser className="text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingUser?.id === user.id ? (
                        <Select
                          value={editingUser.role}
                          onValueChange={(value) =>
                            setEditingUser({ ...editingUser, role: value as User["role"] })
                          }
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingUser?.id === user.id ? (
                        <Select
                          value={editingUser.status}
                          onValueChange={(value) =>
                            setEditingUser({ ...editingUser, status: value })
                          }
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 space-y-1">
                        {user.role === "seller" && (
                          <p>{user._count.medicines} products</p>
                        )}
                        <p>{user._count.orders} orders</p>
                        <p>{user._count.reviews} reviews</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {editingUser?.id === user.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleUpdateUser(user.id, {
                                  role: editingUser.role,
                                  status: editingUser.status,
                                })
                              }
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingUser(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : deleteConfirm === user.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : user.role === "admin" ? (
                          <span className="text-xs text-gray-400 italic">
                            Protected
                          </span>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingUser(user)}
                            >
                              <FiEdit2 size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setDeleteConfirm(user.id)}
                            >
                              <FiTrash2 size={14} />
                            </Button>
                          </>
                        )}
                      </div>
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
            Page {pagination.page} of {pagination.totalPages} ({pagination.total}{" "}
            total)
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
