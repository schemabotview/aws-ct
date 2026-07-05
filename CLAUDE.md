# CLAUDE.md — aws-ct

A **content repo**, not an app. It holds the **AWS (Solutions Architect Associate)** concept, authored **video-first** for the `graphl-movie` app (sibling repo), which loads it **at runtime**. No render engine and no scenes live here — the app fetches this repo's `manifest.json` + notebooks + slides over the network and renders/records them. Read alongside the workspace map in `../CLAUDE.md`, the app contract in `../graphl-movie/CLAUDE.md`, and the video-first reference `../databricks-data-engineer-ct/CLAUDE.md`.

This is a `-ct` (video-target) content repo. It is authored **fresh** for the video target — the existing graphl-ux-era `../aws-content` (whole-notebook, feed/canvas era) is **reference material**, not something to copy wholesale. We refine structure for video, not port it.

Concretely, each module's section notebooks are **split from the `../aws-content` per-module notebook** — the source of truth for the split — then refined for the video target (trimmed to the agreed spine, `## `-per-section, images dropped). Example: module 01's sections split from `../aws-content/notebooks/01-cloud-and-aws-foundations.ipynb`.

There is **nothing to build, run, or test** here. The one executable (later) is a Colab tool that turns `tts/` scripts into `audio/` `.wav`s.

## Working agreement

Same as the app repo: **step by step, one small slice, review gate between each.** We settle the shape first (module categorization → sections → …), then fill content deliberately. No batch generation, no "I generated 12 files" — list files and get a yes.

## The core contract (from graphl-movie — do not break)

1. **The notebook is the single source of truth** for a section's prose and code. `manifest.json` only *wires* — it must never duplicate notebook content.
2. **One notebook per section** (not per module): each `.ipynb` holds exactly one `## ` section. The section is the atomic unit across all four artifacts — `.ipynb` + `.tts` + `.slide` + `.wav` share the same `NN-SS-slug` stem — so a section can be authored and reviewed on its own. The manifest references each artifact by path; the notebook's single `## ` heading is the section title (mirror it in the manifest `heading`).
3. Each section is the unit the video steps through and has its own **`.ipynb`** (prose/code), **`.tts`** (narration script), **`.wav`** (generated audio), and — new for video — a **`.slide`** file (the authored right-pane bullets). Module title/lede lives in `README.md` + the manifest, not in the section notebooks.
4. A section's diagram images (`![]()`) are **stripped** by the app — the React Flow **scene** replaces them.
5. **Scenes live in the `graphl-movie` app** (`src/scenes/*`), authored with the engine's pattern helpers. Here you only reference a scene **by id**, plus `highlight` (node ids brightened in-place, the rest dimmed) and `focus` (a node id the camera frames) per section. The AWS scenes are ported into graphl-movie from `../graphl-ux/src/scenes/aws-*.ts` (`aws-global`, `aws-iam`, `aws-cloud`), refined for the 1920×1080 video frame.

## Folder layout

```
aws-ct/
  notebooks/   # one .ipynb per SECTION (one ## section each) — source of truth for prose/code
  tts/         # one .tts per section (plain spoken narration script)
  audio/       # one .wav per section (generated from tts/ via Colab)
  slides/      # one .slide per section (authored right-pane title + bullets)
  manifest.json  # (later) wires sections → notebook / slide / scene / highlight / focus / audio
  scripts/     # (later) colab_generate_audio.ipynb (.tts -> .wav)
  CLAUDE.md · README.md
```

Naming: every artifact for a section shares the stem `<NN>-<SS>-<slug>`, where `NN` = module number, `SS` = section position (so a sorted glob stays in reading order): `notebooks/<NN>-<SS>-<slug>.ipynb`, `tts/…​.tts` → `audio/…​.wav`, `slides/…​.slide`.

The `.slide` format is a one-screen, scannable Markdown subset — **not** just title + bullets: a `# Title`, then `## ` sub-labels, short paragraphs, fenced ` ```code``` ` blocks, and numbered / `- ` lists, each key term marked with inline **`**bold**`** (rendered bright white, the rest a softer gray). **Keep the whole slide inside the fixed 1920×1080 frame:** the app's right pane does not scroll or auto-shrink type, so an over-long slide clips top and bottom — trim it to fit (drop connective prose the narration already carries) rather than expecting the engine to resize. Title may be punchier than the notebook `## ` heading.

## Curriculum

The course outline (module spine + per-module sections) lives in [`README.md`](./README.md) — the single human-facing source for structure while we plan; `manifest.json` becomes the machine source of truth once authored. Don't duplicate the module/section list here.

**Starting point:** the 14-module SAA curriculum in `../aws-content` (source of truth for the split). Whether the video set keeps all 14 or normalizes toward the ~10-module video shape (à la databricks-data-engineer-ct's 9) is a **next-pass decision** — settle the spine before authoring sections.

## Status

Structure drafted — `README.md` holds the full **14-module / 148-section spine** (agreed: keep all 14 modules; each normalized to ~10 sections).

**Modules 01–03 authored** — every section has `notebooks/NN-SS-*.ipynb` (split from the matching `../aws-content/notebooks/NN-*.ipynb`), `slides/NN-SS-*.slide`, and `tts/NN-SS-*.tts`; `manifest.json` wires them per-section (`focus`/`highlight` on real scene node ids; §1 of each = `hook` on the full map):
- **01 — Cloud & AWS Foundations (10)** → `aws-global` scene.
- **02 — IAM, Organizations & Account Security (11)** → `aws-iam` scene.
- **03 — Compute Core: EC2, ELB, Auto Scaling (12)** → `aws-cloud` scene (the "whole map"; compute lives in Region A's 3-tier — §2–7 frame `app-a`/`ec2-a`, §8–10 `public-a`/`alb`, §11–12 `asg`).
- **04 — Serverless & Containers (11)** → `aws-cloud` scene (Lambda §2–6 → `app-a`/`lambda-a`+`apigw`; containers §7–10 → `ecs`/`fargate`/`ecr`; §11 → all compute tiles).
- **05 — Storage: S3, EBS, EFS, FSx (11)** → `aws-cloud` scene (S3 §2–7 → Region B `lake`/`s3-*`/`glacier`; block/file §8–11 → `storage-a` band `ebs`/`efs`/`fsx`/`storage-gw`).

The 3-scene AWS set is settled: `aws-global` (mod 01), `aws-iam` (mod 02), `aws-cloud` (mod 03+, framed per section). All three are ported into graphl-movie (`src/scenes/`).

Sections were authored **one trio at a time** (notebook → slide → tts), not batch-generated, so each gets full depth and the slide fills the right pane (see the `slide-authoring-depth` preference). **Pushed** to `github.com/schemabotview/aws-ct` (public).

**Pending:** (1) generate `audio/NN-*.wav` from the `.tts` via Colab; (2) **port the `aws-global` + `aws-iam` scenes into the graphl-movie app** (`src/scenes/`, register in `scenes/index.ts`) — they currently live only in `../graphl-ux/src/scenes/`, so the app can't render these modules until they're ported.

Next: modules 03–14, same pattern (split `.ipynb` → `.slide` + `.tts` → Colab `.wav` → manifest wiring), one reviewed slice at a time.
