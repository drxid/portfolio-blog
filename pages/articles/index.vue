<script setup lang="ts">
import Fuse from 'fuse.js'

useSeoMeta({
  title: 'Статьи',
  description: 'Заметки и разборы о фронтенде, Vue и дизайне интерфейсов.',
  ogTitle: 'Статьи — Вадим Бухлов',
  ogDescription: 'Заметки и разборы о фронтенде, Vue и дизайне интерфейсов.',
})

const { data: articles } = await useAsyncData('articles-list', () =>
  queryCollection('articles')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'tags')
    .all(),
)

const query = ref('')

const fuse = computed(
  () =>
    new Fuse(articles.value ?? [], {
      keys: ['title', 'description', 'tags'],
      threshold: 0.4,
      ignoreLocation: true,
    }),
)

const results = computed(() => {
  const q = query.value.trim()
  if (!q) return articles.value ?? []
  return fuse.value.search(q).map((r) => r.item)
})
</script>

<template>
  <div>
    <header class="anim">
      <h1 class="text-2xl font-bold tracking-tight">Статьи</h1>
      <p class="mt-1.5 text-muted">Заметки и разборы — то, что хочется зафиксировать.</p>
    </header>

    <div class="anim mt-8" style="animation-delay: 80ms">
      <label class="mb-2 block text-sm text-muted">Поиск</label>
      <SearchInput v-model="query" placeholder="Введите что-то…" />
    </div>

    <TransitionGroup
      v-if="results.length"
      name="list"
      tag="div"
      class="relative mt-10 space-y-10"
    >
      <ArticleCard v-for="a in results" :key="a.path" :article="a" />
    </TransitionGroup>

    <p v-else class="mt-10 text-muted">
      Ничего не нашлось по запросу «{{ query }}».
    </p>
  </div>
</template>
