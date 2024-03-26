/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "node_modules/preline/dist/*.js",
  ],
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-nesting"), // Add this line to enable nesting
          require("tailwindcss"), // Make sure to include Tailwind CSS after postcss-nesting
          // other plugins...
        ],
      },
    },
  },
  theme: {
    colors: {
      blue: "#1fb6ff",
      purple: "#7e5bef",
      pink: "#ff49db",
      orange: "#ff7849",
      green: "#13ce66",
      yellow: "#ffc82c",
      "gray-dark": "#273444",
      gray: "#8492a6",
      "gray-light": "#d3dce6",
      "teal-50": "#F0FDFA",
      "teal-100": "#CCFBF1",
      "teal-200": "#99F6E4",
      "teal-300": "#5EEAD4",
      "teal-400": "#2DD4BF",
      "teal-500": "#14B8A6",
      "teal-600": "#0D9488",
      "teal-700": "#0F766E",
      "teal-800": "#115E59",
      "teal-900": "#134E4A",
      red: {
        50: "#fff5f5",
        100: "#fed7d7",
        200: "#feb2b2",
        500: "#ef4444",
        800: "#991b1b",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        "dark-blue": "#001122", // replace with your dark mode color
        "light-blue": "#aabbcc", // replace with your light mode color
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("preline/plugin")],
  darkMode: "class",
};
