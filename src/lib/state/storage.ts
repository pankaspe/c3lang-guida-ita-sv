/**
 * Whole-course data management: every key this app writes to localStorage
 * starts with `c3-course:`. Export bundles them into one versioned JSON file,
 * import restores them, and clear removes them.
 */
const PREFIX = 'c3-course:';
const BACKUP_APP = 'impara-c3';
const BACKUP_VERSION = 1;

export interface Backup {
	app: typeof BACKUP_APP;
	version: number;
	exportedAt: string;
	data: Record<string, string>;
}

function courseKeys(): string[] {
	const keys: string[] = [];
	for (let index = 0; index < localStorage.length; index++) {
		const key = localStorage.key(index);
		if (key?.startsWith(PREFIX)) keys.push(key);
	}
	return keys;
}

/** Approximate size of the stored course data, in bytes. */
export function storedBytes(): number {
	try {
		return courseKeys().reduce((sum, key) => sum + key.length + (localStorage.getItem(key)?.length ?? 0), 0);
	} catch {
		return 0;
	}
}

export function createBackup(): Backup {
	const data: Record<string, string> = {};
	for (const key of courseKeys()) data[key] = localStorage.getItem(key) ?? '';
	return { app: BACKUP_APP, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), data };
}

/** Trigger a download of the backup as a dated JSON file. */
export function downloadBackup(): void {
	const backup = createBackup();
	const blob = new Blob([JSON.stringify(backup, null, '\t')], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `impara-c3-backup-${backup.exportedAt.slice(0, 10)}.json`;
	link.click();
	URL.revokeObjectURL(url);
}

/** Parse and validate a backup file; throws an Italian, user-facing message. */
export function parseBackup(text: string): Backup {
	let parsed: unknown;
	try {
		parsed = JSON.parse(text);
	} catch {
		throw new Error('Il file non è un JSON valido.');
	}
	const backup = parsed as Partial<Backup>;
	if (backup?.app !== BACKUP_APP || typeof backup.data !== 'object' || backup.data === null) {
		throw new Error('Questo file non sembra un backup di Impara C3.');
	}
	if (typeof backup.version !== 'number' || backup.version > BACKUP_VERSION) {
		throw new Error('Il backup viene da una versione più recente del corso.');
	}
	const entries = Object.entries(backup.data).filter(
		([key, value]) => key.startsWith(PREFIX) && typeof value === 'string'
	);
	return { app: BACKUP_APP, version: backup.version, exportedAt: String(backup.exportedAt ?? ''), data: Object.fromEntries(entries) };
}

/** Replace all course data with the backup's. The caller reloads the page. */
export function restoreBackup(backup: Backup): void {
	clearCourseData();
	for (const [key, value] of Object.entries(backup.data)) localStorage.setItem(key, value);
}

export function clearCourseData(): void {
	for (const key of courseKeys()) localStorage.removeItem(key);
}
