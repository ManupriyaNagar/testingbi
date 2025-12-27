"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL, BASE_URL } from "@/lib/api";

export default function TemplateList() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/templates`);
        const data = await res.json();
        setTemplates(data);
      } catch (err) {
        console.error("Error fetching templates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading templates...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Templates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => {
              router.push(`/template/${template.id}`, { state: { template } });
            }}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border"
          >
            <div className="aspect-square relative">
              <Image
                src={
                  template.image_url?.startsWith("http")
                    ? template.image_url
                    : `${BASE_URL}${template.image_url.startsWith('/') ? '' : '/'}${template.image_url}`
                }
                alt={template.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{template.category_name}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#37514D]">₹{template.price || 199}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{template.rating || "4.5"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
