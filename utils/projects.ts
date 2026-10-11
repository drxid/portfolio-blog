// Проекты: крупные показываются карточками (и на главной), мелкие — компактным списком на /projects.
// url — сайт или демо, repo — открытый репозиторий (для приватных не указываем).

export interface Project {
  slug: string
  title: string
  description: string
  icon: string
  stack: string[]
  url?: string
  repo?: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'playloop',
    title: 'Playloop',
    description:
      'Аудио-компаньон для настольных игр: озвучка сюжета, фоновые звуки и музыка. Готовые кампании для «Ужаса Аркхэма», Fallout, «Робинзона Крузо» и миксер, в котором собирается своя атмосфера.',
    icon: 'ph:headphones-duotone',
    stack: ['Vue 3', 'Pinia', 'Vite', 'Tailwind', 'Howler'],
    url: 'https://playloop.ru',
  },
  {
    slug: 'bggriddb',
    title: 'BGGridDB',
    description:
      'Открытая база обложек, логотипов, иконок и фонов для настольных игр с публичным API. Загрузка с премодерацией, OAuth, каталог и профили — по мотивам SteamGridDB.',
    icon: 'ph:grid-four-duotone',
    stack: ['Nuxt', 'PostgreSQL', 'Drizzle', 'Redis', 'S3'],
    url: 'https://bggriddb.ru',
  },
  {
    slug: 'vpnkit',
    title: 'VPNkit',
    description:
      'Личный кабинет самодельного VPN: доступы на устройства с пошаговой настройкой, новости и поддержка, плюс админка для управления пользователями и серверами.',
    icon: 'ph:shield-check-duotone',
    stack: ['Nuxt', 'PostgreSQL', 'Drizzle', 'Redis', 'Web Push'],
    url: 'https://vpnkit.ru',
  },
]

export const SMALL_PROJECTS: Project[] = [
  {
    slug: 'prud100',
    title: 'Сотый пруд',
    description: 'Лендинг ресторана на воде и генератор коммерческих предложений для банкетов с админкой.',
    icon: 'ph:fork-knife-duotone',
    stack: ['Nuxt', 'Nuxt UI', 'Prisma'],
    url: 'https://prud100.ru',
  },
  {
    slug: 'print-pulse',
    title: 'Print Pulse',
    description: 'Трей-приложение для Windows, которое не даёт струйному принтеру засохнуть: печать по расписанию, уровень чернил, тихие часы.',
    icon: 'ph:printer-duotone',
    stack: ['Tauri', 'Rust', 'Svelte'],
    repo: 'https://github.com/drxid/print-pulse',
  },
  {
    slug: 'cursor-jiggler',
    title: 'Cursor Jiggler',
    description: 'Маленький кроссплатформенный «шевелитель» мыши: двигает курсор только когда вы бездействуете.',
    icon: 'ph:cursor-click-duotone',
    stack: ['Tauri', 'Rust', 'Svelte'],
    repo: 'https://github.com/drxid/cursor-jiggler',
  },
  {
    slug: 'stickah',
    title: 'Stickah',
    description: 'Генератор печатных наклеек для банок с табаком: поиск вкусов, выбор дизайна и готовый лист A4.',
    icon: 'ph:sticker-duotone',
    stack: ['Vue 3', 'TypeScript', 'Pinia'],
    url: 'https://drxid.github.io/stickah/',
    repo: 'https://github.com/drxid/stickah',
  },
  {
    slug: 'big-picture-vpn',
    title: 'Big Picture VPN',
    description: 'Включает и выключает AmneziaWG VPN с геймпада прямо в Steam Big Picture — без запросов UAC.',
    icon: 'ph:game-controller-duotone',
    stack: ['Tauri', 'Rust', 'Vue 3'],
    repo: 'https://github.com/drxid/big-picture-vpn',
  },
]

/** Короткий адрес для подписи ссылки: https://playloop.ru → playloop.ru */
export function prettyUrl(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
