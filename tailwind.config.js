/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05080f",
        midnight: "#0a1020",
        panel: "#0d1528",
        line: "#16264a",
        electric: "#1e6bff",
        cyan: "#22d3ff",
        muted: "#8da2c8",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 42px rgba(34, 211, 255, .18)",
      },
    },
  },
  plugins: [],
};
