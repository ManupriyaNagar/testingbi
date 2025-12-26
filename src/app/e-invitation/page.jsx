"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const filters = [
  { name: "Most Popular" },
  { name: "Style" },
  { name: "Theme" },
  { name: "Occasion" },
  { name: "Color" },
  { name: "Photo count" },
  { name: "Price" },
];

export default function EInvitations() {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGeneralInvitations = async () => {
      try {
        const res = await fetch("https://beyondinviteb.onrender.com/api/templates");
        const data = await res.json();

        // ✅ Filter general invitations
        const generalInvitations = data.filter(
          (item) =>
            !["wedding", "corporate", "baby shower"].includes(
              item.category_name?.toLowerCase()
            )
        );
        setInvitations(generalInvitations);
      } catch (error) {
        console.error("Error fetching general invitations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneralInvitations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading E-Invitations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-indigo-50 py-10 px-4 md:px-8 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
            E-Invitations
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-3xl">
            Send beautiful digital invitations that save time and make an impact.
            Choose from animated, stylish, and customizable designs for weddings,
            birthdays, corporate events, and more.
          </p>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block sticky top-24 h-fit self-start">
          <h3 className="text-lg font-semibold mb-3">Popular Styles</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Animated</li>
            <li>Minimalist</li>
            <li>Luxury Gold</li>
            <li>Photo-based</li>
            <li>Typography</li>
          </ul>

          <h3 className="text-lg font-semibold mt-8 mb-3">Shop by Occasion</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Weddings</li>
            <li>Birthdays</li>
            <li>Anniversaries</li>
            <li>Festivals</li>
            <li>Corporate Events</li>
          </ul>

          <h3 className="text-lg font-semibold mt-8 mb-3">Shop by Color</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Gold</li>
            <li>Pastels</li>
            <li>Bold Colors</li>
            <li>Neutrals</li>
          </ul>
        </aside>

        {/* Main Section */}
        <main className="md:col-span-3">
          {/* Mobile Filter Bar */}
          <div className="block md:hidden mb-6 overflow-x-auto">
            <div className="flex gap-3 w-max">
              {filters.map((filter, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFilter(filter.name)}
                  className={`px-4 py-2 text-sm border rounded-md whitespace-nowrap ${selectedFilter === filter.name
                    ? "bg-indigo-100 border-indigo-400 text-indigo-700"
                    : "bg-white hover:bg-gray-50"
                    }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Filter Bar */}
          <div className="hidden md:block sticky top-20 bg-white  mb-8">
            <div className="flex flex-wrap gap-3 p-4 border-b">
              {filters.map((filter, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFilter(filter.name)}
                  className={`px-4 py-2 text-sm border rounded-md ${selectedFilter === filter.name
                    ? "bg-indigo-100 border-indigo-400 text-indigo-700"
                    : "bg-white hover:bg-gray-50"
                    }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          {/* Invitations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((card) => (
              <div
                key={card.id}
                onClick={() => router.push(`/template/${card.id}`)}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer group"
              >
                <img
                  src={
                    card.image_url
                      ? card.image_url.startsWith("http")
                        ? card.image_url
                        : `https://beyondinviteb.onrender.com/${card.image_url}`
                      : "/fallback.jpg"
                  }
                  alt={card.title}
                  className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="p-4">
                  <h4 className="text-gray-800 font-medium group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">E-Invitation</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-indigo-600">
                      ₹{card.price || "N/A"}
                    </span>
                    <span className="text-sm text-gray-500">
                      Tap to customize
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {invitations.length === 0 && (
            <p className="text-gray-600 mt-10 text-center">
              No E-Invitations found.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
