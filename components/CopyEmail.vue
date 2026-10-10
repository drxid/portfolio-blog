<script setup lang="ts">
const props = withDefaults(defineProps<{ email?: string }>(), {
  email: 'work@drxid.ru',
})

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

async function copy() {
  try {
    await navigator.clipboard.writeText(props.email)
    copied.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 1800)
  } catch {
    window.location.href = `mailto:${props.email}`
  }
}

onBeforeUnmount(() => timer && clearTimeout(timer))
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors hover:text-fg"
    @click="copy"
  >
    <span>{{ email }}</span>
    <Transition name="fade" mode="out-in">
      <Icon
        v-if="copied"
        key="ok"
        name="ph:check-bold"
        class="h-4 w-4 text-[var(--accent-from)]"
      />
      <Icon v-else key="copy" name="ph:copy" class="h-4 w-4" />
    </Transition>
  </button>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
