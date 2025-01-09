/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'selector', // Utilise une classe pour activer le mode sombre
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
        ltext: '#202020',
        dtext: '#EEE',
        ltextbold: '#446169',
        dtextbold: '#A1B9C6',

        //Backgrounds
        lbg: '#f7f7f7',
        dbg: '#121212',

        //Accent
        laccent: '#5B7982',
        laccenthover: '#4E6C75',
        daccent: '#5F7987',
        daccenthover: '#556B78',

        // Gray
        lgray: '#E6E6E6',
        dgray: '#313131',

        // Borders
        lborder: '#CDCDCD',
        dborder: '#606060',

        // Input
        linputbg: '#606060',
        dinputbg: '#AFAFAF',
        linputborder: '#606060',
        dinputborder: '#AFAFAF',
        linputfocus: '#ACC1C8',
        dinputfocus: '#3E4F59',

        // Cards 
        lcardbg: '#EFEFEF',
        dcardbg: '#191919',
      },
    },
  },
  plugins: [],
}

