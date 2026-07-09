const STORE_KEY = "enganchado_best_chain_v1";

export interface BestChain {
  words: string[];
  score: number;
  date: string;
}

function load(): BestChain | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as BestChain) : null;
  } catch {
    return null;
  }
}

export function getBestChain(): BestChain | null {
  return load();
}

export function maybeSaveBestChain(words: string[], score: number): void {
  const current = load();
  const chainLength = words.length - 1; // exclude starting word
  const currentBest = current ? current.words.length - 1 : -1;
  if (chainLength <= currentBest) return;

  const isoDate = new Date().toISOString().slice(0, 10);
  localStorage.setItem(STORE_KEY, JSON.stringify({ words, score, date: isoDate }));
}
