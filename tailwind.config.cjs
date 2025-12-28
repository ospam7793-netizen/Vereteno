/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          900: "#0f0505",
          800: "#1c0a0a",
          700: "#2b0f0f",
          600: "#450a0a",
          500: "#6b0f0f",
        },
        mythic: {
          gold: "#ffffff",
          red: "#ef4444",
          cyan: "#f43f5e",
        },
      },
      fontFamily: {
        // чтобы твой существующий UI на font-sans / font-serif сразу стал “новым”
        sans: [
          '"Jura Variable"',
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Arial",
          "sans-serif",
        ],
        serif: [
          '"Russo One"',
          '"Jura Variable"',
          "ui-serif",
          "Georgia",
          "serif",
        ],

        // опционально (если захочешь использовать отдельные классы)
        ui: [
          '"Jura Variable"',
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Arial",
          "sans-serif",
        ],
        display: [
          '"Russo One"',
          '"Jura Variable"',
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Arial",
          "sans-serif",
        ],
      },
      letterSpacing: {
        cyber: "0.04em",
        cyberTight: "0.02em",
      },
    },
  },
  plugins: [],
};
