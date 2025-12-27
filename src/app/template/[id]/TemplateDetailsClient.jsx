"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { API_BASE_URL, BASE_URL } from "@/lib/api";
import {
    Heart,
    Share2,
    Star,
    ShoppingCart,
    ArrowLeft,
    Plus,
    Minus,
    Check
} from "lucide-react";

export default function TemplateDetails() {
    const params = useParams();
    const router = useRouter();

    const [template, setTemplate] = useState(null);
    const [allTemplates, setAllTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [customText, setCustomText] = useState("");

    // Get current user from localStorage

    const getCurrentUser = () => {
        if (typeof window === "undefined") return null; // SSR safety

        const stored = localStorage.getItem("currentUser");

        if (!stored || stored === "undefined" || stored === "null") return null;

        try {
            return JSON.parse(stored);
        } catch (err) {
            console.error("Failed to parse currentUser from localStorage:", err);
            return null;
        }
    };
    const currentUser = getCurrentUser();

    // Wishlist helper functions
    const getWishlist = () => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("wishlist") || "[]");
        }
        return [];
    };


    const handleLike = async (templateId) => {
        const currentUser = getCurrentUser();

        if (!currentUser) {
            const email = prompt("Enter your email to continue");
            if (!email) return;

            const res = await fetch(`${API_BASE_URL}/auth/check?email=${email}`);
            const data = await res.json();

            if (data.exists) {
                window.location.href = "/login";
            } else {
                window.location.href = "/signup";
            }
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/wishlist`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUser.id, templateId }),
            });

            if (response.ok) {
                setIsLiked(true);
                alert("Added to your wishlist!");
            } else {
                const error = await response.json();
                alert("Error: " + error.error);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    };



    // Check if already liked on mount
    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const wishlist = getWishlist();
        const exists = wishlist.find(
            (item) => item.userId === currentUser.id && item.templateId === params.id
        );
        if (exists) setIsLiked(true);
    }, [params.id]);


    // Fetch template & all templates
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/templates/${params.id}`);
                if (!res.ok) throw new Error("Template not found");
                const data = await res.json();

                const formattedTemplate = {
                    ...data,
                    images: data.image_url ? [data.image_url] : [],
                    sizes: data.sizes || ["5x7 inches", "4x6 inches"],
                    colors: data.colors || ["#37514D", "#8B4513"],
                    rating: data.rating || 5,
                    reviews: data.reviews || 10,
                    originalPrice: data.originalPrice || data.price,
                    features: data.features || []
                };

                setTemplate(formattedTemplate);

                const resAll = await fetch(`${API_BASE_URL}/templates`);
                const allData = await resAll.json();
                setAllTemplates(allData);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const handleAddToCart = () => {
        if (!template) return;

        const cartItem = {
            id: template.id,
            title: template.title,
            price: template.price,
            quantity,
            size: template.sizes[selectedSize],
            color: template.colors[selectedColor],
            customText,
            image: template.images[selectedImage]
        };

        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItemIndex = existingCart.findIndex(
            item =>
                item.id === cartItem.id &&
                item.size === cartItem.size &&
                item.color === cartItem.color
        );

        if (existingItemIndex > -1) {
            existingCart[existingItemIndex].quantity += cartItem.quantity;
        } else {
            existingCart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));
        router.push("/cart");
    };

    const handleBuyNow = () => {
        handleAddToCart();
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!template) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Button */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Templates
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="space-y-4">
                        <div className="relative w-full rounded-xl shadow-lg">
                            {template.images?.[selectedImage] && (
                                <Image
                                    src={template.images[selectedImage]}
                                    alt={template.title}
                                    width={600}
                                    height={600}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            )}
                        </div>
                    </div>

                    {/* Template Details */}
                    <div className="space-y-6">
                        {/* Title, category, rating */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    {template.category}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600">
                                        {template.rating} ({template.reviews} reviews)
                                    </span>
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{template.title}</h1>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl font-bold text-[#37514D]">₹{template.price}</span>
                                {template.originalPrice > template.price && (
                                    <span className="text-xl text-gray-500 line-through">
                                        ₹{template.originalPrice}
                                    </span>
                                )}
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                                    Save ₹{template.originalPrice - template.price}
                                </span>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{template.description}</p>
                        </div>

                        {/* Features */}
                        {template.features?.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {template.features.map((feat, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-600" />
                                            <span className="text-sm text-gray-700">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {template.sizes?.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                                <div className="flex gap-3">
                                    {template.sizes.map((size, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedSize(idx)}
                                            className={`px-4 py-2 border rounded-lg transition-colors ${selectedSize === idx
                                                ? "border-[#37514D] bg-[#37514D] text-white"
                                                : "border-gray-300 hover:border-gray-400"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Colors */}
                        {template.colors?.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
                                <div className="flex gap-3">
                                    {template.colors.map((color, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColor(idx)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === idx ? "border-gray-800 scale-110" : "border-gray-300"
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Custom Text */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Custom Text</h3>
                            <textarea
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                                placeholder="Enter your custom text here..."
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D] resize-none"
                                rows={3}
                            />
                        </div>

                        {/* Quantity */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-50"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-50"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleBuyNow}
                                className="w-full bg-[#37514D] text-white py-4 rounded-lg font-semibold hover:bg-[#2a3d39] transition-colors"
                            >
                                Buy Now - ₹{(template.price * quantity).toFixed(2)}
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="w-full border-2 border-[#37514D] text-[#37514D] py-4 rounded-lg font-semibold hover:bg-[#37514D] hover:text-white transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleLike(template.id)} // ✅ Correct
                                    className={`flex-1 border py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${isLiked ? "border-red-500 text-red-500 bg-red-50" : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                                    {isLiked ? "Liked" : "Like"}
                                </button>

                                <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Templates */}
                {allTemplates.length > 1 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Templates</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {allTemplates
                                .filter(t => t.id !== template.id)
                                .slice(0, 4)
                                .map(rel => (
                                    <div
                                        key={rel.id}
                                        onClick={() => router.push(`/template/${rel.id}`)}
                                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <div className="aspect-square relative">
                                            {rel.image_url && (
                                                <Image
                                                    src={rel.image_url.startsWith("http") ? rel.image_url : `${BASE_URL}${rel.image_url}`}
                                                    alt={rel.title}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1">{rel.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{rel.category}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold text-[#37514D]">₹{rel.price}</span>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="text-sm text-gray-600">{rel.rating || 5}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
