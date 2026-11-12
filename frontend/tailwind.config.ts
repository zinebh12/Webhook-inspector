import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Application layout
        "app-background": "#181019",
        "sidebar-background": "#201321",
        "content-background": "#1D1420",

        // Cards and panels
        "card-background": "#2A1A2B",
        "card-hover": "#38203A",
        "panel-background": "#281729",

        //json
        "json-background": "#160E19",

        //inputs
        "input-background": "#211522",
        "input-hover": "#2B1930",
        "input-focus": "#29152A",
        "input-border": "#493047",
        "input-border-focus": "#FF1493",
        "input-placeholder": "#A88DA3",
        "input-text": "#FFF0F8",
        "input-disabled": "#19121C",
        "input-disabled-text": "#806D7D",

        // Pink buttons
        "button-primary": "#FF1493",
        "button-primary-hover": "#FF3EAA",
        "button-primary-active": "#D90078",
        "button-disabled": "#713052",

        // Navigation and selection
        "nav-item-hover": "#38203A",
        "nav-item-active": "#6B1D50",
        "nav-item-active-text": "#FF75BE",

        // Request list
        "request-background": "#241827",
        "request-hover": "#38203A",
        "request-selected": "#6B1D50",
        "request-method": "#FF75BE",

        // Text
        "text-primary": "#FFF0F8",
        "text-pinkest": "#FF1493",
        "text-secondary": "#D1B5C9",
        "text-muted": "#A88DA3",

        // Borders and outlines
        "border-default": "#472B43",
        "border-hover": "#80416B",
        "border-focus": "#FF1493",

        // Status indicators
        "status-success": "#4ADE80",
        "status-error": "#F87171",
        "status-warning": "#FBBF24",
        "status-info": "#60A5FA",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
