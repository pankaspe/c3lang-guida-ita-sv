/** English UI dictionary. Must match the shape of the reference locale (it.ts). */
import type { Messages } from '../types';

const en: Messages = {
	meta: {
		languageName: 'English'
	},
	common: {
		cancel: 'Cancel',
		save: 'Save',
		minutes: '{minutes} min',
		unknownDate: 'unknown date',
		justNow: 'just now',
		close: 'Close'
	},
	nav: {
		profile: 'Profile',
		profileAria: 'Your profile',
		settings: 'Settings',
		toLight: 'Switch to light theme',
		toDark: 'Switch to dark theme',
		lightTheme: 'Light theme',
		darkTheme: 'Dark theme'
	},
	footer: {
		basedOn: 'based on the documentation at',
		settings: 'settings',
		shortcuts: 'keyboard shortcuts'
	},
	home: {
		continue: 'Continue where you left off',
		start: 'Start the course',
		modules: 'Modules',
		moreComing: 'More modules coming soon…'
	},
	module: {
		breadcrumb: 'Breadcrumb',
		modules: 'Modules',
		number: 'Module {number}',
		lessons: { one: '{count} lesson', other: '{count} lessons' },
		readingTime: 'about {minutes} minutes of reading',
		level: 'level {level}',
		goals: 'By the end you will be able to',
		notFound: 'Module not found'
	},
	lesson: {
		position: 'Lesson {position} of {total}',
		readingTime: '{minutes} min read',
		completed: 'Lesson completed',
		copy: 'Copy lesson',
		copied: 'Lesson copied',
		copyHint: 'Copy the lesson text as markdown',
		markCompleted: 'Mark as completed',
		cheer: 'Well done! Ready for the next one?',
		pager: 'Previous and next lesson',
		previous: 'Previous',
		next: 'Next',
		finished: "You've finished the available lessons. Back to the modules",
		toc: 'In this lesson',
		notFound: 'Lesson not found'
	},
	callout: {
		tip: 'Tip',
		note: 'Note',
		warning: 'Watch out',
		fun: 'Fun fact',
		c: 'Coming from C',
		deep: 'Deep dive',
		nerd: 'Nerd details'
	},
	code: {
		terminal: 'terminal',
		copy: 'Copy',
		copied: 'Copied'
	},
	quiz: {
		label: 'Quiz',
		correct: 'Correct!',
		wrong: 'Not quite.',
		retry: 'Try again'
	},
	exercise: {
		label: 'Exercise · on your computer',
		solvedOn: 'solved on {date}',
		prompt: 'What did the program print?',
		placeholder: 'Type the output here',
		placeholderMultiline: 'Paste the output here, line by line',
		check: 'Check',
		success: "Perfect, that's exactly it!",
		mismatch: "It doesn't match.",
		mismatchHint: 'Run the program again and compare carefully, spaces included.',
		retry: 'Start over',
		done: 'Done! Keep it up.',
		markDone: "Mark as done when you've finished"
	},
	solution: {
		title: 'Show a solution',
		tryFirst: '(try on your own first!)'
	},
	profile: {
		title: 'Profile',
		description: 'Your progress, stats and milestones.',
		kicker: '// profile',
		defaultName: '{subject} learner',
		nameLabel: 'Your name',
		namePlaceholder: "What's your name?",
		editName: 'Edit name',
		since: 'Learning since {date}',
		notStarted: 'The journey starts with the first lesson',
		badgesCount: '{earned}/{total} milestones',
		resume: 'Pick up from here · {ago}',
		startTitle: 'Start the course',
		startHint: 'Your stats will come to life with the first lesson.',
		statsHeading: 'Stats',
		activityHeading: 'Activity',
		modulesHeading: 'Modules',
		badgesHeading: 'Milestones · {earned}/{total}',
		localOnly: 'Your profile lives only in this browser.',
		manageData: 'Export or delete your data',
		stats: {
			lessons: 'Lessons completed',
			lessonsHint: '{percent}% of the course',
			quiz: 'Quiz accuracy',
			quizHint: '{correct} of {answered} on the first try',
			exercises: 'Exercises solved',
			exercisesHint: 'on your computer',
			time: 'Study time',
			timeHint: 'active reading',
			streak: 'Current streak',
			streakValue: { one: '{count} day', other: '{count} days' },
			streakHint: 'best: {best}'
		},
		duration: {
			minutes: '{minutes} min',
			hours: '{hours} h {minutes} min'
		}
	},
	heatmap: {
		aria: 'Activity calendar for the last {weeks} weeks',
		cell: '{date}: {minutes} min, {actions}',
		actions: { one: '{count} action', other: '{count} actions' },
		less: 'less',
		more: 'more'
	},
	badges: {
		firstStep: { title: 'First step', description: 'Complete your first lesson' },
		sharpEye: { title: 'Sharp eye', description: '5 quizzes right on the first try' },
		handsOn: { title: 'Hands on', description: 'Solve 3 exercises on your computer' },
		nerd: { title: 'Nerd at heart', description: 'Open 5 "Nerd details" boxes' },
		streak: { title: 'Consistency', description: 'Study 3 days in a row' },
		hour: { title: 'An hour of {subject}', description: '60 minutes of study in total' },
		module: { title: 'Module {number} completed' }
	},
	settings: {
		title: 'Settings',
		description: 'Theme, reading, code, experience and managing your data.',
		kicker: '// settings',
		heading: 'The course, your way',
		intro: 'Theme, reading, code and experience. Every change applies right away, on every page.',
		sectionsAria: 'Settings sections',
		sections: {
			appearance: 'Appearance',
			reading: 'Reading',
			code: 'Code',
			experience: 'Experience',
			data: 'Data',
			keyboard: 'Keyboard',
			info: 'Info'
		},
		language: {
			title: 'Interface language',
			description: 'Only the app texts: lessons stay in {language}.',
			auto: 'Same as course'
		},
		theme: {
			title: 'Theme',
			description: '"System" follows your device settings.',
			system: 'System',
			light: 'Light',
			dark: 'Dark'
		},
		palette: {
			title: 'Palette',
			description: 'Every palette has a light and a dark version.',
			c3: { label: 'C3', description: 'Blue and violet from the logo' },
			paper: { label: 'Paper', description: 'Warm, bookish' },
			terminal: { label: 'Terminal', description: 'Green phosphors' },
			contrast: { label: 'High contrast', description: 'Maximum legibility' }
		},
		font: {
			title: 'Typeface',
			description: 'The font of the lesson text.',
			serif: 'Serif',
			sans: 'Sans serif'
		},
		textSize: { title: 'Text size', description: 'Scales the whole site.' },
		lineHeight: {
			title: 'Line spacing',
			description: 'The space between one line and the next.',
			compact: 'Compact',
			normal: 'Normal',
			relaxed: 'Airy'
		},
		measure: {
			title: 'Column width',
			description: 'Shorter lines are quicker to read.',
			narrow: 'Narrow',
			normal: 'Normal',
			wide: 'Wide'
		},
		focus: {
			title: 'Spotlight mode',
			description: "Highlights the section you're reading and dims the others."
		},
		snap: {
			title: 'Section snapping',
			description: 'When you stop scrolling near the start of a section, the page settles there.'
		},
		preview: 'preview ·',
		previewTextMd:
			'A variable is a labelled box: it has a **name**, a **type** and a **value**. For example `int age = 34;` creates a box for integers and puts 34 in it.',
		codeSize: {
			title: 'Code size',
			description: 'Only for code blocks and output.',
			small: 'Small',
			normal: 'Normal',
			large: 'Large'
		},
		ligatures: {
			title: 'Ligatures',
			description: 'Draws != as ≠ and -> as an arrow. Pretty, but confusing at first.'
		},
		motion: {
			title: 'Animations',
			description: '"None" removes every animation, fades included. "System" follows the device\'s "reduce motion" setting.',
			system: 'System',
			full: 'On',
			reduced: 'None'
		},
		sound: {
			title: 'Sounds',
			description: 'Small sounds for quizzes, exercises and completed lessons.',
			try: 'Try'
		},
		haptics: {
			title: 'Vibration',
			description: 'Short haptic feedback, on devices that support it.'
		},
		reset: 'Reset all settings',
		data: {
			localMd:
				'Progress, profile and settings live **only in this browser**, in its `localStorage`. No account, no server. If you switch browser or device, export a backup and import it there.',
			completed: 'Lessons completed',
			storage: 'Storage used',
			exportTitle: 'Export',
			exportDescription: 'Download a JSON file with all your data.',
			exportButton: 'Download backup',
			importTitle: 'Import',
			importDescription: 'Restore from a backup: it replaces the current data.',
			importConfirmMd: 'Backup from **{date}** ({entries}). Replace the current data?',
			importEntries: { one: '{count} entry', other: '{count} entries' },
			importRestore: 'Restore',
			importPick: 'Choose a file…',
			deleteTitle: 'Delete all data',
			deleteDescription:
				'Erases progress, profile and settings from this browser. It cannot be undone: export a backup first if you like.',
			deleteConfirm: 'To confirm, type',
			deleteWord: 'delete',
			deleteForever: 'Delete permanently',
			deleteStart: 'Delete…'
		},
		info: {
			content: 'Content',
			modules: { one: '{count} module', other: '{count} modules' },
			lessons: { one: '{count} lesson', other: '{count} lessons' },
			compiler: 'Reference compiler',
			docs: 'Official documentation'
		}
	},
	cheatsheet: {
		open: 'Cheat sheet',
		openAria: 'Open the language cheat sheet',
		title: 'Cheat sheet',
		intro: 'Keywords and syntax seen so far, on a single page.',
		search: 'Search: for, printf, %d…',
		searchLabel: 'Search the cheat sheet',
		loading: 'Loading…',
		empty: 'No entries for “{query}”.',
		results: { one: '{count} entry', other: '{count} entries' },
		lesson: 'Introduced in lesson {number}: {title}',
		escHint: 'to close'
	},
	shortcuts: {
		title: 'Keyboard shortcuts',
		intro:
			'The course can be navigated with the keyboard alone. Letter keys do nothing while you are typing in a text field: press Esc to leave it.',
		groups: {
			global: 'Everywhere',
			lesson: 'In lessons'
		},
		actions: {
			cheatsheet: 'Open or close the cheat sheet',
			help: 'Show these shortcuts',
			theme: 'Switch between light and dark theme',
			close: 'Close the open dialog',
			focus: 'Move to the next / previous link or button',
			next: 'Next lesson',
			previous: 'Previous lesson',
			check: 'Check an exercise answer'
		},
		keys: {
			esc: 'Esc',
			tab: 'Tab',
			shift: 'Shift',
			enter: 'Enter'
		}
	},
	backup: {
		invalidJson: 'The file is not valid JSON.',
		notABackup: "This file doesn't look like a {title} backup.",
		tooNew: 'The backup comes from a newer version of the course.'
	}
};

export default en;
