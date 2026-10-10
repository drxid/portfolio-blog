<script setup lang="ts">
const { serif, toggle: toggleSerif } = useSerif()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const shared = ref(false)

async function share() {
  const url = typeof window !== 'undefined' ? window.location.href : 'https://drxid.ru'
  const data = { title: document.title || 'drxid', text: 'Личная страница drxid', url }
  if (navigator.share) {
    try {
      await navigator.share(data)
    } catch {
      /* пользователь отменил */
    }
    return
  }
  try {
    await navigator.clipboard.writeText(url)
    shared.value = true
    setTimeout(() => (shared.value = false), 1800)
  } catch {
    /* noop */
  }
}

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onEsc)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onEsc)
})
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="btn-dashed"
      :class="{ 'border-solid bg-card': open }"
      aria-label="Настройки"
      title="Настройки"
      @click="open = !open"
    >
      <Icon
        name="ph:gear-six-duotone"
        class="h-5 w-5 transition-transform duration-300"
        :class="{ 'rotate-90': open }"
      />
    </button>

    <Transition name="pop">
      <div
        v-if="open"
        class="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-border bg-bg p-2 shadow-lg shadow-black/5"
      >
        <p class="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-muted">
          Настройки
        </p>

        <!-- Тумблер серифа -->
        <ClientOnly>
          <button
            type="button"
            class="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-card"
            @click="toggleSerif"
          >
            <Icon name="ph:text-aa-duotone" class="h-4 w-4 shrink-0 text-muted" />
            <span class="whitespace-nowrap">Серифный шрифт</span>
            <span
              class="ml-auto flex h-5 w-9 items-center rounded-full p-0.5 transition-colors"
              :class="serif ? 'bg-[var(--accent-to)]' : 'bg-border'"
            >
              <span
                class="h-4 w-4 rounded-full bg-white shadow transition-transform"
                :class="serif ? 'translate-x-4' : 'translate-x-0'"
              />
            </span>
          </button>
        </ClientOnly>

        <!-- Поделиться -->
        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-card"
          @click="share"
        >
          <Icon name="ph:share-network-duotone" class="h-4 w-4 text-muted" />
          <span>{{ shared ? 'Ссылка скопирована' : 'Поделиться' }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.94) translateY(-4px);
}
</style>
