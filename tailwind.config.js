/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'transition',
    'duration-100',
    'duration-75',
    'ease-out',
    'ease-in',
    'opacity-0',
    'opacity-100',
    'scale-95',
    'scale-100',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f5ff",
          100: "#e0eaff",
          200: "#b8ceff",
          300: "#8eaaff",
          400: "#6492fc",
          500: "#3d70f5",
          600: "#2253d4",
          700: "#1a419d",
          800: "#17397a",
          900: "#162f5c",
        },
        secondary: {
          50: "#f4f6f8",
          100: "#e9ecef",
          200: "#ced4da",
          300: "#adb5bd",
          400: "#868e96",
          500: "#495057",
          600: "#343a40",
          700: "#23272b",
          800: "#1c1e22",
          900: "#18191b",
        },
        info: "#2196f3",
        surface: "#fff",
        background: "#f8fafc",
        muted: "#e5e7eb",
        text: "#334155",
        error: "#e11d48",
        neutral: {
          50: "#f8fafc",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        }
      },
    },
  },
  plugins: [],
}

