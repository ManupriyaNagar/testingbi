"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, BASE_URL } from "@/lib/api";

export default function BabyShowerInvitations() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");
  const router = useRouter();

  const filters = [
    { name: "Most Popular" },
    { name: "Style" },
    { name: "Theme" },
    { name: "Occasion" },
    { name: "Color" },
    { name: "Photo count" },
    { name: "Price" },
  ];

  useEffect(() => {
    const fetchBabyShowerTemplates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/templates`);
        const data = await res.json();

        const babyShowerInvites = data.filter((item) => {
          const category = (item.category_name || item.category_id)
            ? (item.category_name?.toLowerCase() ||
              (item.category_id === 2 ? "baby-shower" : "other"))
            : "";
          return category === "baby-shower";
        });

        setInvitations(babyShowerInvites);
      } catch (err) {
        console.error("Error fetching baby shower invitations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBabyShowerTemplates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-base sm:text-lg">
        Loading baby shower invitations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-pink-50 py-10 px-4 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Baby Shower Invitations
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Celebrate the upcoming arrival with customizable baby shower
            invitations. Choose from cute, modern, floral, and gender reveal
            themes. Add custom text, upload photos, and make the moment even
            more special.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar (hidden on mobile) */}
        <aside className="hidden md:block sticky top-64 h-fit self-start">
          <h3 className="text-lg font-semibold mb-3">
            Baby Shower Invitations
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>Cute and Playful</li>
            <li>Modern</li>
            <li>Floral</li>
            <li>Gender Reveal</li>
            <li>Minimal</li>
            <li>Animals Theme</li>
            <li>Storybook Theme</li>
            <li>Twins Celebration</li>
          </ul>
        </aside>

        {/* Main Section */}
        <main className="md:col-span-3 w-full">
          {/* Filters */}
          <div className="bg-white sticky top-[72px] py-2 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 sm:gap-3 px-1 min-w-max md:min-w-0">
              {filters.map((filter, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFilter(filter.name)}
                  className={`px-3 py-2 text-sm border rounded-md whitespace-nowrap transition-all ${selectedFilter === filter.name
                    ? "bg-pink-100 border-pink-400 text-pink-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
            {invitations.length > 0 ? (
              invitations.map((card) => (
                <div
                  key={card.id}
                  onClick={() => router.push(`/template/${card.id}`)}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        card.image_url?.startsWith("http")
                          ? card.image_url
                          : `${BASE_URL}${card.image_url.startsWith('/') ? '' : '/'}${card.image_url}`
                      }
                      alt={card.title}
                      className="w-full h-44 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h4 className="text-gray-800 text-sm sm:text-base font-medium group-hover:text-pink-600 transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Baby Shower Invitation
                    </p>
                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      <span className="text-pink-600 font-semibold text-sm sm:text-lg">
                        ₹{card.price || 149}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        Customize
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full py-10">
                No baby shower invitations found.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
