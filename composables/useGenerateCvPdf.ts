import type { jsPDF as JsPDF } from 'jspdf'
import type { CvData, CvExperience, CvSkillGroup } from './useCvData'

// Кэш base64-шрифтов, чтобы не качать повторно
let fontCache: { regular: string; bold: string; italic: string } | null = null

async function fetchFontBase64(url: string): Promise<string> {
  const res = await fetch(url)
  const buf = await res.arrayBuffer()
  let binary = ''
  const bytes = new Uint8Array(buf)
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

async function loadFonts() {
  if (fontCache) return fontCache
  const [regular, bold, italic] = await Promise.all([
    fetchFontBase64('/fonts/PTSerif-Regular.ttf'),
    fetchFontBase64('/fonts/PTSerif-Bold.ttf'),
    fetchFontBase64('/fonts/PTSerif-Italic.ttf'),
  ])
  fontCache = { regular, bold, italic }
  return fontCache
}

// Эмодзи в шрифте нет — в PDF они превратились бы в мусор
const stripEmoji = (s: string) =>
  s.replace(/\s*\p{Extended_Pictographic}️?/gu, '').replace(/\s{2,}/g, ' ').trim()

type Style = 'normal' | 'bold' | 'italic'
type Rgb = [number, number, number]

const INK: Rgb = [20, 20, 20]
const MUTED: Rgb = [110, 110, 110]
const LINK: Rgb = [28, 78, 200]

// Вёрстка как у классического резюме: на первой странице основная колонка слева
// и сайдбар справа (имя, контакты, образование, навыки), дальше — во всю ширину.
const MARGIN_X = 52
const MARGIN_TOP = 50
const MARGIN_BOTTOM = 50
const COL_GAP = 26
const SIDE_W = 176
const LEADING = 1.36

// Имя файла и заголовок документа — латиницей, чтобы не ломалось в почте и ATS
const PDF_TITLE = 'Vadim Bukhlov CV'

export function useGenerateCvPdf() {
  const generating = ref(false)

  async function generate(cv: CvData) {
    generating.value = true
    try {
      const { jsPDF } = await import('jspdf')
      const fonts = await loadFonts()
      const doc: JsPDF = new jsPDF({ unit: 'pt', format: 'a4' })

      doc.addFileToVFS('PTSerif-Regular.ttf', fonts.regular)
      doc.addFont('PTSerif-Regular.ttf', 'PTSerif', 'normal')
      doc.addFileToVFS('PTSerif-Bold.ttf', fonts.bold)
      doc.addFont('PTSerif-Bold.ttf', 'PTSerif', 'bold')
      doc.addFileToVFS('PTSerif-Italic.ttf', fonts.italic)
      doc.addFont('PTSerif-Italic.ttf', 'PTSerif', 'italic')
      doc.setProperties({ title: PDF_TITLE, author: cv.name })

      const pageW = doc.internal.pageSize.getWidth()
      const pageH = doc.internal.pageSize.getHeight()
      const bottom = pageH - MARGIN_BOTTOM
      const contentW = pageW - MARGIN_X * 2
      const mainW = contentW - COL_GAP - SIDE_W
      const sideX = MARGIN_X + mainW + COL_GAP

      const font = (style: Style, size: number, color: Rgb = INK) => {
        doc.setFont('PTSerif', style)
        doc.setFontSize(size)
        doc.setTextColor(...color)
      }

      const wrap = (str: string, width: number, style: Style, size: number) => {
        font(style, size)
        return doc.splitTextToSize(str, width) as string[]
      }

      const blockHeight = (str: string, width: number, style: Style, size: number) =>
        wrap(str, width, style, size).length * size * LEADING

      // Курсор потока: на первой странице — левая колонка, после переноса — вся ширина
      const cur = { x: MARGIN_X, y: MARGIN_TOP, w: mainW }

      const newPage = () => {
        doc.addPage()
        cur.x = MARGIN_X
        cur.y = MARGIN_TOP
        cur.w = contentW
      }

      const ensureSpace = (h: number) => {
        if (cur.y + h > bottom) newPage()
      }

      // Абзац с переносом между страницами; при смене ширины колонки
      // остаток текста переверстывается под новую ширину
      const paragraph = (
        str: string,
        opts: { size?: number; style?: Style; color?: Rgb; indent?: number; bullet?: boolean; after?: number } = {},
      ) => {
        const { size = 10.5, style = 'normal', color = INK, indent = 0, bullet = false, after = 4 } = opts
        const lineH = size * LEADING
        const textIndent = indent + (bullet ? 11 : 0)
        let rest = stripEmoji(str)
        let first = true
        while (rest) {
          const lines = wrap(rest, cur.w - textIndent, style, size)
          font(style, size, color)
          let i = 0
          for (; i < lines.length && cur.y + lineH <= bottom; i++) {
            if (first && bullet) doc.text('•', cur.x + indent + 1, cur.y, { baseline: 'top' })
            doc.text(lines[i], cur.x + textIndent, cur.y, { baseline: 'top' })
            cur.y += lineH
            first = false
          }
          if (i === lines.length) break
          newPage()
          rest = lines.slice(i).join(' ')
        }
        cur.y += after
      }

      const sectionTitle = (title: string, c: { x: number; y: number; w: number } = cur) => {
        if (c === cur) ensureSpace(60)
        if (c.y > MARGIN_TOP + 1) c.y += 10
        font('bold', 13)
        doc.text(title, c.x, c.y, { baseline: 'top' })
        c.y += 13 * LEADING + 1
        doc.setDrawColor(...INK)
        doc.setLineWidth(0.6)
        doc.line(c.x, c.y, c.x + c.w, c.y)
        c.y += 9
      }

      // ── Сайдбар первой страницы ──────────────────────────────────────────
      const side = { x: sideX, y: MARGIN_TOP, w: SIDE_W }
      const right = sideX + SIDE_W

      const sideLine = (
        str: string,
        opts: { size?: number; style?: Style; color?: Rgb; align?: 'left' | 'right'; url?: string; after?: number } = {},
      ) => {
        const { size = 10, style = 'normal', color = INK, align = 'left', url, after = 0 } = opts
        const lines = wrap(stripEmoji(str), side.w, style, size)
        // Ссылки в шапке — того же цвета, что и текст
        font(style, size, color)
        lines.forEach((line) => {
          const w = doc.getTextWidth(line)
          const x = align === 'right' ? right - w : side.x
          doc.text(line, x, side.y, { baseline: 'top' })
          if (url) doc.link(x, side.y, w, size, { url })
          side.y += size * LEADING
        })
        side.y += after
      }

      font('bold', 24)
      const nameLines = wrap(cv.name, side.w, 'bold', 24)
      nameLines.forEach((line) => {
        font('bold', 24)
        doc.text(line, right - doc.getTextWidth(line), side.y, { baseline: 'top' })
        side.y += 24 * 1.15
      })
      side.y += 2
      sideLine(cv.title, { style: 'italic', size: 11, color: MUTED, align: 'right', after: 8 })

      sideLine(cv.email, { align: 'right', url: `mailto:${cv.email}` })
      sideLine(cv.site, { align: 'right', url: `https://${cv.site}` })
      sideLine(cv.github, { align: 'right', url: `https://${cv.github}` })
      sideLine(cv.telegram, { align: 'right', url: `https://${cv.telegram}` })
      sideLine(cv.location, { align: 'right', color: MUTED })

      if (cv.salary) {
        side.y += 10
        sideLine('Желаемый уровень дохода:', { style: 'bold', align: 'right' })
        sideLine(cv.salary, { align: 'right' })
      }

      side.y += 8
      sectionTitle('Образование', side)
      cv.education.forEach((e) => {
        sideLine(e.place, { style: 'bold' })
        sideLine(e.faculty)
        if (e.period && e.period !== '—') sideLine(e.period, { color: MUTED })
        side.y += 6
      })

      side.y += 2
      sectionTitle('Языки', side)
      cv.languages.forEach((l) => {
        font('bold', 10)
        const label = `${l.name}: `
        doc.text(label, side.x, side.y, { baseline: 'top' })
        const labelW = doc.getTextWidth(label)
        font('normal', 10)
        doc.text(l.level, side.x + labelW, side.y, { baseline: 'top' })
        side.y += 10 * LEADING + 2
      })

      // Группы навыков, не влезшие в сайдбар, уходят в конец документа
      const overflowSkills: CvSkillGroup[] = []
      const skillsTitleH = 13 * LEADING + 30
      const groupHeight = (g: CvSkillGroup) =>
        10 * LEADING + blockHeight(g.items.join(', '), side.w, 'normal', 9) + 5
      if (cv.skills.length && side.y + skillsTitleH + groupHeight(cv.skills[0]) <= bottom) {
        side.y += 2
        sectionTitle('Навыки', side)
        cv.skills.forEach((g) => {
          if (overflowSkills.length || side.y + groupHeight(g) > bottom) {
            overflowSkills.push(g)
            return
          }
          sideLine(g.label, { style: 'bold' })
          sideLine(g.items.join(', '), { size: 9, after: 5 })
        })
      } else {
        overflowSkills.push(...cv.skills)
      }

      // ── Основной поток ───────────────────────────────────────────────────
      sectionTitle('О себе')
      cv.about.forEach((p) => paragraph(p, { after: 6 }))

      const experienceItem = (exp: CvExperience) => {
        ensureSpace(11.5 * LEADING + 9 * LEADING + 10.5 * LEADING * 2 + 8)

        // Термин подсказки помечаем звёздочкой, расшифровка — сноской в конце блока
        const role =
          exp.tooltipTerm && exp.tooltip ? exp.role.replace(exp.tooltipTerm, `${exp.tooltipTerm}*`) : exp.role
        paragraph(role, { size: 11.5, style: 'bold', after: 1 })

        // Мета-строка: период / сайт компании (ссылкой)
        font('normal', 9, MUTED)
        const meta = `${exp.period}  /  `
        doc.text(meta, cur.x, cur.y, { baseline: 'top' })
        const metaW = doc.getTextWidth(meta)
        font('normal', 9, exp.url ? LINK : MUTED)
        doc.text(exp.company, cur.x + metaW, cur.y, { baseline: 'top' })
        if (exp.url) doc.link(cur.x + metaW, cur.y, doc.getTextWidth(exp.company), 9, { url: exp.url })
        cur.y += 9 * LEADING + 5

        paragraph(exp.summary, { after: 3 })
        exp.highlights.forEach((h) => paragraph(h, { bullet: true, after: 1.5 }))
        cur.y += 2
        paragraph(`Стек: ${exp.stack.join(', ')}`, { size: 9.5, style: 'italic', color: MUTED, after: 2 })
        if (exp.tooltip) paragraph(`* ${exp.tooltip}`, { size: 8.5, color: MUTED, after: 2 })
        cur.y += 10
      }

      const jobs = cv.experience.filter((e) => !e.personal)
      const projects = cv.experience.filter((e) => e.personal)

      if (jobs.length) {
        sectionTitle('Опыт работы')
        jobs.forEach(experienceItem)
      }
      if (projects.length) {
        sectionTitle('Собственные проекты')
        projects.forEach(experienceItem)
      }

      if (overflowSkills.length) {
        sectionTitle(overflowSkills.length === cv.skills.length ? 'Навыки' : 'Навыки (продолжение)')
        overflowSkills.forEach((g) => {
          ensureSpace(10.5 * LEADING * 2)
          paragraph(g.label, { style: 'bold', after: 0 })
          paragraph(g.items.join(', '), { after: 6 })
        })
      }

      // Номера страниц
      const pages = doc.getNumberOfPages()
      if (pages > 1) {
        for (let p = 1; p <= pages; p++) {
          doc.setPage(p)
          font('normal', 8, MUTED)
          const label = `${p} / ${pages}`
          doc.text(label, pageW - MARGIN_X - doc.getTextWidth(label), pageH - 28)
          if (p > 1) doc.text(cv.name, MARGIN_X, pageH - 28)
        }
      }

      doc.save(`${PDF_TITLE}.pdf`)
    } finally {
      generating.value = false
    }
  }

  return { generate, generating }
}
