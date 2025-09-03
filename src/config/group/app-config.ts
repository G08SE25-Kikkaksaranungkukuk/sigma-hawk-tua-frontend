export const APP_CONFIG = {
  group: {
    defaultMaxSize: 8,
    minMembers: 1,
    maxMembers: 20,
    supportedLanguages: ["English", "ไทย", "中文", "Español", "Français"],
    supportedPaces: ["Chill", "Balanced", "Packed"] as const,
    privacyOptions: ["Public", "Private"] as const
  },
  ui: {
    colors: {
      primary: "#ff6600",
      primaryHover: "#e65a00",
      secondary: "#171926",
      secondaryHover: "#212124",
      text: "#0b0b0c",
      textSecondary: "#e8eaee"
    },
    animation: {
      buttonScale: 0.99,
      transitionDuration: "200ms"
    }
  }
} as const;

export type GroupPace = typeof APP_CONFIG.group.supportedPaces[number];
export type GroupPrivacy = typeof APP_CONFIG.group.privacyOptions[number];
