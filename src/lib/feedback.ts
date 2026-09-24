/**
 * Sensory feedback for learner actions: tiny synthesised sounds (Web Audio,
 * no audio files) and short vibrations on devices that support them.
 * Both are opt-in from Impostazioni → Esperienza.
 */
import { settings } from '$lib/state/settings.svelte';

export type FeedbackKind = 'tap' | 'success' | 'error' | 'complete';

let audio: AudioContext | undefined;

/** One short enveloped oscillator note. */
function note(ctx: AudioContext, frequency: number, start: number, duration: number, type: OscillatorType, volume: number) {
	const oscillator = ctx.createOscillator();
	const gain = ctx.createGain();
	oscillator.type = type;
	oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + start);
	gain.gain.setValueAtTime(0, ctx.currentTime + start);
	gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + start + 0.01);
	gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
	oscillator.connect(gain).connect(ctx.destination);
	oscillator.start(ctx.currentTime + start);
	oscillator.stop(ctx.currentTime + start + duration + 0.02);
}

const SOUNDS: Record<FeedbackKind, (ctx: AudioContext) => void> = {
	tap: (ctx) => note(ctx, 1100, 0, 0.04, 'sine', 0.03),
	success: (ctx) => {
		note(ctx, 660, 0, 0.12, 'sine', 0.06);
		note(ctx, 990, 0.08, 0.18, 'sine', 0.06);
	},
	error: (ctx) => {
		note(ctx, 240, 0, 0.12, 'triangle', 0.07);
		note(ctx, 180, 0.09, 0.18, 'triangle', 0.07);
	},
	complete: (ctx) => {
		note(ctx, 523.25, 0, 0.16, 'sine', 0.05);
		note(ctx, 659.25, 0.09, 0.16, 'sine', 0.05);
		note(ctx, 783.99, 0.18, 0.32, 'sine', 0.05);
	}
};

const VIBRATIONS: Record<FeedbackKind, number | number[]> = {
	tap: 8,
	success: [12, 40, 18],
	error: [30, 50, 30],
	complete: [15, 45, 15, 45, 40]
};

export function feedback(kind: FeedbackKind, force = false): void {
	const { sound, haptics } = settings.prefs;
	if (sound || force) {
		try {
			audio ??= new AudioContext();
			if (audio.state === 'suspended') void audio.resume();
			SOUNDS[kind](audio);
		} catch {
			// Web Audio unavailable: stay silent.
		}
	}
	if ((haptics || force) && 'vibrate' in navigator) navigator.vibrate(VIBRATIONS[kind]);
}
