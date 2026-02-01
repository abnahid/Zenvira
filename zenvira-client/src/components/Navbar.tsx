"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFacebookF, FaPinterestP, FaTwitter, FaVimeoV } from "react-icons/fa";
import {
  FiHeart,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiUserPlus,
  FiX,
} from "react-icons/fi";

export default function Navbar({ className }: { className?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { itemCount } = useCart();
  const isHomePage = pathname === "/";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/shops?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-dropdown")) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Inner Pages Navbar (Shop, About, Blog, etc.)
  if (!isHomePage) {
    return (
      <header
        className={cn(
          "w-full bg-white sticky top-0 z-50 transition-shadow duration-300",
          isScrolled && "shadow-md",
          className,
        )}
      >
        {/* Top Bar - Inner Pages */}
        <div className="w-full bg-primary/10 text-primary text-sm py-2.5 hidden md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
            <p>
              Free Shipping
              <a
                href="#"
                className="text-primary font-semibold hover:underline ml-1"
              >
                Orders From All Item
              </a>
            </p>

            <div className="flex items-center gap-4">
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 transition"
                >
                  <FaFacebookF size={12} />
                </a>
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 transition"
                >
                  <FaTwitter size={12} />
                </a>
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 transition"
                >
                  <FaVimeoV size={12} />
                </a>
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 transition"
                >
                  <FaPinterestP size={12} />
                </a>
              </div>

              <span className="flex items-center gap-1">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.46524 14.7406C9.43246 14.7531 11.3241 13.9837 12.724 12.6016C14.124 11.2195 14.9176 9.33785 14.9302 7.37064C14.9176 5.40342 14.124 3.52181 12.724 2.13969C11.3241 0.757565 9.43246 -0.011867 7.46524 0.000638364C5.49803 -0.011867 3.60641 0.757565 2.20647 2.13969C0.806529 3.52181 0.012934 5.40342 0.000244141 7.37064C0.012934 9.33785 0.806529 11.2195 2.20647 12.6016C3.60641 13.9837 5.49803 14.7531 7.46524 14.7406Z"
                    fill="#F0F0F0"
                  />
                  <path
                    d="M1.44721 2.91357C0.889328 3.63861 0.479546 4.46633 0.241211 5.34957H3.88321L1.44721 2.91357Z"
                    fill="#0052B4"
                  />
                  <path
                    d="M14.6891 5.34957C14.4508 4.46634 14.041 3.63863 13.4831 2.91357L11.0471 5.34957H14.6891Z"
                    fill="#0052B4"
                  />
                  <path
                    d="M0.241211 9.3916C0.47957 10.2748 0.88935 11.1025 1.44721 11.8276L3.88321 9.3916H0.241211Z"
                    fill="#0052B4"
                  />
                  <path
                    d="M11.9721 1.44721C11.2471 0.88935 10.4194 0.47957 9.53613 0.241211V3.88321L11.9721 1.44721Z"
                    fill="#0052B4"
                  />
                  <path
                    d="M2.95825 13.2934C3.68333 13.8512 4.51104 14.261 5.39425 14.4994V10.8574L2.95825 13.2934Z"
                    fill="#0052B4"
                  />
                  <path
                    d="M5.39425 0.241211C4.51102 0.47957 3.68331 0.88935 2.95825 1.44721L5.39425 3.88321V0.241211Z"
                    fill="#0052B4"
                  />
                  <path
                    d="M9.53613 14.4994C10.4193 14.261 11.2471 13.8512 11.9721 13.2934L9.53613 10.8574V14.4994Z"
                    fill="#0052B4"
                  />
                  <path
                    d="M11.0471 9.3916L13.4831 11.8276C14.041 11.1025 14.4508 10.2748 14.6891 9.3916H11.0471Z"
                    fill="#0052B4"
                  />
                  <path
                    d="M14.8672 6.40936H8.43921V0.0623585C7.79288 -0.0207862 7.13855 -0.0207862 6.49221 0.0623585V6.40936H0.0632134C-0.0210711 7.04759 -0.0210711 7.69413 0.0632134 8.33236H6.49121V14.6784C7.13755 14.7616 7.79188 14.7616 8.43821 14.6784V8.33236H14.8662C14.9506 7.69413 14.9516 7.04758 14.8672 6.40936Z"
                    fill="#D80027"
                  />
                  <path
                    d="M9.7561 9.56641L12.8801 12.6904C13.0234 12.5471 13.1604 12.3974 13.2911 12.2414L10.6171 9.56641H9.7561Z"
                    fill="#D80027"
                  />
                  <path
                    d="M5.17429 9.56641L2.05029 12.6904C2.19363 12.8337 2.34329 12.9707 2.49929 13.1014L5.17429 10.4274V9.56641Z"
                    fill="#D80027"
                  />
                  <path
                    d="M5.17416 5.17429L2.05016 2.05029C1.90683 2.19363 1.76983 2.34329 1.63916 2.49929L4.31316 5.17429H5.17416Z"
                    fill="#D80027"
                  />
                  <path
                    d="M9.7561 5.17416L12.8801 2.05016C12.7368 1.90616 12.5871 1.76916 12.4311 1.63916L9.7561 4.31316V5.17416Z"
                    fill="#D80027"
                  />
                </svg>
                English
              </span>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar - Inner Pages */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          {/* Logo */}
          <Link href="/">
            <Image src="/logo-zenvira.svg" alt="Logo" width={150} height={36} />
          </Link>

          {/* Desktop Navigation Links - Centered */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/">
              <NavLink active={pathname === "/"}>Home</NavLink>
            </Link>
            <Link href="/shops">
              <NavLink active={pathname.startsWith("/shops")}>Shop</NavLink>
            </Link>
            <Link href="/about">
              <NavLink active={pathname.startsWith("/about")}>About</NavLink>
            </Link>
            <Link href="/blog">
              <NavLink active={pathname.startsWith("/blog")}>Blog</NavLink>
            </Link>
            <Link href="/pages">
              <NavLink active={false}>Pages</NavLink>
            </Link>
            <Link href="/contact">
              <NavLink active={pathname.startsWith("/contact")}>
                Contact
              </NavLink>
            </Link>
          </nav>

          {/* Search Bar for Inner Pages */}
          <div className="hidden items-center gap-2 md:flex">
            <div className="relative">
              <Input
                placeholder="Search For Product"
                className="pr-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <Button
                size="icon"
                onClick={handleSearch}
                className="absolute right-0 top-0 h-full rounded-l-none bg-primary hover:bg-primary/90"
              >
                <FiSearch className="text-white" size={18} />
              </Button>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-4">
              {/* User Dropdown */}
              <div className="relative user-dropdown">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="cursor-pointer text-gray-600 hover:text-primary transition flex items-center gap-2"
                >
                  {isMounted && user ? (
                    <>
                      <Image
                        src={
                          user.image || "https://avatar.iran.liara.run/public/1"
                        }
                        alt={user.name}
                        width={28}
                        height={28}
                        className="rounded-full border border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700 hidden md:inline">
                        {user.name.split(" ")[0]}
                      </span>
                    </>
                  ) : (
                    <FiUser size={20} />
                  )}
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                    {isMounted && user ? (
                      <>
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b flex items-center gap-3">
                          <Image
                            src={
                              user.image ||
                              "https://avatar.iran.liara.run/public/1"
                            }
                            alt={user.name}
                            width={40}
                            height={40}
                            className="rounded-full border border-gray-300"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <FiUser size={16} />
                          My Profile
                        </Link>
                        {(user?.role === "admin" ||
                          user?.role === "seller") && (
                          <Link
                            href="/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            Dashboard
                          </Link>
                        )}
                        <Link
                          href="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <FiShoppingCart size={16} />
                          My Orders
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            router.push("/");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t"
                        >
                          <FiLogOut size={16} />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <FiLogIn size={16} />
                          Login
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <FiUserPlus size={16} />
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              <Link href="/cart" className="relative">
                <FiShoppingCart
                  className="cursor-pointer text-gray-600 hover:text-primary transition"
                  size={20}
                />
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Desktop Hamburger Menu Button */}
            <Button
              size="icon"
              className="hidden md:flex bg-primary hover:bg-primary/90 rounded-md"
            >
              <FiMenu className="text-white" size={18} />
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Inner Pages */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            {/* Mobile Search */}
            <div className="px-4 py-3 border-b">
              <div className="relative w-full">
                <Input
                  placeholder="Search For Product"
                  className="pr-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <Button
                  size="icon"
                  onClick={handleSearch}
                  className="absolute right-0 top-0 h-full rounded-l-none bg-primary hover:bg-primary/90"
                >
                  <FiSearch className="text-white" />
                </Button>
              </div>
            </div>

            <nav className="flex flex-col px-4 py-2">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <MobileNavLink active={pathname === "/"}>Home</MobileNavLink>
              </Link>
              <Link href="/shops" onClick={() => setMobileMenuOpen(false)}>
                <MobileNavLink active={pathname.startsWith("/shops")}>
                  Shop
                </MobileNavLink>
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                <MobileNavLink active={pathname.startsWith("/about")}>
                  About
                </MobileNavLink>
              </Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>
                <MobileNavLink active={pathname.startsWith("/blog")}>
                  Blog
                </MobileNavLink>
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <MobileNavLink active={pathname.startsWith("/contact")}>
                  Contact
                </MobileNavLink>
              </Link>
            </nav>

            {/* Mobile Account Links */}
            <div className="flex items-center justify-around px-4 py-4 border-t bg-gray-50">
              {isMounted && user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-1"
                  >
                    <Image
                      src={
                        user.image || "https://avatar.iran.liara.run/public/1"
                      }
                      alt={user.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-xs">Profile</span>
                  </Link>
                  {(user?.role === "admin" || user?.role === "seller") && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center gap-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span className="text-xs">Dashboard</span>
                    </Link>
                  )}
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-1"
                  >
                    <FiShoppingCart size={20} />
                    <span className="text-xs">Orders</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      router.push("/");
                    }}
                    className="flex flex-col items-center gap-1 text-red-600"
                  >
                    <FiLogOut size={20} />
                    <span className="text-xs">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-1"
                  >
                    <FiLogIn size={20} />
                    <span className="text-xs">Login</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-1"
                  >
                    <FiUserPlus size={20} />
                    <span className="text-xs">Register</span>
                  </Link>
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative">
                      <FiShoppingCart size={20} />
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
                        0
                      </span>
                    </div>
                    <span className="text-xs">Cart</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    );
  }

  // Homepage Navbar (Full Version)
  return (
    <header
      className={cn(
        "w-full bg-white sticky top-0 z-50 transition-shadow duration-300",
        isScrolled && "shadow-md",
        className,
      )}
    >
      {/* Top Bar */}
      <div className="w-full bg-primary/10 text-primary text-sm py-2.5 hidden md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 ">
          <p>
            Free Shipping
            <a
              href="#"
              className="text-primary font-semibold hover:underline ml-1"
            >
              Orders From All Item
            </a>
          </p>

          <div className="flex items-center gap-4">
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="text-primary hover:text-primary/80 transition"
              >
                <FaFacebookF size={12} />
              </a>
              <a
                href="#"
                className="text-primary hover:text-primary/80 transition"
              >
                <FaTwitter size={12} />
              </a>
              <a
                href="#"
                className="text-primary hover:text-primary/80 transition"
              >
                <FaVimeoV size={12} />
              </a>
              <a
                href="#"
                className="text-primary hover:text-primary/80 transition"
              >
                <FaPinterestP size={12} />
              </a>
            </div>

            <span className="flex items-center gap-1">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.46524 14.7406C9.43246 14.7531 11.3241 13.9837 12.724 12.6016C14.124 11.2195 14.9176 9.33785 14.9302 7.37064C14.9176 5.40342 14.124 3.52181 12.724 2.13969C11.3241 0.757565 9.43246 -0.011867 7.46524 0.000638364C5.49803 -0.011867 3.60641 0.757565 2.20647 2.13969C0.806529 3.52181 0.012934 5.40342 0.000244141 7.37064C0.012934 9.33785 0.806529 11.2195 2.20647 12.6016C3.60641 13.9837 5.49803 14.7531 7.46524 14.7406Z"
                  fill="#F0F0F0"
                />
                <path
                  d="M1.44721 2.91357C0.889328 3.63861 0.479546 4.46633 0.241211 5.34957H3.88321L1.44721 2.91357Z"
                  fill="#0052B4"
                />
                <path
                  d="M14.6891 5.34957C14.4508 4.46634 14.041 3.63863 13.4831 2.91357L11.0471 5.34957H14.6891Z"
                  fill="#0052B4"
                />
                <path
                  d="M0.241211 9.3916C0.47957 10.2748 0.88935 11.1025 1.44721 11.8276L3.88321 9.3916H0.241211Z"
                  fill="#0052B4"
                />
                <path
                  d="M11.9721 1.44721C11.2471 0.88935 10.4194 0.47957 9.53613 0.241211V3.88321L11.9721 1.44721Z"
                  fill="#0052B4"
                />
                <path
                  d="M2.95825 13.2934C3.68333 13.8512 4.51104 14.261 5.39425 14.4994V10.8574L2.95825 13.2934Z"
                  fill="#0052B4"
                />
                <path
                  d="M5.39425 0.241211C4.51102 0.47957 3.68331 0.88935 2.95825 1.44721L5.39425 3.88321V0.241211Z"
                  fill="#0052B4"
                />
                <path
                  d="M9.53613 14.4994C10.4193 14.261 11.2471 13.8512 11.9721 13.2934L9.53613 10.8574V14.4994Z"
                  fill="#0052B4"
                />
                <path
                  d="M11.0471 9.3916L13.4831 11.8276C14.041 11.1025 14.4508 10.2748 14.6891 9.3916H11.0471Z"
                  fill="#0052B4"
                />
                <path
                  d="M14.8672 6.40936H8.43921V0.0623585C7.79288 -0.0207862 7.13855 -0.0207862 6.49221 0.0623585V6.40936H0.0632134C-0.0210711 7.04759 -0.0210711 7.69413 0.0632134 8.33236H6.49121V14.6784C7.13755 14.7616 7.79188 14.7616 8.43821 14.6784V8.33236H14.8662C14.9506 7.69413 14.9516 7.04758 14.8672 6.40936Z"
                  fill="#D80027"
                />
                <path
                  d="M9.7561 9.56641L12.8801 12.6904C13.0234 12.5471 13.1604 12.3974 13.2911 12.2414L10.6171 9.56641H9.7561Z"
                  fill="#D80027"
                />
                <path
                  d="M5.17429 9.56641L2.05029 12.6904C2.19363 12.8337 2.34329 12.9707 2.49929 13.1014L5.17429 10.4274V9.56641Z"
                  fill="#D80027"
                />
                <path
                  d="M5.17416 5.17429L2.05016 2.05029C1.90683 2.19363 1.76983 2.34329 1.63916 2.49929L4.31316 5.17429H5.17416Z"
                  fill="#D80027"
                />
                <path
                  d="M9.7561 5.17416L12.8801 2.05016C12.7368 1.90616 12.5871 1.76916 12.4311 1.63916L9.7561 4.31316V5.17416Z"
                  fill="#D80027"
                />
              </svg>
              English
            </span>

            <div className="flex items-center gap-3">
              {/* User Dropdown - Top Bar */}
              <div className="relative user-dropdown">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="cursor-pointer hover:text-primary/80 transition flex items-center gap-2"
                >
                  {isMounted && user ? (
                    <>
                      <Image
                        src={
                          user.image || "https://avatar.iran.liara.run/public/1"
                        }
                        alt={user.name}
                        width={24}
                        height={24}
                        className="rounded-full border border-gray-300"
                      />
                    </>
                  ) : (
                    <FiUser />
                  )}
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                    {isMounted && user ? (
                      <>
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b flex items-center gap-3">
                          <Image
                            src={
                              user.image ||
                              "https://avatar.iran.liara.run/public/1"
                            }
                            alt={user.name}
                            width={40}
                            height={40}
                            className="rounded-full border border-gray-300"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <FiUser size={16} />
                          My Profile
                        </Link>
                        {(user?.role === "admin" ||
                          user?.role === "seller") && (
                          <Link
                            href="/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            Dashboard
                          </Link>
                        )}
                        <Link
                          href="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <FiShoppingCart size={16} />
                          My Orders
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            router.push("/");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t"
                        >
                          <FiLogOut size={16} />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <FiLogIn size={16} />
                          Login
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <FiUserPlus size={16} />
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              <FiHeart className="cursor-pointer" />
              <Link href="/cart" className="relative">
                <FiShoppingCart className="cursor-pointer" />
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Logo */}
        <Link href="/">
          <Image src="/logo-zenvira.svg" alt="Logo" width={180} height={36} />
        </Link>

        {/* Search */}
        <div className="hidden flex-1 items-center md:flex justify-end">
          <div className="relative w-full max-w-3xl">
            <Input
              placeholder="Search For Product"
              className="pr-32"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <Button
              size="icon"
              onClick={handleSearch}
              className="absolute right-0 top-0 h-full rounded-l-none bg-primary hover:bg-primary/90"
            >
              <FiSearch className="text-white" />
            </Button>
          </div>
        </div>

        {/* Mobile Icons */}
        <div className="flex items-center gap-3 md:hidden">
          <FiSearch className="cursor-pointer" size={20} />
          <Link href="/cart" className="relative">
            <FiShoppingCart className="cursor-pointer" size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Navigation Row */}
      <div className="hidden md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
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
            <Link href="/">
              <NavLink active={pathname === "/"}>Home</NavLink>
            </Link>
            <Link href="/shops">
              <NavLink active={pathname.startsWith("/shops")}>Shop</NavLink>
            </Link>
            <Link href="/about">
              <NavLink active={pathname.startsWith("/about")}>About</NavLink>
            </Link>
            <Link href="/blog">
              <NavLink active={pathname.startsWith("/blog")}>Blog</NavLink>
            </Link>
            <Link href="/contact">
              <NavLink active={pathname.startsWith("/contact")}>
                Contact
              </NavLink>
            </Link>
          </nav>
          <div className="hidden text-sm font-medium md:block">
            <span className="text-primary">1-800-654-3210</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          {/* Mobile Search */}
          <div className="px-4 py-3 border-b">
            <div className="relative w-full">
              <Input
                placeholder="Search For Product"
                className="pr-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <Button
                size="icon"
                onClick={handleSearch}
                className="absolute right-0 top-0 h-full rounded-l-none bg-primary hover:bg-primary/90"
              >
                <FiSearch className="text-white" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col px-4 py-2">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <MobileNavLink active={pathname === "/"}>Home</MobileNavLink>
            </Link>
            <Link href="/shops" onClick={() => setMobileMenuOpen(false)}>
              <MobileNavLink active={pathname.startsWith("/shops")}>
                Shop
              </MobileNavLink>
            </Link>
            <Link href="/pages" onClick={() => setMobileMenuOpen(false)}>
              <MobileNavLink active={pathname.startsWith("/pages")}>
                Pages
              </MobileNavLink>
            </Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>
              <MobileNavLink active={pathname.startsWith("/blog")}>
                Blog
              </MobileNavLink>
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <MobileNavLink active={pathname.startsWith("/contact")}>
                Contact
              </MobileNavLink>
            </Link>
          </nav>

          {/* Mobile Categories */}
          <div className="px-4 py-3 border-t">
            <Button
              variant="default"
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
            >
              <FiMenu />
              Browse Categories
            </Button>
          </div>

          {/* Mobile Account Links */}
          <div className="flex items-center justify-around px-4 py-4 border-t bg-gray-50">
            {isMounted && user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1"
                >
                  <Image
                    src={user.image || "https://avatar.iran.liara.run/public/1"}
                    alt={user.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-xs">Profile</span>
                </Link>
                {(user?.role === "admin" || user?.role === "seller") && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-1"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="text-xs">Dashboard</span>
                  </Link>
                )}
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span className="text-xs">Orders</span>
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1 relative"
                >
                  <FiShoppingCart size={20} />
                  <span className="text-xs">Cart</span>
                  {itemCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    router.push("/");
                  }}
                  className="flex flex-col items-center gap-1 text-red-600"
                >
                  <FiLogOut size={20} />
                  <span className="text-xs">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1"
                >
                  <FiLogIn size={20} />
                  <span className="text-xs">Login</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1"
                >
                  <FiUserPlus size={20} />
                  <span className="text-xs">Register</span>
                </Link>
                <div className="flex flex-col items-center gap-1">
                  <FiHeart size={20} />
                  <span className="text-xs">Wishlist</span>
                </div>
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="relative">
                    <FiShoppingCart size={20} />
                    {itemCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
                        {itemCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs">Cart</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Contact */}
          <div className="px-4 py-3 border-t text-center">
            <span className="text-sm font-medium text-primary">
              1-800-654-3210
            </span>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
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

function MobileNavLink({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <span
      className={cn(
        "cursor-pointer py-3 text-sm font-medium transition hover:text-primary border-b last:border-b-0",
        active && "text-primary",
      )}
    >
      {children}
    </span>
  );
}
