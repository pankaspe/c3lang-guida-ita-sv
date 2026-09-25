#!/usr/bin/env python3
"""
Open Graph preview images (1200x630 PNG) for link sharing, written to static/og/:

    index.png                  home and every page without a more specific image
    <module>.png               module page
    <module>/<lesson>.png      lesson page

Run after adding or renaming a module/lesson (needs Pillow):

    python3 scripts/og-images.py

The output is committed: the Pages build does not run this script.
Colours follow the dark theme tokens in src/app.css; fonts come from the
@fontsource packages already used by the site.
"""
import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
MODULES = ROOT / 'src/content/modules'
OUT = ROOT / 'static/og'
FONTS = ROOT / 'node_modules/@fontsource-variable'
SANS = FONTS / 'inter/files/inter-latin-wght-normal.woff2'
MONO = FONTS / 'jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2'

W, H = 1200, 630
PAD = 80

# Dark theme tokens (src/app.css, `.dark`).
PAPER = (11, 14, 26)
INK = (228, 231, 245)
INK_SOFT = (182, 187, 214)
MUTED = (122, 128, 160)
ACCENT = (139, 143, 249)
GRID = (255, 255, 255, 9)
BRAND_BLUE = (37, 99, 235)
BRAND_VIOLET = (124, 58, 237)

ORDERED = re.compile(r'^(\d+)-(.+?)(\.svx)?$')


def font(path: Path, size: int, weight: int) -> ImageFont.FreeTypeFont:
    face = ImageFont.truetype(str(path), size)
    face.set_variation_by_axes([weight])
    return face


def frontmatter(source: str) -> dict:
    """Same tiny `key: value` subset as src/lib/build/course-index.ts."""
    match = re.match(r'^---\r?\n([\s\S]*?)\r?\n---', source)
    data = {}
    for line in (match.group(1).splitlines() if match else []):
        pair = re.match(r'^([\w-]+):\s*(.*)$', line)
        if pair:
            value = pair.group(2).strip()
            if re.fullmatch(r'([\'"]).*\1', value):
                value = value[1:-1]
            data[pair.group(1)] = value
    return data


def gradient(width: int, height: int) -> Image.Image:
    strip = Image.new('RGB', (width, 1))
    for x in range(width):
        t = x / max(width - 1, 1)
        strip.putpixel((x, 0), tuple(round(a + (b - a) * t) for a, b in zip(BRAND_BLUE, BRAND_VIOLET)))
    return strip.resize((width, height))


def wrap(draw: ImageDraw.ImageDraw, text: str, face, width: int, max_lines: int) -> list[str]:
    lines, current = [], ''
    for word in text.split():
        candidate = f'{current} {word}'.strip()
        if draw.textlength(candidate, font=face) <= width:
            current = candidate
            continue
        lines.append(current)
        current = word
    lines.append(current)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        last = lines[-1]
        while last and draw.textlength(last + '…', font=face) > width:
            last = last.rsplit(' ', 1)[0] if ' ' in last else last[:-1]
        lines[-1] = last.rstrip(',.;:') + '…'
    return lines


def background() -> Image.Image:
    image = Image.new('RGB', (W, H), PAPER)

    # Soft brand glow, top right.
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((W - 520, -360, W + 280, 360), fill=BRAND_VIOLET + (90,))
    ImageDraw.Draw(glow).ellipse((W - 820, -300, W - 160, 260), fill=BRAND_BLUE + (55,))
    image.paste(glow.filter(ImageFilter.GaussianBlur(140)), mask=glow.filter(ImageFilter.GaussianBlur(140)))

    grid = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    lines = ImageDraw.Draw(grid)
    for x in range(0, W, 40):
        lines.line((x, 0, x, H), fill=GRID)
    for y in range(0, H, 40):
        lines.line((0, y, W, y), fill=GRID)
    image.paste(grid, mask=grid)

    image.paste(gradient(W, 10), (0, H - 10))
    return image


def render(path: Path, course: dict, kicker: str, title: str, description: str, meta: str) -> None:
    image = background()
    draw = ImageDraw.Draw(image)

    # Brand: logo mark + course name + tagline.
    mark = gradient(64, 64)
    mask = Image.new('L', (64, 64), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 63, 63), radius=14, fill=255)
    image.paste(mark, (PAD, PAD - 16), mask)
    draw.text((PAD + 32, PAD + 16), course['logo'], font=font(MONO, 26, 800), fill='white', anchor='mm')
    draw.text((PAD + 84, PAD - 12), course['title'], font=font(SANS, 30, 700), fill=INK)
    draw.text((PAD + 84, PAD + 26), course['tagline'], font=font(MONO, 20, 400), fill=MUTED)

    # Kicker, title (shrinks to fit), description.
    top = 210
    draw.text((PAD, top), kicker, font=font(MONO, 26, 500), fill=ACCENT)
    top += 50
    text_width = W - 2 * PAD
    # Big on one line; smaller when it has to wrap, so the description still fits.
    for size in (68, 56, 48):
        title_face = font(SANS, size, 750)
        lines = wrap(draw, title, title_face, text_width, 3)
        if len(lines) == 1 or (size < 68 and len(lines) <= 2) or size == 48:
            break
    line_height = round(size * 1.15)
    for line in lines:
        draw.text((PAD, top), line, font=title_face, fill=INK)
        top += line_height
    top += 28
    body = font(SANS, 28, 400)
    for line in wrap(draw, description, body, text_width, 2 if len(lines) > 1 else 3):
        draw.text((PAD, top), line, font=body, fill=INK_SOFT)
        top += 40

    # Footer line: site address and extra info.
    small = font(MONO, 22, 500)
    host = re.sub(r'^https?://|/+$', '', course.get('url', ''))
    draw.text((PAD, H - 62), host, font=small, fill=MUTED, anchor='ls')
    draw.text((W - PAD, H - 62), meta, font=small, fill=MUTED, anchor='rs')

    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, optimize=True)


def main() -> None:
    course = json.loads((ROOT / 'src/content/course.json').read_text())
    compiler = course.get('compiler', '')
    render(OUT / 'index.png', course, course['hero']['kicker'], course['hero']['title'], course['description'], compiler)
    count = 1

    for folder in sorted(p for p in MODULES.iterdir() if p.is_dir() and ORDERED.match(p.name)):
        module_order, module_slug, _ = ORDERED.match(folder.name).groups()
        module = json.loads((folder / 'module.json').read_text())
        lessons = sorted(p for p in folder.glob('*.svx') if ORDERED.match(p.name))
        minutes = 0
        for file in lessons:
            lesson_order, lesson_slug, _ = ORDERED.match(file.name).groups()
            meta = frontmatter(file.read_text())
            minutes += int(meta.get('minutes', 0) or 0)
            render(
                OUT / module_slug / f'{lesson_slug}.png',
                course,
                f'// {module_order}.{lesson_order} · {module["title"]}',
                meta.get('title', lesson_slug),
                meta.get('description', ''),
                f'{meta["minutes"]} min · {compiler}' if meta.get('minutes') else compiler,
            )
            count += 1
        render(
            OUT / f'{module_slug}.png',
            course,
            f'// {module_order} · {module.get("level", "")}'.rstrip(' ·'),
            module['title'],
            module.get('subtitle', ''),
            f'{minutes} min · {compiler}',
        )
        count += 1

    print(f'{count} images in {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
