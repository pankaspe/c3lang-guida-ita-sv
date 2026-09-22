# CLAUDE.md

Interactive Italian course for learning the C3 language (https://c3-lang.org), built as a fully
static SvelteKit site. See README.md for the layout and authoring reference.

## Hard rules

- **App code in English** (Svelte, TS, identifiers, comments, commit messages).
- **Course content in Italian** (`src/content/modules/**/*.svx`) — but the **embedded C3 code is in
  English**: variable/constant/function/type/module names, example file/project names, code comments,
  and printed/output string literals inside `c3`/`output` fences (and matching `Quiz`/`Exercise`/
  `Solution` code) must all be English, "as is customary, one programs in English" — only the
  surrounding Italian narrative prose stays Italian (e.g. `int eta = 34;` → `int age = 34;`,
  `saluto.c3` → `greeting.c3`, printed `"Totale: ... euro"` → `"Total: ... euro"`). Exception: keep an
  accented Italian word where the lesson's whole point is a UTF-8 byte-vs-character-length gotcha that
  needs one to demonstrate (module 1: the `"caffè"` `.len` demo and the `tabella.c3` / "Perché «Caffe»
  senza accento?" callout) — don't translate those into English.
- Work **one module at a time**: when asked to continue, add the next module's `.svx` files;
  do not rewrite the app shell unless asked.
- **Verify every C3 example and every `expected` exercise output with the real compiler**
  before writing it into a lesson: `c3c compile-run file.c3` (c3c 0.8.4 is installed at
  `~/.local/c3/c3c`). The online docs lag behind the compiler (e.g. `printn(double)` prints 6
  decimals, `compile-run` messages differ, `isz` is now `sz`). Use the scratchpad for test files.
- No sandbox / in-browser code execution. Exercises are done on the learner's machine.
- Runtime is **bun** (`bun run dev|build|check`). There is no `node`/`npx` on this machine.

## Stack

SvelteKit 2 · Svelte 5 runes · Tailwind 4 (+typography, class-based dark mode) · mdsvex ·
Prism with a hand-written C3 grammar (`src/lib/markdown/prism-c3.ts`) · `@sveltejs/adapter-static`.
Config lives in `vite.config.ts` (no `svelte.config.js`).

## How content is wired

- `src/lib/build/course-index.ts`: Vite plugin scanning `src/content/modules` → `virtual:course-index`
  (frontmatter parsed with a tiny YAML subset: `key: value` only). Do not `addWatchFile` a directory
  there (breaks dev).
- `src/lib/content/registry.ts`: modules/lessons API; lesson components are lazy-loaded via
  `import.meta.glob`, one chunk per lesson.
- `src/lib/markdown/LessonLayout.svelte` exports the lesson components; `rehype-lesson-components.ts`
  rewrites `<Callout>` etc. to `Components.Callout` (mdsvex only namespaces hast elements, not raw nodes).
  Keep `LESSON_COMPONENTS` in `components.ts` in sync with the layout exports.
- `remark-headings.ts` injects `headings` into the lesson `metadata` for the page TOC.
- Progress and theme: `src/lib/state/*.svelte.ts`, localStorage-backed, loaded in the root layout
  `$effect` so SSR output is deterministic.

## Authoring conventions (lessons)

- Folder `NN-slug/` with `module.json` (`title, subtitle, emoji, level, goals[]`); lessons `NN-slug.svx`
  with frontmatter `title`, `description`, `minutes`.
- Fences: `c3` (with optional `title="file.c3"`), `output` (terminal look), `sh`, `json`, `c`.
- Components: `Callout type="tip|note|warning|fun|c|deep"`, `Quiz question options answer`,
  `Exercise title expected?`, `Solution`. Blank line before/after inner markdown.
- In a `question="…"` attribute you cannot escape quotes: use `question={'…'}` instead.
- Tone: fun but clear, short sections, one idea at a time, "Se vieni dal C" callouts for C comparisons,
  a recap list at the end of each lesson, quizzes inline and at least one on-machine exercise per lesson.

## Status

- Module 1 "Primi passi" done (7 lessons): benvenuto, hello-world, progetti, variabili-e-tipi,
  operatori, stampare-e-formattare, sfida-finale.
- Next: Module 2 — control flow (`if`/`else`, `switch`), loops (`for`, `while`, `foreach`), functions.
  Planned later modules: arrays/slices/strings, structs/enums, optionals & error handling, modules,
  memory & pointers, defer/contracts, generics/macros, C interop.
