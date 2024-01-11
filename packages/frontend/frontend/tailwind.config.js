/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  content: [],
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
              primary: "#2388FF",
      secondary: "#FFC700",
      },
    },
  },
  plugins: [],
  prefix: "",
};

