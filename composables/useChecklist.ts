import Fuse from 'fuse.js'

export interface ChecklistItem {
  id: string
  title: string
  text?: string
  link?: string
  tags?: string[]
  rating?: number
  done?: boolean
  category: 'articles' | 'books' | 'videos' | 'projects' | 'other'
  date: string
}

export type ChecklistCategory = ChecklistItem['category'] | 'all'
export type ChecklistSort = 'new' | 'old' | 'undone'

export const CATEGORIES: { value: ChecklistCategory; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'articles', label: 'Статьи' },
  { value: 'books', label: 'Книги' },
  { value: 'videos', label: 'Видео' },
  { value: 'projects', label: 'Проекты' },
  { value: 'other', label: 'Другое' },
]

export const SORTS: { value: ChecklistSort; label: string }[] = [
  { value: 'new', label: 'Сначала новые' },
  { value: 'old', label: 'Сначала старые' },
  { value: 'undone', label: 'Сначала неотмеченные' },
]

// Айтем считается выполненным, если done === true или есть оценка
export function isDone(item: ChecklistItem): boolean {
  return item.done === true || typeof item.rating === 'number'
}

export function useChecklist(source: Ref<ChecklistItem[]>) {
  const query = ref('')
  const category = ref<ChecklistCategory>('all')
  const sort = ref<ChecklistSort>('new')

  const fuse = computed(
    () =>
      new Fuse(source.value, {
        keys: ['title', 'text', 'tags'],
        threshold: 0.4,
        ignoreLocation: true,
      }),
  )

  // По категории (без учёта поиска) — для расчёта прогресса
  const byCategory = computed(() =>
    category.value === 'all'
      ? source.value
      : source.value.filter((i) => i.category === category.value),
  )

  const searched = computed(() => {
    const q = query.value.trim()
    const base = q ? fuse.value.search(q).map((r) => r.item) : source.value
    return category.value === 'all'
      ? base
      : base.filter((i) => i.category === category.value)
  })

  const items = computed(() => {
    const arr = [...searched.value]
    switch (sort.value) {
      case 'new':
        arr.sort((a, b) => +new Date(b.date) - +new Date(a.date))
        break
      case 'old':
        arr.sort((a, b) => +new Date(a.date) - +new Date(b.date))
        break
      case 'undone':
        arr.sort((a, b) => {
          const d = Number(isDone(a)) - Number(isDone(b))
          return d !== 0 ? d : +new Date(b.date) - +new Date(a.date)
        })
        break
    }
    return arr
  })

  // Прогресс пересчитывается по выбранной категории
  const progress = computed(() => {
    const total = byCategory.value.length
    const done = byCategory.value.filter(isDone).length
    return {
      total,
      done,
      percent: total ? Math.round((done / total) * 100) : 0,
    }
  })

  // Счётчики по категориям для бейджей в табах
  const counts = computed(() => {
    const map: Record<string, number> = { all: source.value.length }
    for (const c of CATEGORIES) {
      if (c.value === 'all') continue
      map[c.value] = source.value.filter((i) => i.category === c.value).length
    }
    return map
  })

  return { query, category, sort, items, progress, counts }
}
