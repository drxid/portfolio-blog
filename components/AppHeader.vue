<script setup lang="ts">
const nav = [
  { to: '/articles', label: 'Статьи' },
  { to: '/checklist', label: 'Чеклист' },
]

const socials = [
  { label: 'Телеграм', href: 'https://t.me/drxid' },
  { label: 'GitHub', href: 'https://github.com/drxid' },
  { label: 'VK', href: 'https://vk.com/drxid' },
  { label: 'Behance', href: 'https://be.net/drxid' },
]
</script>

<template>
  <header class="flex flex-col gap-6 pt-10 sm:flex-row sm:items-start sm:justify-between sm:pt-14">
    <!-- Бренд -->
    <NuxtLink to="/" class="group block">
      <BrandLogo />
      <span class="mt-2 block text-sm text-muted">
        Личная страница
        <span class="text-fg/70 transition-colors group-hover:text-[var(--accent-to)]"
          >‹ Вадим Бухлов ›</span
        >
      </span>
    </NuxtLink>

    <!-- Навигация + контролы + соцсети -->
    <div class="flex flex-col gap-3 sm:items-end">
      <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="nav-link">
          {{ item.label }}<span class="arrow">↗</span>
        </NuxtLink>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <SettingsMenu />
        </div>
      </div>

      <nav class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
        <a
          v-for="s in socials"
          :key="s.label"
          :href="s.href"
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors hover:text-fg"
        >
          {{ s.label }}
        </a>
      </nav>
    </div>
  </header>
</template>
