/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../apps/mobile/**/*.{js,jsx,ts,tsx}",
    "../../apps/volunteer/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF9",
        foreground: "#1C1917",
        muted: "#57534E",
        border: "#E7E5E4",
        card: "#FFFFFF",
        primary: "#1C1917",
        destructive: "#B91C1C",
      },
    },
  },
  plugins: [],
};
