"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { apiUrl } from "@/lib/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiEdit, FiX } from "react-icons/fi";

export default function SellerProfileClient() {
  const { user, fetchUser } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || "",
        image: user.image || "",
      });
      setImagePreview(user.image || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!editData.name.trim()) {
      addToast("Please enter a name", "error");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(apiUrl("/api/user/me"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: editData.name,
          image: editData.image,
        }),
      });

      const data = await response.json();

      if (data.success) {
        addToast("Profile updated successfully!", "success");
        setIsEditing(false);
        await fetchUser();
      } else {
        addToast(data.message || "Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Save profile error:", error);
      addToast("Failed to save profile. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please login to edit your profile</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Profile Header */}
      <div className="p-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* Profile Photo */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 border-4 border-primary">
              <Image
                src={user.image || "https://avatar.iran.liara.run/public/1"}
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
            <p className="text-gray-600 mb-2">{user.email}</p>
            <p className="text-sm text-gray-500 mb-6">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium"
              >
                <FiEdit size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Edit Profile Information
          </h3>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProfile();
            }}
          >
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your full name"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This name will appear on your seller profile and product
                listings.
              </p>
            </div>

            {/* Photo URL Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo URL
              </label>
              <div className="space-y-3">
                <input
                  type="url"
                  value={editData.image}
                  onChange={(e) => {
                    setEditData({
                      ...editData,
                      image: e.target.value,
                    });
                    setImagePreview(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter photo URL (e.g., https://example.com/photo.jpg)"
                />
                <p className="text-xs text-gray-500">
                  Paste the URL of your photo. Supported formats: JPG, PNG, GIF,
                  WebP. Recommended size: 300x300px or larger.
                </p>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Photo Preview:
                    </p>
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-300 shrink-0">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          onError={() => {
                            console.error("Image failed to load");
                          }}
                        />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-xs text-gray-600">
                          This is how your photo will appear on your seller
                          profile and across the platform.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Email Display (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={editData.name ? user.email : ""}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                placeholder="Email cannot be changed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email address cannot be changed for security reasons.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditData({
                    name: user?.name || "",
                    image: user?.image || "",
                  });
                  setImagePreview(user?.image || "");
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

      {/* Profile Details */}
      {!isEditing && (
        <div className="p-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Account Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Full Name</span>
              <span className="font-medium text-gray-900">{user.name}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Email Address</span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Email Verified</span>
              <span
                className={`font-medium ${
                  user.emailVerified ? "text-green-600" : "text-amber-600"
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
      )}
    </div>
  );
}
