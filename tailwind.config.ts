import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "custom-background":
          "linear-gradient(135deg, #F1F1F1 93%, #FFF7F2 100%)",
      },
      colors: {
        "custom-primary": "#E87B34",
        "custom-dark-text": "#1E1E1E",
        "custom-light-text": "#EEEEEE",
        "custom-grey-text": "#858585",
        "custom-orange": "#FF9901",
        "custom-light-orange": "#FFF6D7",
        "custom-red": "#FF4141",
        "custom-light-red": "#FFF2F2",
      },
    },
  },
  plugins: [],
};
export default config;
