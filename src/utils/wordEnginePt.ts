import rawWords from "an-array-of-portuguese-words";

// A diferencia del inglés, el diccionario portugués sí trae acentos/cedilla
// (café, ação, coração...). Los sacamos igual que en español para no
// necesitar una fila de acentos en el teclado ni exigir tildes exactas.
export function normalize(word: string): string {
  return word
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

const wordSet = new Set<string>(
  (rawWords as unknown as string[]).filter((w) => w.length >= 3).map(normalize)
);

export function isValidWord(word: string): boolean {
  return wordSet.has(normalize(word));
}

// Modo por letras, igual que en inglés: la palabra siguiente arranca con
// la última letra de la anterior.
export function getChallengeLetter(word: string): string {
  const w = normalize(word);
  return w.slice(-1);
}

export function wordStartsWithLetter(word: string, letter: string): boolean {
  return normalize(word).startsWith(normalize(letter));
}

const STARTING_WORDS = [
  "gato", "cachorro", "sol", "arvore", "casa", "rio", "montanha", "oceano", "floresta", "jardim",
  "ponte", "castelo", "dragao", "ilha", "selva", "foguete", "planeta", "tigre", "aguia", "golfinho",
];

export function getStartingWord(): string {
  return STARTING_WORDS[Math.floor(Math.random() * STARTING_WORDS.length)];
}
