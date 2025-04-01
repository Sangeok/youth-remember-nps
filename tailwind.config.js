/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "wind-blow": "windBlowing 15s ease-in-out infinite",
      },
      keyframes: {
        windBlowing: {
          "0%": { transform: "scale(1.01) rotate(0deg) translate(0px, 0px)" },
          "25%": {
            transform: "scale(1.02) rotate(0.5deg) translate(5px, 2px)",
          },
          "50%": {
            transform: "scale(1.01) rotate(-0.3deg) translate(-3px, 1px)",
          },
          "75%": {
            transform: "scale(1.02) rotate(0.2deg) translate(2px, -1px)",
          },
          "100%": { transform: "scale(1.01) rotate(0deg) translate(0px, 0px)" },
        },
      },
    },
  },
  plugins: [],
};
