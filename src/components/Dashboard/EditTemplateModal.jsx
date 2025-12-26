"use client";
import { useState, useEffect } from "react";
import { X, Save, Upload } from "lucide-react";
import { templatesAPI } from "@/lib/api";

export default function EditTemplateModal({ isOpen, onClose, onSuccess, template }) {
  const [formData, setFormData] = useState({
    title: "",
    category_id: 1,
    price: "",
    image_url: "",
    description: "",
    created_by: 1
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (template) {
      setFormData({
        title: template.name || template.title || "",
        category_id: getCategoryId(template.category) || 1,
        price: template.price?.toString() || "",
        image_url: template.image || template.image_url || "",
        description: template.description || "",
        created_by: template.created_by || 1
      });
    }
  }, [template]);

  const getCategoryId = (categoryName) => {
    const categoryMap = {
      'Wedding': 1,

      'Corporate': 3,
      'E-Invitation': 4,
      'Birthday': 5,
      'Anniversary': 6
    };
    return categoryMap[categoryName] || 1;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file);

    try {
      setUploading(true);
      setError("");

      const res = await fetch("https://beyondinviteb.onrender.com/api/upload", {
        method: "POST",
        body: data
      });

      if (!res.ok) throw new Error("Image upload failed");
      const result = await res.json();

      setFormData(prev => ({
        ...prev,
        image_url: result.imageUrl || ""
      }));
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await templatesAPI.update(template.id, {
        ...formData,
        price: parseFloat(formData.price) || 0,
        category_id: parseInt(formData.category_id)
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update template");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Template</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                placeholder="Enter template title"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
              >
                <option value={1}>Wedding</option>
                <option value={2}>Baby Shower</option>
                <option value={3}>Corporate</option>
                <option value={4}>E-Invitation</option>
                <option value={5}>Birthday</option>
                <option value={6}>Anniversary</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                placeholder="0.00"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm text-gray-700">
                    {uploading ? "Uploading..." : "Choose File"}
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {formData.image_url && (
                  <div className="w-10 h-10 rounded overflow-hidden border">
                    <img src={formData.image_url} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D] resize-none"
                placeholder="Enter template description"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 bg-[#37514D] text-white px-4 py-2 rounded-lg hover:bg-[#2a3d39] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Template
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
            <div className="border rounded-lg overflow-hidden">
              {formData.image_url ? (
                <div className="aspect-video relative bg-gray-100">
                  <img src={formData.image_url} alt={formData.title} className="object-contain w-full h-full" />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">No image uploaded</p>
                  </div>
                </div>
              )}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900">{formData.title || "Template Title"}</h4>
                <p className="text-sm text-gray-600 mt-1">{formData.description || "No description provided"}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-bold text-[#37514D]">₹{formData.price || "0"}</span>
                  <span className="text-sm text-gray-500">
                    Category: {['', 'Wedding', 'Baby Shower', 'Corporate', 'E-Invitation', 'Birthday', 'Anniversary'][formData.category_id]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
