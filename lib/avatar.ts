// UI-matching color palette for avatars
const UI_AVATAR_COLORS = [
  "4A5568", // Dark blue-gray (matches dark theme)
  "2D3748", // Darker blue-gray
  "1A202C", // Very dark blue-gray
  "2B6CB0", // Blue (complements your blue gradients)
  "553C9A", // Purple (matches your purple accents)
  "6B46C1", // Violet
  "7C3AED", // Purple
  "8B5CF6", // Light purple
] as const;

/**
 * Generate a DiceBear avatar URL based on user's name
 * @param name - User's full name (e.g., "John Doe")
 * @param backgroundColor - Hex color without # (e.g., "4A5568" for dark blue-gray)
 * @returns Avatar URL
 */
export function generateAvatarUrl(
  name: string,
  backgroundColor?: string
): string {
  // Remove spaces and special characters, keep only letters and numbers
  const seed = name.replace(/[^a-zA-Z0-9]/g, "");

  // If no background color provided, pick one based on name hash for consistency
  let bgColor = backgroundColor;
  if (!bgColor) {
    const hash = seed
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    bgColor = UI_AVATAR_COLORS[hash % UI_AVATAR_COLORS.length];
  }

  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=${bgColor}`;
}

/**
 * Extract initials from a name
 * @param name - User's full name
 * @returns Initials (e.g., "JD" for "John Doe")
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get a UI-matching color for avatars
 * @param index - Color index (0-7) or undefined for random
 * @returns Hex color without #
 */
export function getUIAvatarColor(index?: number): string {
  if (index !== undefined && index >= 0 && index < UI_AVATAR_COLORS.length) {
    return UI_AVATAR_COLORS[index];
  }
  return UI_AVATAR_COLORS[Math.floor(Math.random() * UI_AVATAR_COLORS.length)];
}
