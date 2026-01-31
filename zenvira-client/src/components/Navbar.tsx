"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  FiHeart,
  FiMenu,
  FiSearch,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

export default function Navbar({ className }) {
  return (
    <header className={cn("w-full border-b bg-white", className)}>
      {/* Top Bar */}
      <div className="w-full bg-primary/10 text-primary text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <p>Free Shipping Orders From All Item</p>

          <div className="flex items-center gap-4">
            <span>EN</span>
            <span>USD</span>
            <div className="flex items-center gap-3">
              <FiUser className="cursor-pointer" />
              <FiHeart className="cursor-pointer" />
              <div className="relative">
                <FiShoppingCart className="cursor-pointer" />
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
                  0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        {/* Logo */}
        <Image src="logo-zenvira.svg" alt="Logo" width={180} height={36} />

        {/* Search */}
        <div className="hidden flex-1 items-center md:flex justify-end">
          <div className="relative w-full max-w-3xl">
            <Input placeholder="Search For Product" className="pr-32" />
            <Button
              size="icon"
              className="absolute right-0 top-0 h-full rounded-l-none bg-primary hover:bg-primary/90"
            >
              <FiSearch className="text-white" />
            </Button>
          </div>
        </div>

        {/* Contact */}
      </div>

      {/* Navigation Row */}
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Categories */}
          <Button
            variant="default"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <FiMenu />
            Browse Categories
          </Button>

          {/* Links */}
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink active>Home</NavLink>
            <NavLink>Shop</NavLink>
            <NavLink>Pages</NavLink>
            <NavLink>Blog</NavLink>
            <NavLink>Contact</NavLink>
          </nav>
          <div className="hidden text-sm font-medium md:block">
            <span className="text-primary">1-800-654-3210</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ children, active }) {
  return (
    <span
      className={cn(
        "cursor-pointer text-sm font-medium transition hover:text-primary",
        active && "text-primary",
      )}
    >
      {children}
    </span>
  );
}
