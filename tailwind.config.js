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
          bg: "#F5F4EF",
          text: "#171916",
          accent: "#C8FF45",
        },
        surface: {
          secondary: "#FFFFFF",
          dark: "#20221F",
        },
        border: {
          DEFAULT: "#D9DAD3",
        },
        text: {
          muted: "#74776F",
        },
        semantic: {
          warning: "#F4B942",
          error: "#F06464",
          success: "#33855C",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'brutal': '4px 4px 0px rgba(0, 0, 0, 1)',
      }
    },
  },
  plugins: [],
}
