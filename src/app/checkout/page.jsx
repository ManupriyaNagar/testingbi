"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Check,
  MapPin,
  User,
  Mail,
  Phone
} from "lucide-react";
import Image from "next/image";

export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",

    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",

    // Billing same as shipping
    billingDifferent: false,
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart);
      if (cart.length === 0) {
        router.push('/cart');
      }
    } else {
      router.push('/cart');
    }
    setLoading(false);
  }, [router]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Process order
      handlePlaceOrder();
    }
  };
  const handlePlaceOrder = async () => {
    try {
      // Flatten order data to match backend schema
      const orderData = {
        customer: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        type: "Wedding Invitation", // or dynamically set based on selected template
        amount: total.toFixed(2),
        templateId: cartItems[0]?.id || null, // if using a template per item
        notes: `Shipping Address: ${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`
      };

      const response = await fetch("https://beyondinviteb.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        localStorage.removeItem("cart");
        router.push("/order-confirmation");
      } else {
        const error = await response.json();
        alert("Error placing order: " + error.error);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong while placing your order.");
    }
  };

  const steps = [
    { number: 1, title: "Shipping", icon: MapPin },
    { number: 2, title: "Payment", icon: CreditCard },
    { number: 3, title: "Review", icon: Check }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#37514D] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.number
                    ? 'bg-[#37514D] border-[#37514D] text-white'
                    : 'border-gray-300 text-gray-400'
                  }`}>
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${currentStep >= step.number ? 'text-[#37514D]' : 'text-gray-400'
                  }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${currentStep > step.number ? 'bg-[#37514D]' : 'bg-gray-300'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Payment Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37514D]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h2>
                  <div className="space-y-6">
                    {/* Shipping Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                      <div className="text-gray-600">
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                        <p>{formData.country}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
                      <p className="text-gray-600">**** **** **** {formData.cardNumber.slice(-4)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
                <button
                  type="submit"
                  className="ml-auto bg-[#37514D] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a3d39] transition-colors"
                >
                  {currentStep === 3 ? 'Place Order' : 'Continue'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-[#37514D]">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Secure Checkout</span>
              </div>
              <p className="text-xs text-green-700 mt-1">Your payment information is encrypted and secure.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}