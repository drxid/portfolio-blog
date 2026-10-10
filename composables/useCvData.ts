// Типы резюме и доступ к его данным.
// Сами данные лежат в private/cv.ts (файл в .gitignore, репозиторий публичный) и попадают
// только в HTML и payload страницы /cv, которую nginx закрывает паролем. Каталог /_nuxt/
// открыт всем, поэтому в клиентских чанках их быть не должно — публичным страницам
// хватает cvContacts.

export interface CvExperience {
  role: string
  company: string
  url?: string
  period: string
  // Даты для таймлайна (YYYY-MM); без end — работаю по настоящее время
  start: string
  end?: string
  // Личный проект, а не найм — показывается последним, отдельно от остального опыта
  personal?: boolean
  summary: string
  highlights: string[]
  stack: string[]
  // Необязательная всплывающая подсказка на части роли (term выделяется в role)
  tooltipTerm?: string
  tooltip?: string
}

export interface CvSkillGroup {
  label: string
  items: string[]
}

export interface CvData {
  name: string
  title: string
  location: string
  email: string
  site: string
  github: string
  telegram: string
  // Показывается только в PDF
  salary?: string
  about: string[]
  languages: { name: string; level: string }[]
  education: { place: string; faculty: string; period: string }[]
  skills: CvSkillGroup[]
  experience: CvExperience[]
}

export const cvContacts = {
  name: 'Вадим Бухлов',
  title: 'JS-разработчик',
  email: 'work@drxid.ru',
}

const emptyCv: CvData = {
  ...cvContacts,
  location: '',
  site: '',
  github: '',
  telegram: '',
  about: [],
  languages: [],
  education: [],
  skills: [],
  experience: [],
}

export async function useCvData(): Promise<CvData> {
  const { data } = await useAsyncData('cv', async () => {
    if (!import.meta.server) return null
    // Через glob, чтобы сборка без приватного файла — из публичного репозитория — не падала
    const load = Object.values(import.meta.glob<{ cv: CvData }>('../private/cv.ts'))[0]
    return load ? (await load()).cv : emptyCv
  })
  if (!data.value) throw createError({ statusCode: 401, statusMessage: 'Нужен пароль' })
  return data.value
}
