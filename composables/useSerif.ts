// Тумблер серифного шрифта. Хранит выбор в localStorage и вешает класс на <html>.
export function useSerif() {
  const serif = useState('serif', () => false)

  function apply(v: boolean) {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('serif', v)
    }
  }

  function toggle() {
    serif.value = !serif.value
  }

  onMounted(() => {
    const saved = localStorage.getItem('drxid-serif') === '1'
    serif.value = saved
    apply(saved)
  })

  watch(serif, (v) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('drxid-serif', v ? '1' : '0')
    }
    apply(v)
  })

  return { serif, toggle }
}
