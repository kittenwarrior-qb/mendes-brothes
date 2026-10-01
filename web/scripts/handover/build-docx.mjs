/*
 * Builds the handover report + user guide as a Word file from the screenshots.
 *   node scripts/handover/build-docx.mjs vi      (or: en)
 * Text lives in content.<lang>.mjs; screenshots come from shots-site.mjs / shots-admin.mjs.
 * Output: ../docs/handover/<file name from the content file>.docx
 */
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableOfContents,
  TableRow,
  TextRun,
  WidthType,
} from 'docx'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const lang = process.argv[2] || 'vi'
const { doc } = await import(`./content.${lang}.mjs`)
const DIR = path.resolve(process.cwd(), '../docs/handover')
const SHOTS = path.join(DIR, 'shots')

const FONT = 'Arial'
const INK = '1A1A1A'
const MUTED = '666666'
const ACCENT = 'C8461A'
const MARK = 'E11D48' // same red as the numbers drawn on the screenshots
const PAGE_W = 620 // usable width in px at 96 dpi (A4, 2 cm margins)
const MAX_H = 800

/** "Bấm **Publish changes** để đăng" → runs, with the **marked** parts in bold. */
const runs = (text, base = {}) =>
  String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**')
        ? new TextRun({ ...base, text: part.slice(2, -2), bold: true })
        : new TextRun({ ...base, text: part }),
    )

const para = (text, opts = {}) =>
  new Paragraph({ spacing: { after: 120, line: 300 }, ...opts, children: runs(text) })

const image = async (file, caption, maxWidth = PAGE_W) => {
  const full = path.join(SHOTS, file)
  if (!fs.existsSync(full)) throw new Error(`Missing screenshot: ${file}`)
  const meta = await sharp(full).metadata()
  let w = Math.min(maxWidth, meta.width)
  let h = Math.round((meta.height / meta.width) * w)
  if (h > MAX_H) {
    w = Math.round((w * MAX_H) / h)
    h = MAX_H
  }
  const out = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: caption ? 60 : 200 },
      keepNext: true, // stay on the same page as the caption or the steps that follow
      children: [
        new ImageRun({
          type: 'jpg',
          data: fs.readFileSync(full),
          transformation: { width: w, height: h },
        }),
      ],
    }),
  ]
  if (caption) {
    out.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: runs(caption, { italics: true, size: 18, color: MUTED }),
      }),
    )
  }
  return out
}

const cell = (text, { header, width } = {}) =>
  new TableCell({
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    margins: { top: 90, bottom: 90, left: 130, right: 130 },
    shading: header ? { type: ShadingType.CLEAR, fill: 'F3F2EE' } : undefined,
    children: [
      new Paragraph({ spacing: { after: 0, line: 280 }, children: runs(text, { bold: header }) }),
    ],
  })

const table = (rows, { header = true, widths } = {}) => {
  const line = { style: BorderStyle.SINGLE, size: 4, color: 'D8D7D2' }
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: line,
      bottom: line,
      left: line,
      right: line,
      insideHorizontal: line,
      insideVertical: line,
    },
    rows: rows.map(
      (r, i) =>
        new TableRow({
          tableHeader: header && i === 0,
          children: r.map((c, j) => cell(c, { header: header && i === 0, width: widths?.[j] })),
        }),
    ),
  })
}

/** Numbered steps; the red number matches the number on the screenshot. */
const steps = (items) =>
  items.map(
    (text, i) =>
      new Paragraph({
        keepNext: i < items.length - 1, // never leave half of the steps on another page
        spacing: { after: i < items.length - 1 ? 90 : 200, line: 300 },
        indent: { left: 440, hanging: 440 },
        children: [
          new TextRun({ text: `${i + 1}`, bold: true, color: MARK }),
          new TextRun({ text: '\t' }),
          ...runs(text),
        ],
        tabStops: [{ type: 'left', position: 440 }],
      }),
  )

const bullets = (items) =>
  items.map(
    (text) =>
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 80, line: 300 },
        children: runs(text),
      }),
  )

const note = (text) =>
  new Paragraph({
    spacing: { before: 120, after: 200, line: 300 },
    indent: { left: 200, right: 200 },
    shading: { type: ShadingType.CLEAR, fill: 'FBF1EC' },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT, space: 8 } },
    children: runs(text),
  })

const children = []

// ───────── cover
const logo = await sharp(path.resolve(process.cwd(), 'public/brand/logo-word.webp'))
  .png()
  .toBuffer()
children.push(
  new Paragraph({ spacing: { before: 1400 }, children: [] }),
  new Paragraph({
    spacing: { after: 500 },
    children: [
      new ImageRun({ type: 'png', data: logo, transformation: { width: 260, height: 106 } }),
    ],
  }),
  new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text: doc.cover.title, bold: true, size: 64, color: INK })],
  }),
  new Paragraph({
    spacing: { after: 700 },
    children: [new TextRun({ text: doc.cover.subtitle, size: 30, color: MUTED })],
  }),
  table(doc.cover.facts, { header: false, widths: [32, 68] }),
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({
    spacing: { after: 200 },
    children: [new TextRun({ text: doc.tocTitle, bold: true, size: 36, color: INK })],
  }),
  new TableOfContents(doc.tocTitle, { hyperlink: true, headingStyleRange: '1-2' }),
)

// ───────── body
for (const b of doc.body) {
  if (b.h1) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        children: runs(b.h1),
      }),
    )
  } else if (b.h2) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        pageBreakBefore: Boolean(b.newPage),
        keepNext: true,
        children: runs(b.h2),
      }),
    )
  } else if (b.h3) {
    children.push(
      new Paragraph({ heading: HeadingLevel.HEADING_3, keepNext: true, children: runs(b.h3) }),
    )
  } else if (b.p) children.push(para(b.p, { keepNext: /[:：]$/.test(b.p) }))
  else if (b.steps) children.push(...steps(b.steps))
  else if (b.bullets) children.push(...bullets(b.bullets))
  else if (b.note) children.push(note(b.note))
  else if (b.table) children.push(table(b.table, { widths: b.widths }), para(''))
  else if (b.img) {
    // admin screenshots are a little narrower so that a picture and its steps share a page
    const width = b.width ?? (b.img.startsWith('adm-') ? 570 : PAGE_W)
    children.push(...(await image(b.img, b.caption, width)))
  }
}

const document = new Document({
  creator: 'Mendez Brothes website project',
  title: doc.cover.title,
  description: doc.cover.subtitle,
  features: { updateFields: true }, // Word fills in the table of contents when the file is opened
  styles: {
    default: {
      document: { run: { font: FONT, size: 21, color: INK } },
      heading1: {
        run: { font: FONT, size: 40, bold: true, color: INK },
        paragraph: { spacing: { after: 260 } },
      },
      heading2: {
        run: { font: FONT, size: 28, bold: true, color: ACCENT },
        paragraph: { spacing: { before: 360, after: 160 } },
      },
      heading3: {
        run: { font: FONT, size: 23, bold: true, color: INK },
        paragraph: { spacing: { before: 240, after: 120 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: `${doc.footer}   ·   `, size: 16, color: MUTED }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTED }),
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
})

const file = path.join(DIR, `${doc.fileName}.docx`)
fs.writeFileSync(file, await Packer.toBuffer(document))
console.log(file, `${(fs.statSync(file).size / 1e6).toFixed(1)} MB`)
