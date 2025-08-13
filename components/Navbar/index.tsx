"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../AuthProvider";

export default function Navbar() {
  type IPages = {
    title: string;
    mtitle: string;
    link: string;
    authRequired?: boolean;
  };

  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  // Function to format user role display
  const formatUserRole = (user: any) => {
    if (!user?.roles || !Array.isArray(user.roles)) {
      return "User";
    }

    // If user has admin role, prioritize it
    if (user.roles.includes("admin")) {
      return "Admin";
    }

    // Otherwise, take the first role and capitalize it
    const primaryRole = user.roles[0];
    return primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1);
  };

  // Environment check for dashboard visibility
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    setIsDevelopment(process.env.NODE_ENV === "development");
  }, []);

  const publicPages: Array<IPages> = [
    { title: "How It Works", mtitle: "How It Works", link: "/how-it-works" },
    { title: "About Us", mtitle: "About", link: "/about" },
    { title: "Pricing", mtitle: "Pricing", link: "/pricing" },
    { title: "Contact", mtitle: "Contact", link: "/contact" },
    { title: "Roadmap", mtitle: "Roadmap", link: "/roadmap" },
  ];

  const dashboardPages: Array<IPages> = [
    { title: "Dashboard", mtitle: "Dashboard", link: "/dashboard" },
    { title: "Essays", mtitle: "Essays", link: "/dashboard/essays" },
    { title: "Colleges", mtitle: "Colleges", link: "/dashboard/colleges" },
    { title: "Calendar", mtitle: "Calendar", link: "/dashboard/calendar" },
    { title: "Roadmap", mtitle: "Roadmap", link: "/roadmap" },
  ];

  // Only show dashboard pages in development and when on dashboard routes
  const pages = isDashboard && isDevelopment ? dashboardPages : publicPages;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#141414]/95 backdrop-blur-md border-b border-neutral-700/50 shadow-lg"
            : "bg-[#141414]/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 md:px-10">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <Link href="/" className="group flex items-center space-x-2">
              <div className="relative">
                <span className="text-3xl font-bold font-climate-crisis text-[#FEEBD8]">
                  paccy
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FEEBD8] group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {pages.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="relative group px-3 py-2 text-[#FEEBD8] hover:text-white transition-all duration-300"
                >
                  <span className="relative z-10 font-medium">
                    {item.title}
                  </span>
                  <div className="absolute inset-0 bg-[#FEEBD8]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FEEBD8] group-hover:w-full transition-all duration-300"></div>
                </Link>
              ))}

              {/* CTA Button */}
              {isAuthenticated ? (
                <div className="ml-4 flex items-center space-x-3">
                  <div className="relative group">
                    {user?.avatar && (
                      <div className="relative cursor-pointer">
                        <img
                          src={user.avatar}
                          alt={user.name || "User avatar"}
                          className="w-10 h-10 rounded-full border-2 border-[#FEEBD8]/30 group-hover:border-[#FEEBD8]/60 transition-all duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#141414]"></div>
                        <div className="absolute top-full right-0 w-56 h-2 bg-transparent"></div>
                        {/* Dropdown Menu */}
                        <div className="absolute top-full pt-2 right-0 w-56 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
                          <div className="bg-[#1A1A1A] border border-[#FEEBD8]/20 rounded-lg shadow-lg">
                            {/* User Info Header */}
                            <div className="p-4 border-b border-[#FEEBD8]/10">
                              <p className="text-[#FEEBD8] text-sm font-medium">
                                {user?.name || user?.email}
                              </p>
                              <p className="text-[#FEEBD8]/70 text-xs">
                                {formatUserRole(user)}
                              </p>
                            </div>
                            {/* Menu Items */}
                            <div className="py-2">
                              <Link
                                href="/dashboard"
                                className="flex items-center px-4 py-2 text-[#FEEBD8]/80 hover:text-[#FEEBD8] hover:bg-[#FEEBD8]/10 transition-all duration-200"
                              >
                                <svg
                                  className="w-4 h-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                  />
                                </svg>
                                Dashboard
                              </Link>
                              <Link
                                href="/dashboard/settings"
                                className="flex items-center px-4 py-2 text-[#FEEBD8]/80 hover:text-[#FEEBD8] hover:bg-[#FEEBD8]/10 transition-all duration-200"
                              >
                                <svg
                                  className="w-4 h-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                Settings
                              </Link>
                              <Link
                                href="/dashboard/essays"
                                className="flex items-center px-4 py-2 text-[#FEEBD8]/80 hover:text-[#FEEBD8] hover:bg-[#FEEBD8]/10 transition-all duration-200"
                              >
                                <svg
                                  className="w-4 h-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                                Essays
                              </Link>
                              <Link
                                href="/dashboard/colleges"
                                className="flex items-center px-4 py-2 text-[#FEEBD8]/80 hover:text-[#FEEBD8] hover:bg-[#FEEBD8]/10 transition-all duration-200"
                              >
                                <svg
                                  className="w-4 h-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                                Colleges
                              </Link>{" "}
                              <div className="border-t border-[#FEEBD8]/10 mt-2 pt-2">
                                <button
                                  onClick={logout}
                                  className="flex items-center w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                                >
                                  <svg
                                    className="w-4 h-4 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                  </svg>
                                  Logout
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="ml-4 px-6 py-2 bg-[#FEEBD8] text-[#141414] font-semibold rounded-lg hover:shadow-lg hover:bg-[#ffe0b8] transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 group"
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-0.5 bg-[#FEEBD8] transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2" : "group-hover:w-7"
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-[#FEEBD8] transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : "group-hover:w-7"
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-[#FEEBD8] transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : "group-hover:w-7"
                }`}
              />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              isMenuOpen
                ? isAuthenticated
                  ? "max-h-[600px] opacity-100"
                  : "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-4 space-y-2 border-t border-neutral-700/50">
              {pages.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-[#FEEBD8] hover:text-white hover:bg-neutral-700/30 rounded-lg transition-all duration-300 font-medium"
                >
                  {item.mtitle}
                </Link>
              ))}

              {/* Mobile CTA */}
              <div className="px-4 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg border border-[#FEEBD8]/20">
                      <div className="flex items-center space-x-3">
                        {user?.avatar && (
                          <div className="relative">
                            <img
                              src={user.avatar}
                              alt={user.name || "User avatar"}
                              className="w-12 h-12 rounded-full border-2 border-[#FEEBD8]/30"
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#141414]"></div>
                          </div>
                        )}
                        <div>
                          <p className="text-[#FEEBD8] text-sm font-medium">
                            {user?.name || user?.email}
                          </p>
                          <p className="text-[#FEEBD8]/70 text-xs">
                            {formatUserRole(user)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Mobile Quick Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center p-3 bg-[#1A1A1A] border border-[#FEEBD8]/20 rounded-lg hover:bg-[#FEEBD8]/10 transition-all duration-300"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          />
                        </svg>
                        <span className="text-[#FEEBD8] text-sm">
                          Dashboard
                        </span>
                      </Link>

                      <Link
                        href="/dashboard/settings"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center p-3 bg-[#1A1A1A] border border-[#FEEBD8]/20 rounded-lg hover:bg-[#FEEBD8]/10 transition-all duration-300"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-[#FEEBD8] text-sm">Settings</span>
                      </Link>
                    </div>{" "}
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-center px-6 py-3 bg-red-500/20 text-red-400 font-semibold rounded-lg hover:bg-red-500/30 transition-all duration-300"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-6 py-3 bg-[#FEEBD8] text-[#141414] font-semibold rounded-lg hover:shadow-lg hover:bg-[#ffe0b8] transition-all duration-300"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Glassy thin separator - flush with navbar bottom, no gap */}
        <div className="w-full h-px bg-white/20 backdrop-blur-sm border-t border-white/10 m-0 p-0" />
      </nav>
    </>
  );
}
