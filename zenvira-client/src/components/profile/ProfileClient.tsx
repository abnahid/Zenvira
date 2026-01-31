"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { apiUrl } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiEdit,
  FiHeart,
  FiLogOut,
  FiMapPin,
  FiPackage,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";

const ProfileClient = () => {
  const { user, logout, isLoading, fetchUser } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
  });

  // Initialize edit data when user loads
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Ensure component only renders on client after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      const response = await fetch(apiUrl("/api/user/me"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: editData.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveSuccess(true);
        setIsEditing(false);
        // Refresh user data from context
        await fetchUser();
        // Clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(data.message || "Failed to save profile");
      }
    } catch (error) {
      console.error("Save profile error:", error);
      setSaveError("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">
            Please login to view your profile
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const menuItems = [
    { id: "profile", label: "My Profile", icon: FiUser },
    { id: "orders", label: "My Orders", icon: FiPackage },
    { id: "wishlist", label: "Wishlist", icon: FiHeart },
    { id: "addresses", label: "Addresses", icon: FiMapPin },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Sidebar - Navigation Menu */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase">
                Account Menu
              </h3>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                        activeTab === item.id
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full mt-6 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition flex items-center justify-center gap-2"
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="md:col-span-3">
            {/* Profile Section */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Profile Header Card */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                    {/* Profile Photo */}
                    <div className="relative shrink-0">
                      <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 border-4 border-primary">
                        <Image
                          src={
                            user.image ||
                            "https://avatar.iran.liara.run/public/1"
                          }
                          alt={user.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="grow">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {user.name}
                      </h1>
                      <p className="text-gray-600 mb-6">{user.email}</p>

                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium"
                        >
                          <FiEdit size={16} />
                          Edit Profile
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Edit Profile Form */}
                  {isEditing && (
                    <div className="mt-8 pt-8 border-t">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Edit Profile Information
                      </h3>

                      {saveError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                          {saveError}
                        </div>
                      )}

                      {saveSuccess && (
                        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                          Profile updated successfully!
                        </div>
                      )}

                      <form
                        className="space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSaveProfile();
                        }}
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={editData.email}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                            placeholder="Email cannot be changed"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Email address cannot be changed for security
                            reasons.
                          </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSaving ? "Saving..." : "Save Changes"}
                          </Button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setSaveError(null);
                              setSaveSuccess(false);
                              setEditData({
                                name: user?.name || "",
                                email: user?.email || "",
                              });
                            }}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium flex items-center gap-2"
                          >
                            <FiX size={16} />
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* Account Details */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Account Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Email</span>
                      <span className="font-medium text-gray-900">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Email Verified</span>
                      <span
                        className={`font-medium ${
                          user.emailVerified
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {user.emailVerified ? "Verified" : "Not Verified"}
                      </span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-medium text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Section */}
            {activeTab === "orders" && (
              <div className="text-center py-12">
                <FiPackage className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  View Your Orders
                </h3>
                <p className="text-gray-600 mb-6">
                  Click the button below to view your complete order history,
                  track shipments, and manage your orders.
                </p>
                <a
                  href="/orders"
                  className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium"
                >
                  Go to Orders
                </a>
              </div>
            )}

            {/* Wishlist Section */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  My Wishlist ({wishlist.length} items)
                </h3>

                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <FiHeart className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600">Your wishlist is empty</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Add products to your wishlist to save them for later
                    </p>
                    <a
                      href="/shops"
                      className="inline-block mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium"
                    >
                      Browse Products
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="relative mb-3">
                          <Link href={`/shops/${item.slug}`}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={200}
                              height={200}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                          </Link>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition shadow-md"
                            title="Remove from wishlist"
                          >
                            <FiX size={16} />
                          </button>
                        </div>

                        <p className="text-xs text-gray-500 mb-1">
                          {item.category}
                        </p>

                        <Link
                          href={`/shops/${item.slug}`}
                          className="font-medium text-gray-900 hover:text-primary transition block mb-2"
                        >
                          {item.name}
                        </Link>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            ${item.price.toFixed(2)}
                          </span>

                          {item.stock > 0 ? (
                            <span className="text-xs text-green-600">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-xs text-red-600">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/shops/${item.slug}`}
                          className="mt-3 w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                        >
                          <FiShoppingCart size={16} />
                          View Product
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Section */}
            {activeTab === "addresses" && (
              <div className="text-center py-12">
                <FiMapPin className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Manage Your Addresses
                </h3>
                <p className="text-gray-600 mb-6">
                  Coming soon! You'll be able to save and manage your delivery
                  addresses for faster checkout.
                </p>
                <button
                  disabled
                  className="inline-block px-6 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed text-sm font-medium"
                >
                  Add Address (Coming Soon)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
