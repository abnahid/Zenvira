"use client";

import StatCard from "@/components/dashboard/StatCard";
import { apiUrl } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiBox, FiDollarSign, FiShoppingCart, FiStar } from "react-icons/fi";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  averageReview: number;
  totalReviews: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  medicine: {
    id: string;
    name: string;
  };
}

interface Order {
  id: string;
  status: string;
  sellerTotal: number;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch stats and recent orders in parallel
        const [statsRes, ordersRes] = await Promise.all([
          fetch(apiUrl("/api/stats/seller"), { credentials: "include" }),
          fetch(apiUrl("/api/orders/seller?limit=5"), {
            credentials: "include",
          }),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) {
            setStats(statsData.data);
          }
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (ordersData.success) {
            setRecentOrders(ordersData.data || []);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FiBox className="text-green-600" size={24} />}
          label="My Products"
          value={stats?.totalProducts?.toString() || "0"}
          trend="Total medicines"
          bgColor="bg-green-50"
          barColor="bg-green-200"
          trendColor="text-green-600"
        />
        <StatCard
          icon={<FiShoppingCart className="text-blue-600" size={24} />}
          label="Total Orders"
          value={stats?.totalOrders?.toString() || "0"}
          trend="Orders received"
          bgColor="bg-blue-50"
          barColor="bg-blue-200"
          trendColor="text-blue-600"
        />
        <StatCard
          icon={<FiDollarSign className="text-orange-600" size={24} />}
          label="Total Sales"
          value={`$${stats?.totalSales?.toLocaleString() || "0"}`}
          trend="Revenue earned"
          bgColor="bg-orange-50"
          barColor="bg-orange-200"
          trendColor="text-orange-600"
        />
        <StatCard
          icon={<FiStar className="text-purple-600" size={24} />}
          label="Avg Rating"
          value={stats?.averageReview ? `${stats.averageReview}/5` : "N/A"}
          trend={`${stats?.totalReviews || 0} reviews`}
          bgColor="bg-purple-50"
          barColor="bg-purple-200"
          trendColor="text-purple-600"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No orders yet. Orders will appear here when customers purchase
              your products.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    id={`#${order.id.substring(0, 8)}`}
                    customer={order.customer.name}
                    amount={`$${order.sellerTotal.toFixed(2)}`}
                    status={order.status}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Link
          href="/dashboard/orders"
          className="inline-block mt-4 text-primary hover:underline font-medium text-sm"
        >
          View All Orders →
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/create-product"
              className="block px-4 py-3 border border-primary/30 rounded-lg text-primary hover:bg-primary/10 transition font-medium text-sm"
            >
              Add New Product
            </Link>
            <Link
              href="/dashboard/my-products"
              className="block px-4 py-3 border border-primary/30 rounded-lg text-primary hover:bg-primary/10 transition font-medium text-sm"
            >
              Manage Inventory
            </Link>
            <Link
              href="/dashboard/seller-profile"
              className="block px-4 py-3 border border-primary/30 rounded-lg text-primary hover:bg-primary/10 transition font-medium text-sm"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Performance Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Products Listed</span>
              <span className="font-semibold text-gray-900">
                {stats?.totalProducts || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Orders Completed</span>
              <span className="font-semibold text-gray-900">
                {stats?.totalOrders || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Customer Reviews</span>
              <span className="font-semibold text-gray-900">
                {stats?.totalReviews || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TableRow({
  id,
  customer,
  amount,
  status,
}: {
  id: string;
  customer: string;
  amount: string;
  status: string;
}) {
  const statusColors: Record<string, string> = {
    placed: "bg-gray-100 text-gray-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 text-gray-900 font-medium">{id}</td>
      <td className="py-3 px-4 text-gray-600">{customer}</td>
      <td className="py-3 px-4 text-gray-900 font-medium">{amount}</td>
      <td className="py-3 px-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
            statusColors[status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}
