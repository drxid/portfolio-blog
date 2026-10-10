<script setup lang="ts">
const cv = useCvData()
const { generate, generating } = useGenerateCvPdf()

useSeoMeta({
  title: `${cv.name} — Резюме`,
  description: `Резюме: ${cv.title}. Опыт, навыки и контакты.`,
  ogTitle: `${cv.name} — Резюме`,
  ogDescription: `${cv.title}. Опыт, навыки и контакты.`,
})

const expanded = ref(false)

// Разбивает роль на части, выделяя term для всплывающей подсказки
function roleParts(exp: (typeof cv.experience)[number]) {
  if (!exp.tooltipTerm || !exp.role.includes(exp.tooltipTerm)) {
    return [{ text: exp.role, tip: false }]
  }
  const [before, after] = exp.role.split(exp.tooltipTerm)
  return [
    { text: before, tip: false },
    { text: exp.tooltipTerm, tip: true },
    { text: after, tip: false },
  ]
}

async function download() {
  await generate(cv)
}
</script>

<template>
  <div class="grid gap-12 lg:grid-cols-[1fr_300px]">
    <!-- Основная колонка -->
    <div class="order-2 lg:order-1">
      <!-- О себе -->
      <section class="anim">
        <h2 class="text-2xl font-bold tracking-tight">О себе</h2>
        <div class="mt-4 space-y-3 text-[1.02rem] leading-relaxed text-fg/90">
          <p v-for="(p, i) in cv.about" :key="i">{{ p }}</p>
        </div>
      </section>

      <!-- Опыт работы -->
      <section class="anim mt-12" style="animation-delay: 80ms">
        <h2 class="text-2xl font-bold tracking-tight">Опыт работы</h2>
        <div class="mt-6 space-y-10">
          <article v-for="(exp, i) in cv.experience" :key="i">
            <h3 class="text-lg font-bold">
              <template v-for="(part, pi) in roleParts(exp)" :key="pi">
                <Tooltip v-if="part.tip && exp.tooltip" :text="exp.tooltip">{{ part.text }}</Tooltip>
                <span v-else>{{ part.text }}</span>
              </template>
              <span v-if="exp.company" class="text-muted">| {{ exp.company }}</span>
            </h3>
            <span class="tag mt-2">{{ exp.period }}</span>
            <p class="mt-3 text-fg/90">{{ exp.summary }}</p>
            <ul class="mt-3 space-y-2">
              <li
                v-for="(h, hi) in exp.highlights"
                :key="hi"
                class="flex gap-2.5 text-fg/85"
              >
                <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-from)]" />
                <span>{{ h }}</span>
              </li>
            </ul>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <span v-for="s in exp.stack" :key="s" class="tag">{{ s }}</span>
            </div>
          </article>
        </div>
      </section>

      <!-- Языки и образование -->
      <section class="anim mt-12 grid gap-8 sm:grid-cols-2" style="animation-delay: 120ms">
        <div>
          <h2 class="text-lg font-bold tracking-tight">Языки</h2>
          <ul class="mt-3 space-y-1 text-fg/90">
            <li v-for="l in cv.languages" :key="l.name">
              {{ l.name }} — <span class="text-muted">{{ l.level }}</span>
            </li>
          </ul>
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight">Образование</h2>
          <ul class="mt-3 space-y-1 text-fg/90">
            <li v-for="(e, i) in cv.education" :key="i">
              {{ e.place }} · <span class="text-muted">{{ e.faculty }}</span>
            </li>
          </ul>
        </div>
      </section>
    </div>

    <!-- Сайдбар -->
    <aside class="anim order-1 lg:order-2" style="animation-delay: 60ms">
      <div class="lg:sticky lg:top-8">
        <!-- Аватар + контакты -->
        <div class="flex flex-col items-center text-center lg:items-end lg:text-right">
          <Avatar src="/avatar.jpg" :size="128" />
          <h1 class="mt-4 text-2xl font-bold tracking-tight">{{ cv.name }}</h1>
          <p class="text-sm text-muted">{{ cv.title }}</p>

          <ul class="mt-4 space-y-1.5 text-sm">
            <li>
              <a :href="`mailto:${cv.email}`" class="inline-flex items-center gap-1.5 text-fg/80 transition-colors hover:text-[var(--accent-to)]">
                {{ cv.email }} <Icon name="ph:envelope-simple" class="h-4 w-4" />
              </a>
            </li>
            <li>
              <a :href="`https://${cv.github}`" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-fg/80 transition-colors hover:text-[var(--accent-to)]">
                {{ cv.github }} <Icon name="ph:github-logo" class="h-4 w-4" />
              </a>
            </li>
            <li>
              <a :href="`https://${cv.telegram}`" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-fg/80 transition-colors hover:text-[var(--accent-to)]">
                {{ cv.telegram }} <Icon name="ph:telegram-logo" class="h-4 w-4" />
              </a>
            </li>
            <li>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-[var(--accent-to)] disabled:opacity-60"
                :disabled="generating"
                @click="download"
              >
                {{ generating ? 'Готовлю PDF…' : 'Скачать резюме' }}
                <Icon
                  :name="generating ? 'ph:spinner-gap-bold' : 'ph:download-simple'"
                  class="h-4 w-4"
                  :class="{ 'animate-spin': generating }"
                />
              </button>
            </li>
          </ul>
        </div>

        <!-- Скиллы -->
        <div class="mt-8">
          <h2 class="text-lg font-bold tracking-tight">Скиллы</h2>
          <div class="mt-3">
            <div
              v-for="(g, i) in cv.skills"
              :key="g.label"
              class="py-2.5"
              :class="i > 0 ? 'border-t border-dashed border-border' : ''"
            >
              <p class="text-sm">
                <span class="font-medium">{{ g.label }}:</span>
                <span class="text-muted"> {{ g.items.join(', ') }}</span>
              </p>
            </div>

            <Transition name="expand">
              <div v-if="expanded">
                <div
                  v-for="g in cv.extraSkills"
                  :key="g.label"
                  class="border-t border-dashed border-border py-2.5"
                >
                  <p class="text-sm">
                    <span class="font-medium">{{ g.label }}:</span>
                    <span class="text-muted"> {{ g.items.join(', ') }}</span>
                  </p>
                </div>
              </div>
            </Transition>
          </div>

          <button
            type="button"
            class="mt-4 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-all hover:border-[var(--accent-to)] hover:bg-card"
            @click="expanded = !expanded"
          >
            {{ expanded ? 'Свернуть список' : 'Показать расширенный список технологий' }}
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
