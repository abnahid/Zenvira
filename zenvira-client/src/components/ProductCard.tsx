"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaHeart, FaSearchPlus, FaShoppingCart } from "react-icons/fa";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Seller = {
  id: string;
  name: string;
  image: string;
  email: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  stock: number;
  description: string;
  manufacturer: string;
  status: "active" | "inactive";
  sellerId: string;
  categoryId: string;
  createdAt: string;
  images: string[];
  category: Category;
  seller: Seller;
};

type ProductCardProps = {
  product: Product;
  viewType?: "grid" | "list";
};

const ProductCard = ({ product, viewType = "grid" }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Default rating (you can add actual rating data to your API)
  const rating = 4.5;
  const reviewCount = 14;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) return;

    setIsAddingToCart(true);
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "/placeholder.png",
      stock: product.stock,
      quantity: 1,
    });

    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0] || "/placeholder.png",
        stock: product.stock,
        category: product.category.name,
      });
    }
  };

  const inWishlist = isInWishlist(product.id);

  if (viewType === "list") {
    return (
      <div className="group border rounded-lg overflow-hidden bg-white hover:shadow-lg transition">
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="relative overflow-hidden rounded-lg bg-gray-100 shrink-0">
            <Link href={`/products/${product.slug}`}>
              <Image
                src={product.images[0]}
                alt={product.name}
                width={200}
                height={200}
                className="w-48 h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </Link>

            {/* Stock Badge */}
            {product.stock <= 10 && product.stock > 0 && (
              <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                Low Stock
              </span>
            )}

            {product.stock === 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between py-2">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {product.category.name}
              </p>

              <Link href={`/shops/${product.slug}`}>
                <h3 className="font-semibold text-lg text-gray-900 hover:text-primary transition mb-2">
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">
                      {i < Math.floor(rating) ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-600">({reviewCount})</span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex gap-2 items-center mb-3">
                <span className="font-semibold text-lg text-black">
                  ${product.price.toFixed(2)}
                </span>

                {product.oldPrice && (
                  <span className="line-through text-red-500">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="p-2 border rounded-lg text-gray-600 hover:bg-primary hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                title={product.stock === 0 ? "Out of stock" : "Add to cart"}
              >
                <FaShoppingCart size={16} />
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`p-2 border rounded-lg transition ${
                  inWishlist
                    ? "bg-red-500 text-white border-red-500"
                    : "text-gray-600 hover:bg-primary hover:text-white"
                }`}
                title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FaHeart size={16} />
              </button>

              <Link
                href={`/shops/${product.slug}`}
                className="p-2 border rounded-lg text-gray-600 hover:bg-primary hover:text-white transition"
                title="View details"
              >
                <FaSearchPlus size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (original)
  return (
    <div className="group">
      {/* Image Box */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        {/* Product Image */}
        <Link href={`/shops/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={270}
            height={370}
            className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Stock Badge */}
        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            Low Stock
          </span>
        )}

        {product.stock === 0 && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </span>
        )}

        {/* Hover Icons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            title={product.stock === 0 ? "Out of stock" : "Add to cart"}
          >
            <FaShoppingCart size={14} />
          </button>

          <button
            onClick={handleToggleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
              inWishlist
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700 hover:bg-primary hover:text-white"
            }`}
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FaHeart size={14} />
          </button>

          <Link
            href={`/shops/${product.slug}`}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white transition"
            title="View details"
          >
            <FaSearchPlus size={14} />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>

        <Link href={`/shops/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 hover:text-primary transition">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-400 mt-1">by {product.manufacturer}</p>

        <div className="flex gap-2 items-center text-sm mt-2">
          <span className="font-semibold text-black">
            ${product.price.toFixed(2)}
          </span>

          {product.oldPrice && (
            <span className="line-through text-red-500">
              ${product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
