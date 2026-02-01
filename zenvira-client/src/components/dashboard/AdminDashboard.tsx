"use client";

import StatCard from "@/components/dashboard/StatCard";
import { apiUrl } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiBox, FiDollarSign, FiShoppingCart, FiUsers } from "react-icons/fi";

interface AdminStats {
  users: {
    total: number;
    customers: number;
    sellers: number;
    admins: number;
  };
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  ordersByStatus: Record<string, number>;
  averageReview: number;
  totalReviews: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch stats and recent orders in parallel
        const [statsRes, ordersRes] = await Promise.all([
          fetch(apiUrl("/api/stats/admin"), { credentials: "include" }),
          fetch(apiUrl("/api/orders?limit=5"), { credentials: "include" }),
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

  // Calculate order status percentages for progress bars
  const totalOrdersCount = stats?.totalOrders || 1;
  const statusPercentages = {
    placed: Math.round(((stats?.ordersByStatus?.placed || 0) / totalOrdersCount) * 100),
    confirmed: Math.round(((stats?.ordersByStatus?.confirmed || 0) / totalOrdersCount) * 100),
    shipped: Math.round(((stats?.ordersByStatus?.shipped || 0) / totalOrdersCount) * 100),
    delivered: Math.round(((stats?.ordersByStatus?.delivered || 0) / totalOrdersCount) * 100),
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FiShoppingCart className="text-blue-600" size={24} />}
          label="Total Orders"
          value={stats?.totalOrders?.toLocaleString() || "0"}
          trend={`${stats?.ordersByStatus?.placed || 0} pending`}
          bgColor="bg-blue-50"
          barColor="bg-blue-200"
          trendColor="text-blue-600"
        />
        <StatCard
          icon={<FiBox className="text-green-600" size={24} />}
          label="Total Products"
          value={stats?.totalProducts?.toLocaleString() || "0"}
          trend="All medicines"
          bgColor="bg-green-50"
          barColor="bg-green-200"
          trendColor="text-green-600"
        />
        <StatCard
          icon={<FiUsers className="text-purple-600" size={24} />}
          label="Total Users"
          value={stats?.users?.total?.toLocaleString() || "0"}
          trend={`${stats?.users?.sellers || 0} sellers`}
          bgColor="bg-purple-50"
          barColor="bg-purple-200"
          trendColor="text-purple-600"
        />
        <StatCard
          icon={<FiDollarSign className="text-orange-600" size={24} />}
          label="Total Revenue"
          value={`$${stats?.totalSales?.toLocaleString() || "0"}`}
          trend="Platform earnings"
          bgColor="bg-orange-50"
          barColor="bg-orange-200"
          trendColor="text-orange-600"
        />
      </div>

      {/* Recent Orders & Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No orders yet.
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
                      amount={`$${order.total.toFixed(2)}`}
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

        {/* Order Status Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Status
          </h2>
          <div className="space-y-4">
            <ProgressBar
              label={`Placed (${stats?.ordersByStatus?.placed || 0})`}
              value={statusPercentages.placed}
              color="yellow"
            />
            <ProgressBar
              label={`Confirmed (${stats?.ordersByStatus?.confirmed || 0})`}
              value={statusPercentages.confirmed}
              color="blue"
            />
            <ProgressBar
              label={`Shipped (${stats?.ordersByStatus?.shipped || 0})`}
              value={statusPercentages.shipped}
              color="purple"
            />
            <ProgressBar
              label={`Delivered (${stats?.ordersByStatus?.delivered || 0})`}
              value={statusPercentages.delivered}
              color="green"
            />
          </div>

          {/* User Breakdown */}
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">User Breakdown</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-lg font-bold text-blue-600">{stats?.users?.customers || 0}</p>
                <p className="text-xs text-gray-600">Customers</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-lg font-bold text-green-600">{stats?.users?.sellers || 0}</p>
                <p className="text-xs text-gray-600">Sellers</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <p className="text-lg font-bold text-purple-600">{stats?.users?.admins || 0}</p>
                <p className="text-xs text-gray-600">Admins</p>
              </div>
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
    placed: "bg-yellow-100 text-yellow-800",
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

function ProgressBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorMap[color] || "bg-gray-500"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
