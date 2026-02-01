"use client";

import Link from "next/link";
import {
  FiBox,
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
} from "react-icons/fi";

export default function SellerDashboard() {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FiBox className="text-green-600" size={24} />}
          label="My Products"
          value="42"
          trend="5 active"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<FiShoppingCart className="text-blue-600" size={24} />}
          label="Total Orders"
          value="320"
          trend="12 pending"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<FiDollarSign className="text-orange-600" size={24} />}
          label="Total Sales"
          value="$12,450"
          trend="+22%"
          bgColor="bg-orange-50"
        />
        <StatCard
          icon={<FiTrendingUp className="text-purple-600" size={24} />}
          label="Avg Rating"
          value="4.8⭐"
          trend="145 reviews"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
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
              <TableRow
                id="#OD-001"
                customer="Pharmacy A"
                amount="$520"
                status="delivered"
              />
              <TableRow
                id="#OD-002"
                customer="Clinic B"
                amount="$380"
                status="shipped"
              />
              <TableRow
                id="#OD-003"
                customer="Hospital C"
                amount="$650"
                status="confirmed"
              />
            </tbody>
          </table>
        </div>
        <Link
          href="/dashboard/my-orders"
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
              href="/dashboard/my-products"
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
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Performance
          </h3>
          <div className="space-y-4">
            <ProgressBar label="Fulfillment Rate" value={92} color="green" />
            <ProgressBar label="On-time Delivery" value={88} color="blue" />
            <ProgressBar
              label="Customer Satisfaction"
              value={95}
              color="orange"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-primary text-xs font-medium mt-2">{trend}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
      </div>
    </div>
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
  const statusColors = {
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 text-gray-900 font-medium">{id}</td>
      <td className="py-3 px-4 text-gray-600">{customer}</td>
      <td className="py-3 px-4 text-gray-900 font-medium">{amount}</td>
      <td className="py-3 px-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
            statusColors[status as keyof typeof statusColors]
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
  const colorMap = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorMap[color as keyof typeof colorMap]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
