"use client";

import { useTheme } from "./ThemeProvider";
import { ReactNode } from "react";
import { FaTimes } from "react-icons/fa";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export default function ModalWrapper({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "2xl",
}: ModalWrapperProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full ${maxWidthClass} rounded-xl border p-6 ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#141414] to-[#1a1a1a] border-neutral-700/50 shadow-2xl"
            : "bg-white border-gray-200 shadow-xl shadow-gray-200/50"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-white/70 hover:text-white hover:bg-neutral-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
