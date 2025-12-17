"use client";

import { useTheme } from "../ThemeProvider";
import { FaSpinner } from "react-icons/fa";

interface StatsCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  loading?: boolean;
  emptyMessage?: string;
  iconColor?: string;
}

export default function StatsCard({
  icon,
  value,
  label,
  loading = false,
  emptyMessage,
  iconColor = "blue",
}: StatsCardProps) {
  const { theme } = useTheme();

  const getIconBgColor = () => {
    const colors: Record<string, string> = {
      blue: "bg-blue-500/10",
      green: "bg-green-500/10",
      purple: "bg-purple-500/10",
      orange: "bg-orange-500/10",
    };
    return colors[iconColor] || colors.blue;
  };

  const getIconTextColor = () => {
    const colors: Record<string, string> = {
      blue: "text-blue-400",
      green: "text-green-400",
      purple: "text-purple-400",
      orange: "text-orange-400",
    };
    return colors[iconColor] || colors.blue;
  };

  return (
    <div
      className={`rounded-xl p-4 border transition-all duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-[#141414] to-[#1a1a1a] border-neutral-700/50 hover:border-white/30 hover:shadow-lg hover:shadow-white/5"
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/50"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${getIconBgColor()}`}>
          <div className={`text-xl ${getIconTextColor()}`}>{icon}</div>
        </div>
        {loading && (
          <FaSpinner
            className={`animate-spin text-sm ${
              theme === "dark" ? "text-white/50" : "text-gray-400"
            }`}
          />
        )}
      </div>
      <div
        className={`text-2xl font-bold mb-0.5 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {loading ? "..." : value}
      </div>
      <div
        className={`text-xs ${
          theme === "dark" ? "text-white/70" : "text-gray-600"
        }`}
      >
        {label}
      </div>
      {!loading && emptyMessage && value === 0 && (
        <div
          className={`mt-1.5 text-xs ${
            theme === "dark" ? "text-white/50" : "text-gray-500"
          }`}
        >
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
