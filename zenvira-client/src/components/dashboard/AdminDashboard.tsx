"use client";

import StatCard from "@/components/dashboard/StatCard";
import Link from "next/link";
import { FiBox, FiDollarSign, FiShoppingCart, FiUsers } from "react-icons/fi";

export default function AdminDashboard() {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FiShoppingCart className="text-blue-600" size={24} />}
          label="Total Orders"
          value="1,240"
          trend="+12.5%"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<FiBox className="text-green-600" size={24} />}
          label="Total Products"
          value="485"
          trend="+5.2%"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<FiUsers className="text-purple-600" size={24} />}
          label="Total Users"
          value="3,200"
          trend="+8.1%"
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<FiDollarSign className="text-orange-600" size={24} />}
          label="Total Revenue"
          value="$45,230"
          trend="+15.3%"
          bgColor="bg-orange-50"
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
                  id="#ORD-001"
                  customer="Pharmacy A"
                  amount="$520"
                  status="delivered"
                />
                <TableRow
                  id="#ORD-002"
                  customer="Clinic B"
                  amount="$380"
                  status="shipped"
                />
                <TableRow
                  id="#ORD-003"
                  customer="Hospital C"
                  amount="$650"
                  status="confirmed"
                />
              </tbody>
            </table>
          </div>
          <Link
            href="/dashboard/orders"
            className="inline-block mt-4 text-primary hover:underline font-medium text-sm"
          >
            View All Orders →
          </Link>
        </div>

        {/* Sales Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Sales Overview
          </h2>
          <div className="space-y-4">
            <ProgressBar label="Medicines" value={75} color="blue" />
            <ProgressBar label="Supplements" value={60} color="green" />
            <ProgressBar label="Devices" value={45} color="purple" />
            <ProgressBar label="Other" value={30} color="orange" />
          </div>
          <div className="mt-6 p-4 bg-linear-to-r from-primary/10 to-primary/20 rounded-lg border border-primary/30">
            <p className="text-sm text-gray-700 font-medium">Monthly Target</p>
            <p className="text-2xl font-bold text-primary mt-1">85%</p>
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
  const statusColors = {
    placed: "bg-yellow-100 text-yellow-800",
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
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
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
