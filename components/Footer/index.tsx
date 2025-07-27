"use client";

import Link from "next/link";
import { FaGithub, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#141414] border-t border-neutral-700/50">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl text-[#ffffff] font-climate-crisis font-bold cursor-pointer"
            >
              paccy
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/paccy-io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FEEBD8] hover:text-white transition-colors duration-300"
              aria-label="GitHub"
            >
              <FaGithub size={24} />
            </Link>
            <Link
              href="https://instagram.com/paccy.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FEEBD8] hover:text-white transition-colors duration-300"
              aria-label="Instagram"
            >
              <FaInstagram size={24} />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-neutral-700/50">
          <p className="text-center text-[#FEEBD8] text-sm font-sans">
            © 2025 Paccy. Built with ❤️ by students, for students.
          </p>
        </div>
      </div>
    </footer>
  );
}
