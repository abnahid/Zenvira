"use client";

import ProductCard, { Product } from "@/components/ProductCard";
import { apiUrl } from "@/lib/api";
import { useEffect, useState } from "react";

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

interface ProductWithReviews extends Product {
  reviews?: Review[];
  _count?: {
    reviews: number;
  };
  avgRating?: number;
}

export default function BestSellingProducts() {
  const [products, setProducts] = useState<ProductWithReviews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopReviewedProducts = async () => {
      try {
        // Fetch more products to find enough with reviews
        const res = await fetch(
          apiUrl(
            "/api/medicines?page=1&limit=50&sortBy=createdAt&sortOrder=desc",
          ),
        );

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            // Fetch individual product details to get reviews
            const productsWithReviews = await Promise.all(
              data.data.map(async (product: Product) => {
                try {
                  const detailRes = await fetch(
                    apiUrl(`/api/medicines/${product.slug}`),
                  );
                  if (detailRes.ok) {
                    const detailData = await detailRes.json();
                    if (detailData.success && detailData.data) {
                      const reviews = detailData.data.reviews || [];
                      const avgRating =
                        reviews.length > 0
                          ? reviews.reduce(
                              (sum: number, r: Review) => sum + r.rating,
                              0,
                            ) / reviews.length
                          : 0;
                      return {
                        ...product,
                        reviews,
                        avgRating,
                        reviewCount: reviews.length,
                      };
                    }
                  }
                  return {
                    ...product,
                    reviews: [],
                    avgRating: 0,
                    reviewCount: 0,
                  };
                } catch {
                  return {
                    ...product,
                    reviews: [],
                    avgRating: 0,
                    reviewCount: 0,
                  };
                }
              }),
            );

            // Filter products that have at least one review
            const reviewedProducts = productsWithReviews.filter(
              (p) => p.reviewCount > 0,
            );

            // Sort by average rating (highest first), then by review count
            reviewedProducts.sort((a, b) => {
              if (b.avgRating !== a.avgRating) {
                return b.avgRating - a.avgRating;
              }
              return b.reviewCount - a.reviewCount;
            });

            // Take top 8 products
            setProducts(reviewedProducts.slice(0, 8));
          }
        }
      } catch (error) {
        console.error("Failed to fetch top reviewed products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopReviewedProducts();
  }, []);

  // Don't render the section if there are no reviewed products
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Best Selling Item</h2>
        <p className="text-gray-500 text-xs sm:text-sm">
          Our top-rated products based on customer reviews
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-48 sm:h-72 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} viewType="grid" />
          ))}
        </div>
      )}
    </section>
  );
}
