/**
 * German Character-to-Viseme Mapper
 *
 * Converts ElevenLabs character-level alignment into timed viseme events
 * suitable for Rive's 1D blend state input (0–9).
 *
 * Rive viseme indices:
 *   0 idle  – mouth closed / rest
 *   1 pp    – lips pressed:       p, b, m
 *   2 ff    – lip-teeth:          f, v, w
 *   3 th    – tongue forward:     d, t, n, l
 *   4 ss    – teeth together:     s, z, ts, ß
 *   5 sh    – lips forward:       sch, ch
 *   6 kk    – tongue back:        k, g, r, ch (ach)
 *   7 aa    – wide open:          a, ä
 *   8 oo    – rounded:            o, ö, u, ü
 *   9 ee    – wide/stretched:     e, i, ei, ie
 */

export interface VisemeEvent {
	time: number;
	viseme: number;
	duration: number;
}

// ElevenLabs /with-timestamps alignment shape
export interface ElevenLabsAlignment {
	characters: string[];
	character_start_times_seconds: number[];
	character_end_times_seconds: number[];
}

// Digraphs/trigraphs — checked before single chars (longest match first)
const DIGRAPH_MAP: [string, number][] = [
	['sch', 5], // sh
	['tsch', 5],
	['ch', 5], // simplified: covers ich-Laut and ach-Laut
	['pf', 2], // ff
	['ts', 4], // ss
	['tz', 4], // ss
	['ei', 9], // ee
	['ai', 9], // ee
	['eu', 8], // oo
	['äu', 8], // oo
	['au', 7], // aa
	['ie', 9], // ee
	['ck', 6], // kk
	['ng', 6], // kk
	['nk', 6], // kk
	['st', 5], // word-initial German "st" → "scht"
	['sp', 5], // word-initial German "sp" → "schp"
	['qu', 6] // kk
];

const CHAR_MAP: Record<string, number> = {
	// Vowels
	a: 7,
	ä: 7,
	e: 9,
	i: 9,
	y: 9,
	o: 8,
	ö: 8,
	u: 8,
	ü: 8,

	// Labials
	b: 1,
	p: 1,
	m: 1,

	// Labiodentals
	f: 2,
	v: 2,
	w: 2,

	// Alveolars
	d: 3,
	t: 3,
	n: 3,
	l: 3,

	// Sibilants
	s: 4,
	z: 4,
	ß: 4,
	c: 4,

	// Palatals / postalveolars
	j: 5,

	// Velars / uvulars
	k: 6,
	g: 6,
	r: 6,
	q: 6,
	x: 6,

	// Silent / breath
	h: 0
};

const MIN_VISEME_DURATION = 0.08; // seconds — prevents imperceptible flicker
const IDLE_GAP_THRESHOLD = 0.12; // seconds of silence before inserting idle

export function alignmentToVisemes(alignment: ElevenLabsAlignment): VisemeEvent[] {
	const { characters, character_start_times_seconds, character_end_times_seconds } = alignment;

	if (!characters?.length) return [];

	// --- 1. Map each character (or digraph) to a raw viseme event ---
	const raw: VisemeEvent[] = [];
	let i = 0;

	while (i < characters.length) {
		const ch = characters[i].toLowerCase();

		if (!/[a-zäöüß]/.test(ch)) {
			i++;
			continue;
		}

		// Try longest digraph match first
		let matched = false;
		for (const [digraph, viseme] of DIGRAPH_MAP) {
			const len = digraph.length;
			if (i + len > characters.length) continue;
			const ahead = characters
				.slice(i, i + len)
				.map((c) => c.toLowerCase())
				.join('');
			if (ahead === digraph) {
				raw.push({
					time: character_start_times_seconds[i],
					viseme,
					duration: character_end_times_seconds[i + len - 1] - character_start_times_seconds[i]
				});
				i += len;
				matched = true;
				break;
			}
		}

		if (!matched) {
			raw.push({
				time: character_start_times_seconds[i],
				viseme: CHAR_MAP[ch] ?? 0,
				duration: character_end_times_seconds[i] - character_start_times_seconds[i]
			});
			i++;
		}
	}

	if (raw.length === 0) return [];

	// --- 2. Merge consecutive identical visemes ---
	const merged: VisemeEvent[] = [];
	for (const event of raw) {
		const last = merged[merged.length - 1];
		if (last && last.viseme === event.viseme) {
			last.duration = event.time + event.duration - last.time;
		} else {
			merged.push({ ...event });
		}
	}

	// --- 3. Enforce minimum duration — absorb short events into neighbours ---
	const stable: VisemeEvent[] = [];
	for (const event of merged) {
		if (event.duration < MIN_VISEME_DURATION && stable.length > 0) {
			// Extend the previous event to cover this one
			stable[stable.length - 1].duration =
				event.time + event.duration - stable[stable.length - 1].time;
		} else {
			stable.push({ ...event });
		}
	}

	// --- 4. Insert IDLE during significant gaps between words ---
	const withIdles: VisemeEvent[] = [];
	for (let j = 0; j < stable.length; j++) {
		const cur = stable[j];
		if (j > 0) {
			const prev = withIdles[withIdles.length - 1];
			const gap = cur.time - (prev.time + prev.duration);
			if (gap >= IDLE_GAP_THRESHOLD) {
				withIdles.push({ time: prev.time + prev.duration, viseme: 0, duration: gap });
			}
		}
		withIdles.push(cur);
	}

	// --- 5. Trailing idle ---
	const last = withIdles[withIdles.length - 1];
	if (last) {
		withIdles.push({ time: last.time + last.duration, viseme: 0, duration: 0.3 });
	}

	return withIdles;
}
