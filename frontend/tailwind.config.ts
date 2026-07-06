import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00B26B",
          dark: "#00852b",
          light: "#74f29f",
        },
        success: "#01e675",
        warning: "#eabe0f",
        error: "#f54336",
        "dark-gray": "#2b2b2b",
        "medium-gray": "#5e6573",
        "light-gray": "#BEBEBE",
        "clean-gray": "#f5f5f5",
      },
      fontFamily: {
        sans: ['"Nunito Sans"', "Inter", "sans-serif"],
      },
      borderRadius: {
        card: "6px",
        input: "6px",
      },
      boxShadow: {
        card: "0px 2px 4px rgba(214, 214, 214, 0.5)",
        "card-hover": "0px 5px 20px rgba(0, 0, 15, 0.17)",
      },
    },
  },
  plugins: [],
} satisfies Config;
