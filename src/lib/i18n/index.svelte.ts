/**
 * UI internationalisation. Dictionaries live in `./locales/<tag>.ts` and are
 * discovered automatically: adding a language means adding one file.
 *
 * The UI language defaults to the course language (`locale` in
 * src/content/course.json) and can be overridden in Settings. Only the app
 * chrome is translated: lesson content is whatever the course is written in.
 *
 * `t()` reads reactive state, so any template or `$derived` that calls it
 * updates when the language changes. Prerendered pages use the course
 * language, so SSR output stays deterministic.
 */
import { course } from '$lib/content/course';
import { renderInline } from '$lib/markdown/inline';
import { settings } from '$lib/state/settings.svelte';
import type { MessageKey, Messages, Params, PluralForms } from './types';

export type { MessageKey, Messages, Params } from './types';

/** Locale whose dictionary defines the keys; used when a message is missing. */
const REFERENCE_LOCALE = 'it';
/** Used when neither the requested language nor its base language has a dictionary. */
const FALLBACK_LOCALE = 'en';

const modules = import.meta.glob<Messages>('./locales/*.ts', { eager: true, import: 'default' });

export const DICTIONARIES: Record<string, Messages> = Object.fromEntries(
	Object.entries(modules).map(([path, messages]) => [path.replace(/^.*\/|\.ts$/g, ''), messages])
);

/** Available UI languages, as `[tag, native name]` pairs. */
export const AVAILABLE_LOCALES: [string, string][] = Object.entries(DICTIONARIES)
	.map(([tag, messages]): [string, string] => [tag, messages.meta.languageName])
	.sort(([a], [b]) => a.localeCompare(b));

/** Best dictionary for a BCP 47 tag: exact match, then base language, then fallback. */
export function resolveLocale(tag: string): string {
	if (tag in DICTIONARIES) return tag;
	const base = tag.split('-')[0];
	if (base in DICTIONARIES) return base;
	return FALLBACK_LOCALE in DICTIONARIES ? FALLBACK_LOCALE : REFERENCE_LOCALE;
}

function lookup(messages: Messages, key: string): string | PluralForms | undefined {
	let node: unknown = messages;
	for (const part of key.split('.')) node = (node as Record<string, unknown> | undefined)?.[part];
	return node as string | PluralForms | undefined;
}

class I18n {
	/** Active UI language (a key of DICTIONARIES). */
	locale = $derived(resolveLocale(settings.prefs.locale === 'auto' ? course.locale : settings.prefs.locale));

	private messages = $derived(DICTIONARIES[this.locale]);
	private plurals = $derived(new Intl.PluralRules(this.locale));

	/** Translate `key`, filling `{name}` placeholders from `params`. */
	t = (key: MessageKey, params?: Params): string => {
		let message = lookup(this.messages, key) ?? lookup(DICTIONARIES[REFERENCE_LOCALE], key) ?? key;
		if (typeof message !== 'string') {
			const count = Number(params?.count ?? 0);
			const form = count === 0 && message.zero !== undefined ? 'zero' : this.plurals.select(count);
			message = message[form] ?? message.other;
		}
		if (!params) return message;
		return message.replace(/\{(\w+)\}/g, (match, name: string) =>
			name in params ? String(params[name]) : match
		);
	};

	/** Like `t()`, rendered as safe inline HTML (`code`, **bold**, *italic*) for `{@html}`. */
	md = (key: MessageKey, params?: Params): string => renderInline(this.t(key, params));

	date = (date: Date, options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }): string =>
		Number.isNaN(date.getTime()) ? this.t('common.unknownDate') : date.toLocaleString(this.locale, options);

	/** "3 hours ago", "yesterday"... relative to now. */
	relative = (date: Date): string => {
		const minutes = Math.round((Date.now() - date.getTime()) / 60_000);
		if (minutes < 1) return this.t('common.justNow');
		const format = new Intl.RelativeTimeFormat(this.locale, { numeric: 'auto' });
		if (minutes < 60) return format.format(-minutes, 'minute');
		const hours = Math.round(minutes / 60);
		if (hours < 24) return format.format(-hours, 'hour');
		return format.format(-Math.round(hours / 24), 'day');
	};

	/** Name of a language in the current UI language, e.g. "it" → "italiano". */
	languageName = (tag: string): string =>
		new Intl.DisplayNames([this.locale], { type: 'language' }).of(tag) ?? tag;
}

export const i18n = new I18n();
export const t = i18n.t;
