/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-container-highest": "#e0e3e5",
        "inverse-surface": "#2d3133",
        "primary-fixed": "#e1e0ff",
        "on-error": "#ffffff",
        "secondary-container": "#9c48ea",
        "on-surface": "#191c1e",
        "tertiary-fixed": "#d8e2ff",
        "on-secondary": "#ffffff",
        "surface-bright": "#f7f9fb",
        "primary-container": "#6063ee",
        "surface-container-lowest": "#ffffff",
        "error-container": "#ffdad6",
        "primary": "#4648d4",
        "secondary-fixed": "#f0dbff",
        "background": "#f7f9fb",
        "secondary": "#8127cf",
        "error": "#ba1a1a",
        "tertiary": "#0058be",
        "surface": "#f7f9fb",
        "surface-container-low": "#f2f4f6",
        "on-primary": "#ffffff",
        "on-background": "#191c1e",
        "outline": "#767586",
        "outline-variant": "#c7c4d7",
        "on-surface-variant": "#464554",
        "surface-container": "#eceef0",
        "surface-variant": "#e0e3e5",
      },
      fontFamily: {
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "display-lg": ["Plus Jakarta Sans", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Plus Jakarta Sans", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "sans-serif"]
      },
      spacing: {
        "margin-mobile": "16px",
        "gutter": "24px",
        "base": "8px",
        "margin-desktop": "48px",
        "container-max": "1200px"
      },
      boxShadow: {
        'island': '0px 10px 25px rgba(0,0,0, 0.05)',
      }
    },
  },
  plugins: [],
}