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
        lightText: '#333333',
        lightTextMuted: '#555555', // Texte secondaire ou désactivé
        darkText: '#f4f4f4',
        darkTextMuted: '#b0b0af', // Texte secondaire ou désactivé

        //Backgrounds
        lightBg: '#f4f4f4', // Arrière-plan
        darkBg: '#2a2a2a', // Gris foncé pour l'arrière-plan sombre

        //Primaires
        lightPrimary: '#4C7C58',
        lightPrimaryHover: '#3b5c4a', // Survol du primaire
        darkPrimary: '#B8860B',
        darkPrimaryHover: '#9e7e20', // Survol du primaire

        //Secondaires
        lightSecondary: '#a0c4d4',
        lightSecondaryHover: '#77a6b3', // Survol du secondaire
        darkSecondary: '#5a8b99',
        darkSecondaryHover: '#38687a', // Survol du secondaire

        //Accent
        lightAccent: '#7a9b7c',
        lightAccentHover: '#6a8b6d', // Survol de l'accent
        darkAccent: '#718f7c',
        darkAccentHover: '#5d7b6a', // Survol de l'accent

        //Erreur et succès
        lightSuccess: '#5cb85c', // Vert pour les succès
        lightWarning: '#f0ad4e', // Orange pour les avertissements
        darkSuccess: '#5cb85c', // Vert pour les succès
        lightError: '#d9534f', // Rouge pour les erreurs
        darkError: '#d9534f', // Rouge pour les erreurs
        darkWarning: '#f0ad4e', // Orange pour les avertissements
      },
    },
  },
  plugins: [],
}

