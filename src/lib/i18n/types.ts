import type it from './locales/it';

/** Plural forms, picked with Intl.PluralRules from the `count` param. */
export interface PluralForms {
	zero?: string;
	one?: string;
	two?: string;
	few?: string;
	many?: string;
	other: string;
}

type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };

/** Shape every dictionary must have: the reference locale (it.ts) with plain strings. */
export type Messages = Widen<typeof it>;

/** Dotted path to a message, e.g. `"settings.theme.title"`. */
type Paths<T, Prefix extends string = ''> = {
	[K in keyof T & string]: T[K] extends string | { other: string } ? `${Prefix}${K}` : Paths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type MessageKey = Paths<Messages>;

export type Params = Record<string, string | number>;
