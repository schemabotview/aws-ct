import type { TreeEntry } from '@graphlearning/flow'

// The explorer for any step of shop-on-aws: give it the project's files as paths, the open one,
// and what the section adds. Folders come first, then files, each alphabetical, as an editor shows
// them; a path ending in `/` is a folder shown closed (with an optional note after a space:
// 'catalog/ product JSON'). Folders named in `collapse` are shown closed with a count, unless the open
// file is inside — the explorer must fit its pane, and a tree taller than the frame moves every panel.
// Folders named in `trim` that are open show only their sub-folders and the active and new files;
// the rest become one muted '… N more files' line (infra/ outgrew the pane in Course 11).
export function projectTree(paths: string[], active: string, fresh: string[] = [], collapse: string[] = [], trim: string[] = []): TreeEntry[] {
  const root: TreeEntry[] = [{ name: '.venv', folder: true, state: 'muted', note: 'boto3' }]
  const state = (path: string): TreeEntry['state'] => (path === active ? 'active' : fresh.some((f) => path === f || path.startsWith(f.replace(/\/?$/, '/'))) ? 'new' : undefined)
  for (const raw of paths) {
    const [path, ...note] = raw.split(' ')
    const parts = path.replace(/\/$/, '').split('/')
    let level = root
    parts.forEach((name, i) => {
      const last = i === parts.length - 1
      const here = parts.slice(0, i + 1).join('/')
      let entry = level.find((e) => e.name === name)
      if (!entry) {
        entry = last && !path.endsWith('/') ? { name } : { name, folder: true }
        if (last && path.endsWith('/')) entry = { name, folder: true, note: note.join(' ') || undefined }
        if (!last) entry.children = []
        const s = state(last ? path.replace(/\/$/, '') : here)
        if (s && (last || s === 'new')) entry.state = s
        level.push(entry)
      }
      if (!last) level = entry.children ?? (entry.children = [])
    })
  }
  const count = (e: TreeEntry): number => (e.children ? e.children.reduce((n, c) => n + count(c), 0) : 1)
  const sort = (entries: TreeEntry[], at: string): TreeEntry[] =>
    entries
      .map((e) => {
        const here = at ? `${at}/${e.name}` : e.name
        if (e.children && collapse.includes(here) && !active.startsWith(`${here}/`) && e.state !== 'new')
          return { name: e.name, folder: true, note: `${count(e)} file${count(e) === 1 ? '' : 's'}` }
        if (!e.children) return e
        const children = sort(e.children, here)
        if (!trim.includes(here)) return { ...e, children }
        const kept = children.filter((c) => c.children || c.folder || c.state)
        const rest = children.length - kept.length
        return { ...e, children: rest ? [...kept, { name: `… ${rest} more files`, state: 'muted' as const }] : kept }
      })
      .sort((a, b) => Number(!(a.folder || a.children)) - Number(!(b.folder || b.children)) || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
  return sort(root, '')
}
