/**
 * Prism grammar for the C3 language (https://c3-lang.org).
 * Written by hand: Prism ships no C3 support. Token names map to the
 * colours defined in app.css under `.token.*`.
 */
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

const FORMAT_SPECIFIER = /%[-+ 0#]*\d*(?:\.\d+)?[a-zA-Z%]/;

Prism.languages.c3 = {
	comment: [
		{ pattern: /<\*[\s\S]*?\*>/, greedy: true, alias: 'doc-comment' },
		{ pattern: /\/\*[\s\S]*?\*\//, greedy: true },
		{ pattern: /(^|[^\\:])\/\/.*/, lookbehind: true, greedy: true }
	],
	string: [
		{
			// Raw strings: backticks, no escapes, `` to embed a backtick.
			pattern: /`(?:[^`]|``)*`/,
			greedy: true,
			inside: { format: FORMAT_SPECIFIER }
		},
		{
			pattern: /(?:x|b64)?"(?:\\.|[^"\\\r\n])*"/,
			greedy: true,
			inside: {
				escape: /\\(?:[abfnrtv0\\"'e]|x[\da-fA-F]{2}|u[\da-fA-F]{4}|U[\da-fA-F]{8})/,
				format: FORMAT_SPECIFIER
			}
		}
	],
	char: { pattern: /'(?:\\.|[^'\\\r\n])+'/, greedy: true },
	attribute: /@[a-zA-Z_]\w*/,
	'ct-keyword': { pattern: /\$\$?[a-zA-Z_]\w*/, alias: 'keyword' },
	keyword:
		/\b(?:fn|macro|module|import|return|if|else|for|foreach|foreach_r|while|do|switch|case|default|break|continue|nextcase|defer|try|catch|const|static|extern|inline|struct|union|enum|bitstruct|typedef|alias|attrdef|faultdef|interface|tlocal|var|asm|assert|null|true|false|self)\b/,
	'builtin-type': {
		pattern:
			/\b(?:void|bool|char|ichar|short|ushort|int|uint|long|ulong|int128|uint128|iptr|uptr|isz|usz|sz|float|double|float16|float128|any|typeid|fault|String|ZString|DString|WString|Char16|Char32)\b/,
		alias: 'class-name'
	},
	// User types are PascalCase and must contain at least one lowercase letter.
	'class-name': /\b_?[A-Z]\w*[a-z]\w*\b/,
	// Global constants, enum members and faults are SCREAMING_SNAKE_CASE.
	constant: /\b_?[A-Z][A-Z0-9_]*\b/,
	function: /\b[a-z_]\w*(?=\s*\()/,
	namespace: /\b[a-z_][a-z0-9_]*(?=::)/,
	number:
		/\b(?:0x[\da-fA-F_]+(?:\.[\da-fA-F_]*)?(?:p[+-]?\d+)?|0b[01_]+|0o[0-7_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:e[+-]?\d+)?)(?:u?l{0,2}|ull|f|d)?\b/i,
	operator: /\+\+\+|&&&|\|\|\||\?\?|!!|\+\+|--|<<=?|>>=?|[-+*\/%&|^!=<>]=?|~|\?|:/,
	punctuation: /[{}[\];(),.]|::/
};

export { Prism };
