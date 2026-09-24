# CLAUDE.md

Interactive Italian course for learning the C3 language (https://c3-lang.org), built as a fully
static SvelteKit site. See README.md for the layout and authoring reference.

## Hard rules

- **c3-lang.org is the reference.** Always base lesson content on the official docs at
  https://c3-lang.org (full dump: https://c3-lang.org/all), cross-checked against the real compiler
  (see below). Don't rely on memory of C3 or on third-party material.
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
- Browser state lives in `src/lib/state/`, all in localStorage under `c3-course:*` keys (so the
  backup in `storage.ts` picks up any new key automatically). Stores are loaded in the root layout
  `$effect` so SSR output is deterministic:
  - `preferences.ts` + `settings.svelte.ts`: theme mode/palette and reader settings, exposed to CSS
    as `data-*` attributes on `<html>` (+ `.dark`). `applyStoredPreferences()` is the single
    implementation: `src/hooks.server.ts` inlines it into every page (`%c3.boot%` in `app.html`) to
    apply them before first paint, so it must stay self-contained (no imports/outer variables).
  - `progress.svelte.ts` (completed lessons), `profile.svelte.ts` (display name),
    `activity.svelte.ts` (study time per day, first-attempt quizzes, solved exercises, opened nerd
    callouts, last reading position), `reading.svelte.ts` (current lesson/section/progress).
- Lesson sections: `rehype-lesson-sections.ts` wraps each h2 + its content in
  `<section class="lesson-section" data-section="<h2 id>">`. The `readingTracker` attachment marks the
  active one (reading spotlight, TOC, header progress bar, "riprendi da qui"). **Never put an `##`
  heading inside a lesson component** (Callout/Quiz/Exercise/Solution): it would split the component.
- Lesson components get the lesson id via `lesson-context.ts` (`createContext`) to key activity records.
- `src/lib/feedback.ts`: opt-in sounds (Web Audio, synthesised) and vibration for learner actions.
- Pages: `/impostazioni` (Aspetto, Lettura, Codice, Esperienza, Dati: export/import/delete, Info),
  `/profilo` (identicon + name, resume, stats, heatmap, modules, badges from `content/badges.ts`).
- Animations: `.anim-rise|pop|shake|draw|ring` utilities and View Transitions (root layout
  `onNavigate`); every animation is neutralised by the motion setting / `prefers-reduced-motion`.
  Keep new animations short and subtle, and always go through these utilities.

## Theme

Colours are CSS tokens in `src/app.css` (`:root` light, `.dark` dark) exposed to Tailwind via
`@theme inline`. Alternative palettes (`data-palette="paper|terminal|contrast"`) override every token
for both modes (`:not(.dark)` / `.dark`): a new token must be added to all of them. The brand comes from the C3 logo gradient (`--brand-blue` #2563eb → `--brand-violet`
#7c3aed); helpers `.bg-brand`, `.text-brand`, `.bg-grid`. Keep the "tech but calm" look: cool neutral
surfaces, indigo accent, mono for small labels; don't hard-code colours in components, add a token.
**No emoji or colour icons anywhere** (UI or lessons): use the monochrome stroke icons in
`src/lib/components/ui/Icon.svelte` (Lucide paths, `currentColor`); add new ones there when needed.

## Authoring conventions (lessons)

- Folder `NN-slug/` with `module.json` (`title, subtitle, icon, level, goals[]`, `icon` = a name from `Icon.svelte`); lessons `NN-slug.svx`
  with frontmatter `title`, `description`, `minutes`.
- Fences: `c3` (with optional `title="file.c3"`), `output` (terminal look), `sh`, `json`, `c`.
- Components: `Callout type="tip|note|warning|fun|c|deep|nerd"`, `Quiz question options answer`,
  `Exercise title expected?`, `Solution`. Blank line before/after inner markdown.
- In a `question="…"` attribute you cannot escape quotes: use `question={'…'}` instead. The same
  applies to **any attribute containing `{` or `}`** (e.g. C3 code with braces in a quiz question):
  inside `"…"` Svelte reads braces as an expression and the build fails.
- **Braces in prose must be inside inline code**: a bare `{ }` in markdown text (even in italics)
  is parsed as a Svelte expression. Quote compiler messages as inline code, e.g. `` `use '{ }'` ``.
- Never put an `##` heading inside a lesson component (see "Lesson sections" above).
- Tone: fun but clear, short sections, one idea at a time, "Se vieni dal C" callouts for C comparisons,
  a recap list at the end of each lesson, quizzes inline and at least one on-machine exercise per lesson.
- **"Dettagli nerd"** (`Callout type="nerd" title="<the question it answers>"`): whenever a lesson
  uses a term about how the computer works (buffer, RAM, byte/bit, registers, stdout, linker, PATH,
  two's complement, IEEE 754, UTF-8, ...), add a nerd callout explaining it in plain Italian, placed
  right after the paragraph that introduces the term. It renders collapsed (`<details>`), so it must be
  skippable: the main text must still make sense without it. Title it as a question
  ("Cos'è un buffer?"). Don't repeat one already given in an earlier lesson: refer back to it.

## Status

- Module 1 "Primi passi" done (7 lessons): benvenuto, hello-world, progetti, variabili-e-tipi,
  operatori, stampare-e-formattare, sfida-finale; nerd callouts added to lessons 1–6.
- Module 2 "Decisioni, cicli e funzioni" done (7 lessons): if-else, switch, while, for, foreach
  (with a first taste of fixed arrays), funzioni, sfida-finale.
- Next: Module 3 — arrays, slices and strings (lesson 2.5 only introduced `int[*]`, `.len`, indexing,
  bounds errors and `foreach (&x : a)` as a teaser; pointers were promised a module of their own).
  Planned later modules: structs/enums, optionals & error handling, modules, memory & pointers,
  defer/contracts, generics/macros, C interop.
