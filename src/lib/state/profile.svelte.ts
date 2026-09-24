/**
 * Local learner profile: just a display name. No account, no server; it is
 * persisted in localStorage like everything else and included in backups.
 */
import { course } from '$lib/content/course';
import { t } from '$lib/i18n/index.svelte';

const STORAGE_KEY = 'c3-course:profile';

export const MAX_NAME_LENGTH = 32;

class Profile {
	name = $state('');
	loaded = $state(false);

	/** Name shown in the UI when none is set. */
	get displayName(): string {
		return this.name || t('profile.defaultName', { subject: course.subject });
	}

	load(): void {
		if (this.loaded) return;
		try {
			const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as { name?: unknown };
			if (typeof stored.name === 'string') this.name = stored.name.slice(0, MAX_NAME_LENGTH);
		} catch {
			// Start anonymous.
		}
		this.loaded = true;
	}

	setName(name: string): void {
		this.name = name.trim().slice(0, MAX_NAME_LENGTH);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: this.name }));
		} catch {
			// Storage unavailable.
		}
	}
}

export const profile = new Profile();
