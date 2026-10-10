<script setup lang="ts">
const props = defineProps<{ title: string; text?: string }>()

const shared = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

async function share() {
  const url = window.location.href
  if (navigator.share) {
    try {
      await navigator.share({ title: props.title, text: props.text, url })
      return
    } catch {
      // пользователь отменил — ничего не делаем
      return
    }
  }
  // fallback: копируем ссылку
  try {
    await navigator.clipboard.writeText(url)
    shared.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => (shared.value = false), 1800)
  } catch {
    /* noop */
  }
}

onBeforeUnmount(() => timer && clearTimeout(timer))
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
    @click="share"
  >
    <Icon name="ph:share-network" class="h-4 w-4" />
    <span>{{ shared ? 'Скопировано' : 'Поделиться' }}</span>
  </button>
</template>
