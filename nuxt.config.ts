// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/supabase',
    '@prisma/nuxt',
    '@pinia/nuxt',
    '@primevue/nuxt-module'
  ],
  primevue: {
    options: {
      theme: 'none'
    }
  },
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
      '/@:username': { prerender: false }
    }
  }
})