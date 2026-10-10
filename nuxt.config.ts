// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/content',
    '@nuxt/icon',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  css: ['~/assets/css/main.css'],

  // Базовые данные сайта для SEO (sitemap, og, canonical)
  site: {
    url: 'https://drxid.ru',
    name: 'Вадим Бухлов',
    description: 'Личная страница, статьи и чеклист Вадима Бухлова — JS-разработчика.',
    defaultLocale: 'ru',
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:image', content: 'https://drxid.ru/og.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://drxid.ru/og.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
        },
      ],
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
    storageKey: 'drxid-theme',
  },

  content: {
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
        },
      },
    },
  },

  // SSG: пререндерим все статические маршруты + краулер пройдёт по статьям
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/cv', '/articles', '/checklist', '/privacy', '/sitemap.xml'],
    },
  },

  icon: {
    mode: 'svg',
  },

  sitemap: {
    // crawler пройдёт по статьям; явно указываем известные статические маршруты
    autoLastmod: true,
  },
  robots: {
    allow: '/',
  },
})
