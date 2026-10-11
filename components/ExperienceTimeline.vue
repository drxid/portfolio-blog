<script setup lang="ts">
const cv = useCvData()

// Месяцы считаем как целые индексы: год * 12 + (месяц − 1)
function toMonth(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + m - 1
}

// «Сейчас» фиксируем на сервере и передаём клиенту через payload,
// иначе при гидрации пререндеренной страницы полосы разъедутся
const now = useState('timeline-now', () => {
  const d = new Date()
  return d.getFullYear() * 12 + d.getMonth()
})

function plural(n: number, forms: [string, string, string]) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]
  return forms[2]
}

function duration(months: number) {
  const y = Math.floor(months / 12)
  const m = months % 12
  const parts: string[] = []
  if (y) parts.push(`${y} ${plural(y, ['год', 'года', 'лет'])}`)
  if (m) parts.push(`${m} ${plural(m, ['месяц', 'месяца', 'месяцев'])}`)
  return parts.join(' ')
}

// Порядок как в резюме: текущие места работы сверху, от нового к старому
const rows = computed(() =>
  cv.experience.map((exp) => {
    const from = toMonth(exp.start)
    // Конец включительно: полоса доходит до конца последнего месяца
    const to = (exp.end ? toMonth(exp.end) : now.value) + 1
    const [role, org] = exp.role.split(' · ')
    return { exp, role, org: org ?? exp.company, from, to, current: !exp.end }
  }),
)

// Шкала: с января первого года до конца текущего — справа остаётся запас под точку «сейчас»
const rangeFrom = computed(() => Math.floor(Math.min(...rows.value.map((r) => r.from)) / 12) * 12)
const rangeTo = computed(() => (Math.floor(now.value / 12) + 1) * 12)
const pos = (month: number) => ((month - rangeFrom.value) / (rangeTo.value - rangeFrom.value)) * 100

// Градиент общий для всей шкалы: каждая полоса показывает свой отрезок,
// поэтому цвет кодирует время, а не начинается заново на каждой полосе
function barStyle(from: number, to: number) {
  const left = pos(from)
  const width = pos(to) - pos(from)
  return {
    left: `${left}%`,
    width: `${width}%`,
    backgroundSize: `${(100 / width) * 100}% 100%`,
    backgroundPositionX: width < 100 ? `${(left / (100 - width)) * 100}%` : '0',
  }
}

const years = computed(() => {
  const list: { year: number; left: number }[] = []
  for (let m = rangeFrom.value; m < rangeTo.value; m += 12) {
    list.push({ year: m / 12, left: pos(m) })
  }
  return list
})

// Клик по строке — плавный скролл к пункту в «Опыте работы» и короткая подсветка
function goTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  history.replaceState(history.state, '', `#${id}`)
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  el.classList.remove('exp-flash')
  void el.offsetWidth // перезапуск анимации при повторном клике
  el.classList.add('exp-flash')
}

// Общий стаж — объединение периодов, параллельная работа не суммируется
const total = computed(() => {
  const months = new Set<number>()
  for (const r of rows.value) for (let m = r.from; m < r.to; m++) months.add(m)
  return duration(months.size)
})
</script>

<template>
  <div>
    <p class="text-sm text-muted">Общий коммерческий стаж — {{ total }}</p>

    <div class="mt-5 space-y-4 sm:space-y-2">
      <template v-for="(r, i) in rows" :key="r.exp.start">
        <div
          v-if="r.exp.personal && !rows[i - 1]?.exp.personal"
          class="flex items-center gap-3 py-1"
        >
          <span class="text-xs text-muted">Собственный проект</span>
          <hr class="divider-dashed flex-1" />
        </div>
        <a
          :href="`#${experienceId(r.exp)}`"
          class="group -mx-2 grid gap-x-6 gap-y-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-card sm:grid-cols-[11rem_1fr] sm:items-center"
          @click.prevent="goTo(experienceId(r.exp))"
        >
          <div class="min-w-0">
            <p class="font-semibold transition-colors group-hover:text-[var(--accent-to)]">
              {{ r.org }}
            </p>
            <p class="text-sm leading-snug text-muted">{{ r.role }}</p>
          </div>

          <div>
            <div class="relative h-2 rounded-full bg-card group-hover:bg-border">
              <div
                class="absolute inset-y-0 rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]"
                :style="barStyle(r.from, r.to)"
              />
              <!-- Текущая работа: пульсирующая точка на конце полосы -->
              <span
                v-if="r.current"
                class="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2"
                :style="{ left: `${pos(r.to)}%` }"
              >
                <span
                  class="absolute inset-0 animate-ping rounded-full bg-[var(--accent-to)] opacity-60"
                />
                <span
                  class="absolute inset-0 rounded-full border-2 border-[rgb(var(--bg))] bg-[var(--accent-to)]"
                />
              </span>
            </div>
            <p class="mt-1.5 text-xs text-muted">
              {{ duration(r.to - r.from)
              }}<template v-if="r.current"> · по настоящее время</template>
            </p>
          </div>
        </a>
      </template>

      <!-- Ось лет -->
      <div class="-mx-2 grid px-2 sm:grid-cols-[11rem_1fr] sm:gap-x-6">
        <div class="hidden sm:block" />
        <div class="relative h-5 border-t border-dashed border-border">
          <span
            v-for="y in years"
            :key="y.year"
            class="absolute top-1.5 font-mono text-xs text-muted"
            :style="{ left: `${y.left}%` }"
          >
            {{ y.year }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
