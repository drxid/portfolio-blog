// Ключевые навыки в порядке как в оригинальном репозитории drxid.
// icon — имя иконки (@nuxt/icon), color — бренд-цвет при наведении.
// Не-брендовые пункты используют акцентный цвет темы.

export interface Skill {
  label: string
  icon: string
  color: string
}

const ACCENT = 'var(--accent-to)'

export const SKILLS: Skill[] = [
  { label: 'Web programming', icon: 'ph:code-duotone', color: ACCENT },
  { label: 'Web design', icon: 'ph:pen-nib-duotone', color: ACCENT },
  { label: 'HTML5', icon: 'simple-icons:html5', color: '#E34F26' },
  { label: 'CSS', icon: 'simple-icons:css3', color: '#1572B6' },
  { label: 'JavaScript ES6+', icon: 'simple-icons:javascript', color: '#F7DF1E' },
  { label: 'Vue 3', icon: 'simple-icons:vuedotjs', color: '#4FC08D' },
  { label: 'Composition API', icon: 'simple-icons:vuedotjs', color: '#4FC08D' },
  { label: 'Pinia', icon: 'simple-icons:pinia', color: '#FFD859' },
  { label: 'Vuex', icon: 'simple-icons:vuedotjs', color: '#4FC08D' },
  { label: 'Vue Router', icon: 'simple-icons:vuedotjs', color: '#4FC08D' },
  { label: 'Nuxt 3', icon: 'simple-icons:nuxt', color: '#00DC82' },
  { label: 'Vite', icon: 'simple-icons:vite', color: '#646CFF' },
  { label: 'Axios', icon: 'simple-icons:axios', color: '#5A29E4' },
  { label: 'PWA', icon: 'simple-icons:pwa', color: '#5A0FC8' },
  { label: 'React (pet projects)', icon: 'simple-icons:react', color: '#61DAFB' },
  { label: 'Svelte (pet projects)', icon: 'simple-icons:svelte', color: '#FF3E00' },
  { label: 'Sass', icon: 'simple-icons:sass', color: '#CC6699' },
  { label: 'SCSS', icon: 'simple-icons:sass', color: '#CC6699' },
  { label: 'Node.js', icon: 'simple-icons:nodedotjs', color: '#5FA04E' },
  { label: 'Express', icon: 'simple-icons:express', color: ACCENT },
  { label: 'REST API', icon: 'ph:plugs-connected-duotone', color: ACCENT },
  { label: 'JWT Tokens', icon: 'simple-icons:jsonwebtokens', color: '#FB015B' },
  { label: 'MongoDB', icon: 'simple-icons:mongodb', color: '#47A248' },
  { label: 'Auth', icon: 'ph:lock-key-duotone', color: ACCENT },
  { label: 'GIT', icon: 'simple-icons:git', color: '#F05032' },
  { label: 'Postman', icon: 'simple-icons:postman', color: '#FF6C37' },
  { label: 'Docker', icon: 'simple-icons:docker', color: '#2496ED' },
  { label: 'CI/CD', icon: 'ph:infinity-duotone', color: ACCENT },
  { label: 'Adobe soft', icon: 'simple-icons:adobe', color: '#FF0000' },
  { label: 'Figma', icon: 'simple-icons:figma', color: '#F24E1E' },
  // Тестирование
  { label: 'Playwright', icon: 'simple-icons:playwright', color: '#2EAD33' },
  // AI
  { label: 'Claude Code', icon: 'simple-icons:claude', color: '#D97757' },
  { label: 'Cursor', icon: 'simple-icons:cursor', color: ACCENT },
  { label: 'Anthropic API', icon: 'simple-icons:anthropic', color: '#D97757' },
  { label: 'AI Agents', icon: 'ph:robot-duotone', color: ACCENT },
  { label: 'MCP', icon: 'ph:graph-duotone', color: ACCENT },
  { label: 'RAG', icon: 'ph:brain-duotone', color: ACCENT },
  { label: 'Prompt Engineering', icon: 'ph:sparkle-duotone', color: ACCENT },
  { label: 'LangChain', icon: 'simple-icons:langchain', color: ACCENT },
  { label: 'n8n', icon: 'simple-icons:n8n', color: '#EA4B71' },
]

