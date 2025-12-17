type Theme = "dark" | "light";

export const themeStyles = {
  // Backgrounds
  bg: {
    dark: "bg-[#0a0a0a]",
    light: "bg-gray-50",
  },
  bgGradient: {
    dark: "bg-gradient-to-br from-[#141414] to-[#1a1a1a]",
    light: "bg-gradient-to-br from-white to-gray-50",
  },
  bgCard: {
    dark: "bg-gradient-to-br from-[#141414] to-[#1a1a1a]",
    light: "bg-white",
  },
  bgInput: {
    dark: "bg-neutral-800",
    light: "bg-gray-50",
  },
  bgButton: {
    dark: "bg-neutral-700",
    light: "bg-gray-200",
  },
  bgModal: {
    dark: "bg-gradient-to-br from-[#141414] to-[#1a1a1a]",
    light: "bg-white",
  },

  // Borders
  border: {
    dark: "border-neutral-700/50",
    light: "border-gray-200",
  },
  borderHover: {
    dark: "hover:border-blue-500/30",
    light: "hover:border-blue-400/50",
  },

  // Text
  text: {
    dark: "text-white",
    light: "text-gray-900",
  },
  textMuted: {
    dark: "text-white/70",
    light: "text-gray-600",
  },
  textSubtle: {
    dark: "text-white/60",
    light: "text-gray-500",
  },

  // Shadows
  shadow: {
    dark: "shadow-2xl",
    light: "shadow-xl shadow-gray-200/50",
  },
  shadowHover: {
    dark: "hover:shadow-lg hover:shadow-blue-500/5",
    light: "hover:shadow-lg hover:shadow-blue-500/10",
  },
};

export function getThemeClasses(theme: Theme, ...styleKeys: string[]): string {
  const classes: string[] = [];

  for (const key of styleKeys) {
    const parts = key.split(".");
    let current: any = themeStyles;

    for (const part of parts) {
      current = current[part];
      if (!current) break;
    }

    if (current && typeof current === "object" && theme in current) {
      classes.push(current[theme]);
    }
  }

  return classes.join(" ");
}
