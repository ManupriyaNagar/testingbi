"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCurrentUser = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      if (!storedUser || storedUser === "undefined") return null;

      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`https://beyondinviteb.onrender.com/api/wishlist/${currentUser.id}`);
        let data;
        try {
          data = await res.json();
        } catch {
          data = [];
        }

        if (!res.ok) throw new Error(data.error || "Failed to fetch wishlist");
        setWishlist(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [router]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (wishlist.length === 0) return <div className="p-8 text-gray-600">Your wishlist is empty.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/template/${template.id}`)}
            >
              <div className="aspect-square relative">
                {template.image_url && (
                  <Image
                    src={
                      template.image_url.startsWith("http")
                        ? template.image_url
                        : `https://beyondinviteb.onrender.com/${template.image_url}`
                    }
                    alt={template.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{template.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#37514D]">₹{template.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{template.rating || 5}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
