"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { apiUrl } from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";

// Helper function to get token from cookies
const getTokenFromCookies = (): string | null => {
  const name = "auth_token";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const token = parts.pop()?.split(";").shift();
    return token ? decodeURIComponent(token) : null;
  }
  return null;
};

const CheckoutClient = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const shippingCost = 5.0;
  const totalWithShipping = totalAmount + shippingCost;

  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      router.push("/cart");
    }
  }, [cart, orderSuccess, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async () => {
    // Validate shipping info
    if (
      !shippingInfo.fullName ||
      !shippingInfo.email ||
      !shippingInfo.phone ||
      !shippingInfo.address ||
      !shippingInfo.city
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setProcessing(true);

    try {
      // Format address string (street, city, postal code, country)
      const addressParts = [
        shippingInfo.address,
        shippingInfo.city,
        shippingInfo.postalCode,
        shippingInfo.country,
      ].filter((field) => field); // Remove empty fields

      const formattedAddress = addressParts.join(", ");

      // Prepare order items for API
      const orderItems = cart.map((item) => ({
        medicineId: item.id,
        quantity: item.quantity,
      }));

      // Get authentication token from localStorage or cookies
      let token = localStorage.getItem("auth_token") || getTokenFromCookies();

      // Check if user is logged in (either from context or token)
      if (!token && !user) {
        alert("Please login to place an order");
        router.push("/auth/login");
        setProcessing(false);
        return;
      }

      // Send order to backend API
      const response = await fetch(apiUrl("/api/orders"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingName: shippingInfo.fullName,
          shippingPhone: shippingInfo.phone,
          shippingEmail: shippingInfo.email,
          address: formattedAddress,
          paymentMethod: paymentMethod,
          items: orderItems,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const text = await response.text();
        console.error("Response text:", text);
        throw new Error(
          `Server error: ${response.status}. ${response.statusText}`,
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      // Order placed successfully
      setOrderSuccess(true);

      // Clear the cart after successful order
      clearCart();

      // Redirect to order confirmation after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Order failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to place order. Please try again.",
      );
      setProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheck className="text-green-600 text-3xl" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll send you a confirmation email
            shortly.
          </p>
          <div className="text-sm text-gray-500">
            Redirecting to homepage...
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Shipping & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="fullName"
                placeholder="Full Name *"
                value={shippingInfo.fullName}
                onChange={handleInputChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email Address *"
                value={shippingInfo.email}
                onChange={handleInputChange}
                required
              />
              <Input
                name="phone"
                type="tel"
                placeholder="Phone Number *"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                required
              />
              <Input
                name="country"
                placeholder="Country"
                value={shippingInfo.country}
                onChange={handleInputChange}
              />
              <div className="md:col-span-2">
                <Input
                  name="address"
                  placeholder="Street Address *"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Input
                name="city"
                placeholder="City *"
                value={shippingInfo.city}
                onChange={handleInputChange}
                required
              />
              <Input
                name="postalCode"
                placeholder="Postal Code"
                value={shippingInfo.postalCode}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Payment Method
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="font-medium">Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-primary opacity-50 cursor-not-allowed"
                  disabled
                />
                <span className="font-medium">Credit/Debit Card</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="space-y-3 mb-6 max-h-75 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded shrink-0">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t pt-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-medium">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span className="font-medium">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                <span>Total:</span>
                <span>${totalWithShipping.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              onClick={handlePlaceOrder}
              disabled={processing}
              className="w-full bg-primary hover:bg-primary/90 py-6 text-base font-semibold"
            >
              {processing ? "Processing..." : "Place Order"}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By placing your order, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutClient;
