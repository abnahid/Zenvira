"use client";

import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { apiUrl } from "@/lib/api";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import { FiMinus, FiPlus, FiShoppingCart, FiX } from "react-icons/fi";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
};

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  description: string;
  manufacturer: string;
  status: "active" | "inactive";
  sellerId: string;
  categoryId: string;
  createdAt: string;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  seller: {
    id: string;
    name: string;
    image: string;
    email: string;
  };
  reviews: Review[];
};

const ShopDetailsClient = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [addingToCart, setAddingToCart] = useState(false);
  const [showCartSuccess, setShowCartSuccess] = useState(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Calculate rating and review count from actual reviews
  const reviewCount = product?.reviews?.length || 0;
  const rating =
    reviewCount > 0
      ? product!.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  const fetchProduct = async () => {
    try {
      const res = await fetch(apiUrl(`/api/medicines/${slug}`));
      if (!res.ok) throw new Error("Failed to fetch product");

      const json = await res.json();
      if (json.success && json.data) {
        setProduct(json.data);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleSubmitReview = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!product) return;

    setSubmittingReview(true);
    setReviewError(null);

    try {
      const res = await fetch(apiUrl("/api/reviews"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          medicineId: product.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const json = await res.json();

      if (json.success) {
        // Reset form and close
        setShowReviewForm(false);
        setReviewRating(5);
        setReviewComment("");
        // Refresh product to get updated reviews
        await fetchProduct();
      } else {
        setReviewError(json.message || "Failed to submit review");
      }
    } catch (err) {
      setReviewError("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageBanner
          title="Loading..."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shops" },
            { label: "Loading" },
          ]}
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <PageBanner
          title="Shop Details"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shops" },
            { label: "Shop Details" },
          ]}
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg">
              {error || "Product not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (value: number) => {
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0] || "/placeholder.png",
        stock: product.stock,
        quantity: quantity,
      });

      // Show success notification
      setAddingToCart(false);
      setShowCartSuccess(true);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowCartSuccess(false);
      }, 3000);

      // Reset quantity to 1
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAddingToCart(false);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  return (
    <div className="bg-white">
      <PageBanner
        title={product.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shops" },
          { label: product.name },
        ]}
      />
      {/* Product Details Section */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 ">
              <Image
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx
                        ? "border-primary"
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-gray-500 mb-2">
              {product.category.name}
            </p>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xl">
                    {i < Math.floor(rating) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">({reviewCount})</span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-primary mb-2">
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Manufacturer & Stock */}
            <div className="mb-6 pb-6 border-b">
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-600">
                  Manufacturer:
                </span>
                <p className="text-gray-900">{product.manufacturer}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Stock:
                </span>
                <p className="text-gray-900">
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-semibold">
                      {product.stock} in stock
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Out of Stock
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="p-2 hover:bg-gray-100 transition"
                >
                  <FiMinus size={18} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  className="w-16 text-center border-0 focus:outline-none"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition"
                >
                  <FiPlus size={18} />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="flex-1 bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
              >
                <FiShoppingCart size={20} />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </Button>
            </div>

            {/* Wishlist & Share */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <FaHeart size={18} />
                Wishlist
              </Button>
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <FaShareAlt size={18} />
                Share
              </Button>
            </div>

            {/* Seller Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">Sold by</p>
              <div className="flex items-center gap-3">
                <Image
                  src={product.seller.image}
                  alt={product.seller.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {product.seller.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {product.seller.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-t pt-8">
          {/* Tab Navigation */}
          <div className="flex gap-6 mb-8 border-b">
            {[
              { id: "description", label: "Description" },
              { id: "additional", label: "Additional Info" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 font-medium transition ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Overview
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.description} This medication has been carefully
                  formulated to provide effective relief while maintaining the
                  highest safety standards. Always consult with your healthcare
                  provider before starting any new medication.
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Usage Guidelines
                  </h4>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">→</span>
                      <span>
                        Store in a cool, dry place away from direct sunlight and
                        keep out of reach of children
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">→</span>
                      <span>
                        Follow the dosage instructions provided by your doctor
                        or as indicated on the packaging
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">→</span>
                      <span>
                        Do not exceed the recommended dose without medical
                        advice
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">→</span>
                      <span>
                        If symptoms persist or worsen, discontinue use and
                        consult a healthcare professional immediately
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "additional" && (
              <div className="max-w-3xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Additional Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Manufacturer</span>
                    <span className="font-semibold">
                      {product.manufacturer}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold">
                      {product.category.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">SKU</span>
                    <span className="font-semibold">{product.id}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600">Stock Status</span>
                    <span
                      className={`font-semibold ${
                        product.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-3xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Customer Reviews
                </h3>

                {/* Rating Summary */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">
                      {rating.toFixed(1)}
                    </div>
                    <div className="flex text-yellow-400 justify-center my-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-lg">
                          {i < Math.floor(rating) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                {reviewCount > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b pb-6 last:border-b-0"
                      >
                        <div className="flex items-start gap-4">
                          <Image
                            src={review.user.image || "/placeholder-avatar.png"}
                            alt={review.user.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">
                                {review.user.name}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex text-yellow-400 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-sm">
                                  {i < review.rating ? "★" : "☆"}
                                </span>
                              ))}
                            </div>
                            {review.comment && (
                              <p className="text-gray-600">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                )}

                {/* Write Review Form */}
                {showReviewForm ? (
                  <div className="mt-6 p-6 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-900">
                        Write Your Review
                      </h4>
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX size={20} />
                      </button>
                    </div>

                    {reviewError && (
                      <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {reviewError}
                      </div>
                    )}

                    {/* Star Rating Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className={`text-3xl transition ${
                              star <= reviewRating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            } hover:text-yellow-400`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review (Optional)
                      </label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Share your experience with this product..."
                      />
                    </div>

                    <Button
                      onClick={handleSubmitReview}
                      disabled={submittingReview}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6 text-center">
                    <Button
                      onClick={() => {
                        if (!user) {
                          router.push("/login");
                          return;
                        }
                        setShowReviewForm(true);
                      }}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Write a Review
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification Toast */}
      {showCartSuccess && (
        <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <div className="shrink-0">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold">Added to cart!</p>
              <p className="text-sm text-green-50">
                {quantity} x {product.name}
              </p>
            </div>
            <button
              onClick={() => router.push("/cart")}
              className="ml-4 bg-white text-green-600 px-4 py-2 rounded font-medium text-sm hover:bg-green-50 transition"
            >
              View Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopDetailsClient;
