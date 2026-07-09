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

// "an-array-of-spanish-words" (our dictionary) stores every word WITHOUT
// accents, so the written tilde that normally marks a hiato (e.g. biología,
// país, tenía) is already gone by the time it reaches us — "ia"/"io"/"ua"
// look identical whether they're a real diphthong (farmacia) or a lost-tilde
// hiato (biología). These are known-safe exceptions where the ending is
// unambiguously a hiato even unaccented, patched in by hand since the
// dictionary can't tell us anymore.
const HIATUS_SUFFIXES = [
  "logia", "logias", // biología, psicología, tecnología...
  "grafia", "grafias", // geografía, fotografía, biografía...
  "sofia", "sofias", // filosofía...
  "nomia", "nomias", // economía, astronomía, autonomía...
  "tomia", "tomias", // anatomía, dicotomía...
  "metria", "metrias", // geometría, simetría...
];

// Stored as the prefix ending right at the hiatus vowel (nucleus), NOT the
// whole word — trailing consonants (país, raíz, baúl, maíz) haven't been
// attached as coda yet at the point this check runs, and plurals/other
// suffixed forms already truncate to the same prefix on their own, so they
// don't need separate entries (e.g. "categorias" naturally checks against
// "categoria").
const HIATUS_WORDS = new Set([
  "dia",
  "tio", "tia",
  "rio",
  "frio", "fria",
  "pai", // país, países (only affects the singular; "países" hiatus falls mid-word already)
  "rai", // raíz
  "bau", // baúl
  "mai", // maíz
  "policia",
  "alegria",
  "energia",
  "poesia",
  "todavia",
  "categoria",
  "teoria",
  "mayoria",
  "sabiduria",
  "cortesia",
  "valentia",
  "melancolia",
  "bahia",
]);

// `word` is the exact string being syllabified at this point and `boundary`
// is the index of the second vowel in the pair under evaluation, so
// word.slice(0, boundary + 1) is precisely the prefix ending right at the
// juncture we're deciding on.
function hasKnownHiatus(word: string, boundary: number): boolean {
  const prefix = word.slice(0, boundary + 1);
  if (HIATUS_WORDS.has(prefix)) return true;
  return HIATUS_SUFFIXES.some((suf) => prefix.endsWith(suf));
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
  if (
    nucleusStart > 0 &&
    isVowel(w[nucleusStart - 1]) &&
    isDiphthong(w[nucleusStart - 1], w[nucleusStart]) &&
    !hasKnownHiatus(w, nucleusStart)
  ) {
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

/**
 * Returns the first syllable of a Spanish word, computed by peeling
 * syllables off the end (via getLastSyllable) until nothing is left.
 * Needed because a word can literally start with a syllable's letters
 * without that being its real first syllable (e.g. "tonelada" is
 * "to-ne-la-da": it starts with the letters "ton", but its first
 * syllable is "to", not "ton").
 */
export function getFirstSyllable(word: string): string {
  const w = normalize(word);
  let remainder = w;
  let first = w;
  while (remainder.length > 0) {
    const syl = getLastSyllable(remainder);
    if (!syl || syl.length > remainder.length) break;
    first = syl;
    remainder = remainder.slice(0, remainder.length - syl.length);
  }
  return first;
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

  // Sin continuaciones para la sílaba completa (ej. "dormitorio" -> "rio",
  // pero nada empieza con el diptongo "rio" salvo derivados de "río", que
  // ahora cuentan como hiato). Preferimos recortar por atrás primero
  // (RIO -> RI, nos quedamos con el ataque + núcleo) antes que por
  // adelante (RIO -> IO, perdemos la "R"): recortar por atrás mantiene el
  // sonido inicial real de la sílaba, así que se siente más parecido a
  // "seguir la palabra anterior" en vez de saltar a un arranque distinto.
  for (let len = lastSyl.length - 1; len >= 2; len--) {
    const trimmed = lastSyl.slice(0, len);
    if (hasWordsFor(trimmed)) return trimmed;
  }

  // Si tampoco hay nada, recortar por adelante como antes.
  for (let i = 1; i < lastSyl.length - 1; i++) {
    const trimmed = lastSyl.slice(i);
    if (trimmed.length >= 2 && hasWordsFor(trimmed)) return trimmed;
  }

  return lastSyl.slice(-2);
}

function hasWordsFor(prefix: string): boolean {
  const key = prefix.slice(0, 2);
  const words = wordIndex.get(key) ?? [];
  return words.some((w) => getFirstSyllable(w) === prefix);
}

export function wordStartsWithSyllable(word: string, syllable: string): boolean {
  return getFirstSyllable(word) === normalize(syllable);
}

export function getCpuWord(syllable: string, usedWords: Set<string>): string | null {
  const normSyl = normalize(syllable);
  const key = normSyl.slice(0, 2);
  const candidates = wordIndex.get(key) ?? [];
  const available = candidates.filter(
    (w) => getFirstSyllable(w) === normSyl && !usedWords.has(w) && !isMonosyllable(w) && w.length >= 3
  );
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

const STARTING_WORDS = [
  "casa", "perro", "zapato", "mesa", "camino", "tierra", "tiempo", "fuerza",
  "barco", "cielo", "piedra", "bosque", "ciudad", "campo", "puerta", "fuego",
  "monte", "patio", "libro", "techo", "roca", "noche", "tarde", "mañana",
];

export function getStartingWord(): string {
  return STARTING_WORDS[Math.floor(Math.random() * STARTING_WORDS.length)];
}

// getSyllables kept for compatibility but not used internally
export function getSyllables(word: string): string[] {
  return [getLastSyllable(word)];
}
