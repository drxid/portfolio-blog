<script setup lang="ts">
import { isDone, type ChecklistItem } from '~/composables/useChecklist'

const props = defineProps<{ item: ChecklistItem }>()

const done = computed(() => isDone(props.item))
// Айтемы с оценкой ниже 3 — приглушаем
const faded = computed(() => typeof props.item.rating === 'number' && props.item.rating < 3)
</script>

<template>
  <li
    class="rounded-xl border border-border bg-card p-4 transition"
    :class="faded ? 'opacity-40 hover:opacity-100' : ''"
  >
    <div class="flex items-start gap-3">
      <Icon
        :name="done ? 'ph:check-circle-duotone' : 'ph:circle-dashed'"
        class="mt-0.5 h-5 w-5 shrink-0"
        :class="done ? 'text-[var(--accent-from)]' : 'text-muted'"
      />
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-medium leading-snug">
            <a
              v-if="item.link"
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-[var(--accent-to)]"
            >
              {{ item.title }}
              <Icon name="ph:arrow-up-right-bold" class="inline h-3.5 w-3.5 align-baseline" />
            </a>
            <span v-else>{{ item.title }}</span>
          </h3>

          <span
            v-if="typeof item.rating === 'number'"
            class="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs font-medium"
            :title="`Оценка: ${item.rating}/10`"
          >
            {{ item.rating }}/10
          </span>
        </div>

        <p v-if="item.text" class="mt-1 text-sm text-muted">{{ item.text }}</p>

        <div
          class="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted"
        >
          <span v-for="t in item.tags" :key="t" class="tag">{{ t }}</span>
          <span class="ml-auto">{{ formatDate(item.date) }}</span>
        </div>
      </div>
    </div>
  </li>
</template>
