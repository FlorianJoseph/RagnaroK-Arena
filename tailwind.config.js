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
        lightText: '#1f1f1e',
        lightBg: '#e1e1e0',
        lightPrimary: '#47616c',
        lightSecondary: '#72aac0',
        lightAccent: '#628470',
        darkText: '#e1e1e0',
        darkBg: '#1f1f1e',
        darkPrimary: '#93adb8',
        darkSecondary: '#3f778d',
        darkAccent: '#7b9d89',
      },
    },
  },
  plugins: [],
}

