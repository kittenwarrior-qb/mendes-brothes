/*
 * Copies the annotated admin screenshots of the guide into public/help as WebP, for the
 * chat assistant.   node scripts/handover/copy-help-images.mjs   (after shots-admin.mjs)
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SRC = path.resolve(process.cwd(), '../docs/handover/shots')
const OUT = path.resolve(process.cwd(), 'public/help')
fs.mkdirSync(OUT, { recursive: true })

const { helpImages } = await import('../../src/ai/helpImages.ts')
let total = 0
for (const id of Object.keys(helpImages)) {
  const src = path.join(SRC, `${id}.jpg`)
  if (!fs.existsSync(src)) {
    console.log('missing', id)
    continue
  }
  const info = await sharp(src)
    .resize(1440, 1600, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 74 })
    .toFile(path.join(OUT, `${id}.webp`))
  total += info.size
}
console.log(`${Object.keys(helpImages).length} images, ${(total / 1e6).toFixed(1)} MB`)
