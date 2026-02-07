/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["display", "sans-serif"],
        general: ["general", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        "circular-web": ["circular-web", "sans-serif"],
        "robert-medium": ["robert-medium", "sans-serif"],
        "robert-regular": ["robert-regular", "sans-serif"],
      },
      colors: {
        // JecnaGames color palette - dark tech theme
        jecna: {
          dark: "#0a0a0f",
          darker: "#050508",
          card: "#12121a",
          border: "#1e1e2e",
        },
        accent: {
          green: "#4ade80",
          blue: "#60a5fa",
          purple: "#a78bfa",
          yellow: "#facc15",
          red: "#f87171",
        },
        text: {
          primary: "#ffffff",
          secondary: "#a1a1aa",
          muted: "#52525b",
        },
        // Keep some legacy colors for compatibility
        blue: {
          50: "#e0f2fe",
          75: "#0a0a0f",
          100: "#ffffff",
          200: "#010101",
          300: "#00d4ff",
        },
        violet: {
          50: "#a1a1aa",
          300: "#a855f7",
        },
        yellow: {
          100: "#fbbf24",
          300: "#fbbf24",
        },
      },
    },
  },
  plugins: [],
};
