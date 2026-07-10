import {
  normalize as normalizeEs,
  isValidWord as isValidWordEs,
  isMonosyllable,
  getChallengeSyllable,
  getStartingWord as getStartingWordEs,
  getStartingWords as getStartingWordsEs,
  wordStartsWithSyllable,
} from "./wordEngine";
import {
  normalize as normalizeEn,
  isValidWord as isValidWordEn,
  getChallengeLetter as getChallengeLetterEn,
  getStartingWord as getStartingWordEn,
  getStartingWords as getStartingWordsEn,
  wordStartsWithLetter as wordStartsWithLetterEn,
} from "./wordEngineEn";
import {
  normalize as normalizePt,
  isValidWord as isValidWordPt,
  getChallengeLetter as getChallengeLetterPt,
  getStartingWord as getStartingWordPt,
  getStartingWords as getStartingWordsPt,
  wordStartsWithLetter as wordStartsWithLetterPt,
} from "./wordEnginePt";
import { SupportedLanguage } from "../i18n/translations";

// Unifies the Spanish (syllable-chain) and English (letter-chain) engines
// behind one shape so game.tsx doesn't need to branch on language itself.
export interface WordGameEngine {
  getStartingWord(): string;
  getStartingWords(): string[];
  getChallengeUnit(word: string): string;
  unitMatchesWord(word: string, unit: string): boolean;
  isValidWord(word: string): boolean;
  isRejected(word: string): boolean;
  normalize(word: string): string;
}

const esEngine: WordGameEngine = {
  getStartingWord: getStartingWordEs,
  getStartingWords: getStartingWordsEs,
  getChallengeUnit: getChallengeSyllable,
  unitMatchesWord: wordStartsWithSyllable,
  isValidWord: isValidWordEs,
  isRejected: isMonosyllable,
  normalize: normalizeEs,
};

const enEngine: WordGameEngine = {
  getStartingWord: getStartingWordEn,
  getStartingWords: getStartingWordsEn,
  getChallengeUnit: getChallengeLetterEn,
  unitMatchesWord: wordStartsWithLetterEn,
  isValidWord: isValidWordEn,
  // English monosyllables (cat, dog, run...) are far too common to ban.
  isRejected: () => false,
  normalize: normalizeEn,
};

const ptEngine: WordGameEngine = {
  getStartingWord: getStartingWordPt,
  getStartingWords: getStartingWordsPt,
  getChallengeUnit: getChallengeLetterPt,
  unitMatchesWord: wordStartsWithLetterPt,
  isValidWord: isValidWordPt,
  isRejected: () => false,
  normalize: normalizePt,
};

const engines: Record<SupportedLanguage, WordGameEngine> = {
  es: esEngine,
  en: enEngine,
  pt: ptEngine,
};

export function getGameEngine(lang: SupportedLanguage): WordGameEngine {
  return engines[lang];
}
