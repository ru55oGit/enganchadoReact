export type SupportedLanguage = "es" | "en" | "pt";

export interface Translation {
  // Layout
  appName: string;
  drawerHome: string;
  drawerPlay: string;

  // Home
  tagline: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  readyToPlay: string;
  exampleChainLabel: string;
  exampleChain: string[];
  exampleExplanation: string;
  playButton: string;
  freeModeLabel: string;
  freeModeSub: string;
  bestStreakTitle: string;
  wordsLabel: string;
  pointsLabel: string;
  dateLocale: string;
  whatIsTitle: string;
  whatIsBody: string;
  howToPlayTitle: string;
  howToPlayBody: string;

  // Game
  startingWordLabel: string;
  idleInstruction: string;
  startButton: string;
  gameOverTitle: string;
  scoreLabel: string;
  chainOfWords: (n: number) => string;
  yourChainLabel: string;
  playAgainButton: string;
  backToHomeButton: string;
  currentWordLabel: string;
  mustStartWithLabel: string;
  inputPlaceholder: (unit: string) => string;
  chainCount: (n: number) => string;

  // Errors
  errorTooShort: string;
  errorWrongStart: (unit: string) => string;
  errorNotInDictionary: string;
  errorMonosyllable: string;
  errorAlreadyUsed: string;
}

const es: Translation = {
  appName: "Enganchado",
  drawerHome: "Inicio",
  drawerPlay: "Jugar",

  tagline: "pensá · enganchá · ganás",
  greetingMorning: "Buenos días ☀️",
  greetingAfternoon: "Buenas tardes 🌤️",
  greetingEvening: "Buenas noches 🌙",
  readyToPlay: "¿Listo para jugar Enganchado?",
  exampleChainLabel: "Ejemplo de cadena",
  exampleChain: ["CASA", "SAPO", "POZO", "ZORRO", "ROPERO"],
  exampleExplanation: "La última sílaba de ROPERO es RO → tu palabra empieza con RO",
  playButton: "¡JUGAR!",
  freeModeLabel: "MODO LIBRE",
  freeModeSub: "¡A ver cuánto llegás!",
  bestStreakTitle: "Mejor Racha",
  wordsLabel: "palabras",
  pointsLabel: "puntos",
  dateLocale: "es-AR",
  whatIsTitle: "¿Qué es Enganchado?",
  whatIsBody: "Enganchado es un juego de palabras encadenadas. Tomá la última sílaba de la palabra anterior y formá una nueva. ¿Hasta dónde podés llegar antes de que se acabe el tiempo?",
  howToPlayTitle: "¿Cómo jugar?",
  howToPlayBody: "Te damos una palabra de inicio. Usá su última sílaba para arrancar la siguiente, y así sucesivamente. Tenés 15 segundos por turno. No valen monosílabos ni palabras repetidas. Cuanto más larga la cadena y más rápido respondés, más puntos sumás.",

  startingWordLabel: "Palabra inicial",
  idleInstruction: "Tomá la última sílaba y enganchá la siguiente palabra",
  startButton: "¡Empezar!",
  gameOverTitle: "¡Se acabó el tiempo!",
  scoreLabel: "Puntaje",
  chainOfWords: (n) => `Cadena de ${n} palabras`,
  yourChainLabel: "Tu cadena",
  playAgainButton: "Jugar de nuevo",
  backToHomeButton: "Volver al inicio",
  currentWordLabel: "Palabra actual",
  mustStartWithLabel: "Tu palabra debe empezar con",
  inputPlaceholder: (unit) => `Empezá con ${unit}...`,
  chainCount: (n) => `Cadena (${n})`,

  errorTooShort: "La palabra debe tener al menos 3 letras.",
  errorWrongStart: (unit) => `La palabra debe empezar con "${unit}".`,
  errorNotInDictionary: "Esa palabra no existe en el diccionario.",
  errorMonosyllable: "No valen monosílabos.",
  errorAlreadyUsed: "Esa palabra ya fue usada.",
};

const en: Translation = {
  appName: "Enganchado",
  drawerHome: "Home",
  drawerPlay: "Play",
  tagline: "Word Chain",
  greetingMorning: "Good morning ☀️",
  greetingAfternoon: "Good afternoon 🌤️",
  greetingEvening: "Good evening 🌙",
  readyToPlay: "Ready to play Word Chain?",
  exampleChainLabel: "Example chain",
  exampleChain: ["CAT", "TIGER", "ROCKET", "TOWER", "RIVER"],
  exampleExplanation: "The last letter of TOWER is R → your word starts with R",
  playButton: "PLAY!",
  freeModeLabel: "FREE MODE",
  freeModeSub: "See how far you can go!",
  bestStreakTitle: "Best Streak",
  wordsLabel: "words",
  pointsLabel: "points",
  dateLocale: "en-US",
  whatIsTitle: "What is Word Chain?",
  whatIsBody: "Word Chain is a linked-word game. Take the last letter of the previous word and start a new one with it. How far can you get before time runs out?",
  howToPlayTitle: "How to play?",
  howToPlayBody: "We give you a starting word. Use its last letter to start the next one, and so on. You get 15 seconds per turn. No repeated words. The longer the chain and the faster you answer, the more points you score.",

  startingWordLabel: "Starting word",
  idleInstruction: "Take the last letter and link the next word",
  startButton: "Start!",
  gameOverTitle: "Time's up!",
  scoreLabel: "Score",
  chainOfWords: (n) => `Chain of ${n} word${n === 1 ? "" : "s"}`,
  yourChainLabel: "Your chain",
  playAgainButton: "Play again",
  backToHomeButton: "Back to home",
  currentWordLabel: "Current word",
  mustStartWithLabel: "Your word must start with",
  inputPlaceholder: (unit) => `Start with ${unit}...`,
  chainCount: (n) => `Chain (${n})`,

  errorTooShort: "The word must be at least 3 letters long.",
  errorWrongStart: (unit) => `The word must start with "${unit}".`,
  errorNotInDictionary: "That word isn't in the dictionary.",
  errorMonosyllable: "Single-syllable words aren't allowed.",
  errorAlreadyUsed: "That word was already used.",
};

const pt: Translation = {
  appName: "Enganchado",
  drawerHome: "Início",
  drawerPlay: "Jogar",

  tagline: "Palavra Encadeada",
  greetingMorning: "Bom dia ☀️",
  greetingAfternoon: "Boa tarde 🌤️",
  greetingEvening: "Boa noite 🌙",
  readyToPlay: "Pronto para jogar Palavra Encadeada?",
  exampleChainLabel: "Exemplo de cadeia",
  exampleChain: ["CASA", "ÁRVORE", "ESCOLA", "AMOR", "RIO"],
  exampleExplanation: "A última letra de AMOR é R → sua palavra começa com R",
  playButton: "JOGAR!",
  freeModeLabel: "MODO LIVRE",
  freeModeSub: "Veja até onde você chega!",
  bestStreakTitle: "Melhor Sequência",
  wordsLabel: "palavras",
  pointsLabel: "pontos",
  dateLocale: "pt-BR",
  whatIsTitle: "O que é Palavra Encadeada?",
  whatIsBody: "Palavra Encadeada é um jogo de palavras em cadeia. Pegue a última letra da palavra anterior e comece uma nova com ela. Até onde você consegue chegar antes que o tempo acabe?",
  howToPlayTitle: "Como jogar?",
  howToPlayBody: "Damos uma palavra inicial. Use a última letra dela para começar a próxima, e assim por diante. Você tem 15 segundos por rodada. Sem palavras repetidas. Quanto mais longa a cadeia e mais rápido você responder, mais pontos você ganha.",

  startingWordLabel: "Palavra inicial",
  idleInstruction: "Pegue a última letra e encadeie a próxima palavra",
  startButton: "Começar!",
  gameOverTitle: "Tempo esgotado!",
  scoreLabel: "Pontuação",
  chainOfWords: (n) => `Cadeia de ${n} palavra${n === 1 ? "" : "s"}`,
  yourChainLabel: "Sua cadeia",
  playAgainButton: "Jogar de novo",
  backToHomeButton: "Voltar ao início",
  currentWordLabel: "Palavra atual",
  mustStartWithLabel: "Sua palavra deve começar com",
  inputPlaceholder: (unit) => `Comece com ${unit}...`,
  chainCount: (n) => `Cadeia (${n})`,

  errorTooShort: "A palavra deve ter pelo menos 3 letras.",
  errorWrongStart: (unit) => `A palavra deve começar com "${unit}".`,
  errorNotInDictionary: "Essa palavra não existe no dicionário.",
  errorMonosyllable: "Palavras monossílabas não valem.",
  errorAlreadyUsed: "Essa palavra já foi usada.",
};

export const translations: Record<SupportedLanguage, Translation> = { es, en, pt };

export const availableLanguages: Array<{
  code: SupportedLanguage;
  name: string;
  flag: string;
}> = [
  { code: "es", name: "Español", flag: "🇦🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
];
