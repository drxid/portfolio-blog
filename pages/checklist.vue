<script setup lang="ts">
import {
  useChecklist,
  CATEGORIES,
  SORTS,
  type ChecklistItem,
} from '~/composables/useChecklist'

useSeoMeta({
  title: 'Чеклист',
  description:
    'Публичный список того, что хочу изучить, прочитать и посмотреть — с прогрессом и оценками.',
  ogTitle: 'Чеклист — Вадим Бухлов',
  ogDescription: 'Что хочу изучить, прочитать и посмотреть. Повторяйте мой путь.',
})

const { data } = await useAsyncData('checklist', async () => {
  const res = await queryCollection('checklist').first()
  return res ?? { items: [] }
})

const source = computed<ChecklistItem[]>(() => (data.value?.items ?? []) as ChecklistItem[])

const { query, category, sort, items, progress, counts } = useChecklist(source)
</script>

<template>
  <div class="mx-auto max-w-content">
    <header class="anim">
      <h1 class="text-2xl font-bold tracking-tight">Чеклист</h1>
      <p class="mt-2 max-w-2xl text-muted">
        Небольшая страница с растущим списком того, что хочется изучить, сделать и посмотреть.
        Раньше он жил в моих заметках — теперь делюсь им открыто: вдруг кому-то пригодится
        и подскажет, что попробовать.
      </p>
    </header>

    <div class="anim mt-8" style="animation-delay: 60ms">
      <label class="mb-2 block text-sm text-muted">Поиск</label>
      <SearchInput v-model="query" placeholder="Введите что-то…" />
    </div>

    <!-- Табы категорий -->
    <div class="anim mt-6 flex flex-wrap gap-2" style="animation-delay: 100ms">
      <button
        v-for="c in CATEGORIES"
        :key="c.value"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all duration-200"
        :class="
          category === c.value
            ? 'border-fg bg-fg text-bg'
            : 'border-border text-muted hover:border-fg/40 hover:text-fg'
        "
        @click="category = c.value"
      >
        {{ c.label }}
        <span
          class="text-xs"
          :class="category === c.value ? 'text-bg/60' : 'text-muted'"
          >{{ counts[c.value] ?? 0 }}</span
        >
      </button>
    </div>

    <!-- Прогресс + сортировка -->
    <div class="anim mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style="animation-delay: 140ms">
      <div class="flex-1">
        <div class="mb-1.5 flex items-center justify-between text-xs text-muted">
          <span>Прогресс{{ category !== 'all' ? ' по категории' : '' }}</span>
          <span>{{ progress.done }} / {{ progress.total }} · {{ progress.percent }}%</span>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-card">
          <div
            class="h-full rounded-full transition-[width] duration-500 ease-out"
            :style="{
              width: progress.percent + '%',
              background: 'linear-gradient(90deg, var(--accent-from), var(--accent-to))',
            }"
          />
        </div>
      </div>

      <label class="flex items-center gap-2 text-sm text-muted">
        <span class="hidden sm:inline">Сортировка:</span>
        <select
          v-model="sort"
          class="rounded-lg border border-border bg-card px-3 py-1.5 text-fg outline-none transition-colors focus:border-[var(--accent-to)]"
        >
          <option v-for="s in SORTS" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </label>
    </div>

    <!-- Список -->
    <TransitionGroup v-if="items.length" name="list" tag="ul" class="relative mt-8 space-y-3">
      <ChecklistItem v-for="item in items" :key="item.id" :item="item" />
    </TransitionGroup>
    <p v-else class="mt-8 rounded-xl border border-dashed border-border p-8 text-center text-muted">
      Ничего не нашлось.
    </p>
  </div>
</template>
