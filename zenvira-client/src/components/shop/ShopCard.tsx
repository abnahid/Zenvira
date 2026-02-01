"use client";

import ProductCard, { Product } from "@/components/ProductCard";
import { apiUrl } from "@/lib/api";
import { useEffect, useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { Button } from "../ui/button";

type ApiResponse = {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

type ShopCardProps = {
  viewType?: "grid" | "list";
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  manufacturer?: string;
  onPageChange?: (page: number) => void;
  onTotalChange?: (total: number) => void;
};

const ShopCard = ({
  viewType = "grid",
  page = 1,
  limit = 12,
  sortBy = "createdAt",
  sortOrder = "desc",
  search = "",
  minPrice = "",
  maxPrice = "",
  categoryId = "",
  manufacturer = "",
  onPageChange,
  onTotalChange,
}: ShopCardProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
          ...(search && { search }),
          ...(minPrice && { minPrice }),
          ...(maxPrice && { maxPrice }),
          ...(categoryId && categoryId !== "all" && { categoryId }),
          ...(manufacturer && { manufacturer }),
        });

        const res = await fetch(apiUrl(`/api/medicines?${queryParams}`));
        if (!res.ok) throw new Error("Failed to fetch products");

        const json: ApiResponse = await res.json();
        if (json.success) {
          setProducts(json.data);
          setPagination(json.pagination);
          onTotalChange?.(json.pagination.total);
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    page,
    limit,
    sortBy,
    sortOrder,
    search,
    minPrice,
    maxPrice,
    categoryId,
    manufacturer,
  ]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64 w-full" />
            <div className="mt-3 space-y-2">
              <div className="bg-gray-200 h-3 w-20 rounded" />
              <div className="bg-gray-200 h-4 w-full rounded" />
              <div className="bg-gray-200 h-3 w-24 rounded" />
              <div className="bg-gray-200 h-4 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Products Grid */}
      <div
        className={
          viewType === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
            : "flex flex-col gap-4 mb-8"
        }
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} viewType={viewType} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, pagination.total)} of {pagination.total}{" "}
            products
          </div>

          <div className="flex gap-5 flex-wrap justify-center">
            <Button
              onClick={() => onPageChange?.(page - 1)}
              disabled={!pagination.hasPrevPage}
              variant="outline"
              className="w-10 h-10 rounded-full"
            >
              <FaArrowLeftLong />
            </Button>

            {/* Page Numbers */}
            {Array.from({ length: pagination.totalPages }).map((_, i) => {
              const pageNum = i + 1;
              // Show max 5 page buttons
              const isVisible =
                pageNum === 1 ||
                pageNum === pagination.totalPages ||
                (pageNum >= page - 1 && pageNum <= page + 1);

              if (!isVisible) return null;

              return (
                <Button
                  key={pageNum}
                  onClick={() => onPageChange?.(pageNum)}
                  variant={pageNum === page ? "default" : "outline"}
                  className={
                    pageNum === page
                      ? "bg-primary w-10 h-10 hover:bg-primary/90 rounded-full"
                      : "w-10 h-10 rounded-full"
                  }
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              onClick={() => onPageChange?.(page + 1)}
              disabled={!pagination.hasNextPage}
              variant="outline"
              className="w-10 h-10 rounded-full"
            >
              <FaArrowRightLong />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopCard;
