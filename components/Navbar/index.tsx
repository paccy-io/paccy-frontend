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
  const isDashboard = pathname?.startsWith('/dashboard');

  const publicPages: Array<IPages> = [
    { title: "How It Works", mtitle: "How It Works", link: "/how-it-works" },
    { title: "About Us", mtitle: "About", link: "/about" },
    { title: "Pricing", mtitle: "Pricing", link: "/pricing" },
    { title: "Contact", mtitle: "Contact", link: "/contact" },
  ];

  const dashboardPages: Array<IPages> = [
    { title: "Dashboard", mtitle: "Dashboard", link: "/dashboard" },
    { title: "Essays", mtitle: "Essays", link: "/dashboard/essays" },
    { title: "Colleges", mtitle: "Colleges", link: "/dashboard/colleges" },
    { title: "Calendar", mtitle: "Calendar", link: "/dashboard/calendar" },
  ];

  const pages = isDashboard ? dashboardPages : publicPages;

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#141414]/95 backdrop-blur-md border-b border-neutral-700/50 shadow-lg"
          : "bg-[#141414]/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 md:px-10">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-2">
            <div className="relative">
              <span className="text-3xl font-bold font-climate-crisis bg-gradient-to-r from-[#FEEBD8] to-[#E5D5B7] bg-clip-text text-transparent">
                paccy
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FEEBD8] to-[#E5D5B7] group-hover:w-full transition-all duration-300"></div>
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
                <span className="relative z-10 font-medium">{item.title}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FEEBD8]/10 to-[#E5D5B7]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FEEBD8] to-[#E5D5B7] group-hover:w-full transition-all duration-300"></div>
              </Link>
            ))}

            {/* CTA Button */}
            {isAuthenticated ? (
              <div className="ml-4 flex items-center space-x-4">
                <span className="text-[#FEEBD8]/70 text-sm">
                  Welcome, {user?.name || user?.email}
                </span>
                <button
                  onClick={logout}
                  className="px-6 py-2 bg-red-500/20 text-red-400 font-semibold rounded-lg hover:bg-red-500/30 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="ml-4 px-6 py-2 bg-gradient-to-r from-[#FEEBD8] to-[#E5D5B7] text-[#141414] font-semibold rounded-lg hover:shadow-lg hover:shadow-[#FEEBD8]/25 transform hover:scale-105 transition-all duration-300"
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
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
                <div className="space-y-2">
                  <p className="text-[#FEEBD8]/70 text-sm">
                    Welcome, {user?.name || user?.email}
                  </p>
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
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-[#FEEBD8] to-[#E5D5B7] text-[#141414] font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
