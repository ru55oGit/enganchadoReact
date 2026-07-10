import { SupportedLanguage } from "../i18n/translations";

// Clave sin sufijo usada antes de que existieran modos de idioma (siempre
// era español). Se migra a "_es" la primera vez que se lee, así nadie
// pierde su mejor racha guardada.
const LEGACY_STORE_KEY = "enganchado_best_chain_v1";

function storeKey(lang: SupportedLanguage): string {
  return `${LEGACY_STORE_KEY}_${lang}`;
}

export interface BestChain {
  words: string[];
  score: number;
  date: string;
  timeUsedSec?: number;
}

function load(lang: SupportedLanguage): BestChain | null {
  try {
    const raw = localStorage.getItem(storeKey(lang));
    if (raw) return JSON.parse(raw) as BestChain;
    if (lang === "es") {
      const legacy = localStorage.getItem(LEGACY_STORE_KEY);
      if (legacy) return JSON.parse(legacy) as BestChain;
    }
    return null;
  } catch {
    return null;
  }
}

export function getBestChain(lang: SupportedLanguage): BestChain | null {
  return load(lang);
}

export function maybeSaveBestChain(
  lang: SupportedLanguage,
  words: string[],
  score: number,
  timeUsedSec: number
): void {
  const current = load(lang);
  const chainLength = words.length - 1; // exclude starting word
  const currentBest = current ? current.words.length - 1 : -1;
  if (chainLength <= currentBest) return;

  const isoDate = new Date().toISOString().slice(0, 10);
  localStorage.setItem(storeKey(lang), JSON.stringify({ words, score, date: isoDate, timeUsedSec }));
}
