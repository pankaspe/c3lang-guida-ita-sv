# CLAUDE.md

Interactive Italian course for learning the C3 language (https://c3-lang.org), built as a fully
static SvelteKit site, live at https://c3-tutorial.pages.dev. This file is the layout and authoring
reference; README.md is the public face of the repo (what the course is, module table, how to run it):
update its module table when a module is added.

## Hard rules

- **c3-lang.org is the reference.** Always base lesson content on the official docs at
  https://c3-lang.org (full dump: https://c3-lang.org/all), cross-checked against the real compiler
  (see below). Don't rely on memory of C3 or on third-party material.
- **App code in English** (Svelte, TS, identifiers, comments, commit messages). **No hard-coded UI
  text in components**: every user-visible string goes through the i18n dictionaries (see
  "Internationalisation" below); course-specific texts go in `src/content/course.json`.
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
  Before finishing a module, extract every complete program (`c3` fence with `fn void main`) from the
  new `.svx` files, compile-run it and diff against the following `output` fence. Runtime panic
  traces are quoted with shortened paths (`in window.main (window.c3:7) [window] [inline]`), and
  output that varies per run (dangling memory) is presented as such in the prose.
  The compiler version shown in the app is `compiler` in `src/content/course.json`: update it
  when the reference compiler changes.
- No sandbox / in-browser code execution. Exercises are done on the learner's machine.
- Runtime is **bun** (`bun run dev|build|check`). There is no `node`/`npx` on this machine.

## Stack

SvelteKit 2 · Svelte 5 runes · Tailwind 4 (+typography, class-based dark mode) · mdsvex ·
Prism with a hand-written C3 grammar (`src/lib/markdown/prism-c3.ts`) · `@sveltejs/adapter-static`.
Config lives in `vite.config.ts` (no `svelte.config.js`).

## Internationalisation

The app is a generic, localisable course reader; the content is Italian only (no English lessons).

- UI strings: `src/lib/i18n/locales/<tag>.ts`, auto-discovered. `it.ts` is the **reference**: its
  shape defines the `Messages` type, so `en.ts` (and any new locale) must have the same keys or
  `bun run check` fails. **Add every new key to all locale files.**
- `src/lib/i18n/index.svelte.ts`: `t('dotted.key', { param })` (reactive; `{name}` placeholders,
  `{ one, other }` plurals picked from `count`), `i18n.md()` for `…Md` keys (inline markdown →
  `{@html}`), `i18n.date()` / `i18n.relative()` / `i18n.languageName()` via `Intl`. Never format
  dates with a hard-coded locale.
- UI language = `locale` in `course.json` unless overridden by the `locale` preference (Settings →
  Aspetto). Prerendered HTML uses the course language; `<html lang>` is always the course language
  (`%c3.lang%` in `app.html`, filled by `hooks.server.ts`).
- `src/content/course.json` (`src/lib/content/course.ts` types it): title, subject, logo, tagline,
  hero, footer, about, docs link, compiler, course-specific badges. Written in the course language.
- Routes are English and language-neutral: `/`, `/modules/[module]/[lesson]`, `/profile`,
  `/privacy`, `/settings` (section anchors `#appearance`, `#reading`, `#code`, `#experience`, `#keyboard`, `#data`,
  `#info`).

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
- Pages: `/settings` (Aspetto incl. UI language, Lettura, Codice, Esperienza, Dati:
  export/import/delete, Info), `/profile` (identicon + name, resume, stats, heatmap, modules, badges
  from `content/badges.ts` + `course.json`).
- Animations: page content only **fades in** (opacity, no movement, no stagger, no page/View
  Transitions — the user explicitly asked for "solo il fadeIn"). `.anim-fade` on a page's root (pure
  CSS, works on prerendered HTML) + the `reveal(selector)` attachment in `src/lib/motion.ts` for blocks
  below the fold (only hides those, so nothing visible flickers on hydration). Lesson and module views
  are wrapped in `{#key}` so the fade replays between lessons/modules. Small interaction feedback
  (`.anim-rise|pop|shake|draw|ring` on quiz/exercise/buttons) stays. Settings → Esperienza →
  Animazioni "Nessuna" (`motion: 'reduced'`) removes everything, fades included; so does
  `prefers-reduced-motion` with "Sistema".
  - Section snap (`snap` preference, `data-snap`): `scroll-snap-type: y proximity` on lesson pages,
    each `.lesson-section` snaps at its start. Never `mandatory`: sections are longer than the screen.
- Cheat sheet ("Prontuario"): floating button on every page + `K` key, a native `<dialog>` via
  `components/ui/Modal.svelte`. Data in `src/content/cheatsheet.json` (typed by
  `src/lib/content/cheatsheet.ts`); the body (`CheatSheetBody.svelte`, with Prism) is lazy-loaded on
  first open.
- Keyboard shortcuts: `src/lib/shortcuts.svelte.ts` (`handleShortcut` on the window in the root layout,
  `panels` = which dialog is open, `SHORTCUTS` = the table shown in the `?` dialog and Settings →
  Tastiera). A new shortcut goes in `SHORTCUTS` + `shortcuts.actions.*` in every locale. Letter keys are
  ignored while typing in a field. Lesson prev/next links carry `data-shortcut="previous|next"`.
- "Copia lezione" in the lesson header copies the lesson as markdown (`loadLessonMarkdown` in the
  registry, `?raw` glob loaded on demand, so it never grows the lesson chunk).

## Deploy & SEO

- Cloudflare Pages, configured in the dashboard (build `bun run build`, output `build`). There is no
  `wrangler.toml` on purpose: Pages would read it instead of the dashboard and requires `name` in it.
- `fallback: '404.html'` in the adapter so unknown URLs get a real 404, not the homepage with 200.
- Footer: `components/ui/SiteFooter.svelte` (course links, docs/GitHub/issues from `course.json`
  `docs`/`repository`, `copyright`). `/privacy` explains the localStorage-only data model; keep it
  true if anything starts talking to a server (analytics, external fonts...) and bump its date.
- `url` in `course.json` = public site address (https://c3-tutorial.pages.dev). While empty, canonical/`og:url`, the sitemap entries
  and the `Sitemap:` line in robots.txt are omitted (`src/lib/seo.ts`). `robots.txt` and
  `sitemap.xml` are prerendered routes (`src/routes/*/+server.ts`), the sitemap lists home, modules
  and lessons automatically.
- Every page sets its head via `components/ui/Seo.svelte` (title, description, canonical, Open Graph,
  Twitter card); `noindex` on `/profile` and `/settings`. The home page adds a schema.org `Course`
  JSON-LD.
- Preview images (`og:image`, 1200x630) are generated offline by `python3 scripts/og-images.py`
  (Pillow, fonts from node_modules) into `static/og/` and committed: `index.png` (default),
  `<module>.png`, `<module>/<lesson>.png`. **Re-run it after adding/renaming a module or lesson**;
  the build warns about missing ones (`sitemap.xml/+server.ts`).

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
- **Cheat sheet**: every lesson that introduces a keyword, type, operator, stdlib call or compiler
  command adds an entry to `src/content/cheatsheet.json` (in the right section, or a new section with
  an `Icon.svelte` icon): `term`, optional `code` (English, verified with c3c; `lang: "bash"` for shell),
  `text` (Italian, inline markdown), `lesson` (`<moduleSlug>/<lessonSlug>`). Keep entries to 1–2
  sentences.
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
- Module 3 "Array, slice e stringhe" done (8 lessons): array, slice, slice-e-funzioni, griglie,
  stringhe, costruire-stringhe (temp memory, `tformat`, `DString`, `@pool`, a first taste of
  `mem`/`free`), liste (`List`, `sort::quicksort`), sfida-finale. Optionals (`pop`, `to_int`) were
  deliberately avoided; the final challenge's parallel lists set up structs.
- Module 4 "Struct ed enum" done (7 lessons): struct, metodi (`self` vs `&self`),
  collezioni-di-struct (foreach `&p`, comparator for `sort::quicksort`), enum, enum-con-dati
  (associated values, state machine, constdef), alias-e-typedef, sfida-finale (blackjack).
  Gotchas found: `==` on structs is an error; `printn` of an array/List of structs prints addresses;
  enum props are `Enum::values` / `Enum::from_ordinal` (docs say `.`); short enum names fail where
  the type can't be inferred; writing an associated value compiles but crashes.
- Next: Module 5 — optionals & error handling (promised at the end of module 4: `find` returning
  -1, `pop()`, `to_int()`).
  Planned later modules: modules, memory & pointers,
  defer/contracts, generics/macros, C interop.
- Idea under evaluation (not started, don't build unasked): a `/play` section with an android the
  learner names (`const NAME`) and assembles as the course goes on. Parts appear with completed lessons,
  and per-module missions have the learner run C3 locally and paste a small line-based "firmware"
  output (`NAME: Bolt`, `STEP`, ...) that the app parses and animates (no in-browser execution).
  Leaning towards three.js with a low-poly android built from primitives, lazy-loaded on /play, colours
  from CSS tokens. Open: 2D vs 3D, one android vs one per module, missions optional vs badges.
  First step when resumed: design the module-1 firmware on paper.
