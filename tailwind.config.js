/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "tech-dark": "#1a1a2e",
        "tech-dark-light": "#16213e",
        "tech-accent": "#0f3460",
        "tech-highlight": "#e94560",
        "tech-text": "#e0e0e0",
      },
    },
  },
  plugins: [],
  darkMode: "class", // This enables dark mode
};
