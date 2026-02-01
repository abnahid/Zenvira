"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiUrl } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiFilter, FiGrid, FiList, FiSearch, FiX } from "react-icons/fi";
import ShopCard from "./ShopCard";

type Category = {
  id: string;
  name: string;
  slug: string;
};

const ShopClient = () => {
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [manufacturer, setManufacturer] = useState("");

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Read category and search query from URL on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const searchFromUrl = searchParams.get("q");

    if (categoryFromUrl) {
      setCategoryId(categoryFromUrl);
    }

    if (searchFromUrl) {
      setSearch(decodeURIComponent(searchFromUrl));
    }
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(apiUrl("/api/categories"));
        if (res.ok) {
          const data = await res.json();
          setCategories(data.success ? data.data : []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setCategoryId("all");
    setManufacturer("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  return (
    <div className="bg-white">
      {/* Single Line Header - Results, Filters, Search, Controls */}
      <div className="mx-auto max-w-7xl px-4 py-4 border-b">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Results Count & Title */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Medical Equipment Products
              </h1>
              <p className="text-xs text-gray-600">
                About {totalProducts.toLocaleString()} results
              </p>
            </div>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-sm font-medium">Sort:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Best Match</SelectItem>
                <SelectItem value="price">Price: Low High</SelectItem>
                <SelectItem value="-price">Price: High Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Per Page */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-sm font-medium">Per:</span>
            <Select
              value={limit.toString()}
              onValueChange={(v) => setLimit(parseInt(v))}
            >
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="36">36</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 border rounded-lg p-1">
            <button
              onClick={() => setViewType("grid")}
              className={`p-2 rounded transition ${
                viewType === "grid"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Grid View"
            >
              <FiGrid size={18} />
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`p-2 rounded transition ${
                viewType === "list"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="List View"
            >
              <FiList size={18} />
            </button>
          </div>

          {/* Center: Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition whitespace-nowrap"
          >
            <FiFilter size={18} />
          </button>

          {/* Right: Search */}
          <form onSubmit={handleSearch} className="flex gap-2 w-64">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 px-4"
            >
              <FiSearch size={18} />
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Filter Panel */}
        {showFilters && (
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Min Price ($)
                </label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Price ($)
                </label>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Manufacturer */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Manufacturer
                </label>
                <Input
                  type="text"
                  placeholder="Manufacturer name"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
              >
                Reset Filters
              </Button>
              <Button
                onClick={() => setPage(1)}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <ShopCard
          viewType={viewType}
          page={page}
          limit={limit}
          sortBy={sortBy}
          sortOrder={sortOrder}
          search={search}
          minPrice={minPrice}
          maxPrice={maxPrice}
          categoryId={categoryId}
          manufacturer={manufacturer}
          onPageChange={setPage}
          onTotalChange={setTotalProducts}
        />
      </div>
    </div>
  );
};

export default ShopClient;
