import type { Ref } from 'vue'

// Возвращает прогресс прочтения (0–100) для контейнера статьи.
export function useReadingProgress(target: Ref<HTMLElement | null>) {
  const progress = ref(0)

  function update() {
    const el = target.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const viewport = window.innerHeight
    const total = rect.height - viewport
    if (total <= 0) {
      progress.value = 100
      return
    }
    const scrolled = Math.min(Math.max(-rect.top, 0), total)
    progress.value = Math.round((scrolled / total) * 100)
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
  })

  return { progress }
}
