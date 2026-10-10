<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md' }>(), { size: 'md' })

const links = [
  { name: 'Telegram', href: 'https://t.me/drxid', icon: 'simple-icons:telegram' },
  { name: 'VK', href: 'https://vk.com/drxid', icon: 'simple-icons:vk' },
  { name: 'GitHub', href: 'https://github.com/drxid', icon: 'simple-icons:github' },
  { name: 'Behance', href: 'https://be.net/drxid', icon: 'simple-icons:behance' },
]
</script>

<template>
  <ul class="flex flex-wrap items-center gap-5">
    <li v-for="l in links" :key="l.name">
      <a
        :href="l.href"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center text-muted transition hover:scale-110 hover:text-fg"
        :aria-label="l.name"
        :title="l.name"
      >
        <Icon :name="l.icon" :class="size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'" />
      </a>
    </li>
  </ul>
</template>
