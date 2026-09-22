/**
 * Light/dark "paper" theme. The initial class is applied by an inline
 * script in app.html (before hydration, to avoid a flash); this store keeps
 * the runtime in sync and persists the explicit choice.
 */
const STORAGE_KEY = 'c3-course:theme';

export type Theme = 'light' | 'dark';

class ThemeStore {
	current = $state<Theme>('light');

	/** Read what the inline script already applied to <html>. */
	sync(): void {
		this.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
	}

	toggle(): void {
		this.set(this.current === 'dark' ? 'light' : 'dark');
	}

	set(theme: Theme): void {
		this.current = theme;
		document.documentElement.classList.toggle('dark', theme === 'dark');
		try {
			localStorage.setItem(STORAGE_KEY, theme);
		} catch {
			// Ignore: theme simply won't persist.
		}
	}
}

export const theme = new ThemeStore();
