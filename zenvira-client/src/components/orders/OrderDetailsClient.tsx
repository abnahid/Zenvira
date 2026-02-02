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
    manufacturer: string;
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
  customer: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export default function OrderDetailsClient({ orderId }: { orderId: string }) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchOrderDetails();
    }
  }, [user, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(apiUrl(`/api/orders/${orderId}`), {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || "Failed to fetch order details");
      }
    } catch (err) {
      console.error("Fetch order details error:", err);
      setError("Failed to load order details. Please try again.");
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

  const getStatusSteps = (currentStatus: Order["status"]) => {
    const steps = [
      { status: "placed", label: "Order Placed", completed: false },
      { status: "confirmed", label: "Confirmed", completed: false },
      { status: "shipped", label: "Shipped", completed: false },
      { status: "delivered", label: "Delivered", completed: false },
    ];

    const statusOrder = ["placed", "confirmed", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus);

    if (currentStatus === "cancelled") {
      return steps.map((step) => ({ ...step, completed: false }));
    }

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
    }));
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

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setIsCancelling(true);
      const response = await fetch(apiUrl(`/api/orders/${orderId}/cancel`), {
        method: "PUT",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : null));
      } else {
        setError(data.message || "Failed to cancel order");
      }
    } catch (err) {
      setError("Failed to cancel order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive mb-4">
              {error || "Order not found"}
            </p>
            <Button onClick={() => router.push("/orders")}>
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusSteps = getStatusSteps(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push("/orders")}>
          ← Back to Orders
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                  {order.updatedAt !== order.createdAt && (
                    <p className="text-sm text-muted-foreground">
                      Last updated: {formatDate(order.updatedAt)}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={getStatusColor(order.status)}
                    className="text-base px-4 py-1"
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Order Status Timeline */}
          {order.status !== "cancelled" && (
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />

                  <div className="space-y-6">
                    {statusSteps.map((step, index) => (
                      <div
                        key={step.status}
                        className="relative flex items-start gap-4"
                      >
                        {/* Step Dot */}
                        <div
                          className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.completed ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <span className="text-sm">{index + 1}</span>
                          )}
                        </div>

                        {/* Step Label */}
                        <div className="flex-1 pt-1">
                          <p
                            className={`font-medium ${
                              step.completed
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {order.status === "cancelled" && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <p className="font-semibold">This order has been cancelled</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 items-start cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors"
                    onClick={() => router.push(`/shops/${item.medicine.slug}`)}
                  >
                    {item.medicine.images &&
                      item.medicine.images.length > 0 && (
                        <img
                          src={item.medicine.images[0]}
                          alt={item.medicine.name}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      )}
                    <div className="flex-1">
                      <h4 className="font-medium text-lg mb-1">
                        {item.medicine.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.medicine.manufacturer}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-base font-medium mt-2">
                        {formatCurrency(item.price)} × {item.quantity} ={" "}
                        <span className="text-lg">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping:</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium">
                    {order.paymentMethod.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <Badge
                    variant={
                      order.paymentStatus === "paid" ? "default" : "secondary"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Name</p>
                <p className="font-medium">{order.shippingName}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Phone</p>
                <p className="font-medium">{order.shippingPhone}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{order.shippingEmail}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Address</p>
                <p className="font-medium">{order.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {order.status === "placed" && (
            <Card>
              <CardContent className="pt-6">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Order"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
