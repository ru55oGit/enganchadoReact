import rawWords from "an-array-of-english-words";

export function normalize(word: string): string {
  return word.toLowerCase().trim();
}

// Countries, capitals and major cities missing from "an-array-of-english-words"
// (confirmed by real gameplay — "Rome" and "England" got rejected, 2026-10-13).
const EXTRA_WORDS = [
  // Countries.
  "afghanistan","albania","algeria","andorra","angola","antigua and barbuda","argentina","armenia",
  "australia","austria","azerbaijan","bahamas","bahrain","bangladesh","barbados","belarus","belgium",
  "belize","benin","bhutan","bolivia","bosnia and herzegovina","botswana","brazil","brunei","bulgaria",
  "burkina faso","burundi","cambodia","cameroon","canada","cape verde","central african republic","chad",
  "chile","china","colombia","comoros","costa rica","croatia","cuba","cyprus","denmark","djibouti",
  "dominica","dominican republic","ecuador","egypt","el salvador","england","equatorial guinea","eritrea",
  "estonia","eswatini","ethiopia","fiji","finland","france","gabon","gambia","georgia","germany","ghana",
  "greece","greenland","grenada","guatemala","guinea","guinea-bissau","guyana","haiti","honduras",
  "hungary","iceland","india","indonesia","iran","iraq","ireland","israel","italy","ivory coast",
  "jamaica","japan","jordan","kazakhstan","kenya","kiribati","kosovo","kuwait","kyrgyzstan","laos",
  "latvia","lebanon","lesotho","liberia","libya","liechtenstein","lithuania","luxembourg","madagascar",
  "malawi","malaysia","maldives","mali","malta","mauritania","mauritius","mexico","moldova","monaco",
  "mongolia","montenegro","morocco","mozambique","myanmar","namibia","nauru","nepal","netherlands",
  "nicaragua","niger","nigeria","north korea","north macedonia","norway","oman","pakistan","palau",
  "panama","papua new guinea","paraguay","peru","philippines","poland","portugal","qatar","romania",
  "russia","rwanda","samoa","san marino","saudi arabia","scotland","senegal","serbia","seychelles",
  "sierra leone","singapore","slovakia","slovenia","somalia","south africa","south korea","south sudan",
  "spain","sri lanka","sudan","suriname","sweden","switzerland","syria","taiwan","tajikistan","tanzania",
  "thailand","togo","tonga","trinidad and tobago","tunisia","turkey","turkmenistan","tuvalu","uganda",
  "ukraine","united arab emirates","united kingdom","united states","uruguay","uzbekistan","vanuatu",
  "vatican city","venezuela","vietnam","wales","yemen","zambia","zimbabwe",
  // Capitals of the countries above, plus a few constituent-country capitals
  // (Edinburgh, Cardiff) since Scotland/Wales/England are listed too.
  "kabul","tirana","algiers","andorra la vella","luanda","saint john's","buenos aires","yerevan",
  "canberra","vienna","baku","nassau","manama","dhaka","bridgetown","minsk","brussels","belmopan",
  "porto-novo","thimphu","sucre","la paz","sarajevo","gaborone","brasilia","bandar seri begawan","sofia",
  "ouagadougou","bujumbura","phnom penh","yaounde","ottawa","praia","bangui","n'djamena","santiago",
  "beijing","bogota","moroni","san jose","zagreb","havana","nicosia","copenhagen","djibouti city",
  "roseau","santo domingo","quito","cairo","san salvador","malabo","asmara","tallinn","mbabane",
  "addis ababa","suva","helsinki","paris","libreville","banjul","tbilisi","berlin","accra","athens",
  "nuuk","saint george's","guatemala city","conakry","bissau","georgetown","port-au-prince","tegucigalpa",
  "budapest","reykjavik","new delhi","jakarta","tehran","baghdad","dublin","jerusalem","rome","abidjan",
  "yamoussoukro","kingston","tokyo","amman","nur-sultan","astana","nairobi","tarawa","pristina",
  "kuwait city","bishkek","vientiane","riga","beirut","maseru","monrovia","tripoli","vaduz","vilnius",
  "luxembourg city","antananarivo","lilongwe","kuala lumpur","male","bamako","valletta","nouakchott",
  "port louis","mexico city","chisinau","monaco","ulaanbaatar","podgorica","rabat","maputo","naypyidaw",
  "windhoek","yaren","kathmandu","amsterdam","managua","niamey","abuja","pyongyang","skopje","oslo",
  "muscat","islamabad","ngerulmud","panama city","port moresby","asuncion","lima","manila","warsaw",
  "lisbon","doha","bucharest","moscow","kigali","apia","san marino","riyadh","edinburgh","dakar",
  "belgrade","victoria","freetown","bratislava","ljubljana","honiara","mogadishu","pretoria","cape town",
  "bloemfontein","seoul","juba","madrid","colombo","khartoum","stockholm","bern","damascus","taipei",
  "dushanbe","dodoma","bangkok","lome","nuku'alofa","port of spain","tunis","ankara","ashgabat",
  "funafuti","kampala","kyiv","abu dhabi","london","washington","montevideo","tashkent","port vila",
  "vatican city","caracas","hanoi","sanaa","lusaka","harare","cardiff",
  // Major non-capital cities.
  "new york","los angeles","chicago","toronto","vancouver","montreal","barcelona","munich","milan",
  "naples","frankfurt","hamburg","seville","valencia","bilbao","dubai","shanghai","hong kong","mumbai",
  "bangalore","kolkata","saint petersburg","istanbul","osaka","kyoto","alexandria","johannesburg",
  "sao paulo","rio de janeiro","medellin","guadalajara","monterrey","cordoba","porto","genoa","turin",
  "lyon","marseille","nice","geneva","zurich","manchester","liverpool","las vegas","miami","houston",
  "boston","seattle","dallas","atlanta","philadelphia","detroit","phoenix","birmingham","glasgow",
  "belfast","sydney","melbourne","brisbane","auckland","guangzhou","shenzhen",
];

// Build the valid-word set once at module load.
const wordSet = new Set<string>(
  [...(rawWords as unknown as string[]), ...EXTRA_WORDS].filter((w) => w.length >= 3).map(normalize)
);

// Index by first letter, used to look up example solutions quickly.
const wordIndex = new Map<string, string[]>();
for (const w of wordSet) {
  const key = w[0];
  if (!wordIndex.has(key)) wordIndex.set(key, []);
  wordIndex.get(key)!.push(w);
}

export function isValidWord(word: string): boolean {
  return wordSet.has(normalize(word));
}

// English mode chains by LAST LETTER instead of last syllable — no
// diphthong/hiatus ambiguity to deal with, so this stays intentionally
// simple compared to wordEngine.ts (Spanish).
export function getChallengeLetter(word: string): string {
  const w = normalize(word);
  return w.slice(-1);
}

export function wordStartsWithLetter(word: string, letter: string): boolean {
  return normalize(word).startsWith(normalize(letter));
}

// Example words that would have continued the chain — shown on the game
// over screen when the player runs out of time.
export function getExampleSolutions(letter: string, usedWords: Set<string>, count: number): string[] {
  const normLetter = normalize(letter);
  const candidates = wordIndex.get(normLetter) ?? [];
  const available = candidates.filter((w) => !usedWords.has(w));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const STARTING_WORDS = [
  "cat", "dog", "sun", "tree", "house", "river", "mountain", "ocean", "forest", "garden",
  "bridge", "castle", "dragon", "island", "jungle", "rocket", "planet", "tiger", "eagle", "dolphin",
];

export function getStartingWord(): string {
  return STARTING_WORDS[Math.floor(Math.random() * STARTING_WORDS.length)];
}

export function getStartingWords(): string[] {
  return [...STARTING_WORDS].sort((a, b) => a.localeCompare(b, "en"));
}
