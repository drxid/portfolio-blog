<script setup lang="ts">
const route = useRoute()
const siteUrl = 'https://drxid.ru'

// Глобальный canonical для текущего маршрута
useHead({
  link: [
    {
      rel: 'canonical',
      href: () => siteUrl + (route.path === '/' ? '' : route.path),
    },
  ],
  htmlAttrs: { lang: 'ru' },
})

// Базовый JSON-LD: Person + WebSite
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            name: 'Вадим Бухлов',
            url: siteUrl,
            jobTitle: 'Fullstack JS-разработчик',
            sameAs: [
              'https://github.com/drxid',
              'https://t.me/drxid',
              'https://vk.com/drxid',
            ],
          },
          {
            '@type': 'WebSite',
            name: 'Вадим Бухлов',
            url: siteUrl,
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
