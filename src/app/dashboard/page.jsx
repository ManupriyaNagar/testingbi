"use client";
import {
  Mail,
  ShoppingBag,
  Users,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Calendar,
  Star,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import Image from "next/image";
import StatsCard from "@/components/Dashboard/StatsCard";
import OrdersTable from "@/components/Dashboard/OrdersTable";
import AnalyticsChart from "@/components/Dashboard/AnalyticsChart";
import TemplateCard from "@/components/Dashboard/TemplateCard";
import { useDashboardStats, useOrders } from "@/hooks/useApi";
import { useState } from "react";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('30d');

  // Fetch real data from API
  const { data: dashboardData, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { data: ordersData, loading: ordersLoading, error: ordersError } = useOrders();

  // Loading state
  if (statsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-[#37514D] mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (statsError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Failed to load dashboard data</p>
            <button
              onClick={refetchStats}
              className="bg-[#37514D] text-white px-4 py-2 rounded-lg hover:bg-[#2a3d39] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats from API data
  const stats = [
    {
      title: "Total Templates",
      value: dashboardData?.templates?.length?.toString() || "0",
      change: "+12%",
      icon: Mail,
      color: "bg-blue-500"
    },
    {
      title: "Total Invitations",
      value: dashboardData?.totalInvitations?.toString() || "0",
      change: "+8%",
      icon: ShoppingBag,
      color: "bg-green-500"
    },
    {
      title: "Total Orders",
      value: dashboardData?.totalOrders?.toString() || "0",
      change: "+23%",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      title: "Revenue",
      value: `₹${dashboardData?.totalRevenue?.toLocaleString() || "0"}`,
      change: "+15%",
      icon: TrendingUp,
      color: "bg-orange-500"
    }
  ];

  // Use real orders data or fallback to empty array
  const recentOrders = ordersData || [];

  // Use real templates data from API
  const invitationTemplates = dashboardData?.templates?.map(template => ({
    id: template.id,
    name: template.title,
    category: template.category || 'General',
    orders: template.orders || 0,
    image: template.image_url || '/wedding.jpeg',
    price: template.price?.toString() || '0'
  })) || [];

  const handleTemplateView = (template) => {
    console.log("Viewing template:", template);
  };

  const handleTemplateEdit = (template) => {
    console.log("Editing template:", template);
  };

  const handleTemplateDelete = (template) => {
    console.log("Deleting template:", template);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setDateRange(dateRange === '30d' ? '7d' : '30d')}
            className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <Calendar className="w-4 h-4" />
            Last 30 days
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/invitations'}
            className="bg-[#37514D] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#2a3d39] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Template
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart title="Revenue Overview" type="revenue" />

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Templates Created</p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">24</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +18%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">New Customers</p>
                  <p className="text-sm text-gray-600">This week</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">89</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +12%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Avg. Rating</p>
                  <p className="text-sm text-gray-600">All templates</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">4.8</p>
                <p className="text-sm text-gray-600">out of 5</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <OrdersTable
        orders={recentOrders.slice(0, 5)}
        onView={(order) => alert(`Viewing order: ${order.id}`)}
        onEdit={(order) => window.location.href = '/dashboard/orders'}
        onDelete={(order) => {
          if (confirm(`Delete order ${order.id}?`)) {
            alert('Order deleted!');
          }
        }}
      />

      {/* Popular Templates */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Popular Templates</h3>
          <button
            onClick={() => window.location.href = '/dashboard/invitations'}
            className="text-[#37514D] text-sm font-medium flex items-center gap-1 hover:text-[#2a3d39]"
          >
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {invitationTemplates.slice(0, 4).map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onView={handleTemplateView}
              onEdit={handleTemplateEdit}
              onDelete={handleTemplateDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}