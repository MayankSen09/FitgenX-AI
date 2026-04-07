/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-secondary-fixed-variant": "#004493",
        "tertiary": "#21674f",
        "error-container": "#ffdad6",
        "primary": "#5d5c5b",
        "tertiary-fixed-dim": "#90d5b7",
        "surface-container-lowest": "#ffffff",
        "surface-tint": "#5f5e5e",
        "primary-container": "#757474",
        "secondary-fixed-dim": "#adc6ff",
        "inverse-surface": "#2e3034",
        "on-error": "#ffffff",
        "error": "#ba1a1a",
        "on-surface": "#1a1c1f",
        "on-primary": "#ffffff",
        "surface-dim": "#d9dade",
        "inverse-primary": "#c8c6c5",
        "on-secondary": "#ffffff",
        "on-tertiary": "#ffffff",
        "on-background": "#1a1c1f",
        "tertiary-fixed": "#abf1d2",
        "outline-variant": "#c1c6d7",
        "on-secondary-fixed": "#001a41",
        "on-tertiary-container": "#f5fff8",
        "on-primary-container": "#f7feff",
        "surface-container": "#ededf2",
        "inverse-on-surface": "#f0f0f5",
        "tertiary-container": "#3d8167",
        "secondary-container": "#0070eb",
        "surface": "#f9f9fe",
        "surface-container-highest": "#e2e2e7",
        "surface-bright": "#f9f9fe",
        "outline": "#717786",
        "on-tertiary-fixed-variant": "#00513b",
        "primary-fixed-dim": "#c8c6c5",
        "on-tertiary-fixed": "#002116",
        "surface-container-high": "#e8e8ed",
        "on-secondary-container": "#fefcff",
        "surface-container-low": "#f3f3f8",
        "background": "#f9f9fe",
        "on-primary-fixed-variant": "#474746",
        "secondary": "#0058bc",
        "surface-variant": "#e2e2e7",
        "on-surface-variant": "#414755",
        "on-error-container": "#93000a",
        "primary-fixed": "#e5e2e1",
        "secondary-fixed": "#d8e2ff",
        "on-primary-fixed": "#1c1b1b"
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px"
      },
      fontFamily: {
        headline: ["Manrope"],
        body: ["Inter"],
        label: ["Inter"]
      }
    }
  },
  plugins: [],
}
