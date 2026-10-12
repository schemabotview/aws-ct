# aws-ct

The **AWS** concept app of GraphL — *From Cloud Foundations to Advanced Architecture and Operations*.
One concept, 12 courses (one per chapter of [`AWS-COURSE-PLAN.md`](AWS-COURSE-PLAN.md)), each a list
of sections; a section is `(scene, slide, narration)` and one segment of the course video.

Served at `graphl.in/aws-ct/`. Scaffolded from `content-repo-template`, with the SQL repo's guards.

## Status

Chapters 1–2 (`foundations` 6, `identity` 7 sections) authored; awaiting review. No narration audio yet.

## Run it

```sh
npm install
npm run dev                # http://localhost:5173 — #/foundations-cloud-operating-model
```

## Verify a change

```sh
pip install -r scripts/requirements-check.txt   # once: botocore, cfn-lint, moto
npx tsc --noEmit && npm run build && npm run check && npm run check:aws
node scripts/shot.mjs /tmp/shots                # with the dev server up
```

Every code card names its **verification level** in its filename (`runs locally`, `model-checked`,
`emulated`, `doc-cited`, `illustrative`); `check:aws` proves each claim. See `CLAUDE.md`.

## Layout

```
AWS-COURSE-PLAN.md    the approved syllabus (reviewed upstream in toc)
src/content/          courses → sections (NN-<id>.ts) + registry
src/scenes/           scenes per course + registry
scripts/              check-content · check-icons · check-plan · check-aws.py · shot · measure-slides
public/audio/<course>/    narration wavs (Colab + Chatterbox)
```
