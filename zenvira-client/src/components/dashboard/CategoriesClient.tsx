"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import { apiUrl } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";

interface Category {
  id: string;
  name: string;
  slug: string;
  medicines: { id: string }[];
}

export default function CategoriesClient() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl("/api/categories"), {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data.data || []);
      setIsInitialLoad(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      setIsInitialLoad(false);
      addToast("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      addToast("Category name is required", "error");
      return;
    }

    const slug = newCategory.slug.trim() || generateSlug(newCategory.name);

    try {
      const response = await fetch(apiUrl("/api/categories"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newCategory.name.trim(), slug }),
      });

      const data = await response.json();

      if (data.success) {
        setCategories([...categories, { ...data.data, medicines: [] }]);
        addToast("Category created successfully", "success");
        setShowAddModal(false);
        setNewCategory({ name: "", slug: "" });
      } else {
        addToast(data.message || "Failed to create category", "error");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      addToast("Failed to create category", "error");
    }
  };

  const handleUpdateCategory = async (categoryId: string) => {
    if (!editingCategory) return;

    try {
      const response = await fetch(apiUrl(`/api/categories/${categoryId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editingCategory.name,
          slug: editingCategory.slug,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCategories(
          categories.map((c) =>
            c.id === categoryId ? { ...c, ...data.data } : c
          )
        );
        addToast("Category updated successfully", "success");
        setEditingCategory(null);
      } else {
        addToast(data.message || "Failed to update category", "error");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      addToast("Failed to update category", "error");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(apiUrl(`/api/categories/${categoryId}`), {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setCategories(categories.filter((c) => c.id !== categoryId));
        addToast("Category deleted successfully", "success");
        setDeleteConfirm(null);
      } else {
        addToast(data.message || "Failed to delete category", "error");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      addToast("Failed to delete category", "error");
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-gray-600 mt-1">Manage product categories</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <FiPlus className="mr-2" size={16} />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center justify-end text-sm text-gray-600">
            Total: {filteredCategories.length} categories
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {isInitialLoad ? (
          <div className="p-8 text-center text-gray-500">
            Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No categories found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto relative">
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      {editingCategory?.id === category.id ? (
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      ) : (
                        <span className="font-medium text-gray-900">
                          {category.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingCategory?.id === category.id ? (
                        <input
                          type="text"
                          value={editingCategory.slug}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              slug: e.target.value,
                            })
                          }
                          className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      ) : (
                        <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                          {category.slug}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {category.medicines?.length || 0} products
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {editingCategory?.id === category.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateCategory(category.id)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingCategory(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : deleteConfirm === category.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingCategory(category)}
                            >
                              <FiEdit2 size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setDeleteConfirm(category.id)}
                              disabled={
                                category.medicines &&
                                category.medicines.length > 0
                              }
                              title={
                                category.medicines &&
                                category.medicines.length > 0
                                  ? "Cannot delete category with products"
                                  : "Delete category"
                              }
                            >
                              <FiTrash2 size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Add New Category</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategory({ name: "", slug: "" });
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => {
                    setNewCategory({
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    });
                  }}
                  placeholder="e.g. Pain Relief"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, slug: e.target.value })
                  }
                  placeholder="pain-relief"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated from name. Used in URLs.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategory({ name: "", slug: "" });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Create Category</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
