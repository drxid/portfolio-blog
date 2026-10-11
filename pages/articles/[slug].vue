<script setup lang="ts">
const route = useRoute()
const path = computed(() => route.path)

const { data: doc } = await useAsyncData(`article-${path.value}`, () =>
  queryCollection('articles').path(path.value).first(),
)

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Статья не найдена', fatal: true })
}

// Соседние статьи (prev/next)
const { data: surround } = await useAsyncData(`surround-${path.value}`, () =>
  queryCollectionItemSurroundings('articles', path.value, {
    fields: ['title', 'path'],
  }).order('date', 'DESC'),
)

const prev = computed(() => surround.value?.[0] ?? null)
const next = computed(() => surround.value?.[1] ?? null)

const tocLinks = computed(() => doc.value?.body?.toc?.links ?? [])

// Прогресс чтения
const articleBody = ref<HTMLElement | null>(null)
const { progress } = useReadingProgress(articleBody)

useSeoMeta({
  title: () => doc.value?.title,
  description: () => doc.value?.description,
  ogTitle: () => doc.value?.title,
  ogDescription: () => doc.value?.description,
  articlePublishedTime: () => doc.value?.date,
})

// JSON-LD для статьи
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: doc.value?.title,
          description: doc.value?.description,
          datePublished: doc.value?.date,
          author: { '@type': 'Person', name: 'Вадим Бухлов' },
        }),
      ),
    },
  ],
})
</script>

<template>
  <div v-if="doc">
    <ReadingProgress :progress="progress" />

    <div class="mx-auto flex max-w-wide gap-10">
      <!-- Боковое оглавление -->
      <aside class="hidden w-56 shrink-0 lg:block">
        <div class="sticky top-24">
          <TableOfContents :links="tocLinks" />
        </div>
      </aside>

      <article class="mx-auto min-w-0 max-w-content flex-1">
        <NuxtLink to="/articles" class="read-link group mb-6">
          <Icon name="ph:arrow-left" class="transition-transform duration-200 group-hover:-translate-x-1" /> Все статьи
        </NuxtLink>

        <!-- Шапка статьи -->
        <header class="anim">
          <div class="flex items-start justify-between gap-4">
            <h1 class="text-3xl font-bold leading-tight tracking-tight sm:text-[2.5rem]">
              {{ doc.title }}
            </h1>
            <ShareButton class="mt-1 shrink-0" :title="doc.title" :text="doc.description" />
          </div>
          <p class="mt-3 text-lg text-muted">{{ doc.description }}</p>

          <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            <time :datetime="doc.date">{{ formatDate(doc.date) }}</time>
            <div v-if="doc.tags?.length" class="flex flex-wrap gap-1.5">
              <span v-for="t in doc.tags" :key="t" class="tag">{{ t }}</span>
            </div>
          </div>
        </header>

        <!-- Пунктирный разделитель -->
        <hr class="divider-dashed my-8" />

        <!-- Тело статьи -->
        <div ref="articleBody" class="prose-article anim" style="animation-delay: 100ms">
          <ContentRenderer :value="doc" />
        </div>

        <!-- Навигация по статьям -->
        <ArticleNav :prev="prev" :next="next" />
      </article>
    </div>
  </div>
</template>
