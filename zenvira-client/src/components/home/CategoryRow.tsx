"use client";

import { apiUrl } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiBox,
  FiBriefcase,
  FiGrid,
  FiHeart,
  FiShield,
  FiTag,
} from "react-icons/fi";

type Category = {
  id: string;
  name: string;
  slug: string;
};

// All available icons in a cycle
const availableIcons = [FiHeart, FiShield, FiBox, FiBriefcase, FiTag, FiGrid];

// Function to get icon based on category name/slug with keyword matching
const getIconForCategory = (category: Category, index: number) => {
  const searchText = `${category.name} ${category.slug}`.toLowerCase();

  // Keyword-based matching
  if (searchText.includes("pain") || searchText.includes("relief"))
    return FiHeart;
  if (searchText.includes("cold") || searchText.includes("flu"))
    return FiShield;
  if (searchText.includes("ayurvedic") || searchText.includes("herbal"))
    return FiTag;
  if (searchText.includes("digestive") || searchText.includes("care"))
    return FiBriefcase;
  if (searchText.includes("vitamin") || searchText.includes("supplement"))
    return FiBox;
  if (searchText.includes("heart") || searchText.includes("health"))
    return FiHeart;
  if (searchText.includes("dental") || searchText.includes("oral"))
    return FiBriefcase;
  if (searchText.includes("equipment") || searchText.includes("device"))
    return FiBox;
  if (searchText.includes("protective") || searchText.includes("safety"))
    return FiShield;
  if (searchText.includes("accessory") || searchText.includes("accessories"))
    return FiBox;

  // Fallback: cycle through icons based on index to ensure variety
  return availableIcons[index % availableIcons.length];
};

export default function CategoryRow() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(apiUrl("/api/categories"));
        if (res.ok) {
          const data = await res.json();
          // Limit to 6 categories for display
          setCategories(data.success ? data.data.slice(0, 6) : []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full border-b py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-full bg-gray-100 animate-pulse w-14 h-14" />
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 border-b py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const Icon = getIconForCategory(category, index);

            return (
              <Link
                key={category.id}
                href={`/shops?category=${category.id}`}
                className="flex flex-col items-center gap-2 cursor-pointer transition text-gray-700 hover:text-primary"
              >
                <div className="p-3 rounded-full transition bg-gray-100 hover:bg-primary/10">
                  <Icon className="text-xl" />
                </div>

                <span className="text-sm font-medium text-center">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
