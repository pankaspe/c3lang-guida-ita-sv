/**
 * Reactive view of the user preferences (see preferences.ts). The initial
 * DOM state is applied before hydration by the inline bootstrap; `sync()`
 * reads the stored values after hydration, and every change is persisted and
 * re-applied to <html> through the same `applyStoredPreferences` function.
 */
import {
	DEFAULT_PREFERENCES,
	PREFERENCES_KEY,
	applyStoredPreferences,
	readPreferences,
	type Preferences
} from './preferences';

class SettingsStore {
	prefs = $state<Preferences>({ ...DEFAULT_PREFERENCES });
	/** Whether the dark theme is currently showing (resolves mode "system"). */
	isDark = $state(false);
	/** Whether the OS asks for reduced motion. */
	systemReducedMotion = $state(false);

	private darkQuery?: MediaQueryList;
	private motionQuery?: MediaQueryList;

	/** Read stored preferences and start following system theme/motion changes. */
	sync(): void {
		this.prefs = readPreferences();
		this.isDark = document.documentElement.classList.contains('dark');

		if (!this.darkQuery) {
			this.darkQuery = matchMedia('(prefers-color-scheme: dark)');
			this.darkQuery.addEventListener('change', () => {
				if (this.prefs.mode === 'system') this.apply();
			});
			this.motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
			this.systemReducedMotion = this.motionQuery.matches;
			this.motionQuery.addEventListener('change', (event) => {
				this.systemReducedMotion = event.matches;
			});
		}
	}

	/** True when animations should be skipped (explicit choice or OS setting). */
	get reducedMotion(): boolean {
		const { motion } = this.prefs;
		return motion === 'reduced' || (motion === 'system' && this.systemReducedMotion);
	}

	update(patch: Partial<Preferences>): void {
		this.prefs = { ...this.prefs, ...patch };
		this.persist();
	}

	/** Flip between light and dark (leaving "system" for an explicit choice). */
	toggleDark(): void {
		this.update({ mode: this.isDark ? 'light' : 'dark' });
	}

	reset(): void {
		this.prefs = { ...DEFAULT_PREFERENCES };
		this.persist();
	}

	private persist(): void {
		try {
			localStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.prefs));
			localStorage.removeItem('c3-course:theme'); // legacy key, now part of the settings
		} catch {
			// Storage unavailable: preferences apply to this page view only.
		}
		this.apply();
	}

	private apply(): void {
		applyStoredPreferences();
		this.isDark = document.documentElement.classList.contains('dark');
	}
}

export const settings = new SettingsStore();
