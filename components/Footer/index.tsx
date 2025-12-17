"use client";

import Link from "next/link";
import { FaGithub, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-white/[0.02] border-t border-neutral-800/50 mt-auto">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo/Brand + Social Links */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link
              href="/"
              className="text-xl text-white font-climate-crisis font-bold hover:text-white transition-colors cursor-pointer"
            >
              paccy
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/paccy-io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[white]/60 hover:text-white transition-colors duration-200 flex items-center justify-center"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </Link>
              <Link
                href="https://instagram.com/paccy.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[white]/60 hover:text-white transition-colors duration-200 flex items-center justify-center"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-[white]/50 text-xs">
            © 2025 Paccy. Built with ❤️ by students, for students.
          </p>
        </div>
      </div>
    </footer>
  );
}
