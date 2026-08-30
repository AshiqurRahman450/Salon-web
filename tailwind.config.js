/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(262.1, 83.3%, 57.8%)",
          foreground: "hsl(210, 40%, 98%)",
        },
        secondary: {
          DEFAULT: "hsl(42.4, 100%, 50%)",
          foreground: "hsl(222.2, 47.4%, 11.2%)",
        }
      }
    },
  },
  plugins: [],
}
