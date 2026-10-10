import type { CvData } from './useCvData'

// Кэш base64-шрифтов, чтобы не качать повторно
let fontCache: { regular: string; bold: string } | null = null

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
  const [regular, bold] = await Promise.all([
    fetchFontBase64('/fonts/DejaVuSans.ttf'),
    fetchFontBase64('/fonts/DejaVuSans-Bold.ttf'),
  ])
  fontCache = { regular, bold }
  return fontCache
}

export function useGenerateCvPdf() {
  const generating = ref(false)

  async function generate(cv: CvData) {
    generating.value = true
    try {
      const { jsPDF } = await import('jspdf')
      const fonts = await loadFonts()
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })

      doc.addFileToVFS('DejaVuSans.ttf', fonts.regular)
      doc.addFont('DejaVuSans.ttf', 'DejaVu', 'normal')
      doc.addFileToVFS('DejaVuSans-Bold.ttf', fonts.bold)
      doc.addFont('DejaVuSans-Bold.ttf', 'DejaVu', 'bold')
      doc.setFont('DejaVu', 'normal')

      const margin = 48
      const pageW = doc.internal.pageSize.getWidth()
      const pageH = doc.internal.pageSize.getHeight()
      const maxW = pageW - margin * 2
      let y = margin

      const ensureSpace = (h: number) => {
        if (y + h > pageH - margin) {
          doc.addPage()
          y = margin
        }
      }

      const text = (
        str: string,
        opts: { size?: number; bold?: boolean; color?: number; gap?: number; indent?: number } = {},
      ) => {
        const { size = 10.5, bold = false, color = 30, gap = 4, indent = 0 } = opts
        doc.setFont('DejaVu', bold ? 'bold' : 'normal')
        doc.setFontSize(size)
        doc.setTextColor(color)
        const lines = doc.splitTextToSize(str, maxW - indent) as string[]
        const lineH = size * 1.35
        lines.forEach((line) => {
          ensureSpace(lineH)
          doc.text(line, margin + indent, y)
          y += lineH
        })
        y += gap
      }

      const divider = () => {
        ensureSpace(12)
        doc.setDrawColor(210)
        doc.setLineWidth(0.6)
        doc.line(margin, y, pageW - margin, y)
        y += 12
      }

      const sectionTitle = (title: string) => {
        ensureSpace(28)
        y += 6
        text(title.toUpperCase(), { size: 11, bold: true, color: 90, gap: 2 })
        divider()
      }

      // Шапка
      text(cv.name, { size: 22, bold: true, color: 20, gap: 2 })
      text(cv.title, { size: 12, color: 90, gap: 6 })
      text(
        [cv.location, cv.email, cv.site].filter(Boolean).join('  ·  '),
        { size: 9.5, color: 120, gap: 8 },
      )

      // О себе
      sectionTitle('О себе')
      cv.about.forEach((p) => text(p, { gap: 4 }))

      // Опыт
      sectionTitle('Опыт')
      cv.experience.forEach((exp) => {
        ensureSpace(40)
        // Термин подсказки помечаем звёздочкой, расшифровка — сноской в конце блока
        const roleText =
          exp.tooltipTerm && exp.tooltip
            ? exp.role.replace(exp.tooltipTerm, `${exp.tooltipTerm}*`)
            : exp.role
        text(roleText, { size: 11.5, bold: true, color: 20, gap: 1 })
        text(
          `${exp.company}${exp.url ? '  ·  ' + exp.url : ''}`,
          { size: 10, color: 90, gap: 1 },
        )
        text(exp.period, { size: 9, color: 130, gap: 4 })
        text(exp.summary, { gap: 3 })
        exp.highlights.forEach((h) => text(`•  ${h}`, { indent: 10, gap: 1 }))
        text(`Стек: ${exp.stack.join(', ')}`, { size: 9.5, color: 110, gap: exp.tooltip ? 3 : 8 })
        if (exp.tooltip) {
          text(`* ${exp.tooltip}`, { size: 8.5, color: 130, gap: 8 })
        }
      })

      // Навыки
      sectionTitle('Ключевые навыки')
      ;[...cv.skills, ...cv.extraSkills].forEach((g) => {
        text(`${g.label}: ${g.items.join(', ')}`, { gap: 3 })
      })

      // Языки и образование
      sectionTitle('Языки')
      cv.languages.forEach((l) => text(`${l.name} — ${l.level}`, { gap: 1 }))

      sectionTitle('Образование')
      cv.education.forEach((e) =>
        text(`${e.place} · ${e.faculty}${e.period && e.period !== '—' ? ' · ' + e.period : ''}`, {
          gap: 1,
        }),
      )

      const fileName = `${cv.name.replace(/\s+/g, '_')}_CV.pdf`
      doc.save(fileName)
    } finally {
      generating.value = false
    }
  }

  return { generate, generating }
}
