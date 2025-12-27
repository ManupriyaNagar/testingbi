"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/templates`);
        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Templates</h1>

      {templates.length === 0 ? (
        <p className="text-gray-500">No templates found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {template.image_url && (
                <img
                  src={template.image_url}
                  alt={template.title}
                  className="w-full h-48 object-contain"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{template.title}</h2>
                <p className="text-gray-500 text-sm mb-2">
                  <strong>Category ID:</strong> {template.category_id}
                </p>
                <p className="text-gray-600 mb-2">{template.description}</p>
                <p className="text-gray-900 font-bold">${template.price}</p>
                <button className="mt-3 w-full bg-[#37514D] text-white py-2 px-4 rounded-lg hover:bg-[#274036] transition-colors">
                  View Template
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
