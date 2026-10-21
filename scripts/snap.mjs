// Review tool: screenshot sections the way the recorder frames them (?capture=1), for looking at.
// Not a check — check-render.mjs is the guard. Starts its own vite.
//
//   node scripts/snap.mjs <outDir> [slug …]        default: every section; 1920×1080
//   WIDTH=3840 HEIGHT=2160 THEME=light node scripts/snap.mjs out why-cloud-what-we-will-build
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import { createServer } from 'vite'
import puppeteer from 'puppeteer'

const [outDir = 'snaps', ...only] = process.argv.slice(2)
const PORT = 5187
await mkdir(outDir, { recursive: true })
const bundle = join('node_modules', '.cache', 'aws-snap-content.mjs')
await build({
  stdin: { contents: `export { COURSES } from './src/content'`, resolveDir: process.cwd(), loader: 'ts' },
  outfile: bundle, bundle: true, platform: 'node', format: 'esm', logLevel: 'silent', external: ['@graphlearning/shell'],
})
const { COURSES } = await import(pathToFileURL(join(process.cwd(), bundle)).href)
const all = Object.values(COURSES).flatMap((c) => c.sections.map((s) => `${c.id}-${s.id}`))
const slugs = only.length ? all.filter((s) => only.some((o) => s.startsWith(o))) : all
const server = await createServer({ server: { host: '127.0.0.1', port: PORT, strictPort: true }, logLevel: 'silent' })
await server.listen()
const browser = await puppeteer.launch({ headless: true, args: process.getuid?.() === 0 ? ['--no-sandbox'] : [] })
try {
  const page = await browser.newPage()
  await page.setViewport({ width: Number(process.env.WIDTH ?? 1920), height: Number(process.env.HEIGHT ?? 1080) })
  for (const slug of slugs) {
    await page.goto(`http://127.0.0.1:${PORT}/?capture=1&theme=${process.env.THEME ?? 'dark'}#/${slug}`, { waitUntil: 'networkidle0' })
    await page.waitForSelector('.flow-node', { timeout: 15000 })
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
    await page.screenshot({ path: join(outDir, `${slug}.png`) })
    console.log(join(outDir, `${slug}.png`))
  }
} finally {
  await browser.close()
  await server.close()
}
