"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/lib/useAuth";
import { useAdminProtect } from "@/hooks/useAdminProtect";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
} from "@/lib/api";

export default function AdminCategories() {
  useAdminProtect();
  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    emoji: "",
  });

  // Emoji options for categories
  const emojiOptions = [
    { emoji: "🛋️", name: "Sofa" },
    { emoji: "🛏️", name: "Bed" },
    { emoji: "🪑", name: "Chair" },
    { emoji: "🍽️", name: "Dining" },
    { emoji: "🗄️", name: "Storage" },
    { emoji: "💼", name: "Office" },
    { emoji: "🎨", name: "Decor" },
    { emoji: "🪟", name: "Window" },
    { emoji: "🚪", name: "Door" },
    { emoji: "✨", name: "Lighting" },
    { emoji: "🌿", name: "Plant" },
    { emoji: "🖼️", name: "Wall Art" },
  ];

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      if (response.success && response.data?.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setMessage({ type: "error", text: "Failed to load categories" });
    } finally {
      setLoading(false);
    }
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "Category name is required" });
      return;
    }

    try {
      setSubmitting(true);
      const slug = formData.slug || generateSlug(formData.name);

      if (editingId) {
        // Update existing category
        const catId = "_id" in categories[0] ? editingId : editingId;
        await updateCategory(catId, {
          name: formData.name,
          slug,
          description: formData.description,
          image: formData.image,
          emoji: formData.emoji,
        });
        setMessage({ type: "success", text: "Category updated successfully" });
      } else {
        // Create new category
        await createCategory({
          name: formData.name,
          slug,
          image: formData.image,
          emoji: formData.emoji,
          description: formData.description,
        });
        setMessage({ type: "success", text: "Category created successfully" });
      }

      // Refresh categories
      await fetchCategories();
      setFormData({ name: "", slug: "", description: "", image: "", emoji: "" });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to save category",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
      emoji: cat.emoji || "",
    });
    setEditingId((cat._id || cat.id) as string);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      setSubmitting(true);
      await deleteCategory(id);
      setMessage({ type: "success", text: "Category deleted successfully" });
      await fetchCategories();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to delete category",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout adminEmail={user?.email || "Admin"}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Categories Management
        </h1>
        <p className="text-gray-600 mt-2">Manage product categories</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: "", slug: "", description: "", image: "", emoji: "" });
            setMessage(null);
          }}
          className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition font-semibold flex items-center gap-2"
        >
          <span>+</span> Add New Category
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full my-8">
            {/* Modal Header */}
            <div className="bg-yellow-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    name: "",
                    slug: "",
                    description: "",
                    image: "",
                    emoji: "",
                  });
                  setMessage(null);
                }}
                className="text-2xl font-bold hover:text-yellow-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: !editingId
                          ? generateSlug(e.target.value)
                          : formData.slug,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
                    placeholder="e.g., Sofas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Slug (URL-friendly)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
                    placeholder="e.g., sofas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
                    placeholder="Category description..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Emoji
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {emojiOptions.map((option) => (
                      <button
                        key={option.emoji}
                        onClick={() =>
                          setFormData({ ...formData, emoji: option.emoji })
                        }
                        title={option.name}
                        className={`text-3xl p-2 rounded-lg border-2 transition ${
                          formData.emoji === option.emoji
                            ? "border-yellow-600 bg-yellow-100"
                            : "border-gray-200 hover:border-yellow-400"
                        }`}
                      >
                        {option.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
                    placeholder="https://... (leave empty for Unsplash random)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to auto-generate random image from Unsplash
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex gap-4 justify-end border-t pt-4">
                <button
                   onClick={() => {
                     setShowForm(false);
                     setEditingId(null);
                     setFormData({
                       name: "",
                       slug: "",
                       description: "",
                       image: "",
                       emoji: "",
                     });
                     setMessage(null);
                   }}
                  disabled={submitting}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={submitting}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingId ? "Update" : "Add"}{" "}
                  Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No categories found. Create one to get started!
                </p>
              </div>
            ) : (
              categories.map((category) => {
                const categoryId = category._id || category.id;
                return (
                  <div
                    key={categoryId}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                  >
                    {category.image && (
                      <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      {category.emoji && (
                        <span className="text-4xl">{category.emoji}</span>
                      )}
                      <h3 className="text-2xl font-bold text-gray-900">
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Slug: <span className="font-mono">{category.slug}</span>
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      {category.description}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(category)}
                        disabled={submitting}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(categoryId as string)}
                        disabled={submitting}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
