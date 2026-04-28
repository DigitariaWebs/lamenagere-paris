/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#002444",
          container: "#1b3a5c",
        },
        secondary: {
          DEFAULT: "#7f5531",
          container: "#ffc69a",
        },
        background: "#f9f9f9",
        surface: {
          DEFAULT: "#f9f9f9",
          container: "#eeeeee",
          "container-low": "#f3f3f3",
          "container-lowest": "#ffffff",
          dim: "#dadada",
        },
        "on-surface": {
          DEFAULT: "#1a1c1c",
          variant: "#43474e",
        },
        outline: {
          DEFAULT: "#73777f",
          variant: "#c3c6cf",
        },
        error: "#ba1a1a",
        "on-primary": "#ffffff",
        success: "#10B981",
        warning: "#F59E0B",
      },
      fontFamily: {
        headline: ["Manrope_700Bold"],
        "headline-extrabold": ["Manrope_800ExtraBold"],
        body: ["Inter_400Regular"],
        "body-light": ["Inter_300Light"],
        "body-medium": ["Inter_500Medium"],
        "body-semibold": ["Inter_600SemiBold"],
        "body-bold": ["Inter_700Bold"],
      },
      borderRadius: {
        xs: "2px",
        card: "8px",
        pill: "12px",
      },
    },
  },
  plugins: [],
};
