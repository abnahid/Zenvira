"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { apiUrl } from "@/lib/api";
import { Fragment, useCallback, useEffect, useState } from "react";
import { FaBox } from "react-icons/fa";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  medicine: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    sellerId?: string;
  };
}

interface Order {
  id: string;
  status: "placed" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  sellerTotal?: number;
  totalItems?: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingName: string;
  shippingPhone: string;
  shippingEmail: string;
  address: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  items: OrderItem[];
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
  { value: "placed", label: "Placed", color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export default function OrdersClient() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const isAdmin = user?.role === "admin";

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (statusFilter) {
        params.append("status", statusFilter);
      }

      // Admin fetches all orders, seller fetches their orders
      const endpoint = isAdmin
        ? `/api/orders?${params}`
        : `/api/orders/seller?${params}`;

      const response = await fetch(apiUrl(endpoint), {
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server error: ${response.status}`
        );
      }

      const data = await response.json();
      setOrders(data.data || []);
      setPagination(data.pagination);
      setIsInitialLoad(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setPagination(null);
      setIsInitialLoad(false);
      addToast("Failed to fetch orders.", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, isAdmin, addToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      const response = await fetch(apiUrl(`/api/orders/${orderId}/status`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? { ...order, status: newStatus as Order["status"] }
              : order
          )
        );
        addToast(`Order status updated to ${newStatus}!`, "success");
      } else {
        addToast(data.message || "Failed to update order status", "error");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      addToast("Failed to update order status", "error");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handlePaymentStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(apiUrl(`/api/orders/${orderId}/payment`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? { ...order, paymentStatus: newStatus }
              : order
          )
        );
        addToast(`Payment status updated to ${newStatus}!`, "success");
      } else {
        addToast(data.message || "Failed to update payment status", "error");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      addToast("Failed to update payment status", "error");
    }
  };

  // Calculate order total for display
  const getOrderTotal = (order: Order) => {
    if (isAdmin) {
      return order.total;
    }
    // For sellers, use sellerTotal if available, otherwise calculate from items
    if (order.sellerTotal !== undefined) {
      return order.sellerTotal;
    }
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Get total items count
  const getItemsCount = (order: Order) => {
    if (order.totalItems !== undefined) {
      return order.totalItems;
    }
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-gray-600 mt-1">
          {isAdmin
            ? "Manage all platform orders"
            : "Monitor and manage your customer orders"}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Filter by Status
        </label>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value === "all" ? "" : value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full md:w-48">
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
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {isInitialLoad ? (
          <div className="p-8 text-center text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No orders found.</p>
            {!isAdmin && (
              <p className="text-sm mt-2">
                Orders will appear here once customers purchase your products.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto relative">
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            <table
              className={`w-full transition-opacity duration-200 ${
                loading ? "opacity-50" : "opacity-100"
              }`}
            >
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    {isAdmin ? "Total" : "Your Earnings"}
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Payment
                    </th>
                  )}
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
                {orders.map((order) => (
                  <Fragment key={order.id}>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-mono text-sm text-gray-900">
                          {order.id.substring(0, 8)}...
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.customer.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.customer.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {getItemsCount(order)} item
                        {getItemsCount(order) !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        ${getOrderTotal(order).toFixed(2)}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <Select
                            value={order.paymentStatus}
                            onValueChange={(newStatus) =>
                              handlePaymentStatusUpdate(order.id, newStatus)
                            }
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <Select
                          value={order.status}
                          onValueChange={(newStatus) =>
                            handleStatusUpdate(order.id, newStatus)
                          }
                          disabled={updatingStatus === order.id}
                        >
                          <SelectTrigger className="w-32">
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
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order.id ? null : order.id
                            )
                          }
                        >
                          <FaBox size={14} />
                          {expandedOrder === order.id ? "Hide" : "Details"}
                        </Button>
                      </td>
                    </tr>

                    {/* Expanded Order Details */}
                    {expandedOrder === order.id && (
                      <tr className="bg-gray-50 border-b">
                        <td colSpan={isAdmin ? 8 : 7} className="px-6 py-4">
                          <div className="space-y-4">
                            {/* Shipping Info for Admin */}
                            {isAdmin && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg border">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">
                                    Shipping Information
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Name:</span>{" "}
                                    {order.shippingName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Phone:</span>{" "}
                                    {order.shippingPhone}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Email:</span>{" "}
                                    {order.shippingEmail}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Address:</span>{" "}
                                    {order.address}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">
                                    Payment Information
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Method:</span>{" "}
                                    {order.paymentMethod?.toUpperCase()}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Status:</span>{" "}
                                    <span
                                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                                        order.paymentStatus === "paid"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {order.paymentStatus}
                                    </span>
                                  </p>
                                  <p className="text-sm text-gray-600 mt-2">
                                    <span className="font-medium">Order Total:</span>{" "}
                                    <span className="text-lg font-bold text-green-600">
                                      ${order.total.toFixed(2)}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Items */}
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900">
                                {isAdmin ? "Order Items:" : "Your Items in This Order:"}
                              </h3>
                              {!isAdmin && (
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Your Total:</p>
                                  <p className="text-lg font-bold text-green-600">
                                    ${getOrderTotal(order).toFixed(2)}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="border rounded-lg p-4 bg-white"
                                >
                                  {item.medicine.images?.[0] && (
                                    <img
                                      src={item.medicine.images[0]}
                                      alt={item.medicine.name}
                                      className="w-full h-32 object-cover rounded mb-3"
                                    />
                                  )}
                                  <p className="font-medium text-gray-900">
                                    {item.medicine.name}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Quantity:{" "}
                                    <span className="font-semibold">
                                      {item.quantity}
                                    </span>
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Price:{" "}
                                    <span className="font-semibold">
                                      ${item.price.toFixed(2)}
                                    </span>
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Subtotal:{" "}
                                    <span className="font-semibold">
                                      ${(item.quantity * item.price).toFixed(2)}
                                    </span>
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
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
