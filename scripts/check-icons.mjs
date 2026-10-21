// Icon-name guard. A wrong `icon:` type-checks, passes check-content, builds, and renders the
// pattern's fallback glyph instead of the one meant — on an AWS board that silently swaps a service
// logo for a generic shape. The published @graphlearning/flow does not export its registries
// (`AWS_ICONS` is declared but not in the barrel), so this reads them out of the bundle itself:
// the engine resolves an icon AWS → Azure → lucide, and each map is an object literal of
// `key: Component` lines. Anchor keys locate each map; if an engine upgrade renames one, this
// fails loudly rather than passing everything.
//
// Run: npm run check
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const bundle = readFileSync('node_modules/@graphlearning/flow/dist/index.js', 'utf8').split('\n')

/** The keys of the object literal that contains `anchor:` as one of its lines. */
function mapContaining(anchor) {
  const at = bundle.findIndex((l) => new RegExp(`^\\s*${anchor}:\\s*[\\w$]+,?\\s*$`).test(l))
  if (at < 0) throw new Error(`icon map with key '${anchor}' not found in the engine bundle`)
  let start = at
  while (start > 0 && !/=\s*\{\s*$/.test(bundle[start - 1])) start--
  const keys = []
  for (let i = start; i < bundle.length; i++) {
    const l = bundle[i]
    if (/^\s*\}/.test(l)) break
    const m = l.match(/^\s*([a-z0-9]+):\s*[\w$]+,?\s*$/)
    if (m) keys.push(m[1])
  }
  return keys
}

const aws = mapContaining('ec2')
const azure = mapContaining('keyvault')
const lucide = mapContaining('gitbranch')
const brand = mapContaining('kafka')
const valid = new Set([...aws, ...azure, ...brand, ...lucide, 'none'])

const files = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? files(p) : p.endsWith('.ts') ? [p] : []
  })

const problems = []
for (const f of files('src/scenes')) {
  for (const [, name] of readFileSync(f, 'utf8').matchAll(/\bicon:\s*'([^']+)'/g)) {
    if (!valid.has(name)) problems.push(`${f}: icon '${name}' is not in the engine's registries`)
  }
}
if (problems.length) {
  console.error(`✗ ${problems.length} unknown icon(s) — AWS keys: ${aws.join(' ')}\n  lucide keys: ${lucide.join(' ')}`)
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}
console.log(`✓ icons resolve (${aws.length} AWS, ${azure.length} Azure, ${brand.length} brand, ${lucide.length} lucide keys known)`)
