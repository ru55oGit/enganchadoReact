// Palabras "trampa" (sin ninguna continuación posible en el diccionario,
// ej. "madrid" → "drid") descubiertas en partidas reales. Una vez que una
// le corta el juego a alguien y esa persona mira el rewarded para seguir,
// se banea acá — no se vuelve a ofrecer ni a aceptar en este dispositivo,
// para no repetirle a nadie más el mismo callejón sin salida.
const BANNED_WORDS_KEY = "enganchalo_banned_words";

export function getBannedWords(): Set<string> {
  try {
    const raw = window.localStorage.getItem(BANNED_WORDS_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function banWord(word: string): void {
  try {
    const banned = getBannedWords();
    banned.add(word);
    window.localStorage.setItem(BANNED_WORDS_KEY, JSON.stringify([...banned]));
  } catch {
    /* localStorage no disponible */
  }
}
