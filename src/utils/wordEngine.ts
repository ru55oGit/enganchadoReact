import rawWords from "an-array-of-spanish-words";

export function normalize(word: string): string {
  return word
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

// Palabras comunes que faltan en "an-array-of-spanish-words" (confirmado
// por gameplay real). Se van sumando acá a medida que aparecen huecos.
// El bloque de nombres propios (abelgario...zeferino) viene de
// conmishijos.com/nombres/ninos/latinos/, agregado a pedido del usuario.
const EXTRA_WORDS = [
  "brocoli",
  "abelgario","abudemio","abundancio","abundio","acayo","acépsimas","acestes","acilino","acis","acisclo","acrisio","acte","acteón","acucio","adalgiso","adalvino","adamán","adauco","adelardo","adelbergo","adelfo","adelgiro","adelino","adelmo","ademar","adeodato","aderaldo","adonias","adonino","adonis","adrasto","adrián","adulfo","adventor","aecio","afraates","afranio","africano","áfrico","afro","afrodisio","aftonio","agabio","agacio","agamenón","ágapa","ágape","agapito","agatángelo","agatocles","agatón","agatónico","agatopo","agatópodo","agenor","agerico","agesilao","agila","agilberto","agileo","agilo","agilulfo","agis","agliberto","agnelo","agoardo","agobardo","agofredo","agomar","agricio","agripino","agrippinus","agustín","aidano","alacrino","alan","albano","albino","alfano","alfio","alicio","almárico","aloisio","alpiniano","alvito","amable","amadeo","amadís","amado","amador","amalarico","amalberto","amancio","amando","amarino","amaro","amasio","amberto","ambiorige","amenofis","amiano","amideo","amílcar","amio","amulio","androcles","anio","anquises","antolín","antonio","anubis","apiano","apio","apro","aproniano","aquilino","arrio","asensio","augusto","aurelio","auxencio","aventio","averroes","avitio","avito","áyax","bábil","bábilas","bademio","bademo","baetano","bafomet","balbino","baldomiano","baraquisio","barbaciano","barbata","barbato","barca","bardo","bardón","barsanufio","baruch","basiano","basileo","basiliano","basilio","basso","bastián","baudelio","baudolino","bel","belcebú","belino","bellido","benancio","benedicto","benicio","benigno","benito","berardo","berilo","berno","bernón","bertín","bertino","bertoldo","bertualdo","bertuino","bertulfo","besarión","bienvenido","blandino","blando","blas","boecio","bonfilio","bonifacio","bonito","bono","bonoso","brais","breno","británico","calígula","calíxtrato","calócero","calpurnio","camerino","camilo","cancianilo","canciano","cancio","candidiano","cándido","canio","capitolino","capitón","caprasio","caracalla","carino","caro","casiano","casiodoro","casto","castorio","castoro","castrense","cástulo","cataldo","catulino","catulo","cayetano","cayo","ceciliano","cecilio","ceferino","céfiro","celerino","celestino","celio","celso","censurio","cereal","césar","cesáreo","cesarino","cesarión","cesidio","claudio","clemente","clodión","clodoaldo","clodomiro","clodoveo","conceso","concordio","constanciano","constancio","constante","constantino","corbiniano","coriolano","cornelio","cratón","crescente","crescentino","crisanto","crisipo","crisótelo","crispín","cristian","cristiano","cristino","cristo","cuarto","cupido","dalmacio","dan","danilo","decencio","delfín","delfino","deodato","deogracias","desiderato","desiderio","deusdedit","dídaco","didio","digno","diocleciano","dioclecio","domecio","domingo","domnolo","donaciano","donadeo","donato","druso","dulas","dulcidio","dulcineo","dulcísimo","dunstano","durán","eaco","eadberto","eberardo","eberulfo","ebrulfo","eco","edberto","edelberto","edesio","edgardo","edualdo","edvino","edwin","efisa","efisio","egeo","egidio","egisto","eladio","eleazar","eleázaro","eleusipo","eleuterio","élfego","elián","eliano","elicio","elidia","elidio","élido","eliecer","eligio","elio","eloy","emanuel","emeberto","emerenciano","emerico","emerito","emigdio","emiliano","epifano","erenio","ermenoldo","esperado","esperato","etelvodo","eteocles","eterio","euberto","eubulo","eucadio","eucario","eucarpio","eucarpo","eudaldo","eudaocio","eudocio","eudoro","eufebio","eufronio","eugeniano","eugrafo","eulampio","eulogio","eumelio","eumenes","eumenio","eumolpo","euniciano","euno","eunomio","euplio","eupsiquio","euquerio","eurialo","eurico","eurípides","eurosio","eurulfo","eusicio","eusiquio","eustacio","eustasio","eustatio","eustoquio","eustorgio","eustosio","eustracio","eustrato","euticio","eutimio","eutiques","eutiquiano","eutiquio","eutrapio","eutropio","euvaldo","evagrio","evaldo","evandro","evangelista","evelio","evencio","everardo","evodio","evrardo","evrulfo","exiquio","expedito","exuperancio","exuperio","fabián","fabio","fabiolo","fabriciano","fabricio","factón","facundo","falcón","famiano","fándila","faustiniano","faustino","fausto","febronio","feliciano","felicio","felicísimo","felículo","felino","félix","fermín","ferreol","ferreolo","ferrucio","festo","fiacro","fidel","fidelio","fidenciano","fidencio","fidiolo","fidolo","filogonio","filólogo","filón","filoteo","fintán","fintano","firmano","firmato","firmiliano","firmo","flaminio","flaviano","flavino","flavio","flocelo","florenciano","florencio","florente","florián","floriano","floriberto","florin","florindo","florino","florio","floro","flósculo","fobo","focas","formerio","formoso","fortunato","fortunio","francisco","fraterno","fredesvindo","fridolino","frigdiano","frigidiano","frisio","froberto","frodoberto","frontón","frúctulo","fructuoso","frumencio","frutos","frutoso","fugacio","fulgencio","fulvio","furio","fusciano","fusco","fúsculo","gabino","gaciano","galdulfo","galeano","galerio","galiano","galieno","galileo","galindo","gandolfo","gandulfo","gaudioso","gavino","gayo","gelimer","gelimero","gelmiro","gemelo","geminiano","gémino","genaro","generoso","genesio","gentil","gervasio","getulio","gétulo","gil","gildardo","gordiano","graco","gulliver","gundebaldo","guntero","gurutz","habencio","heladio","helenio","heleno","helvecio","herculano","hércules","hereno","hernani","herundino","hilario","homobono","honesto","honorato","honorino","honorio","horacio","hortensio","hortulano","ignacio","iluminado","inocencio","inocente","iñaki","ioan","isacio","isidoro","isidro","ítalo","ives","ivo","jano","januario","jenaro","joan","jordán","joviniano","jovino","jovita","jucundiano","jucundo","julián","juliano","julio","juniano","junio","júpiter","justiniano","justino","justo","juvenal","juvencio","juvenciolo","juventino","lacedemón","lacedemonio","ladislao","laercio","laertes","laín","landelino","landerico","landolfo","lanfranco","largo","latino","laureano","laurencio","laurentino","lauro","lelio","leo","leobardo","leobino","leocadio","leodegario","leodobaldo","leodovaldo","leofrido","león","leonel","leonilo","leopardo","letancio","leto","leutfrido","liberal","liberato","liberio","libertino","liberto","liborio","licerio","licinio","lionel","lobo","lope","lorenzo","luano","lucano","lucas","luciano","lucidio","lúcido","lucífero","luciliano","lucilo","luciniano","lucinio","lucino","lucio","lucrecio","lúculo","ludgerio","ludgero","luminoso","lupercio","luperco","lupicinio","lupicino","lupo","lusor","lusorio","luxorio","luzbel","maclovio","macrino","macuto","magín","magino","maglorio","magno","magnus","magoriano","mainardo","majencio","mamers","mamertino","mamerto","mamiliano","mamilio","manilio","manio","manlio","mansueto","marceliano","marcelino","marcelo","marcial","marciano","marcio","marco","marcos","margarito","mariano","marino","mario","marselio","marsilio","marte","martín","martiniano","materno","matroniano","maturino","maturo","mauregato","maurilio","maurilo","maurino","mauro","maximiano","maximino","máximo","mayo","mayor","mayoriano","mayorico","mayorino","mecenas","medardo","mederico","meginardo","meinardo","melchor","melcíades","melito","melquíades","mercurial","mercurio","merenciano","meroveo","mesala","metelo","millán","minervino","minervo","modesto","modoaldo","mónico","montano","nabor","natal","natalicio","natalio","nazareno","nazario","nemesiano","nemorio","neopolo","nepomuceno","neptuno","nerón","nestorio","nilo","nino","nón","nono","nuño","obdulio","octaviano","octavio","oftalmólogo","olegario","oleguer","oliba","oliva","oriana","oliverio","olivio","olivo","optato","orco","orencio","orgetórix","oriencio","oriol","oroncio","orosio","ovidio","pablo","paciano","paciente","pacífico","pacomio","palmacio","palmiro","pandolfo","pandulfo","parisio","pascasio","pascual","pastor","paterniano","paterno","patricio","paulino","paulo","pelegrín","peregrino","perfecto","pergentino","perpetuo","perseverando","petronilo","petronio","pilatos","pío","pirmin","plácido","plautilo","plauto","pol","pompeyo","pompilio","pomponio","ponce","ponciano","poncio","póntico","porcio","porfirio","potenciano","primiano","primitivo","primo","prisciano","prisciliano","prisco","privado","privato","probo","proceso","próculo","próspero","protasio","proyecto","prudencio","prudente","publio","pudenciano","pudente","pulquerio","quinciano","quincio","quintiliano","quintilio","quintilo","quintín","quinto","quirico","quirino","quiterio","quodvuldeo","redempto","redento","regino","régulo","remo","renato","renovado","renovato","respicio","restituto","revocato","robustiano","rocco","rocky","rogaciano","rogato","román","romano","romeo","rómulo","roque","rosalino","rufiniano","rufino","rufo","rústico","rutilio","rútilo","rútulo","sabacio","sabas","sabiniano","sabino","salustiano","salustio","salvador","salvino","salvio","salvo","sancho","sandalio","santiago","santino","saturiano","saturino","saturio","saturnino","saturno","saturo","savino","secundario","secundiano","secundilo","secundino","secundo","secúndolo","segundo","semproniano","senador","septimino","septimio","séptimo","sereno","sergio","serotino","servacio","serviliano","servilio","servio","servo","servodei","servodeo","sérvulo","severiano","severino","severo","sibilino","sidonio","silas","silverio","silvestre","silvino","silvio","similiano","simpliciano","simplicio","siro","sixto","solemnio","taciano","tácito","tarcisio","tarquinio","tarquino","tarsicio","tarsilo","taurino","teobardo","tercio","terenciano","terencio","tertuliano","tertulio","tiberio","tiburcio","ticiano","tirso","torcuato","toribio","trajano","tranquilino","tranquilo","tulio","tulo","tutatis","urbano","urcisceno","urcisio","ursicino","ursicio","ursino","urso","úrsulo","valencio","valente","valentín","valentiniano","valerio","valero","venancio","venerando","ventura","venustiano","venusto","verano","vercingetórix","verecundo","vergilio","veriano","verísimo","vérulo","vicencio","vicente","víctor","victoriano","victorico","victorino","vidal","vigilio","viliulfo","vindemial","vindiciano","vinicio","virgilio","virginio","viriato","vistremundo","vital","vitaliano","vitalicio","vitálico","vitalio","vitelio","vitores","vitorino","vivaldo","vivencio","vulcano","vulpiano","yucundo","yves","zeferino",
  // Frutas y verduras (Tuttifrutalo), incluye sinónimos regionales España/Latinoamérica.
  "acerola","chirimoya","carambola","litchi","melocotón","mangostán","plátano","pitahaya","zapote",
  "kiwi","ají","alcachofa","arvejas","betabel","betarraga","boniato","cacahuete","camote","chiles",
  "chinola","col","damasco","ejotes","elote","espárragos","garbanzos","guisantes","habas","judías",
  "judías verdes","lentejas","maní","okra","parchita","patata","patilla","porotos","porotos verdes",
  "quimbombó","remolacha","soja","yuca","zapallito","zucchini",
  // Países (Tuttifrutalo), tomados de la lista de banderas de emojinaloReact.
  "afganistán","albania","alemania","andorra","angola","anguila","antigua y barbuda","arabia saudí",
  "argelia","argentina","armenia","aruba","australia","austria","azerbaiyán","bahamas","bahréin",
  "bangladesh","barbados","bélgica","belice","benín","bermudas","bielorrusia","birmania (myanmar)",
  "bolivia","bonaire","bosnia y herzegovina","botsuana","brasil","brunéi","bulgaria","burkina faso",
  "burundi","bután","cabo verde","camboya","camerún","canadá","ceuta y melilla","chad","chile","china",
  "chipre","ciudad del vaticano","colombia","comoras","corea del norte","corea del sur","costa de marfil",
  "costa rica","croacia","cuba","curazao","diego garcía","dinamarca","dominica","ecuador","egipto",
  "el salvador","emiratos árabes unidos","eritrea","escocia","eslovaquia","eslovenia","españa",
  "estados unidos","estonia","esuatini","etiopía","filipinas","finlandia","fiyi","francia","gabón",
  "gales","gambia","georgia","ghana","gibraltar","granada","grecia","groenlandia","guadalupe","guam",
  "guatemala","guayana francesa","guernsey","guinea","guinea ecuatorial","guinea-bisau","guyana",
  "haití","honduras","hong kong","hungría","india","indonesia","inglaterra","irak","irán","irlanda",
  "isla de man","isla de navidad","isla norfolk","islandia","islas åland","islas caimán","islas canarias",
  "islas cocos (keeling)","islas cook","islas feroe","islas marianas del norte","islas marshall",
  "islas salomón","islas turcas y caicos","islas vírgenes británicas","islas vírgenes de ee.uu.","italia",
  "jamaica","japón","jersey","jordania","kazajistán","kenia","kirguistán","kiribati","kosovo","kuwait",
  "laos","lesoto","letonia","líbano","liberia","libia","liechtenstein","lituania","luxemburgo","macao",
  "macedonia del norte","madagascar","malasia","malaui","maldivas","malí","malta","marruecos","martinica",
  "mauricio","mauritania","mayotte","méxico","micronesia","moldavia","mónaco","mongolia","montenegro",
  "montserrat","mozambique","namibia","nauru","nepal","nicaragua","níger","nigeria","niue","noruega",
  "nueva caledonia","nueva zelanda","omán","países bajos","pakistán","palaos","palestina","panamá",
  "papúa nueva guinea","paraguay","perú","pitcairn","polinesia francesa","polonia","portugal",
  "puerto rico","qatar","reino unido","república centroafricana","república checa","república del congo",
  "república democrática del congo","república dominicana","reunión","ruanda","rumania","rusia",
  "sáhara occidental","samoa","samoa americana","san bartolomé","san cristóbal y nieves","san marino",
  "san martín","san pedro y miquelón","san vicente y las granadinas","santa lucía","santo tomé y príncipe",
  "sark","senegal","serbia","seychelles","sierra leona","singapur","sint maarten","siria","somalia",
  "sri lanka","sudáfrica","sudán","sudán del sur","suecia","suiza","surinam","tailandia","taiwán",
  "tanzania","tayikistán","timor oriental","togo","tokelau","tonga","trinidad y tobago","túnez",
  "turkmenistán","turquía","tuvalu","ucrania","uganda","uruguay","uzbekistán","vanuatu","venezuela",
  "vietnam","wallis y futuna","yemen","yibuti","zambia","zimbabue",
  // Animales (Tuttifrutalo).
  "abeja","abejorro","ácaro","águila","ajolote","alce","almeja","anaconda","anémona de mar","araña",
  "ardilla","atún","avestruz","avispa","bacalao","ballena","boa","buey","búho","buitre","burro",
  "caballo","cabra","cabrito","cacatúa","cachorro","caimán","calamar","camaleón","canario","cangrejo",
  "canguro","cardenal","carnero","castor","cerda","cerdo","chimpancé","chinche","chinchilla","ciempiés",
  "ciervo","cisne","cobaya","cobra","cocodrilo","colibrí","cóndor","coneja","conejo","coral","cordero",
  "cucaracha","culebra","delfín","elefante","emú","erizo","erizo de mar","escarabajo","escorpión",
  "eslizón","estrella de mar","faisán","flamenco","foca","gallina","gallo","gamba","ganso","garrapata",
  "gata","gatito","gato","geco","grillo","grulla","guacamayo","gusano","halcón","hámster","hipopótamo",
  "hormiga","hurón","iguana","jabalí","jilguero","jirafa","lagarto","langosta","lechón","lechuza",
  "lenguado","león","león marino","leona","leopardo","libélula","liebre","llama","lobo","loro","mapache",
  "mariposa","mariquita","marmota","medusa","milpiés","mirlo","mofeta","mono","morsa","mosca","mosquito",
  "mula","orca","oruga","oso","oso pardo","oso polar","ostra","oveja","pato","pavo","pavo real",
  "periquito","perra","perro","pez","pez dorado","piojo","pitón","polilla","pollito","pollo","potro",
  "puercoespín","pulga","pulpo","quetzal","rana","rata","ratón","rinoceronte","salamandra",
  "salamanquesa","salmón","saltamontes","sapo","sardina","serpiente","termita","ternero","tiburón",
  "tigre","toro","tortuga","tortuga marina","tortuga terrestre","tritón","tucán","vaca","venado",
  "víbora","yegua","zorro",
  // Profesiones y oficios (Tuttifrutalo).
  "artesano","apicultor","agricultor","animador","afilador","antropólogo","administrador","astrónomo",
  "agrónomo","actuario","barrendero","barbero","botánico","cerrajero","camarero","cajero","carnicero",
  "calígrafo","cardiólogo","desarrollador web","escultor","frutero","fumigador","filólogo","físico",
  "farmacólogo","fonoaudiólogo","filósofo","geógrafo","guardabosques","historiador","imprentero","joyero",
  "kinesiólogo","lechero","lavandero","leñador","lutier","matemático","meteorólogo","óptico","obstetra",
  "pescador","panadero","peletero","pastor","paleontólogo","politólogo","paramédico","psicoanalista",
  "químico","relojero","radiólogo","sociólogo","transportista","telefonista","trabajador social",
  "vigilante","zapatero",
  // Otras palabras sueltas confirmadas jugando Tuttifrutalo.
  "cabutiá","celeste","nuria","neonatólogo",
  // Nombres (segunda tanda) y más profesiones (Tuttifrutalo).
  "aarón","abdiel","abel","abelardo","abraham","adán","adel","adolfo","adriel","adriano",
  "aharón","albert","aldo","alen","alessandro","alexander","alexei","alexis","alfred","alfredo",
  "alonso","amir","andré","angelo","aníbal","anthony","antony","arnoldo","arthur","asael",
  "ashley","astrid","baltasar","bartolo","bastian","bladimir","brandon","braulio","brayan","brian",
  "caleb","calvin","cameron","carlo","carmelo","casimiro","christian","cristhian","cristobal","cruz",
  "damián","darian","darién","dario","darren","derek","dylan","eber","eden","eder",
  "edison","efraín","efrén","eleazar","elid","elmer","elvis","emerson","esteban","estefan",
  "eugenio","ever","ezequiel","farid","fausto","floren","franco","freddy","gaspar","gastón",
  "geovanny","gerardo","gerson","gonzalo","hans","hashmed","haziel","héctor","heraclio","heberto",
  "herberth","hernán","hibraim","iker","irving","isael","isaí","isaías","ismael","jael",
  "jared","jason","jaziel","jean","jefferson","jeremías","jerson","jhosua","jhon","johan",
  "jonatan","jordan","josefo","joshua","jovany","junior","karlos","kenneth","kevin","lautaro",
  "lázaro","leon","leonardo","luca","luka","luis","maison","marcus","marlon","marvin",
  "mateo","matheo","michel","miller","misac","misael","modesto","moisés","nahim","napoleón",
  "nelson","nolberto","norberto","obed","omar","orlando","osvaldo","owen","paolo","peter",
  "ramsés","raymond","renato","renzo","rey","ricardo","richard","roberth","rodolfo","rogelio",
  "ronald","ronaldo","roy","rubén","said","salomón","samir","sandro","santos","saúl",
  "stefan","stephan","steven","teodoro","tyler","uziel","valentino","vicente","wilfredo","william",
  "wilmer","wilson","xavier","yazid","zabdiel","zaid","adriana","adaris","aina","ainara",
  "ainoa","aitana","alba","alicia","alma","anaid","andrea","andreina","anette","ángela",
  "angelica","aria","ariadna","ariana","aroa","araceli","astrid","atenas","aylin","belinda",
  "berenice","beyda","blanca","camila","candela","carla","carlota","catalina","cayetana","chantal",
  "cielo","cinthia","clara","constanza","cristal","daisy","dayana","danisa","denisse","diana",
  "elba","elizabeth","erendira","galilea","grecia","griselda","iliana","india","iris","itzel",
  "iztel","jackie","jana","janet","jeni","jimena","jocelyn","johana","josefa","justina",
  "karime","karmen","karolay","katia","larissa","laia","lara","lexy","leyre","lina",
  "lola","luna","lupita","maddie","maggie","marilú","mariana","martina","mayra","melanie",
  "mia","mikaela","milagros","miley","miriam","monica","nereida","nohemi","nuria","olga",
  "orquídea","ofelia","paulina","perla","rocío","rosario","roxana","sabya","selena","sophia",
  "susana","tania","triana","vanesa","vanessa","vania","vega","victoria","yaneli","yaremiz",
  "yaretzi","yesenia","yuly","zury","actriz","agente inmobiliario","arqueólogo","asesor empresarial",
  "asesor de imagen","ambientalista","bailarín","cantante","cazador","chef","criminólogo",
  "climatólogo","dermatólogo","decorador","deportista","diseñador de modas","editor","empresario",
  "entrenador","estilista","florista","floricultor","ginecólogo","ganadero","gestor","informático",
  "ingeniero civil","ingeniero industrial","ingeniero naval","militar","minero","mercadólogo",
  "nutriólogo","oficinista","operario","pastelero","programador","publicista","político","podólogo",
  "pediatra",
];

// Build Set and index once at module load
const wordSet = new Set<string>(
  [...(rawWords as unknown as string[]), ...EXTRA_WORDS]
    .filter((w) => w.length >= 3)
    .map(normalize)
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

// Returns the syllable the next word must START with. Siempre la sílaba
// real, sin recortes: si no hay ninguna palabra que continúe esa sílaba
// exacta, es una consecuencia de la palabra que se jugó, no algo que el
// juego deba disimular.
export function getChallengeSyllable(word: string): string {
  const lastSyl = normalize(getLastSyllable(word));
  // "rr" nunca puede arrancar una palabra en español (una sola r inicial
  // ya tiene el sonido fuerte/vibrante), así que ninguna palabra real
  // podría continuar una sílaba tipo "rro"/"rra". Para el desafío usamos
  // la "r" simple en su lugar, que sí puede empezar cualquier palabra.
  if (lastSyl.startsWith("rr")) return lastSyl.slice(1);
  return lastSyl;
}

export function wordStartsWithSyllable(word: string, syllable: string): boolean {
  return getFirstSyllable(word) === normalize(syllable);
}

function getCandidates(syllable: string, usedWords: Set<string>): string[] {
  const normSyl = normalize(syllable);
  const key = normSyl.slice(0, 2);
  const candidates = wordIndex.get(key) ?? [];
  return candidates.filter(
    (w) => getFirstSyllable(w) === normSyl && !usedWords.has(w) && !isMonosyllable(w) && w.length >= 3
  );
}

export function getCpuWord(syllable: string, usedWords: Set<string>): string | null {
  const available = getCandidates(syllable, usedWords);
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// Palabras de ejemplo que sí hubieran continuado la cadena — se muestran
// en la pantalla de game over cuando el jugador se queda sin tiempo.
export function getExampleSolutions(syllable: string, usedWords: Set<string>, count: number): string[] {
  const available = getCandidates(syllable, usedWords);
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// "patio" (tio, hiato heredado de "tío") y "ciudad" (dad: la única
// palabra del diccionario con esa sílaba inicial es "dad", que es
// monosílabo y el juego ya los rechaza) terminan en sílabas que ninguna
// palabra puede continuar — dejarían al jugador trabado en el primer
// movimiento sin haber elegido nada, así que se sacaron de la lista.
// "perro"/"tierra" (rro/rra) ya no tienen ese problema: getChallengeSyllable
// las normaliza a "ro"/"ra" porque "rr" nunca puede arrancar una palabra.
const STARTING_WORDS = [
  "casa", "perro", "zapato", "mesa", "camino", "tierra", "tiempo", "fuerza",
  "barco", "cielo", "piedra", "bosque", "campo", "puerta", "fuego",
  "monte", "libro", "techo", "roca", "noche", "tarde", "mañana",
];

export function getStartingWord(): string {
  return STARTING_WORDS[Math.floor(Math.random() * STARTING_WORDS.length)];
}

export function getStartingWords(): string[] {
  return [...STARTING_WORDS].sort((a, b) => a.localeCompare(b, "es"));
}

// getSyllables kept for compatibility but not used internally
export function getSyllables(word: string): string[] {
  return [getLastSyllable(word)];
}
