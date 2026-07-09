import rawWords from "an-array-of-spanish-words";

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

// ── Spanish syllabification ──────────────────────────────────────────────────

const VOWELS = new Set("aeiouáéíóúü");
const STRONG_VOWELS = new Set("aeoáéó");
const WEAK_VOWELS = new Set("iuíúü");

// Consonant clusters that form an inseparable onset (go together to the next syllable)
const LIQUID_CLUSTERS = new Set([
  "bl","br","cl","cr","dr","fl","fr","gl","gr","pl","pr","tr","vr",
  "ch","ll","rr","gu","qu",
]);

function isVowel(c: string): boolean {
  return VOWELS.has(c);
}

function isDiphthong(a: string, b: string): boolean {
  if (STRONG_VOWELS.has(a) && STRONG_VOWELS.has(b)) return false; // hiatus
  if (a === "í" || a === "ú" || b === "í" || b === "ú") return false; // accented weak = hiatus
  return isVowel(a) && isVowel(b);
}

/**
 * Returns the last syllable of a Spanish word using proper syllabification rules.
 * Much more accurate than hypher for this purpose.
 */
export function getLastSyllable(word: string): string {
  const w = normalize(word);

  // Find the last vowel
  let lastVowelIdx = -1;
  for (let i = w.length - 1; i >= 0; i--) {
    if (isVowel(w[i])) { lastVowelIdx = i; break; }
  }
  if (lastVowelIdx === -1) return w;

  // Extend vowel nucleus backward to include diphthong
  let nucleusStart = lastVowelIdx;
  if (nucleusStart > 0 && isVowel(w[nucleusStart - 1]) && isDiphthong(w[nucleusStart - 1], w[nucleusStart])) {
    nucleusStart--;
  }

  // Find onset: consonants immediately before the nucleus
  let onsetStart = nucleusStart;
  if (onsetStart > 0 && !isVowel(w[onsetStart - 1])) {
    onsetStart--; // take one consonant
    // Try to take a second consonant if it forms an inseparable cluster
    if (onsetStart > 0 && !isVowel(w[onsetStart - 1])) {
      const cluster = w[onsetStart - 1] + w[onsetStart];
      if (LIQUID_CLUSTERS.has(cluster)) {
        onsetStart--;
      }
    }
  }

  // Include everything from onset start to end of word (coda included)
  return w.slice(onsetStart);
}

export function isValidWord(word: string): boolean {
  return wordSet.has(normalize(word));
}

/** Count vowel nuclei to detect monosyllables (more reliable than hypher) */
export function isMonosyllable(word: string): boolean {
  const w = normalize(word);
  let nuclei = 0;
  let i = 0;
  while (i < w.length) {
    if (isVowel(w[i])) {
      nuclei++;
      // Skip diphthong
      if (i + 1 < w.length && isVowel(w[i + 1]) && isDiphthong(w[i], w[i + 1])) i++;
    }
    i++;
  }
  return nuclei <= 1;
}

// Returns the syllable the next word must START with (with fallback)
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
  const key = prefix.slice(0, 2);
  const words = wordIndex.get(key) ?? [];
  return words.some((w) => w.startsWith(prefix));
}

export function wordStartsWithSyllable(word: string, syllable: string): boolean {
  return normalize(word).startsWith(normalize(syllable));
}

export function getCpuWord(syllable: string, usedWords: Set<string>): string | null {
  const normSyl = normalize(syllable);
  const key = normSyl.slice(0, 2);
  const candidates = wordIndex.get(key) ?? [];
  const available = candidates.filter(
    (w) => w.startsWith(normSyl) && !usedWords.has(w) && !isMonosyllable(w) && w.length >= 3
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

// getSyllables kept for compatibility but not used internally
export function getSyllables(word: string): string[] {
  return [getLastSyllable(word)];
}
