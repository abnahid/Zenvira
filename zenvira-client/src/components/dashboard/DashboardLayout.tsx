"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  menuItems: MenuItem[];
}

export default function DashboardLayout({
  children,
  title,
  menuItems,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-primary text-white transition-all duration-300 flex flex-col fixed h-screen z-40 overflow-y-auto shadow-lg`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/20">
          {sidebarOpen && (
            <Image
              src="/logo-zenvira.svg"
              alt="Logo"
              className="bg-accent p-1"
              width={180}
              height={36}
            />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/20 transition-all duration-200 group"
            >
              <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <img
              src={user?.image || "https://avatar.iran.liara.run/public/1"}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            />
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-white/70 capitalize">{user?.role}</p>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white/20 hover:bg-white/30 transition text-white"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`${
          sidebarOpen ? "ml-64" : "ml-20"
        } flex-1 flex flex-col transition-all duration-300`}
      >
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50">
              <img
                src={user?.image || "https://avatar.iran.liara.run/public/1"}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
