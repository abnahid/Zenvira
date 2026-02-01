"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  FiBox,
  FiDollarSign,
  FiHome,
  FiPackage,
  FiSettings,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Admin menu items
  const adminMenuItems = [
    {
      label: "Dashboard",
      icon: <FiHome size={20} />,
      href: "/dashboard",
    },
    {
      label: "Orders",
      icon: <FiShoppingCart size={20} />,
      href: "/dashboard/orders",
    },
    {
      label: "Products",
      icon: <FiBox size={20} />,
      href: "/dashboard/products",
    },
    {
      label: "Categories",
      icon: <FiPackage size={20} />,
      href: "/dashboard/categories",
    },
    {
      label: "Users",
      icon: <FiUsers size={20} />,
      href: "/dashboard/users",
    },
    {
      label: "Revenue",
      icon: <FiDollarSign size={20} />,
      href: "/dashboard/revenue",
    },
    {
      label: "Settings",
      icon: <FiSettings size={20} />,
      href: "/dashboard/settings",
    },
  ];

  // Seller menu items
  const sellerMenuItems = [
    {
      label: "Dashboard",
      icon: <FiHome size={20} />,
      href: "/dashboard",
    },
    {
      label: "My Products",
      icon: <FiBox size={20} />,
      href: "/dashboard/my-products",
    },
    {
      label: "Orders",
      icon: <FiShoppingCart size={20} />,
      href: "/dashboard/my-orders",
    },
    {
      label: "Sales",
      icon: <FiDollarSign size={20} />,
      href: "/dashboard/sales",
    },
    {
      label: "Settings",
      icon: <FiSettings size={20} />,
      href: "/dashboard/settings",
    },
  ];

  // Choose menu items based on role
  const menuItems = user?.role === "admin" ? adminMenuItems : sellerMenuItems;
  const title = user?.role === "admin" ? "Admin Dashboard" : "Seller Dashboard";

  return (
    <DashboardLayout title={title} menuItems={menuItems}>
      {children}
    </DashboardLayout>
  );
}
