<script setup lang="ts">
// «Декодирующая» анимация бренда: при наведении буквы прокручиваются
// через случайные глифы и собираются слева-направо с акцентной подсветкой.
const TARGET = 'drxid'
const CHARS = '!<>-_\\/[]{}=+*^?#0123456789xkz$&%@'

interface Cell {
  ch: string
  on: boolean
}

const cells = ref<Cell[]>(TARGET.split('').map((ch) => ({ ch, on: false })))
const reduced = ref(false)
let raf = 0
let frame = 0

const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)]

function scramble() {
  if (reduced.value) return
  cancelAnimationFrame(raf)
  frame = 0
  const queue = TARGET.split('').map((to, i) => ({
    to,
    start: i * 3 + Math.floor(Math.random() * 6),
    end: i * 3 + 16 + Math.floor(Math.random() * 10),
  }))

  const tick = () => {
    let done = 0
    cells.value = queue.map((q) => {
      if (frame >= q.end) {
        done++
        return { ch: q.to, on: false }
      }
      if (frame >= q.start) return { ch: rand(), on: true }
      return { ch: q.to, on: false }
    })
    frame++
    if (done < queue.length) raf = requestAnimationFrame(tick)
  }
  tick()
}

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <span
    class="font-brand block cursor-pointer select-none text-4xl leading-none sm:text-5xl"
    aria-label="drxid"
    @mouseenter="scramble"
    @focus="scramble"
  >
    <span
      v-for="(c, i) in cells"
      :key="i"
      class="letter inline-block"
      :class="{ 'is-on': c.on }"
      aria-hidden="true"
      >{{ c.ch }}</span
    >
  </span>
</template>

<style scoped>
.letter {
  transition: color 0.12s ease, transform 0.12s ease;
  will-change: transform;
}
@media (prefers-reduced-motion: no-preference) {
  .letter.is-on {
    color: var(--accent-to);
    transform: translateY(-3px) rotate(-4deg);
  }
}
</style>
