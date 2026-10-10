<script setup lang="ts">
interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

const props = defineProps<{ links: TocLink[] }>()

// Разворачиваем дерево в плоский список (H2 + H3)
const flat = computed(() => {
  const out: TocLink[] = []
  const walk = (items: TocLink[]) => {
    for (const l of items) {
      out.push(l)
      if (l.children?.length) walk(l.children)
    }
  }
  walk(props.links ?? [])
  return out
})

const activeId = ref('')
let observer: IntersectionObserver | null = null

onMounted(() => {
  const headings = flat.value
    .map((l) => document.getElementById(l.id))
    .filter((el): el is HTMLElement => !!el)

  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) activeId.value = e.target.id
      }
    },
    { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
  )
  headings.forEach((h) => observer!.observe(h))
})

onBeforeUnmount(() => observer?.disconnect())

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }
}
</script>

<template>
  <nav v-if="flat.length" class="text-sm">
    <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Содержание</p>
    <ul class="space-y-1.5 border-l border-border">
      <li v-for="l in flat" :key="l.id" :style="{ paddingLeft: (l.depth - 2) * 12 + 12 + 'px' }">
        <a
          :href="`#${l.id}`"
          class="-ml-px block border-l-2 py-0.5 transition"
          :class="
            activeId === l.id
              ? 'border-[var(--accent-to)] text-fg'
              : 'border-transparent text-muted hover:text-fg'
          "
          @click.prevent="scrollTo(l.id)"
        >
          {{ l.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>
