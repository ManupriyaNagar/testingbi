"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const filters = [
  { name: "Most Popular" },
  { name: "Style" },
  { name: "Theme" },
  { name: "Season" },
  { name: "Venue" },
  { name: "Color" },
  { name: "Photo count" },
  { name: "Price" },
];

export default function WeddingInvitations() {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showThemes, setShowThemes] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/templates");
        const data = await res.json();

        // ✅ Filter only "Wedding" templates
        const weddingTemplates = data.filter(
          (item) =>
            item.category_name?.toLowerCase() === "wedding" ||
            item.category_id === 1
        );

        setInvitations(weddingTemplates);
      } catch (err) {
        console.error("Error fetching invitations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading invitations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-green-50 py-10 px-4 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Wedding Invitations
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Customize online wedding invitations from top designers. Make a
            custom URL, add Photo Gallery and Registry Blocks, and track RSVPs.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar for Desktop */}
        <aside className="hidden md:block sticky top-64 h-fit self-start">
          <h3 className="text-lg font-semibold mb-3">Wedding Themes</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Elegant and formal</li>
            <li>Modern</li>
            <li>Simple and minimal</li>
            <li>Rustic</li>
            <li>Boho</li>
            <li>Watercolor</li>
            <li>Romantic</li>
            <li>Calligraphy</li>
            <li>Vintage and retro</li>
          </ul>
        </aside>

        {/* Main Section */}
        <main className="md:col-span-3">
          {/* Mobile Dropdown for Themes */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => setShowThemes(!showThemes)}
              className="w-full bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-md font-medium flex justify-between items-center"
            >
              Wedding Themes
              <span className="text-lg">{showThemes ? "−" : "+"}</span>
            </button>

            {showThemes && (
              <ul className="mt-3 bg-green-50 border border-green-200 rounded-md p-3 text-gray-700 space-y-2 text-sm">
                <li>Elegant and formal</li>
                <li>Modern</li>
                <li>Simple and minimal</li>
                <li>Rustic</li>
                <li>Boho</li>
                <li>Watercolor</li>
                <li>Romantic</li>
                <li>Calligraphy</li>
                <li>Vintage and retro</li>
              </ul>
            )}
          </div>

          {/* Filter Bar */}
          <div className="bg-white sticky top-[70px]  py-2 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 sm:gap-3 px-1 min-w-max md:min-w-0">
              {filters.map((filter, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFilter(filter.name)}
                  className={`px-3 py-2 text-sm border rounded-md whitespace-nowrap transition-all ${selectedFilter === filter.name
                    ? "bg-green-100 border-green-400 text-green-700"
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
                          : `http://localhost:5001/${card.image_url}`
                      }
                      alt={card.title}
                      className="w-full h-44 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                      <button className="bg-white text-gray-800 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm sm:text-base font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h4 className="text-gray-800 text-sm sm:text-base font-medium group-hover:text-green-600 transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Wedding Invitation
                    </p>
                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      <span className="text-green-600 font-semibold text-sm sm:text-lg">
                        ₹{card.price || 199}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        Customize
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 mt-10 text-center col-span-full">
                No invitations found.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
