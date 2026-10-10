<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'DEV' })

// Спутники: угол (deg) и радиус от центра
const cx = 400
const cy = 180
const nodes = [
  { a: 0, r: 300, fill: true },
  { a: 32, r: 250, fill: false },
  { a: 70, r: 300, fill: true },
  { a: 110, r: 235, fill: false },
  { a: 150, r: 300, fill: true },
  { a: 180, r: 250, fill: false },
  { a: 210, r: 300, fill: true },
  { a: 252, r: 235, fill: false },
  { a: 290, r: 300, fill: true },
  { a: 326, r: 250, fill: false },
].map((n, i) => {
  const rad = (n.a * Math.PI) / 180
  return {
    ...n,
    i,
    x: +(cx + Math.cos(rad) * n.r * 1.0).toFixed(1),
    y: +(cy + Math.sin(rad) * n.r * 0.42).toFixed(1),
    delay: (i * 0.18).toFixed(2),
  }
})
</script>

<template>
  <figure class="my-8 select-none">
    <svg viewBox="0 0 800 360" class="w-full text-fg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- связи -->
      <g class="text-muted" stroke="currentColor" stroke-width="1" opacity="0.5">
        <line
          v-for="n in nodes"
          :key="'l' + n.i"
          :x1="cx"
          :y1="cy"
          :x2="n.x"
          :y2="n.y"
          stroke-dasharray="3 5"
          class="flow"
          :style="{ animationDelay: n.delay + 's' }"
        />
      </g>

      <!-- спутники -->
      <g>
        <g v-for="n in nodes" :key="'n' + n.i" class="pulse" :style="{ animationDelay: n.delay + 's' }">
          <circle :cx="n.x" :cy="n.y" r="7" stroke="currentColor" stroke-width="1.5" :fill="n.fill ? 'currentColor' : 'transparent'" />
          <circle v-if="n.fill" :cx="n.x" :cy="n.y" r="2.5" fill="var(--bg)" />
        </g>
      </g>

      <!-- центр -->
      <g>
        <circle :cx="cx" :cy="cy" r="40" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 5" class="spin" style="transform-origin: 400px 180px" />
        <circle :cx="cx" :cy="cy" r="30" fill="currentColor" />
        <text :x="cx" :y="cy + 4" text-anchor="middle" class="font-brand" font-size="13" letter-spacing="1" fill="var(--bg)">
          {{ label }}
        </text>
      </g>
    </svg>
  </figure>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .flow {
    animation: flow 2.4s linear infinite;
  }
  @keyframes flow {
    to {
      stroke-dashoffset: -16;
    }
  }
  .pulse {
    animation: pulse 3s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 0.45;
    }
    50% {
      opacity: 1;
    }
  }
  .spin {
    animation: spin 22s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
