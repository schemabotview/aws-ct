import type { Scene, SceneNode, TreeEntry } from '@graphlearning/flow'
import { SCENE_ASPECT } from '@graphlearning/shell'

// The IDE frame every course from 3 on is built from — ONE fixed template, so every panel sits at the
// same pixels in every section and a viewer always knows where to look:
//
//   explorer (EXPLORER_W, full height) | editor (EDITOR_COLS × EDITOR_H)  | side (SIDE_W, full height)
//                                       80 columns: PEP 8's line limit, so a well-formatted line always fits
//                                       | terminal docked underneath (TERMINAL_H)
//
// The sizes are floors (minW / minH): a file longer than the editor must be folded with `show`, not
// allowed to grow the pane — check-render.mjs fails any IDE frame whose panels move.
//
// This is the python-ct / apache-spark-ct template, unchanged in shape: explorer 300 | editor 80
// columns × 18 rows over a terminal | side pane 520, 1632 wide, the height derived from the shell's
// SCENE_ASPECT so the frame fills 16:9 exactly. The terminal is 84 characters wide at the editor's
// width, and scripts/spine.py wraps output there, as a real terminal that wide does: a longer line
// would widen the centre column and move the side pane. Every side card is stretched to SIDE_W.
// Code and terminal text come from spine/ via `?raw`, so a frame can only show what scripts/spine.py
// has replayed. A terminal whose commands ran against the emulator is titled `· emulated`.

export const EXPLORER_W = 300
export const EDITOR_COLS = 80
export const EDITOR_W = 792
export const EDITOR_H = 467
export const SIDE_W = 520
const GAP = 10
const TOTAL_H = Math.round((EXPLORER_W + EDITOR_W + SIDE_W + 2 * GAP) / SCENE_ASPECT)
export const TERMINAL_H = TOTAL_H - GAP - EDITOR_H

export interface Pane {
  file: string
  code: string
  show?: [number, number][]
  highlight?: number[]
  pattern?: SceneNode['pattern']
  terminal?: string
  title?: string
  /** false when nothing in the terminal touched the emulator (a local Python run) */
  emulated?: boolean
}

export const trim = (text: string) => text.replace(/\n+$/, '')

/**
 * A long run as a real terminal shows it: only the `keep` ranges of lines (1-based, inclusive; a
 * negative number counts from the end, -1 being the last line), each gap folded to `··· N lines` —
 * the same mark the editor uses. An error's last lines are what is on screen when the command
 * returns, so a frame keeps those and the command, and folds the rest.
 */
export function fold(session: string, ...keep: [number, number][]): string {
  const lines = trim(session).split('\n')
  const at = (n: number) => (n < 0 ? lines.length + n + 1 : n)
  const kept = new Set<number>()
  for (const [from, to] of keep) for (let n = at(from); n <= at(to); n++) kept.add(n)
  const out: string[] = []
  let hidden = 0
  lines.forEach((line, i) => {
    if (kept.has(i + 1)) {
      if (hidden) out.push(`··· ${hidden} line${hidden === 1 ? '' : 's'}`)
      hidden = 0
      out.push(line)
    } else hidden++
  })
  if (hidden) out.push(`··· ${hidden} line${hidden === 1 ? '' : 's'}`)
  return out.join('\n')
}

/** The 1-based number of the first line of `session` that starts with `prefix`. */
export const lineOf = (session: string, prefix: string) => trim(session).split('\n').findIndex((l) => l.startsWith(prefix)) + 1

// A bare side group is a column of cards: each one is stretched to the column, not the group.
const fill = (side: SceneNode): SceneNode =>
  side.bare && side.children ? { ...side, minW: SIDE_W, children: side.children.map((c) => ({ ...c, minW: SIDE_W })) } : { ...side, minW: SIDE_W }

export function ideFrame(id: string, project: string, tree: TreeEntry[], pane: Pane | SceneNode, side: SceneNode): Scene {
  const centre: SceneNode =
    'code' in pane
      ? {
          id: `${id}-centre`,
          label: pane.file,
          bare: true,
          gap: 'tight',
          children: [
            {
              id: `${id}-editor`, kind: 'code', filename: pane.title ?? pane.file, label: trim(pane.code), show: pane.show,
              highlight: pane.highlight, pattern: pane.pattern ?? 'storage', minCols: EDITOR_COLS, minH: EDITOR_H,
            },
            { id: `${id}-terminal`, kind: 'terminal', filename: `Terminal — ${project}${pane.emulated === false ? '' : ' · emulated'}`, label: trim(pane.terminal ?? ''), span: 'all', minH: TERMINAL_H },
          ],
        }
      : { ...pane, minW: EDITOR_W, minH: EDITOR_H + GAP + TERMINAL_H }
  return {
    id,
    padding: 0.04,
    flow: 'LR',
    align: 'start',
    stretch: true,
    gap: 'tight',
    nodes: [
      { id: `${id}-explorer`, kind: 'tree', label: project, tree, minW: EXPLORER_W },
      centre,
      { id: `${id}-side`, label: 'side', bare: true, framed: true, minW: SIDE_W, children: [fill(side)] },
    ],
    edges: [],
  }
}
