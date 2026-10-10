// Смена темы с плавным переходом через View Transitions API (если доступен)
export type ThemeName = 'light' | 'dark' | 'gruvbox'

export function useThemeSwitch() {
  const colorMode = useColorMode()

  function set(theme: ThemeName) {
    const apply = () => {
      colorMode.preference = theme
    }
    // @ts-expect-error — startViewTransition есть не во всех браузерах
    if (typeof document !== 'undefined' && document.startViewTransition) {
      // @ts-expect-error
      document.startViewTransition(apply)
    } else {
      apply()
    }
  }

  // Быстрый тогл свет/тьма
  function toggle() {
    set(colorMode.value === 'light' ? 'dark' : 'light')
  }

  return { colorMode, set, toggle }
}
