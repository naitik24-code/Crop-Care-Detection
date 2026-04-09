/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2d6a4f",
        "primary-dim": "#1f5e44",
        "primary-container": "#b1f0ce",
        "on-primary": "#e6ffee",
        "on-primary-container": "#1d5c42",
        secondary: "#40665d",
        "secondary-container": "#c1ebdf",
        "on-secondary-container": "#325950",
        tertiary: "#2d676d",
        "tertiary-container": "#b8f2f9",
        "on-tertiary-container": "#215d63",
        surface: "#f8f9fa",
        "surface-container": "#ebeef0",
        "surface-container-low": "#f1f4f5",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#e5e9eb",
        "surface-dim": "#d5dbdd",
        "on-surface": "#2d3335",
        "on-surface-variant": "#5a6062",
        "outline-variant": "#adb3b5",
        error: "#a83836",
        "error-container": "#fa746f",
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        spin: "spin 1s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
