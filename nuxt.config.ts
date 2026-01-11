// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
    css: ['~/assets/css/main.css'],
  modules: ['@nuxt/eslint', '@nuxt/ui',  ['nuxt-auth-sanctum', {
      baseUrl: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:8000',
      mode: 'cookie',
      endpoints: {
          csrf: '/sanctum/csrf-cookie',
          login: '/login',
          logout: '/logout',
          user: '/api/account',
      },
      redirect: {
          onAuthOnly: '/login',
          onGuestOnly: '/account',
          onLogin: '/account',
          onLogout: '/',
      },
      globalMiddleware: { enabled: true, allow404WithoutAuth: true },
      client: { initialRequest: true },
  }]]
})
