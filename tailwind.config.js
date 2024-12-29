/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Utilise une classe pour activer le mode sombre
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#1a202c',
        lightBg: '#f7fafc',
      },
    },
  },
  plugins: [],
}

