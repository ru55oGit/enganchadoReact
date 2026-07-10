import rawWords from "an-array-of-english-words";

export function normalize(word: string): string {
  return word.toLowerCase().trim();
}

// Build the valid-word set once at module load.
const wordSet = new Set<string>(
  (rawWords as unknown as string[]).filter((w) => w.length >= 3).map(normalize)
);

// Index by first letter, used to look up example solutions quickly.
const wordIndex = new Map<string, string[]>();
for (const w of wordSet) {
  const key = w[0];
  if (!wordIndex.has(key)) wordIndex.set(key, []);
  wordIndex.get(key)!.push(w);
}

export function isValidWord(word: string): boolean {
  return wordSet.has(normalize(word));
}

// English mode chains by LAST LETTER instead of last syllable — no
// diphthong/hiatus ambiguity to deal with, so this stays intentionally
// simple compared to wordEngine.ts (Spanish).
export function getChallengeLetter(word: string): string {
  const w = normalize(word);
  return w.slice(-1);
}

export function wordStartsWithLetter(word: string, letter: string): boolean {
  return normalize(word).startsWith(normalize(letter));
}

// Example words that would have continued the chain — shown on the game
// over screen when the player runs out of time.
export function getExampleSolutions(letter: string, usedWords: Set<string>, count: number): string[] {
  const normLetter = normalize(letter);
  const candidates = wordIndex.get(normLetter) ?? [];
  const available = candidates.filter((w) => !usedWords.has(w));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const STARTING_WORDS = [
  "cat", "dog", "sun", "tree", "house", "river", "mountain", "ocean", "forest", "garden",
  "bridge", "castle", "dragon", "island", "jungle", "rocket", "planet", "tiger", "eagle", "dolphin",
];

export function getStartingWord(): string {
  return STARTING_WORDS[Math.floor(Math.random() * STARTING_WORDS.length)];
}

export function getStartingWords(): string[] {
  return [...STARTING_WORDS].sort((a, b) => a.localeCompare(b, "en"));
}
