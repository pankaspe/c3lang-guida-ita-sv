/**
 * User preferences (appearance, reading, code, experience), persisted as one
 * JSON object in localStorage and exposed to CSS as attributes on <html>.
 *
 * `applyStoredPreferences` is the single source of truth for turning the
 * stored object into DOM state. It runs twice:
 *  - inlined in every page's <head> before first paint (see hooks.server.ts),
 *    so it must stay self-contained: no imports, no outer variables;
 *  - from the settings store after every change.
 */
export const PREFERENCES_KEY = 'c3-course:settings';

export type ThemeMode = 'system' | 'light' | 'dark';
export type Palette = 'c3' | 'paper' | 'terminal' | 'contrast';
export type ReadingFont = 'serif' | 'sans';
export type TextSize = 100 | 125 | 150;
export type LineHeight = 'compact' | 'normal' | 'relaxed';
export type Measure = 'narrow' | 'normal' | 'wide';
export type CodeSize = 90 | 100 | 115;
export type Motion = 'system' | 'reduced' | 'full';

export interface Preferences {
	mode: ThemeMode;
	palette: Palette;
	font: ReadingFont;
	textSize: TextSize;
	lineHeight: LineHeight;
	measure: Measure;
	codeSize: CodeSize;
	ligatures: boolean;
	focus: boolean;
	motion: Motion;
	sound: boolean;
	haptics: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = {
	mode: 'system',
	palette: 'c3',
	font: 'serif',
	textSize: 100,
	lineHeight: 'normal',
	measure: 'normal',
	codeSize: 100,
	ligatures: false,
	focus: true,
	motion: 'system',
	sound: false,
	haptics: false
};

/** Read the stored preferences merged over the defaults (never throws). */
export function readPreferences(): Preferences {
	try {
		const raw = localStorage.getItem(PREFERENCES_KEY);
		const stored = raw ? (JSON.parse(raw) as Partial<Preferences>) : {};
		return { ...DEFAULT_PREFERENCES, ...stored };
	} catch {
		return { ...DEFAULT_PREFERENCES };
	}
}

/**
 * Apply the stored preferences to <html>. Self-contained on purpose (it is
 * serialised into an inline script): keep defaults in sync with
 * DEFAULT_PREFERENCES above.
 */
export function applyStoredPreferences(): void {
	var root = document.documentElement;
	var prefs: Record<string, unknown> = {};
	try {
		prefs = JSON.parse(localStorage.getItem('c3-course:settings') || '{}') || {};
		// Migrate the pre-settings theme key (plain "light" / "dark").
		var legacy = localStorage.getItem('c3-course:theme');
		if (!prefs.mode && (legacy === 'light' || legacy === 'dark')) prefs.mode = legacy;
	} catch (e) {
		prefs = {};
	}
	var mode = prefs.mode || 'system';
	var dark = mode === 'dark' || (mode === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
	root.classList.toggle('dark', dark);
	var attrs: Record<string, unknown> = {
		palette: prefs.palette || 'c3',
		font: prefs.font || 'serif',
		textSize: prefs.textSize || 100,
		lineHeight: prefs.lineHeight || 'normal',
		measure: prefs.measure || 'normal',
		codeSize: prefs.codeSize || 100,
		ligatures: prefs.ligatures ? 'on' : 'off',
		focus: prefs.focus === false ? 'off' : 'on',
		motion: prefs.motion || 'system'
	};
	for (var key in attrs) root.dataset[key] = String(attrs[key]);
}
