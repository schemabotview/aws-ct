// Print every registered scene as JSON on stdout, for scripts/check-aws.py.
//
// The scenes are TypeScript, so they are bundled with esbuild (already a devDependency) into a
// throwaway ESM file and imported. Reading the real registry — rather than regex-parsing the source
// the way check-content.mjs does — means a code card is checked exactly as the app renders it,
// template-literal escapes and all.
import { build } from 'esbuild'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const dir = mkdtempSync(join(tmpdir(), 'aws-scenes-'))
const out = join(dir, 'scenes.mjs')
try {
  await build({
    entryPoints: ['src/scenes/index.ts'],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: out,
    logLevel: 'error',
    // Scene files only import TYPES from the engine; nothing at runtime needs it.
    external: ['@graphlearning/flow'],
  })
  const { SCENES } = await import(pathToFileURL(out).href)
  process.stdout.write(JSON.stringify(SCENES))
} finally {
  rmSync(dir, { recursive: true, force: true })
}
