// Единый источник данных резюме — используется и страницей /cv, и генератором PDF.
// Правь данные здесь — они автоматически попадут и на страницу, и в PDF.

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

// Приватный опыт из private/experience.ts (файл в .gitignore). Через glob,
// чтобы сборка без этого файла — например, из публичного репозитория — не падала.
const privateModules = import.meta.glob<{ default: CvExperience[] }>('../private/experience.ts', {
  eager: true,
})
const privateExperience = Object.values(privateModules).flatMap((m) => m.default)

// Порядок опыта: найм перед личными проектами, затем текущие места работы,
// внутри групп — от нового к старому
function byRecency(a: CvExperience, b: CvExperience) {
  if (!a.personal !== !b.personal) return a.personal ? 1 : -1
  if (!a.end !== !b.end) return a.end ? 1 : -1
  return b.start.localeCompare(a.start)
}

export function useCvData(): CvData {
  return {
    name: 'Вадим Бухлов',
    title: 'JS-разработчик',
    location: 'Россия',
    email: 'work@drxid.ru',
    site: 'drxid.ru',
    github: 'github.com/drxid',
    telegram: 't.me/drxid',
    salary: '400 000 – 450 000 ₽',
    about: [
      'Меня зовут Вадим 👋. Я работаю разработчиком JavaScript с акцентом на фронтенд-разработку. У меня есть страсть к проектированию макетов и интерфейсов веб-сайтов. Мне нравится создавать визуально привлекательные дизайны, которые улучшают пользовательский опыт. Помимо разработки фронтенда, у меня также есть опыт в разработке бэкенда.',
      'Я стремлюсь создавать уникальные, надёжные и эффективные приложения, которые отвечают современным потребностям пользователей; стараюсь постоянно учиться и оставаться в курсе новейших технологий и передового опыта в области веб-разработки.',
    ],
    languages: [
      { name: 'Русский', level: 'родной' },
      { name: 'Английский', level: 'B1 — Intermediate' },
    ],
    education: [
      {
        place: 'ВВГУ',
        faculty: 'Институт информационных технологий, информационные системы и технологии',
        period: '—',
      },
    ],
    skills: [
      {
        label: 'Frontend',
        items: [
          'TypeScript',
          'JavaScript ES6+',
          'Vue 3',
          'Composition API',
          'Nuxt',
          'Pinia',
          'TanStack Query',
          'Vue Router',
          'VueUse',
          'Vite',
          'Tailwind CSS',
          'SCSS',
          'shadcn-vue',
          'Nuxt UI',
          'i18n',
          'PWA',
          'Web Audio API',
          'Vuex',
          'Axios',
          'HTML5',
          'CSS',
        ],
      },
      {
        label: 'Backend',
        items: [
          'Node.js',
          'Nuxt Server (Nitro)',
          'Express',
          'REST API',
          'WebSocket',
          'PostgreSQL',
          'Drizzle ORM',
          'Prisma',
          'Redis',
          'MongoDB',
          'S3',
          'OAuth',
          'JWT',
          'Zod',
        ],
      },
      {
        label: 'AI',
        items: [
          'Claude Code',
          'Cursor',
          'Anthropic API',
          'AI Agents',
          'MCP',
          'RAG',
          'Prompt Engineering',
          'LangChain',
          'n8n',
        ],
      },
      {
        label: 'Тестирование и качество',
        items: ['Vitest', 'Playwright', 'Testing Library', 'Storybook', 'ESLint', 'Sentry'],
      },
      {
        label: 'Десктоп',
        items: ['Tauri 2', 'Rust', 'Svelte 5', 'React'],
      },
      {
        label: 'DevOps и инструменты',
        items: ['Docker', 'Docker Compose', 'nginx', 'Linux', 'CI/CD', 'Git', 'pnpm', 'Postman'],
      },
      {
        label: 'Дизайн',
        items: ['Figma', 'Adobe soft'],
      },
    ],
    experience: [
      ...privateExperience,
      {
        role: 'Frontend JS-разработчик · РЖД (ADT)',
        tooltipTerm: 'ADT',
        tooltip:
          'Agile Development Team — филиал R&D РЖД. Не общий отдел, а инкубатор новых проектов с современным подходом к разработке.',
        company: 'rzd.ru',
        url: 'https://rzd.ru',
        period: 'Октябрь 2023 — по настоящее время',
        start: '2023-10',
        summary:
          'Работа над большим портфелем продуктов РЖД — от поддержки и развития существующих сервисов до запуска новых разделов и технического руководства командами.',
        highlights: [
          'На ряде проектов был техническим лидером: выбирал стек, настраивал линтеры, CI/CD-пайплайны и процессы разработки, задавал стандарты качества кода.',
          'Разрабатывал новые разделы со сложными таблицами и развитыми системами фильтров для работы с большими объёмами данных; параллельно поддерживал и развивал действующие проекты.',
          'Участвовал в создании цифрового ассистента портала — аналога «Робота Макса» с Госуслуг, но для РЖД: ассистент отвечал на вопросы по компании и всем её подразделениям по всей России.',
          'В паре с другим лидом разработал сложный интерактивный редактор мероприятий РЖД: real-time на веб-сокетах, drag-and-drop, система пересечений и валидаций по времени, контроль отсутствия аффилированности между участниками, генерация пакета сопроводительных документов с индивидуальным расписанием и рассылка PDF по разным каналам.',
        ],
        stack: ['Vue 3', 'Nuxt 3', 'TypeScript', 'Pinia', 'WebSockets', 'Drag-and-Drop', 'CI/CD', 'PDF'],
      },
      {
        role: 'Основатель и Fullstack-разработчик · Playloop',
        personal: true,
        tooltipTerm: 'Основатель',
        tooltip: 'Собственный коммерческий проект (ИП). Единственный разработчик: идея, продукт, дизайн, фронтенд, бэкенд и инфраструктура.',
        company: 'playloop.ru',
        url: 'https://playloop.ru',
        period: 'Апрель 2022 — по настоящее время',
        start: '2022-04',
        summary:
          'Основал и в одиночку развиваю коммерческий продукт «Playloop» — PWA-приложение, звуковой компаньон, который создаёт погружающее аудио-сопровождение и атмосферу для настольных игр. Отвечаю за всё: идею и развитие продукта, дизайн, фронтенд, бэкенд и инфраструктуру.',
        highlights: [
          'Полностью адаптивный интерфейс — одинаково удобно на компьютере и смартфоне; звук продолжает играть даже при заблокированном экране, поэтому приложением можно пользоваться прямо во время партии.',
          'Глубокое управление музыкой и звуками через браузерный Web Audio API и фоновое воспроизведение создают атмосферное аудио-окружение.',
          'Обучение голосовых моделей с помощью Python-библиотек, облачных инструментов и Microsoft Azure.',
        ],
        stack: [
          'Vue 3',
          'Vue Router',
          'Pinia',
          'Vite',
          'Axios',
          'Web Audio API',
          'Howler.js',
          'PWA',
          'Express',
          'REST API',
          'Auth',
          'MongoDB',
        ],
      },
      {
        role: 'Fullstack JS-разработчик · ООО «Спектр»',
        company: 'spektrtruck.ru',
        url: 'https://spektrtruck.ru',
        period: 'Июль 2021 — Сентябрь 2023',
        start: '2021-07',
        end: '2023-09',
        summary:
          'ООО «Спектр» занимается поставкой складской техники мировых брендов на российский рынок и сервисным обслуживанием складского оборудования.',
        highlights: [
          'Старый сайт устарел и имел низкий трафик; перезапуск с новым дизайном дал резкий рост трафика уже в первый месяц, и дальше динамика была только положительной.',
          'Переход на SPA ускорил загрузку сайта в 3 раза, а переходы между страницами — в 10 раз, что заметно улучшило пользовательский опыт.',
          'Единый фирменный стиль для всех сайтов, наружной рекламы и документов повысил доверие к бренду компании.',
          'Разработка внутренней CRM упростила управление и обработку сервисных заявок; интеграция кабинетов менеджера по запчастям и сервис-менеджера повысила эффективность продаж за счёт автогенерации КП и документов.',
        ],
        stack: [
          'Vue 3',
          'Vue Router',
          'Pinia',
          'Vite',
          'Express',
          'REST API',
          'Auth',
          'MongoDB',
        ],
      },
    ].sort(byRecency),
  }
}
