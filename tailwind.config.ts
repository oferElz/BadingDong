import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Light mode palette
        background: "#F7F8FA",
        surface: "#FFFFFF",
        Sky: "#C3EBFA",
        SkyLight: "#EDF9FD",
        Purple: "#CFCEFF",
        PurpleLight: "#F1F0FF",
        Yellow: "#FAE27C",
        YellowLight: "#FEFCE8",

        // Dark mode palette as top-level keys
        "dark-background": "#121212",
        "grey-background": "#2e2d2d",
        "dark-surface": "#1E1E1E",
        "dark-Sky": "#2C5363",
        "dark-SkyLight": "#335561",
        "dark-Purple": "#383866",
        "dark-PurpleLight": "#2A2A4D",
        "dark-Yellow": "#665C33",
        "dark-YellowLight": "#4D4426",
        "dark-text": "#E1E1E1",
        "dark-primary": "#90CAF9",
        "dark-secondary": "#B39DDB",
      },
    },
  },
  plugins: [],
};

export default config;