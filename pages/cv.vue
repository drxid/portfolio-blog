<script setup lang="ts">
definePageMeta({ wide: true })

const cv = useCvData()
const { generate, generating } = useGenerateCvPdf()

useSeoMeta({
  title: `${cv.name} — Резюме`,
  description: `Резюме: ${cv.title}. Опыт, навыки и контакты.`,
  ogTitle: `${cv.name} — Резюме`,
  ogDescription: `${cv.title}. Опыт, навыки и контакты.`,
})

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
  <div class="grid gap-12 lg:grid-cols-[1fr_320px]">
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
        <ExperienceTimeline class="mt-4 rounded-2xl border border-border p-5" />
        <div class="mt-8 space-y-4">
          <template v-for="(exp, i) in cv.experience" :key="i">
            <div
              v-if="exp.personal && !cv.experience[i - 1]?.personal"
              class="flex items-center gap-3 pt-4"
            >
              <span class="text-xs font-medium uppercase tracking-wider text-muted">Собственный проект</span>
              <hr class="divider-dashed flex-1" />
            </div>
            <article :id="experienceId(exp)" class="-mx-4 scroll-mt-6 rounded-2xl px-4 py-3">
              <header class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-lg font-bold leading-snug">
                    <template v-for="(part, pi) in roleParts(exp)" :key="pi">
                      <Tooltip v-if="part.tip && exp.tooltip" :text="exp.tooltip">{{ part.text }}</Tooltip>
                      <span v-else>{{ part.text }}</span>
                    </template>
                  </h3>
                  <p class="mt-1 text-sm text-muted">{{ exp.period }}</p>
                </div>
                <!-- Сайт компании — иконкой, домен виден в подсказке -->
                <a
                  v-if="exp.url"
                  :href="exp.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  :title="exp.company"
                  :aria-label="`Сайт: ${exp.company}`"
                  class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-[var(--accent-to)] hover:text-[var(--accent-to)]"
                >
                  <Icon name="ph:globe-simple" class="h-4 w-4" />
                </a>
              </header>
              <p class="mt-3 text-fg/90">{{ exp.summary }}</p>
              <ul class="mt-3 space-y-2">
                <li v-for="(h, hi) in exp.highlights" :key="hi" class="flex gap-2.5 text-fg/85">
                  <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-from)]" />
                  <span>{{ h }}</span>
                </li>
              </ul>
              <div class="mt-3 flex flex-wrap gap-1.5">
                <span v-for="s in exp.stack" :key="s" class="tag">{{ s }}</span>
              </div>
            </article>
          </template>
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
      <div>
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
          <div class="mt-4 space-y-4">
            <section v-for="g in cv.skills" :key="g.label">
              <h3 class="text-sm font-semibold">{{ g.label }}</h3>
              <div class="mt-2 flex flex-wrap gap-1">
                <span v-for="item in g.items" :key="item" class="tag">{{ item }}</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

