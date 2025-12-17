import { useTheme } from "../../components/ThemeProvider";

interface ThemeClassesResult {
  // Backgrounds
  bg: string;
  bgCard: string;
  bgInput: string;
  bgModal: string;
  bgHover: string;
  bgGradient: string;

  // Borders
  border: string;
  borderHover: string;
  borderFocus: string;

  // Text
  text: string;
  textMuted: string;
  textSubtle: string;

  // Buttons
  btnPrimary: string;
  btnSecondary: string;
  btnDanger: string;

  // Shadows
  shadow: string;
  shadowHover: string;
}

export function useThemeClasses(): ThemeClassesResult {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return {
    // Backgrounds
    bg: isDark ? "bg-[#0a0a0a]" : "bg-gray-50",
    bgCard: isDark
      ? "bg-gradient-to-br from-[#141414] to-[#1a1a1a]"
      : "bg-white",
    bgInput: isDark ? "bg-neutral-800" : "bg-white",
    bgModal: isDark
      ? "bg-gradient-to-br from-[#141414] to-[#1a1a1a]"
      : "bg-white",
    bgHover: isDark ? "hover:bg-neutral-700" : "hover:bg-gray-100",
    bgGradient: isDark
      ? "bg-gradient-to-br from-[#141414] to-[#1a1a1a]"
      : "bg-gradient-to-br from-white to-gray-50",

    // Borders
    border: isDark ? "border-neutral-700/50" : "border-gray-200",
    borderHover: isDark
      ? "hover:border-blue-500/30"
      : "hover:border-blue-400/50",
    borderFocus: "focus:border-blue-500",

    // Text
    text: isDark ? "text-white" : "text-gray-900",
    textMuted: isDark ? "text-white/70" : "text-gray-600",
    textSubtle: isDark ? "text-white/60" : "text-gray-500",

    // Buttons
    btnPrimary: "bg-blue-600 text-white hover:bg-blue-700",
    btnSecondary: isDark
      ? "bg-neutral-700 text-white hover:bg-neutral-600"
      : "bg-gray-200 text-gray-900 hover:bg-gray-300",
    btnDanger: "bg-red-600 text-white hover:bg-red-700",

    // Shadows
    shadow: isDark ? "shadow-2xl" : "shadow-xl shadow-gray-200/50",
    shadowHover: isDark
      ? "hover:shadow-lg hover:shadow-blue-500/5"
      : "hover:shadow-lg hover:shadow-blue-500/10",
  };
}
