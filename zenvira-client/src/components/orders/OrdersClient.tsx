"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { apiUrl } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  medicine: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
  };
}

interface Order {
  id: string;
  total: number;
  status: "placed" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid";
  paymentMethod: string;
  shippingName: string;
  shippingPhone: string;
  shippingEmail: string;
  address: string;
  createdAt: string;
  updatedAt: string;
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

export default function OrdersClient() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchOrders(currentPage, statusFilter);
    }
  }, [user, currentPage, statusFilter]);

  const fetchOrders = async (page: number, status: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (status !== "all") {
        queryParams.append("status", status);
      }

      const response = await fetch(
        apiUrl(`/api/orders?${queryParams.toString()}`),
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "placed":
        return "default";
      case "confirmed":
        return "secondary";
      case "shipped":
        return "default";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          View and track your order history
        </p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("all");
            setCurrentPage(1);
          }}
        >
          All Orders
        </Button>
        <Button
          variant={statusFilter === "placed" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("placed");
            setCurrentPage(1);
          }}
        >
          Placed
        </Button>
        <Button
          variant={statusFilter === "confirmed" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("confirmed");
            setCurrentPage(1);
          }}
        >
          Confirmed
        </Button>
        <Button
          variant={statusFilter === "shipped" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("shipped");
            setCurrentPage(1);
          }}
        >
          Shipped
        </Button>
        <Button
          variant={statusFilter === "delivered" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("delivered");
            setCurrentPage(1);
          }}
        >
          Delivered
        </Button>
        <Button
          variant={statusFilter === "cancelled" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("cancelled");
            setCurrentPage(1);
          }}
        >
          Cancelled
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {statusFilter === "all"
                ? "You haven't placed any orders yet."
                : `No ${statusFilter} orders found.`}
            </p>
            <Button onClick={() => router.push("/shops")}>
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg mb-2">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                    <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                      Payment: {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 items-start cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                      onClick={() =>
                        router.push(`/shops/${item.medicine.slug}`)
                      }
                    >
                      {item.medicine.images &&
                        item.medicine.images.length > 0 && (
                          <img
                            src={item.medicine.images[0]}
                            alt={item.medicine.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        )}
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">
                          {item.medicine.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          {formatCurrency(item.price)} × {item.quantity} ={" "}
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Shipping Info */}
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Information</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        {order.shippingName}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        {order.shippingPhone}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Email:</span>{" "}
                        {order.shippingEmail}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Address:</span>{" "}
                        {order.address}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Order Summary</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-muted-foreground">
                          Payment Method:
                        </span>{" "}
                        {order.paymentMethod.toUpperCase()}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Total Items:
                        </span>{" "}
                        {order.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}
                      </p>
                      <p className="text-lg font-bold mt-2">
                        Total: {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    View Details
                  </Button>
                  {order.status === "placed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={!pagination.hasPrevPage}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
