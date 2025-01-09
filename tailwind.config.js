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
        //Textes
        lightText: '#202020',
        darkText: '#EEE',

        //Backgrounds
        lightBg: '#f7f7f7', // Arrière-plan
        darkBg: '#121212', // Gris foncé pour l'arrière-plan sombre

        //Accent
        lightAccent: '#5B7982',
        lightAccentHover: '#4E6C75',
        darkAccent: '#5F7987',
        darkAccentHover: '#556B78',

        // Gray
        lightGray: '#B0B0B0',
        darkGray: '#7A7A7A',





        //Primaires
        lightPrimary: '#5B7982',
        lightPrimaryHover: '#3b5c4a', // Survol du primaire
        darkPrimary: '#5F7987',
        darkPrimaryHover: '#9e7e20', // Survol du primaire

        //Secondaires
        lightSecondary: '#a0c4d4',
        lightSecondaryHover: '#77a6b3', // Survol du secondaire
        darkSecondary: '#5a8b99',
        darkSecondaryHover: '#38687a', // Survol du secondaire
      },
    },
  },
  plugins: [],
}

