<script setup lang="ts">
const cv = useCvData()

// На главной — отдельный краткий текст «О себе» (резюме-вариант живёт на /cv)
const aboutHome = [
  'Привет! Я фуллстек JS-разработчик. Делаю быстрые и аккуратные веб-приложения на Vue 3 / Nuxt, проектирую API на Node.js.',
  'Люблю минимализм в интерфейсах, чистый код и доведение продукта до состояния, в котором им приятно пользоваться.',
]

useSeoMeta({
  title: `${cv.name} — ${cv.title}`,
  description: aboutHome[0],
  ogTitle: `${cv.name} — ${cv.title}`,
  ogDescription: aboutHome[0],
})

const { data: latest } = await useAsyncData('home-latest', () =>
  queryCollection('articles')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'tags')
    .limit(3)
    .all(),
)
</script>

<template>
  <div>
    <!-- О себе -->
    <section class="anim">
      <h2 class="text-2xl font-bold tracking-tight">О себе</h2>
      <div class="mt-4 max-w-2xl space-y-3 text-[1.05rem] leading-relaxed text-fg/90">
        <p v-for="(p, i) in aboutHome" :key="i">{{ p }}</p>
      </div>
      <div class="mt-6 flex flex-wrap items-center gap-4 text-sm">
        <NuxtLink to="/cv" class="read-link font-medium text-fg">
          Полное резюме <span class="arrow">→</span>
        </NuxtLink>
        <CopyEmail :email="cv.email" />
      </div>
    </section>

    <!-- Навыки -->
    <section class="anim mt-14" style="animation-delay: 80ms">
      <h2 class="text-lg font-bold tracking-tight">Ключевые навыки</h2>
      <SkillTags class="mt-4" />
    </section>

    <!-- Последние статьи -->
    <section class="anim mt-14" style="animation-delay: 120ms">
      <div class="flex items-end justify-between">
        <h2 class="text-lg font-bold tracking-tight">Последние статьи</h2>
        <NuxtLink to="/articles" class="nav-link text-sm">
          Все статьи<span class="arrow">↗</span>
        </NuxtLink>
      </div>
      <div class="mt-6 space-y-8">
        <ArticleCard v-for="a in latest" :key="a.path" :article="a" />
      </div>
    </section>

    <!-- Разделы -->
    <section class="anim mt-14 grid gap-4 sm:grid-cols-2" style="animation-delay: 160ms">
      <NuxtLink
        to="/articles"
        class="group rounded-2xl border border-border p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--accent-to)] hover:shadow-lg hover:shadow-black/5"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold">Статьи</h3>
          <span class="arrow text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
        </div>
        <p class="mt-2 text-sm text-muted">Заметки и разборы — то, что хочется зафиксировать.</p>
      </NuxtLink>

      <NuxtLink
        to="/checklist"
        class="group rounded-2xl border border-border p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--accent-to)] hover:shadow-lg hover:shadow-black/5"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold">Чеклист</h3>
          <span class="arrow text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
        </div>
        <p class="mt-2 text-sm text-muted">Список того, что хочу изучить, прочитать и посмотреть.</p>
      </NuxtLink>
    </section>
  </div>
</template>
