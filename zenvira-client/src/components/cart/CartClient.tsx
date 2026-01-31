"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";

const CartClient = () => {
  const { cart, totalAmount, updateQuantity, removeFromCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [shippingData, setShippingData] = useState({
    country: "Bangladesh",
    city: "Mirpur Dhaka-1205",
    postalCode: "",
  });

  const shippingCost = 5.0;
  const taxRate = 0.0;
  const totalWithShipping = totalAmount + shippingCost;

  const handleApplyPromo = () => {
    // Promo code logic can be implemented here
    console.log("Applying promo code:", promoCode);
  };

  const handleCalculateShipping = () => {
    // Shipping calculation logic
    console.log("Calculating shipping for:", shippingData);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some items to your cart to get started!
          </p>
          <Link href="/shops">
            <Button className="bg-primary hover:bg-primary/90">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side - Cart Items */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg border">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b bg-gray-50 font-semibold text-gray-700">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Cart Items */}
            <div className="divide-y">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-6 items-center"
                >
                  {/* Product Info */}
                  <div className="md:col-span-5 flex items-center gap-4">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FiX size={20} />
                    </button>
                    <div className="w-20 h-20 bg-gray-100 rounded shrink-0">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/shops/${item.slug}`}
                        className="font-medium text-gray-900 hover:text-primary transition"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        In Stock: {item.stock} pcs
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 text-left md:text-center">
                    <span className="md:hidden font-medium text-gray-700">
                      Price:{" "}
                    </span>
                    <span className="font-medium text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="md:col-span-3 flex items-center gap-2 md:justify-center">
                    <span className="md:hidden font-medium text-gray-700">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-2 hover:bg-gray-100 transition"
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-2 hover:bg-gray-100 transition"
                        disabled={item.quantity >= item.stock}
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="md:col-span-2 text-left md:text-right">
                    <span className="md:hidden font-medium text-gray-700">
                      Total:{" "}
                    </span>
                    <span className="font-bold text-primary text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Section */}
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex gap-2 max-w-md">
                <Input
                  type="text"
                  placeholder="Add promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleApplyPromo}
                  className="bg-primary hover:bg-primary/90 px-6"
                >
                  APPLY
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Cart Totals & Shipping */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Cart Totals
            </h3>

            {/* Subtotal */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-medium">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 pb-4 border-b">
                <span>Total:</span>
                <span className="font-medium">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Total with highlighted box */}
            <div className="bg-primary/10 rounded-lg p-4 mb-6 text-center">
              <div className="text-3xl font-bold text-primary">
                ${totalWithShipping.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                = ${totalWithShipping.toFixed(2)}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 flex items-start gap-2 mb-4">
                <span className="text-primary">✓</span>
                Shipping & taxes calculated at checkout
              </p>

              <Link href="/checkout">
                <Button className="w-full bg-primary hover:bg-primary/90 py-6 text-base font-semibold">
                  Proceed To Checkout
                </Button>
              </Link>
            </div>

            {/* Calculate Shipping Section */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                Calculate Shipping
              </h4>

              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Bangladesh"
                  value={shippingData.country}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      country: e.target.value,
                    })
                  }
                />
                <Input
                  type="text"
                  placeholder="Mirpur Dhaka-1205"
                  value={shippingData.city}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, city: e.target.value })
                  }
                />
                <Input
                  type="text"
                  placeholder="Postal Code"
                  value={shippingData.postalCode}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      postalCode: e.target.value,
                    })
                  }
                />

                <Button
                  onClick={handleCalculateShipping}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Shipping
                </Button>
              </div>
            </div>

            {/* Clear Cart Button */}
            <div className="border-t pt-4 mt-4">
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear your cart?")) {
                    removeFromCart;
                  }
                }}
                className="text-sm text-red-600 hover:text-red-700 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
