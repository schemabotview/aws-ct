// Plan conformance guard. AWS-COURSE-PLAN.md is the syllabus; this holds src/content to it so the
// app cannot drift from the reviewed plan. It reads the plan, then checks every authored section:
//
//   1. the plan parses: every course header's section count matches its list, and the totals match
//   2. each course folder is a plan course (by id), and its Course title is the plan's course title
//   3. each section file is `NN-<id>.ts`, NN is a real section number of that chapter, no NN twice
//   4. the section's title is the plan's section title, word for word
//
// Titles are enforced verbatim on purpose: the plan's wording is the reviewed artefact, and a
// section that has been quietly renamed is a section the reviewers no longer recognise.
// It also prints coverage (authored / planned per chapter), so progress is a number, not a feeling.
//
// Run: npm run check
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// Course headers read: **3. `start` · Start the project · 6 sections**, and each numbered item under
// one reads `N. <title> — <what it shows> · <frame>`. The section title is the text before ` — `.
const FRAMES = ['map', 'map+term', 'ide', 'concept']
const plan = readFileSync('AWS-COURSE-PLAN.md', 'utf8')
const chapters = []
const problems = []
const bad = (m) => problems.push(m)
let cur = null
for (const line of plan.split('\n')) {
  const h = line.match(/^\*\*(\d+)\. `([\w-]+)` · (.+) · (\d+) sections\*\*$/)
  if (h) {
    cur = { n: Number(h[1]), id: h[2], title: h[3].trim(), declared: Number(h[4]), sections: [] }
    chapters.push(cur)
    continue
  }
  if (line.startsWith('## ')) cur = null // Old chapter → new course, Decisions, etc.
  const s = cur && line.match(/^(\d+)\. (.+?) — .+ · ([\w+]+)$/)
  if (s) {
    cur.sections.push({ n: Number(s[1]), title: s[2].trim() })
    if (!FRAMES.includes(s[3])) bad(`plan course ${cur.n} item ${s[1]}: frame '${s[3]}' is not one of ${FRAMES.join(', ')}`)
  } else if (cur && /^\d+\. /.test(line)) bad(`plan course ${cur.n}: item does not read 'N. title — description · frame': ${line}`)
}
const COURSE_IDS = chapters.map((c) => c.id)

// The header reads: ## The courses — 13 courses, 104 sections
const head = plan.match(/^## The courses — (\d+) courses, (\d+) sections$/m)
const total = chapters.reduce((a, c) => a + c.sections.length, 0)
if (!head) bad('plan has no "## The courses — N courses, M sections" header')
else if (Number(head[1]) !== chapters.length || Number(head[2]) !== total) {
  bad(`plan header declares ${head[1]} courses / ${head[2]} sections but lists ${chapters.length} / ${total}`)
}
chapters.forEach((c, i) => {
  if (c.n !== i + 1) bad(`plan course '${c.id}' is numbered ${c.n}, expected ${i + 1}`)
  if (c.declared !== c.sections.length) bad(`plan course '${c.id}' declares ${c.declared} sections but lists ${c.sections.length}`)
  c.sections.forEach((s, j) => { if (s.n !== j + 1) bad(`plan course '${c.id}': item ${s.n} out of order`) })
})

let authored = 0
const rows = []
chapters.forEach((ch, i) => {
  const id = ch.id
  const dir = join('src/content', id)
  let done = 0
  if (existsSync(dir)) {
    const idx = join(dir, 'index.ts')
    if (existsSync(idx)) {
      const t = readFileSync(idx, 'utf8').match(/title:\s*'([^']*)'/)?.[1]
      if (t !== ch.title) bad(`${idx}: course title '${t}' is not the plan's chapter title '${ch.title}'`)
    }
    const seen = new Set()
    for (const f of readdirSync(dir).filter((f) => /^\d+-.+\.ts$/.test(f))) {
      const n = Number(f.match(/^(\d+)-/)[1])
      const sec = ch.sections.find((s) => s.n === n)
      if (!sec) { bad(`${dir}/${f}: the plan has no section ${n} in chapter ${ch.n} (it has ${ch.sections.length})`); continue }
      if (seen.has(n)) bad(`${dir}: two files claim section ${n}`)
      seen.add(n)
      const title = readFileSync(join(dir, f), 'utf8').match(/title:\s*'((?:[^'\\]|\\.)*)'/)?.[1]?.replace(/\\'/g, "'")
      if (title !== sec.title) bad(`${dir}/${f}: title '${title}' is not the plan's '${sec.title}'`)
      done++
    }
  }
  authored += done
  rows.push(`  ch ${String(ch.n).padStart(2)}  ${id.padEnd(14)} ${String(done).padStart(2)} / ${String(ch.sections.length).padStart(2)}   ${ch.title}`)
})
for (const d of existsSync('src/content') ? readdirSync('src/content', { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) : []) {
  if (!COURSE_IDS.includes(d)) bad(`src/content/${d} is not a course in the plan (expected one of ${COURSE_IDS.join(', ')})`)
}

console.log(rows.join('\n'))
console.log(`  authored ${authored} of ${total} planned sections`)
if (problems.length) {
  console.error(`\n✗ ${problems.length} plan-conformance problem(s):`)
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}
console.log('✓ content matches AWS-COURSE-PLAN.md')
