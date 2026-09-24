/**
 * Reader settings: lesson font and text size. Like the theme, the initial
 * values are applied to <html> by an inline script in app.html (before
 * hydration, to avoid a flash); this store keeps the runtime in sync and
 * persists changes to localStorage.
 *
 * The values are exposed to CSS as `data-font` and `data-text-size`
 * attributes on <html>, see app.css.
 */
const STORAGE_KEY = 'c3-course:settings';

export type ReadingFont = 'serif' | 'sans';
export type TextSize = 100 | 125 | 150;

export const TEXT_SIZES: readonly TextSize[] = [100, 125, 150];

const DEFAULT_FONT: ReadingFont = 'serif';
const DEFAULT_SIZE: TextSize = 100;

class SettingsStore {
	font = $state<ReadingFont>(DEFAULT_FONT);
	textSize = $state<TextSize>(DEFAULT_SIZE);

	/** Read what the inline script already applied to <html>. */
	sync(): void {
		const root = document.documentElement;
		this.font = root.dataset.font === 'sans' ? 'sans' : 'serif';
		const size = Number(root.dataset.textSize);
		this.textSize = TEXT_SIZES.includes(size as TextSize) ? (size as TextSize) : DEFAULT_SIZE;
	}

	setFont(font: ReadingFont): void {
		this.font = font;
		this.apply();
	}

	setTextSize(size: TextSize): void {
		this.textSize = size;
		this.apply();
	}

	reset(): void {
		this.font = DEFAULT_FONT;
		this.textSize = DEFAULT_SIZE;
		this.apply();
	}

	private apply(): void {
		const root = document.documentElement;
		root.dataset.font = this.font;
		root.dataset.textSize = String(this.textSize);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ font: this.font, textSize: this.textSize }));
		} catch {
			// Ignore: settings simply won't persist.
		}
	}
}

export const settings = new SettingsStore();
