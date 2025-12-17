"use client";

import { useTheme } from "./ThemeProvider";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0a0a0a]" : "bg-gray-50"
      }`}
    >
      {children}
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-xl border transition-all duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-[#141414] to-[#1a1a1a] border-neutral-700/50"
          : "bg-white border-gray-200"
      } ${
        hover
          ? theme === "dark"
            ? "hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5"
            : "hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface TextProps {
  children: ReactNode;
  variant?: "default" | "muted" | "subtle";
  className?: string;
}

export function Text({
  children,
  variant = "default",
  className = "",
}: TextProps) {
  const { theme } = useTheme();

  const colorClass =
    variant === "muted"
      ? theme === "dark"
        ? "text-white/70"
        : "text-gray-600"
      : variant === "subtle"
      ? theme === "dark"
        ? "text-white/60"
        : "text-gray-500"
      : theme === "dark"
      ? "text-white"
      : "text-gray-900";

  return <span className={`${colorClass} ${className}`}>{children}</span>;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export function Input({
  fullWidth = false,
  className = "",
  ...props
}: InputProps) {
  const { theme } = useTheme();

  return (
    <input
      {...props}
      className={`rounded-lg px-4 py-3 border transition-colors ${
        theme === "dark"
          ? "bg-neutral-800 border-neutral-700/50 text-white focus:border-blue-500"
          : "bg-white border-gray-200 text-gray-900 focus:border-blue-500"
      } focus:outline-none ${fullWidth ? "w-full" : ""} ${className}`}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  fullWidth?: boolean;
}

export function Select({
  fullWidth = false,
  className = "",
  children,
  ...props
}: SelectProps) {
  const { theme } = useTheme();

  return (
    <select
      {...props}
      className={`rounded-lg px-4 py-3 border transition-colors ${
        theme === "dark"
          ? "bg-neutral-800 border-neutral-700/50 text-white focus:border-blue-500"
          : "bg-white border-gray-200 text-gray-900 focus:border-blue-500"
      } focus:outline-none ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </select>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  const variantClass =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : theme === "dark"
      ? "bg-neutral-700 text-white hover:bg-neutral-600"
      : "bg-gray-200 text-gray-900 hover:bg-gray-300";

  return (
    <button
      {...props}
      className={`px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
