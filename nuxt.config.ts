// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase', '@nuxt/ui', '@prisma/nuxt', '@pinia/nuxt'],
  supabase: {
    redirectOptions: {
      login: '/auth/connexion',
      callback: '/confirm',
      include: ['/admin'],
      exclude: [],
      cookieRedirect: false,
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ['~/assets/styles/main.css'],
  plugins: ['~/plugins/toast.js'],
  nitro: {
    routeRules: {
      '/compte/:username': { prerender: false }
    }
  }
})