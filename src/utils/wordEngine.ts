import Hypher from "hypher";
import spanishHyphenation from "hyphenation.es";
import rawWords from "an-array-of-spanish-words";

const hypher = new Hypher(spanishHyphenation as Record<string, unknown>);

export function normalize(word: string): string {
  return word
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

// Build Set and index once at module load
const wordSet = new Set<string>(
  (rawWords as unknown as string[]).filter((w) => w.length >= 3).map(normalize)
);

const wordIndex = new Map<string, string[]>();
for (const w of wordSet) {
  const key = w.slice(0, 2);
  if (!wordIndex.has(key)) wordIndex.set(key, []);
  wordIndex.get(key)!.push(w);
}

export function isValidWord(word: string): boolean {
  return wordSet.has(normalize(word));
}

export function getSyllables(word: string): string[] {
  return hypher.hyphenate(normalize(word));
}

export function isMonosyllable(word: string): boolean {
  return getSyllables(word).length <= 1;
}

export function getLastSyllable(word: string): string {
  const syls = getSyllables(word);
  return syls[syls.length - 1];
}

// Returns the syllable the next word must START with (normalized, with fallback)
export function getChallengeSyllable(word: string): string {
  const lastSyl = normalize(getLastSyllable(word));

  if (hasWordsFor(lastSyl)) return lastSyl;

  // Strip leading characters one by one until we find a valid prefix
  for (let i = 1; i < lastSyl.length - 1; i++) {
    const trimmed = lastSyl.slice(i);
    if (trimmed.length >= 2 && hasWordsFor(trimmed)) return trimmed;
  }

  return lastSyl.slice(-2);
}

function hasWordsFor(prefix: string): boolean {
  return (wordIndex.get(prefix)?.length ?? 0) > 0;
}

export function wordStartsWithSyllable(word: string, syllable: string): boolean {
  return normalize(word).startsWith(normalize(syllable));
}

export function getCpuWord(syllable: string, usedWords: Set<string>): string | null {
  const normSyl = normalize(syllable);
  const candidates = wordIndex.get(normSyl) ?? [];
  const available = candidates.filter(
    (w) => !usedWords.has(w) && !isMonosyllable(w) && w.length >= 3
  );
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

const STARTING_WORDS = [
  "casa", "perro", "zapato", "mesa", "camino", "tierra", "tiempo", "fuerza",
  "barco", "cielo", "piedra", "bosque", "ciudad", "campo", "puerta", "fuego",
  "monte", "patio", "libro", "techo", "roca", "noche", "tarde", "manana",
];

export function getStartingWord(): string {
  return STARTING_WORDS[Math.floor(Math.random() * STARTING_WORDS.length)];
}
