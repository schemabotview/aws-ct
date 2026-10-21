// Print every registered scene as JSON on stdout, for scripts/check-aws.py.
//
// The scenes are TypeScript, so they are bundled with esbuild (already a devDependency) into a
// throwaway ESM file and imported. Reading the real registry — rather than regex-parsing the source
// the way check-content.mjs does — means a code card is checked exactly as the app renders it,
// template-literal escapes and all.
import { build } from 'esbuild'
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

// Under node_modules/, so the bundle's external imports resolve to this repo's packages.
mkdirSync(join('node_modules', '.cache'), { recursive: true })
const dir = mkdtempSync(join('node_modules', '.cache', 'aws-scenes-'))
const out = join(dir, 'scenes.mjs')
try {
  await build({
    entryPoints: ['src/scenes/index.ts'],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: out,
    logLevel: 'error',
    // Scenes import only types from the engine; the IDE template reads SCENE_ASPECT from the shell,
    // and spine files arrive through Vite's `?raw`, which esbuild is taught here.
    external: ['@graphlearning/*'],
    plugins: [{ name: 'raw', setup: (b) => {
      b.onResolve({ filter: /\?raw$/ }, (a) => ({ path: join(a.resolveDir, a.path.slice(0, -4)), namespace: 'raw' }))
      b.onLoad({ filter: /.*/, namespace: 'raw' }, (a) => ({ contents: readFileSync(a.path, 'utf8'), loader: 'text' }))
    } }],
  })
  const { SCENES } = await import(pathToFileURL(join(process.cwd(), out)).href)
  process.stdout.write(JSON.stringify(SCENES))
} finally {
  rmSync(dir, { recursive: true, force: true })
}
