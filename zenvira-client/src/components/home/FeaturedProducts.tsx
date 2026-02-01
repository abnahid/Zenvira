"use client";

import ProductCard, { Product } from "@/components/ProductCard";
import { apiUrl } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          apiUrl(
            "/api/medicines?page=1&limit=6&sortBy=createdAt&sortOrder=desc",
          ),
        );
        if (res.ok) {
          const data = await res.json();
          setProducts(data.success ? data.data.slice(0, 6) : []);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
        <p className="text-gray-500 text-sm">
          Discover our carefully selected medical and healthcare products
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-72 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT: PROMO CARDS */}
          <div className="flex flex-col gap-6 h-full">
            {/* Promo Card 1 */}
            <div className="rounded-xl bg-emerald-50 p-6 flex flex-col justify-between flex-1">
              <div>
                <span className="text-xs text-emerald-600 font-semibold">
                  Mask & Covid
                </span>

                <h3 className="text-2xl font-bold mt-2 mb-4">
                  50% off in Covid Vaccine
                </h3>

                <Link
                  href="/shops"
                  className="text-sm text-emerald-600 font-medium hover:underline"
                >
                  Buy Now →
                </Link>
              </div>

              <div className="mt-10 w-full h-32 rounded-lg flex items-center justify-center text-xs text-gray-500">
                <Image
                  src="/assets/cobid19.jpg"
                  alt="Evion 400"
                  width={180}
                  height={90}
                  className="bg-transparent object-contain mix-blend-multiply mb-4"
                />
              </div>
            </div>

            {/* Promo Card 2 */}
            <div className="rounded-xl bg-blue-50 p-6 flex flex-col justify-between flex-1">
              <div>
                <span className="text-xs text-blue-600 font-semibold">
                  — 59% OFF
                </span>

                <h3 className="text-2xl font-bold mt-2 mb-4">
                  Antiseptic Dry Hand Gel
                </h3>

                <Link
                  href="/shops"
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  Buy Now →
                </Link>
              </div>

              <div className="mt-10 w-full h-32 rounded-lg flex items-center justify-center text-xs text-gray-500">
                <Image
                  src="/assets/madicin1.jpg"
                  alt="Evion 400"
                  width={180}
                  height={90}
                  className="bg-transparent object-contain mix-blend-multiply mb-4"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT CARDS */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} viewType="grid" />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
