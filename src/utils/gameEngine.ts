import {
  normalize as normalizeEs,
  isValidWord as isValidWordEs,
  isMonosyllable,
  getChallengeSyllable,
  getStartingWord as getStartingWordEs,
  wordStartsWithSyllable,
} from "./wordEngine";
import {
  normalize as normalizeEn,
  isValidWord as isValidWordEn,
  getChallengeLetter,
  getStartingWord as getStartingWordEn,
  wordStartsWithLetter,
} from "./wordEngineEn";
import { SupportedLanguage } from "../i18n/translations";

// Unifies the Spanish (syllable-chain) and English (letter-chain) engines
// behind one shape so game.tsx doesn't need to branch on language itself.
export interface WordGameEngine {
  getStartingWord(): string;
  getChallengeUnit(word: string): string;
  unitMatchesWord(word: string, unit: string): boolean;
  isValidWord(word: string): boolean;
  isRejected(word: string): boolean;
  normalize(word: string): string;
}

const esEngine: WordGameEngine = {
  getStartingWord: getStartingWordEs,
  getChallengeUnit: getChallengeSyllable,
  unitMatchesWord: wordStartsWithSyllable,
  isValidWord: isValidWordEs,
  isRejected: isMonosyllable,
  normalize: normalizeEs,
};

const enEngine: WordGameEngine = {
  getStartingWord: getStartingWordEn,
  getChallengeUnit: getChallengeLetter,
  unitMatchesWord: wordStartsWithLetter,
  isValidWord: isValidWordEn,
  // English monosyllables (cat, dog, run...) are far too common to ban.
  isRejected: () => false,
  normalize: normalizeEn,
};

export function getGameEngine(lang: SupportedLanguage): WordGameEngine {
  return lang === "en" ? enEngine : esEngine;
}
