# Impara C3

An interactive, module-based course (in Italian) for learning the [C3 language](https://c3-lang.org),
built as a fully static SvelteKit site. No sandbox: learners compile on their own machine and
report the output back into the app.

- **App code** (Svelte, TypeScript): English.
- **Course content** (`src/content/**/*.svx`): Italian.

## Stack

SvelteKit 2 · Svelte 5 (runes) · Tailwind 4 + typography · mdsvex · Prism (custom C3 grammar) ·
`@sveltejs/adapter-static` · bun.

```sh
bun install
bun run dev      # http://localhost:5173
bun run build    # static site in ./build
bun run check    # svelte-check
```

## Project layout

```
src/
├─ content/modules/            # THE COURSE. One folder per module.
│  └─ 01-primi-passi/
│     ├─ module.json           # title, subtitle, emoji, level, goals
│     ├─ 01-benvenuto.svx      # lessons: <order>-<slug>.svx
│     └─ ...
├─ lib/
│  ├─ build/course-index.ts    # Vite plugin: scans content → virtual:course-index
│  ├─ content/registry.ts      # modules/lessons API used by routes (lazy lesson loading)
│  ├─ markdown/                # mdsvex layout, Prism C3 grammar, highlighter, remark/rehype plugins
│  ├─ components/lesson/       # Callout, Quiz, Exercise, Solution, CodeBlock (usable in .svx)
│  ├─ components/ui/           # header, theme toggle, progress bar
│  └─ state/                   # progress + theme (localStorage-backed)
└─ routes/
   ├─ +page.svelte             # home: module cards
   └─ moduli/[module]/         # module page and [lesson] page
```

## Adding a module

1. Create `src/content/modules/NN-slug/module.json`:
   ```json
   { "title": "...", "subtitle": "...", "emoji": "🧭", "level": "Base", "goals": ["..."] }
   ```
2. Add lessons as `NN-slug.svx` with frontmatter `title`, `description`, `minutes`.
3. That's it: routes, navigation, prev/next and progress are derived from the file system.

## Writing lessons

Fences: ```` ```c3 title="file.c3" ````, ```` ```output ```` (terminal look), ```` ```sh ````,
```` ```json ````, ```` ```c ````. Every block gets a copy button.

Components (no import needed; leave a blank line before and after the inner markdown):

```md
<Callout type="tip|note|warning|fun|c|deep" title="optional">…</Callout>

<Quiz question="…" options={['a', 'b']} answer={1}>explanation…</Quiz>

<Exercise title="…" expected={`exact
output`}>instructions…</Exercise>   (omit `expected` for a self-check)

<Solution>…</Solution>
```

Use `question={'…'}` (JS string) when the question contains double quotes.

**Verify every example and expected output with the real compiler** (`c3c compile-run`)
before publishing a lesson; `printn` formatting and error messages change between releases.
