<script setup lang="ts">
import { PROJECTS, SMALL_PROJECTS } from '~/utils/projects'

useSeoMeta({
  title: 'Проекты',
  description: 'Проекты Вадима Бухлова: Bezuglya, Playloop, BGGridDB, VPNkit и небольшие утилиты.',
  ogTitle: 'Проекты — Вадим Бухлов',
  ogDescription: 'Проекты Вадима Бухлова: Bezuglya, Playloop, BGGridDB, VPNkit и небольшие утилиты.',
})
</script>

<template>
  <div>
    <header class="anim">
      <h1 class="text-2xl font-bold tracking-tight">Проекты</h1>
      <p class="mt-1.5 text-muted">То, что я делаю и поддерживаю сам — от продуктов до маленьких утилит.</p>
    </header>

    <section class="anim mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style="animation-delay: 80ms">
      <ProjectCard v-for="p in PROJECTS" :key="p.slug" :project="p" />
    </section>

    <section class="anim mt-14" style="animation-delay: 140ms">
      <h2 class="text-lg font-bold tracking-tight">Небольшие проекты</h2>
      <ul class="mt-4">
        <li
          v-for="p in SMALL_PROJECTS"
          :key="p.slug"
          class="flex flex-col gap-2 border-t border-dashed border-border py-5 last:border-b sm:flex-row sm:items-start sm:gap-6"
        >
          <div class="flex shrink-0 items-center gap-2.5 sm:w-48">
            <Icon :name="p.icon" class="h-5 w-5 text-muted" />
            <span class="font-semibold">{{ p.title }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm leading-relaxed text-muted">{{ p.description }}</p>
            <div class="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <div class="flex flex-wrap gap-1.5">
                <span v-for="s in p.stack" :key="s" class="tag">{{ s }}</span>
              </div>
              <a v-if="p.url" :href="p.url" target="_blank" rel="noopener noreferrer" class="nav-link">
                {{ prettyUrl(p.url) }}<Icon name="ph:arrow-up-right-bold" class="arrow" />
              </a>
              <a v-if="p.repo" :href="p.repo" target="_blank" rel="noopener noreferrer" class="nav-link">
                GitHub<Icon name="ph:arrow-up-right-bold" class="arrow" />
              </a>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
