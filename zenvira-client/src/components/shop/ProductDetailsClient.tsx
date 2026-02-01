"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { apiUrl } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaEdit,
  FaShoppingCart,
  FaStar,
  FaTrash,
} from "react-icons/fa";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  createdAt: string;
}

interface Seller {
  id: string;
  name: string;
  image: string | null;
  email: string;
}

interface Category {
  id: string;
  name: string;
}

interface Medicine {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  description: string;
  manufacturer: string;
  status: string;
  images: string[];
  category: Category;
  seller: Seller;
  reviews: Review[];
  createdAt: string;
}

export default function ProductDetailsClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchMedicineDetails();
  }, [slug]);

  const fetchMedicineDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(apiUrl(`/api/medicines/${slug}`), {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setMedicine(data.data);
      } else {
        setError(data.message || "Medicine not found");
      }
    } catch (err) {
      console.error("Error fetching medicine:", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!medicine) return;

    try {
      setIsDeleting(true);
      const response = await fetch(apiUrl(`/api/medicines/${medicine.id}`), {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        addToast("Product deleted successfully!", "success");
        router.push("/dashboard/my-products");
      } else {
        addToast("Failed to delete product", "error");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      addToast("Failed to delete product", "error");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const isProductOwner =
    user &&
    medicine &&
    (user.id === medicine.seller.id || user.role === "admin");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Product not found"}
          </h1>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist
          </p>
          <Link href="/shops">
            <Button className="gap-2">
              <FaArrowLeft size={14} />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const avgRating =
    medicine.reviews.length > 0
      ? (
          medicine.reviews.reduce((sum, r) => sum + r.rating, 0) /
          medicine.reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/shops">
              <Button variant="outline" size="sm" className="gap-2">
                <FaArrowLeft size={14} />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {medicine.name}
            </h1>
          </div>
          {isProductOwner && (
            <div className="flex gap-2">
              <Link href={`/dashboard/my-products/${medicine.id}/edit`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <FaEdit size={14} />
                  Edit
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <FaTrash size={14} />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div className="space-y-4">
            {medicine.images.length > 0 ? (
              <>
                <div className="bg-white rounded-lg border overflow-hidden aspect-square">
                  <img
                    src={medicine.images[selectedImage]}
                    alt={medicine.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {medicine.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {medicine.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`border rounded-lg overflow-hidden aspect-square transition ${
                          selectedImage === idx
                            ? "border-primary border-2"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${medicine.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Price & Status */}
            <div>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${medicine.price.toFixed(2)}
                </span>
                <Badge
                  variant={medicine.stock > 0 ? "default" : "destructive"}
                  className="text-base"
                >
                  {medicine.stock > 0
                    ? `In Stock (${medicine.stock})`
                    : "Out of Stock"}
                </Badge>
              </div>
              <Badge
                variant={medicine.status === "active" ? "default" : "secondary"}
              >
                {medicine.status}
              </Badge>
            </div>

            {/* Product Info */}
            <div className="space-y-3 pb-4 border-b">
              <div>
                <p className="text-sm text-gray-600">Manufacturer</p>
                <p className="text-lg font-semibold text-gray-900">
                  {medicine.manufacturer}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="text-lg font-semibold text-gray-900">
                  {medicine.category.name}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {medicine.description}
              </p>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 items-center">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 text-center border-l border-r py-2"
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(medicine.stock, quantity + 1))
                  }
                  className="px-4 py-2 hover:bg-gray-100"
                  disabled={quantity >= medicine.stock}
                >
                  +
                </button>
              </div>
              <Button
                size="lg"
                disabled={medicine.stock === 0}
                className="flex-1 gap-2"
              >
                <FaShoppingCart size={16} />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Seller Information
          </h2>
          <div className="flex items-center gap-4">
            {medicine.seller.image && (
              <img
                src={medicine.seller.image}
                alt={medicine.seller.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {medicine.seller.name}
              </p>
              <p className="text-gray-600">{medicine.seller.email}</p>
              <Button variant="outline" size="sm" className="mt-2">
                Contact Seller
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h2>

          {medicine.reviews.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      size={16}
                      fill={
                        i < Math.round(parseFloat(avgRating as string))
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {avgRating}
                </span>
                <span className="text-gray-600">
                  ({medicine.reviews.length} reviews)
                </span>
              </div>

              <div className="space-y-4 divide-y">
                {medicine.reviews.map((review) => (
                  <div key={review.id} className="pt-4 first:pt-0">
                    <div className="flex items-center gap-3 mb-2">
                      {review.user.image && (
                        <img
                          src={review.user.image}
                          alt={review.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.user.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex text-yellow-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FaStar
                                key={i}
                                size={12}
                                fill={
                                  i < review.rating ? "currentColor" : "none"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{medicine?.name}"? This action
              cannot be undone and the product will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
