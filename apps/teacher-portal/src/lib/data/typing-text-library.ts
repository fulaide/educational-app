/**
 * Text Library for Typing Challenges
 *
 * Organized by grade level (1-4), theme, and difficulty.
 * Each text is age-appropriate with proper German grammar and umlauts.
 */

export interface TextTemplate {
	id: string;
	title: string;
	content: string;
	theme: 'STORY' | 'POEM' | 'EDUCATIONAL' | 'RHYME' | 'CUSTOM';
	difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
	gradeLevel: number;
	wordCount: number;
	hasUmlauts: boolean;
	hasNumbers: boolean;
	hasPunctuation: boolean;
	author?: string;
}

export const textLibrary: TextTemplate[] = [
	// ==================== GRADE 1 - BEGINNER ====================

	// STORIES - Grade 1 BEGINNER
	{
		id: 'story-cat-g1-1',
		title: 'Die kleine Katze',
		content: 'Die Katze ist klein. Sie ist weiß. Die Katze mag Milch. Sie spielt gern.',
		theme: 'STORY',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 15,
		hasUmlauts: false,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-dog-g1-1',
		title: 'Mein Hund',
		content: 'Ich habe einen Hund. Er heißt Max. Max ist braun und groß. Wir spielen im Park.',
		theme: 'STORY',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 17,
		hasUmlauts: false,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-sun-g1-1',
		title: 'Die Sonne scheint',
		content: 'Die Sonne scheint hell. Es ist warm. Ich gehe raus. Ich bin froh.',
		theme: 'STORY',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 14,
		hasUmlauts: false,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-ball-g1-1',
		title: 'Der rote Ball',
		content: 'Tom hat einen Ball. Der Ball ist rot. Tom wirft den Ball. Lisa fängt den Ball.',
		theme: 'STORY',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 17,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-tree-g1-1',
		title: 'Der große Baum',
		content: 'Ein Baum steht im Garten. Er ist sehr groß. Im Baum ist ein Nest. Dort wohnen Vögel.',
		theme: 'STORY',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 19,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-flower-g1-1',
		title: 'Die schöne Blume',
		content: 'Im Garten ist eine Blume. Sie ist gelb und schön. Eine Biene kommt. Sie mag die Blume.',
		theme: 'STORY',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 19,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// POEMS - Grade 1 BEGINNER
	{
		id: 'poem-sun-g1-1',
		title: 'Die Sonne',
		content: 'Die Sonne scheint so hell und warm. Sie gibt uns Licht mit ihrem Arm.',
		theme: 'POEM',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 15,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'poem-bird-g1-1',
		title: 'Der Vogel',
		content: 'Ein Vogel sitzt im Baum. Er singt mir einen Traum. So schön und fein. Das muss Frühling sein.',
		theme: 'POEM',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 18,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'poem-moon-g1-1',
		title: 'Der Mond',
		content: 'Der Mond steht in der Nacht. Er gibt uns sanftes Licht. Die Sterne sind erwacht.',
		theme: 'POEM',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 15,
		hasUmlauts: false,
		hasNumbers: false,
		hasPunctuation: true
	},

	// RHYMES - Grade 1 BEGINNER
	{
		id: 'rhyme-mouse-g1-1',
		title: 'Die Maus',
		content: 'Eine kleine Maus läuft durch das Haus. Sie sucht nach Käse fein. Dann isst sie ihn ganz allein.',
		theme: 'RHYME',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 18,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'rhyme-rain-g1-1',
		title: 'Regen',
		content: 'Es regnet heut ganz sehr. Die Tropfen fallen schwer. Der Himmel ist so grau. Ich schau durchs Fenster raus.',
		theme: 'RHYME',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 19,
		hasUmlauts: false,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'rhyme-star-g1-1',
		title: 'Sternchen',
		content: 'Kleines Sternchen in der Nacht. Du hast die Welt so hell gemacht. Funkelnd leuchtest du so klar.',
		theme: 'RHYME',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 16,
		hasUmlauts: false,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'rhyme-frog-g1-1',
		title: 'Der Frosch',
		content: 'Ein grüner Frosch am Teich. Er hüpft so munter gleich. Quak quak macht er laut. Das hat mir gut gefallen.',
		theme: 'RHYME',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 19,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'rhyme-numbers-g1-1',
		title: 'Eins zwei drei',
		content: 'Eins zwei drei vier fünf sechs sieben. Wo ist denn nur mein Schuh geblieben? Sieben sechs fünf vier drei zwei eins. Jetzt hab ich wieder meins.',
		theme: 'RHYME',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 24,
		hasUmlauts: false,
		hasNumbers: false,
		hasPunctuation: true
	},

	// EDUCATIONAL - Grade 1 BEGINNER
	{
		id: 'edu-colors-g1-1',
		title: 'Farben lernen',
		content: 'Rot ist die Rose. Gelb ist die Sonne. Blau ist der Himmel. Grün ist das Gras.',
		theme: 'EDUCATIONAL',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 16,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'edu-body-g1-1',
		title: 'Mein Körper',
		content: 'Ich habe zwei Augen. Ich habe eine Nase. Ich habe einen Mund. Ich habe zwei Ohren.',
		theme: 'EDUCATIONAL',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 17,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'edu-family-g1-1',
		title: 'Meine Familie',
		content: 'Das ist Mama. Das ist Papa. Das ist meine Schwester. Das ist mein Bruder. Wir sind eine Familie.',
		theme: 'EDUCATIONAL',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 18,
		hasUmlauts: false,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'edu-animals-g1-1',
		title: 'Tiere',
		content: 'Die Kuh macht muh. Der Hund macht wau. Die Katze macht miau. Das Schaf macht mäh.',
		theme: 'EDUCATIONAL',
		difficulty: 'BEGINNER',
		gradeLevel: 1,
		wordCount: 17,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// ==================== GRADE 2 - BEGINNER ====================

	// STORIES - Grade 2 BEGINNER
	{
		id: 'story-park-g2-beg',
		title: 'Im Park',
		content: 'Lisa geht in den Park. Sie sieht viele Blumen. Die Blumen sind bunt und riechen gut. Ein Schmetterling fliegt von Blume zu Blume. Lisa setzt sich auf eine Bank.',
		theme: 'STORY',
		difficulty: 'BEGINNER',
		gradeLevel: 2,
		wordCount: 30,
		hasUmlauts: false,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-pet-g2-beg',
		title: 'Mein Haustier',
		content: 'Ich habe einen Hamster. Er heißt Bruno. Bruno lebt in einem großen Käfig. Er mag Körner und Gemüse. Am liebsten spielt er in seinem Laufrad. Bruno ist sehr süß.',
		theme: 'STORY',
		difficulty: 'BEGINNER',
		gradeLevel: 2,
		wordCount: 30,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-garden-g2-beg',
		title: 'Im Garten',
		content: 'Oma hat einen Garten. Dort wachsen Tomaten und Gurken. Ich helfe Oma beim Gießen. Die Pflanzen brauchen Wasser. Im Sommer ernten wir das Gemüse. Es schmeckt sehr gut.',
		theme: 'STORY',
		difficulty: 'BEGINNER',
		gradeLevel: 2,
		wordCount: 30,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// POEMS - Grade 2 BEGINNER
	{
		id: 'poem-rainbow-g2-beg',
		title: 'Der Regenbogen',
		content: 'Nach dem Regen kommt die Sonne. Sie bringt uns Licht und Wonne. Ein Regenbogen erscheint am Himmel weit. Mit Farben bunt für große Freud.',
		theme: 'POEM',
		difficulty: 'BEGINNER',
		gradeLevel: 2,
		wordCount: 25,
		hasUmlauts: false,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'poem-wind-g2-beg',
		title: 'Der Wind',
		content: 'Der Wind weht durch die Bäume. Er tanzt in meinen Träumen. Die Blätter fliegen durch die Luft. Der Wind bringt Regen und auch Duft.',
		theme: 'POEM',
		difficulty: 'BEGINNER',
		gradeLevel: 2,
		wordCount: 24,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// RHYMES - Grade 2 BEGINNER
	{
		id: 'rhyme-week-g2-beg',
		title: 'Die Woche',
		content: 'Montag Dienstag Mittwoch fein. Donnerstag will ich fleißig sein. Freitag Samstag Sonntag dann. Fängt die neue Woche an.',
		theme: 'RHYME',
		difficulty: 'BEGINNER',
		gradeLevel: 2,
		wordCount: 20,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'rhyme-seasons-g2-beg',
		title: 'Die Jahreszeiten',
		content: 'Frühling Sommer Herbst und Winter. Diese vier kennt jedes Kind. Sie kommen Jahr für Jahr zurück. Das ist unser großes Glück.',
		theme: 'RHYME',
		difficulty: 'BEGINNER',
		gradeLevel: 2,
		wordCount: 22,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// EDUCATIONAL - Grade 2 BEGINNER
	{
		id: 'edu-seasons-g2-beg',
		title: 'Die Jahreszeiten',
		content: 'Es gibt vier Jahreszeiten. Im Frühling blühen Blumen. Im Sommer ist es warm. Im Herbst fallen die Blätter. Im Winter schneit es oft. Jede Jahreszeit ist schön.',
		theme: 'EDUCATIONAL',
		difficulty: 'BEGINNER',
		gradeLevel: 2,
		wordCount: 28,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'edu-fruits-g2-beg',
		title: 'Obst ist gesund',
		content: 'Obst ist sehr gesund. Äpfel sind rot oder grün. Bananen sind gelb. Erdbeeren sind süß und rot. Orangen haben viel Vitamin C. Wir sollten jeden Tag Obst essen.',
		theme: 'EDUCATIONAL',
		difficulty: 'BEGINNER',
		gradeLevel: 2,
		wordCount: 28,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// ==================== GRADE 2 - INTERMEDIATE ====================

	// STORIES - Grade 2 INTERMEDIATE
	{
		id: 'story-forest-g2-1',
		title: 'Der Wald im Herbst',
		content: 'Emma läuft durch den bunten Herbstwald. Die Blätter leuchten in Rot und Gold. Ein Eichhörnchen sammelt Nüsse für den Winter. Emma hört den Wind in den Bäumen rauschen. Sie findet einen Pilz am Wegesrand.',
		theme: 'STORY',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 2,
		wordCount: 38,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-birthday-g2-1',
		title: 'Der Geburtstag',
		content: 'Heute hat Paula Geburtstag. Sie wird sieben Jahre alt. Alle ihre Freunde kommen zum Feiern. Es gibt eine große Torte mit Kerzen. Paula bläst die Kerzen aus und alle klatschen. Dann spielen sie zusammen im Garten.',
		theme: 'STORY',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 2,
		wordCount: 38,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-school-g2-1',
		title: 'Mein Schultag',
		content: 'Morgens gehe ich zur Schule. In der ersten Stunde haben wir Mathe. Danach kommt Deutsch. In der Pause spiele ich mit meinen Freunden Fußball. Nach der Schule mache ich Hausaufgaben. Dann bin ich frei.',
		theme: 'STORY',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 2,
		wordCount: 37,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-beach-g2-1',
		title: 'Am Strand',
		content: 'Im Sommer fahren wir ans Meer. Der Sand ist warm unter meinen Füßen. Ich baue eine große Sandburg mit Türmen. Die Wellen rauschen und ich springe hinein. Das Wasser ist herrlich erfrischend.',
		theme: 'STORY',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 2,
		wordCount: 35,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-winter-g2-1',
		title: 'Wintertag',
		content: 'Es hat geschneit! Alles ist weiß. Ich ziehe warme Kleidung an. Draußen baue ich einen Schneemann. Er bekommt eine Karotte als Nase. Meine Schwester und ich machen eine Schneeballschlacht. Das macht Spaß!',
		theme: 'STORY',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 2,
		wordCount: 36,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// POEMS - Grade 2 INTERMEDIATE
	{
		id: 'poem-seasons-g2-1',
		title: 'Jahreszeitenlied',
		content: 'Der Frühling kommt mit Blütenduft. Der Sommer bringt die warme Luft. Der Herbst malt Blätter kunterbunt. Der Winter macht die Welt ganz rund mit Schnee so weiß und kalt.',
		theme: 'POEM',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 2,
		wordCount: 30,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'poem-butterfly-g2-1',
		title: 'Der Schmetterling',
		content: 'Bunter Falter fliegt umher. Leicht wie Luft und federleicht. Von Blume zu Blume schwebt er. Seine Flügel bunt und weich. Tanzt im Sonnenschein so heiter.',
		theme: 'POEM',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 2,
		wordCount: 26,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'poem-moon-g2-1',
		title: 'Mondnacht',
		content: 'Der Mond scheint hell in dunkler Nacht. Die Sterne haben mich bewacht. Ich träume süß im Bettchen klein. Der Mond guckt durchs Fenster rein.',
		theme: 'POEM',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 2,
		wordCount: 25,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// RHYMES - Grade 2 INTERMEDIATE
	{
		id: 'rhyme-colors-g2-1',
		title: 'Bunte Welt',
		content: 'Rot wie Rosen Gelb wie Sand. Blau wie Wasser Grün wie Land. Orange Sonne Lila Traum. Bunte Farben überall. Was für eine schöne Welt!',
		theme: 'RHYME',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 2,
		wordCount: 25,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'rhyme-days-g2-1',
		title: 'Wochentage',
		content: 'Montag fängt die Woche an. Dienstag Mittwoch folgen dann. Donnerstag ist schon fast rum. Freitag macht uns alle froh. Samstag Sonntag Wochenende. Bis die Woche neu beginnt.',
		theme: 'RHYME',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 2,
		wordCount: 28,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// EDUCATIONAL - Grade 2 INTERMEDIATE
	{
		id: 'edu-water-g2-1',
		title: 'Wasser ist wichtig',
		content: 'Wasser brauchen wir jeden Tag. Wir trinken es und waschen uns damit. Pflanzen brauchen Wasser zum Wachsen. Tiere trinken Wasser aus Seen und Flüssen. Ohne Wasser gäbe es kein Leben auf der Erde.',
		theme: 'EDUCATIONAL',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 2,
		wordCount: 34,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'edu-plants-g2-1',
		title: 'Wie Pflanzen wachsen',
		content: 'Pflanzen brauchen Licht Wasser und Erde. Aus einem kleinen Samen wird eine große Pflanze. Die Wurzeln holen Wasser aus der Erde. Die Blätter fangen das Sonnenlicht ein. So können Pflanzen wachsen und gedeihen.',
		theme: 'EDUCATIONAL',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 2,
		wordCount: 36,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'edu-animals-g2-1',
		title: 'Waldtiere',
		content: 'Im Wald leben viele Tiere. Das Reh frisst Gras und Blätter. Der Fuchs jagt kleine Mäuse. Das Eichhörnchen klettert auf Bäume. Die Eule fliegt nachts durch den Wald. Jedes Tier hat seine Aufgabe.',
		theme: 'EDUCATIONAL',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 2,
		wordCount: 36,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'edu-planets-g2-1',
		title: 'Unser Sonnensystem',
		content: 'Die Erde ist unser Planet. Sie kreist um die Sonne. Der Mond kreist um die Erde. Es gibt noch sieben andere Planeten. Mars ist der rote Planet. Saturn hat schöne Ringe. Alle Planeten drehen sich um die Sonne.',
		theme: 'EDUCATIONAL',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 2,
		wordCount: 41,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// ==================== GRADE 3 - BEGINNER ====================

	// STORIES - Grade 3 BEGINNER
	{
		id: 'story-bicycle-g3-beg',
		title: 'Fahrrad fahren lernen',
		content: 'Tim möchte Fahrrad fahren lernen. Papa hält das Fahrrad fest. Tim steigt auf und Papa läuft neben ihm her. Langsam lässt Papa los. Tim fährt ganz alleine! Er ist so stolz und glücklich. Jetzt kann er mit seinen Freunden fahren.',
		theme: 'STORY',
		difficulty: 'BEGINNER',
		gradeLevel: 3,
		wordCount: 42,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-zoo-g3-beg',
		title: 'Ausflug in den Zoo',
		content: 'Unsere Klasse macht einen Ausflug in den Zoo. Wir sehen Elefanten Giraffen und Affen. Die Seehunde machen eine lustige Show. In der Pause essen wir unser Picknick. Am besten gefallen mir die Pinguine. Sie watscheln so witzig umher.',
		theme: 'STORY',
		difficulty: 'BEGINNER',
		gradeLevel: 3,
		wordCount: 41,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-camping-g3-beg',
		title: 'Zelten am See',
		content: 'Wir zelten am See. Papa baut das Zelt auf. Mama macht ein Lagerfeuer. Wir grillen Würstchen und Marshmallows. Als es dunkel wird zählen wir die Sterne. In der Nacht hören wir die Eulen rufen. Zelten ist ein großes Abenteuer.',
		theme: 'STORY',
		difficulty: 'BEGINNER',
		gradeLevel: 3,
		wordCount: 42,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// POEMS - Grade 3 BEGINNER
	{
		id: 'poem-spring-g3-beg',
		title: 'Frühlingszeit',
		content: 'Der Frühling ist nun endlich da. Die Blumen blühen wunderbar. Die Vögel singen froh und heiter. Der Winter zieht sich immer weiter. Die Sonne scheint so warm und hell. Die Welt wird bunt und farbenfroh.',
		theme: 'POEM',
		difficulty: 'BEGINNER',
		gradeLevel: 3,
		wordCount: 35,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'poem-forest-g3-beg',
		title: 'Im grünen Wald',
		content: 'Im grünen Wald da rauscht der Wind. Die Bäume wiegen sich geschwind. Ein Reh steht still am Waldessaum. Ich träume hier den schönsten Traum. Die Vögel zwitschern ihre Lieder. Der Wald erwacht zum Leben wieder.',
		theme: 'POEM',
		difficulty: 'BEGINNER',
		gradeLevel: 3,
		wordCount: 36,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// RHYMES - Grade 3 BEGINNER
	{
		id: 'rhyme-weather-g3-beg',
		title: 'Wetter',
		content: 'Sonne Regen Wind und Schnee. Wolken ziehen übern See. Blitz und Donner Hagel auch. Nebel weht wie weißer Rauch. Wetter wechselt jeden Tag. Jeder es gern anders mag.',
		theme: 'RHYME',
		difficulty: 'BEGINNER',
		gradeLevel: 3,
		wordCount: 29,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'rhyme-animals-g3-beg',
		title: 'Tierparade',
		content: 'Hund und Katze Maus und Ratte. Pferd und Esel auf der Matte. Kuh und Schaf und auch das Schwein. Alle Tiere groß und klein. Vogel Fisch und Schmetterling. Jedes Tier ist wunderbar.',
		theme: 'RHYME',
		difficulty: 'BEGINNER',
		gradeLevel: 3,
		wordCount: 33,
		hasUmlauts: false,
		hasNumbers: false,
		hasPunctuation: true
	},

	// EDUCATIONAL - Grade 3 BEGINNER
	{
		id: 'edu-teeth-g3-beg',
		title: 'Zähne putzen',
		content: 'Unsere Zähne müssen wir gut pflegen. Morgens und abends putzen wir sie gründlich. Die Zahnbürste reinigt jeden Zahn. Zahnpasta hilft gegen Karies. Wir sollten nicht zu viel Süßes essen. Einmal im Jahr gehen wir zum Zahnarzt. So bleiben unsere Zähne gesund.',
		theme: 'EDUCATIONAL',
		difficulty: 'BEGINNER',
		gradeLevel: 3,
		wordCount: 44,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'edu-recycling-g3-beg',
		title: 'Müll trennen',
		content: 'Müll trennen ist wichtig für unsere Umwelt. Papier kommt in die blaue Tonne. Glas werfen wir in den Glascontainer. Plastik gehört in die gelbe Tonne. Essensreste kommen in die Biotonne. Wenn wir Müll trennen können viele Dinge recycelt werden. Das schützt die Natur.',
		theme: 'EDUCATIONAL',
		difficulty: 'BEGINNER',
		gradeLevel: 3,
		wordCount: 47,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// ==================== GRADE 3 - INTERMEDIATE ====================

	// STORIES - Grade 3 INTERMEDIATE
	{
		id: 'story-treehouse-g3-int',
		title: 'Das Baumhaus',
		content: 'Leon und seine Freunde bauen ein Baumhaus. Sie sammeln Bretter und Nägel. Papa hilft beim Sägen. Stück für Stück entsteht ein tolles Versteck. Sie bauen eine Leiter aus Seilen. Oben malen sie ein Schild: Geheimclub. Von dort können sie den ganzen Garten überblicken.',
		theme: 'STORY',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 3,
		wordCount: 48,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-mystery-g3-int',
		title: 'Der verschwundene Schlüssel',
		content: 'Mama sucht ihren Autoschlüssel überall. Sarah hilft beim Suchen. Sie schauen in der Küche im Wohnzimmer und im Bad. Nirgendwo ist der Schlüssel zu finden. Plötzlich hat Sarah eine Idee. Sie geht zum Fahrradkorb. Dort liegt der Schlüssel! Mama ist so erleichtert.',
		theme: 'STORY',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 3,
		wordCount: 48,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// POEMS - Grade 3 INTERMEDIATE
	{
		id: 'poem-nature-g3-int',
		title: 'Die Natur erwacht',
		content: 'Wenn der Frühling kommt ins Land. Wird die Welt so wunderbar. Blumen blühen allerhand. Vögel singen laut und klar. Bäume treiben frisches Grün. Schmetterlinge tanzen fein. Bienen summen hin und hin. Alles will jetzt fröhlich sein.',
		theme: 'POEM',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 3,
		wordCount: 40,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// RHYMES - Grade 3 INTERMEDIATE
	{
		id: 'rhyme-months-g3-int',
		title: 'Die zwölf Monate',
		content: 'Januar Februar März so kalt. April Mai Juni bald wird alt. Juli August heiß und schön. September bis Dezember werden gehen. Zwölf Monate hat das Jahr. Jeder anders wunderbar.',
		theme: 'RHYME',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 3,
		wordCount: 32,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// EDUCATIONAL - Grade 3 INTERMEDIATE
	{
		id: 'edu-magnets-g3-int',
		title: 'Magnete',
		content: 'Magnete haben besondere Kräfte. Sie ziehen Eisen und Stahl an. Jeder Magnet hat zwei Pole: Nord und Süd. Gleiche Pole stoßen sich ab. Verschiedene Pole ziehen sich an. Magnete werden in vielen Geräten benutzt. Sogar die Erde ist wie ein großer Magnet.',
		theme: 'EDUCATIONAL',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 3,
		wordCount: 48,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// ==================== GRADE 3 - ADVANCED ====================

	// STORIES - Grade 3 ADVANCED
	{
		id: 'story-adventure-g3-1',
		title: 'Die Schatzsuche',
		content: 'Max findet auf dem Dachboden eine alte Schatzkarte. Zusammen mit seiner Schwester Anna entschlüsselt er die geheimen Zeichen. Die Karte führt sie durch den Garten zum alten Apfelbaum. Dort graben sie vorsichtig. Plötzlich stößt der Spaten auf etwas Hartes. Sie finden eine Holzkiste mit alten Münzen und Briefen von Opa.',
		theme: 'STORY',
		difficulty: 'ADVANCED',
		gradeLevel: 3,
		wordCount: 59,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-library-g3-1',
		title: 'Die magische Bibliothek',
		content: 'Lea liebt Bücher über alles. In der Stadtbibliothek entdeckt sie eine versteckte Tür. Neugierig öffnet sie diese und findet einen geheimen Raum voller alter Bücher. Als sie ein Buch aufschlägt beginnen die Buchstaben zu leuchten. Die Geschichten werden lebendig und Lea erlebt fantastische Abenteuer in fernen Ländern.',
		theme: 'STORY',
		difficulty: 'ADVANCED',
		gradeLevel: 3,
		wordCount: 56,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-robot-g3-1',
		title: 'Der kleine Roboter',
		content: 'In der Werkstatt von Professor Klein steht ein kleiner Roboter. Eines Tages erwacht er zum Leben. Der Roboter lernt sprechen und laufen. Er möchte die Welt entdecken. Gemeinsam mit Tim dem Enkel des Professors erkundet er die Stadt. Die Menschen staunen über den freundlichen Roboter.',
		theme: 'STORY',
		difficulty: 'ADVANCED',
		gradeLevel: 3,
		wordCount: 52,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-dragon-g3-1',
		title: 'Der freundliche Drache',
		content: 'Hinter dem Berg lebt ein Drache. Alle Leute haben Angst vor ihm. Doch die mutige Sophie besucht ihn. Sie entdeckt dass der Drache sehr einsam ist. Er kann kein Feuer speien sondern nur bunte Seifenblasen. Sophie und der Drache werden beste Freunde und spielen jeden Tag zusammen.',
		theme: 'STORY',
		difficulty: 'ADVANCED',
		gradeLevel: 3,
		wordCount: 54,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// POEMS - Grade 3 ADVANCED
	{
		id: 'poem-ringelnatz-seepferd-g3',
		title: 'Das Seepferdchen',
		content: 'Das Seepferdchen im Ozean. Schwimmt aufrecht seine Bahn. Mit seinem Ringelschwänzchen fein. Möcht es gern ein Pferdchen sein. Doch Hufe hat es nicht. Nur Flossen sind in Sicht.',
		theme: 'POEM',
		difficulty: 'ADVANCED',
		gradeLevel: 3,
		wordCount: 32,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true,
		author: 'Nach Joachim Ringelnatz'
	},
	{
		id: 'poem-autumn-g3-1',
		title: 'Herbstwind',
		content: 'Der Herbstwind fegt durch Straßen und durch Felder. Er wirbelt Blätter bunt umher. Die Bäume werden leerer und kahler. Die Tage kürzer mehr und mehr. Der Wind erzählt von kommender Kälte. Von Schnee und Eis nicht mehr so weit. Doch noch genießen wir die bunte Welt.',
		theme: 'POEM',
		difficulty: 'ADVANCED',
		gradeLevel: 3,
		wordCount: 50,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'poem-spring-g3-1',
		title: 'Frühlingserwachen',
		content: 'Die ersten Blumen strecken sich empor. Die Vögel zwitschern laut im Chor. Die Sonne wärmt das kalte Land. Der Frühling kommt mit sanfter Hand. Er malt die Wiesen grün und bunt. Macht Tiere und Natur gesund. Ein Duft von Blüten liegt in der Luft.',
		theme: 'POEM',
		difficulty: 'ADVANCED',
		gradeLevel: 3,
		wordCount: 50,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// RHYMES - Grade 3 ADVANCED
	{
		id: 'rhyme-adventure-g3-adv',
		title: 'Auf Entdeckung',
		content: 'Über Berg und über Tal. Durch den Wald zum ersten Mal. An den Fluss und übern Steg. Jeden Tag ein neuer Weg. In die Höhle tief hinein. Wird das nicht spannend sein? Die Welt ist groß und wunderbar. Für Abenteuer sind wir da.',
		theme: 'RHYME',
		difficulty: 'ADVANCED',
		gradeLevel: 3,
		wordCount: 48,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// EDUCATIONAL - Grade 3 ADVANCED
	{
		id: 'edu-bees-g3-1',
		title: 'Die fleißige Biene',
		content: 'Bienen sind sehr wichtige Insekten. Sie bestäuben Blüten und helfen Pflanzen beim Vermehren. Eine Biene fliegt von Blume zu Blume und sammelt Nektar. Im Bienenstock wird daraus Honig gemacht. Bienen leben in großen Gemeinschaften. Jede Biene hat eine bestimmte Aufgabe. Ohne Bienen gäbe es viel weniger Obst und Gemüse.',
		theme: 'EDUCATIONAL',
		difficulty: 'ADVANCED',
		gradeLevel: 3,
		wordCount: 57,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'edu-volcano-g3-1',
		title: 'Vulkane',
		content: 'Ein Vulkan ist ein Berg mit einer Öffnung. Tief unter der Erde ist flüssiges Gestein. Das nennt man Magma. Wenn der Druck zu groß wird bricht der Vulkan aus. Das Magma steigt nach oben. An der Oberfläche heißt es Lava. Die Lava ist sehr heiß und fließt den Berg hinunter. Vulkane können sehr gefährlich sein.',
		theme: 'EDUCATIONAL',
		difficulty: 'ADVANCED',
		gradeLevel: 3,
		wordCount: 62,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'edu-weather-g3-1',
		title: 'Wie entsteht Regen',
		content: 'Die Sonne erwärmt das Wasser in Seen und Meeren. Das Wasser verdunstet und steigt als Wasserdampf nach oben. In der kalten Luft verwandelt sich der Dampf in winzige Wassertropfen. Diese bilden Wolken. Wenn die Tropfen zu schwer werden fallen sie als Regen zur Erde. So beginnt der Kreislauf von neuem.',
		theme: 'EDUCATIONAL',
		difficulty: 'ADVANCED',
		gradeLevel: 3,
		wordCount: 60,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// ==================== GRADE 4 - BEGINNER ====================

	// STORIES - Grade 4 BEGINNER
	{
		id: 'story-neighbor-g4-beg',
		title: 'Der neue Nachbar',
		content: 'Neben uns zieht eine neue Familie ein. Sie haben einen Jungen in meinem Alter. Er heißt David und kommt aus einer anderen Stadt. Am Anfang ist er sehr schüchtern. Ich lade ihn ein mit mir Fußball zu spielen. Wir verstehen uns gut. David erzählt von seiner alten Schule. Jetzt haben wir einen neuen Freund in der Nachbarschaft.',
		theme: 'STORY',
		difficulty: 'BEGINNER',
		gradeLevel: 4,
		wordCount: 62,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-market-g4-beg',
		title: 'Auf dem Markt',
		content: 'Samstags gehe ich mit Oma zum Wochenmarkt. Überall stehen bunte Stände. Es gibt frisches Obst Gemüse Brot und Blumen. Oma kauft Äpfel Tomaten und einen Blumenstrauß. An einem Stand probiere ich leckeren Käse. Ein Bauer verkauft Eier von seinen Hühnern. Der Markt ist lebhaft und es riecht überall gut. Am liebsten mag ich den Süßigkeitenstand.',
		theme: 'STORY',
		difficulty: 'BEGINNER',
		gradeLevel: 4,
		wordCount: 62,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// POEMS - Grade 4 BEGINNER
	{
		id: 'poem-stars-g4-beg',
		title: 'Sternenhimmel',
		content: 'Wenn die Nacht hereingebrochen. Funkeln Sterne ohne Zahl. Jeder hat sein Licht entfacht. Leuchtet hell im Himmelssaal. Manche bilden Sternenbilder. Andere stehen ganz allein. Doch zusammen in der Nacht. Lassen sie den Himmel schön erscheinen. Ich betrachte sie voll Staunen. Träume von der Ferne dort. Wo die Sterne ewig leuchten.',
		theme: 'POEM',
		difficulty: 'BEGINNER',
		gradeLevel: 4,
		wordCount: 56,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// RHYMES - Grade 4 BEGINNER
	{
		id: 'rhyme-school-g4-beg',
		title: 'Schulfächer',
		content: 'Mathe Deutsch und Sachkunde. Englisch Sport zur gleichen Stunde. Kunst und Musik machen Spaß. Jedes Fach ist erste Klass. In der Schule lernen wir. Wissen sammeln Tag für Tag. Für die Zukunft rüsten wir. Alles was man brauchen mag.',
		theme: 'RHYME',
		difficulty: 'BEGINNER',
		gradeLevel: 4,
		wordCount: 47,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// EDUCATIONAL - Grade 4 BEGINNER
	{
		id: 'edu-bones-g4-beg',
		title: 'Unser Skelett',
		content: 'Der Mensch hat über zweihundert Knochen. Sie bilden zusammen das Skelett. Das Skelett gibt unserem Körper Form und Halt. Die Knochen schützen wichtige Organe. Der Schädel schützt das Gehirn. Die Rippen schützen Herz und Lunge. Knochen sind sehr stabil aber auch leicht. Gelenke verbinden die Knochen und ermöglichen Bewegung. Damit wir starke Knochen haben brauchen wir Kalzium aus der Nahrung.',
		theme: 'EDUCATIONAL',
		difficulty: 'BEGINNER',
		gradeLevel: 4,
		wordCount: 68,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// ==================== GRADE 4 - INTERMEDIATE ====================

	// STORIES - Grade 4 INTERMEDIATE
	{
		id: 'story-competition-g4-int',
		title: 'Der Mathematik-Wettbewerb',
		content: 'Julia nimmt an einem Mathematik-Wettbewerb teil. Sie hat sich wochenlang vorbereitet. Am Tag des Wettbewerbs ist sie sehr aufgeregt. Die Aufgaben sind schwierig aber Julia gibt ihr Bestes. Sie rechnet konzentriert und überprüft ihre Ergebnisse. Nach zwei Stunden ist die Zeit um. Eine Woche später kommt die Nachricht: Julia hat den dritten Platz belegt! Sie ist unglaublich stolz auf sich.',
		theme: 'STORY',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 4,
		wordCount: 69,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// POEMS - Grade 4 INTERMEDIATE
	{
		id: 'poem-ocean-g4-int',
		title: 'Das Meer',
		content: 'Das weite Meer so tief und blau. Erstreckt sich bis zum Horizont genau. Die Wellen rollen an den Strand. Hinterlassen Muscheln dort im Sand. Die Möwen kreisen hoch und frei. Ihr Ruf erklingt wie Melodei. Im Wasser schwimmen Fische bunt. Der Ozean ist tief und rund. Ein Wunder voller Leben hier. Das Meer fasziniert mich für und für.',
		theme: 'POEM',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 4,
		wordCount: 63,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// RHYMES - Grade 4 INTERMEDIATE
	{
		id: 'rhyme-nature-g4-int',
		title: 'Naturwunder',
		content: 'Berge Täler Fluss und Meer. Wald und Wiese hin und her. Wüste trocken Dschungel feucht. Jeder Ort ist einzigartig leicht. Gletscher kalt und Vulkan heiß. Unsere Erde kennt den Preis. Von Vielfalt die uns staunen lässt. Natur ist einfach allerbest.',
		theme: 'RHYME',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 4,
		wordCount: 46,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// EDUCATIONAL - Grade 4 INTERMEDIATE
	{
		id: 'edu-butterfly-g4-int',
		title: 'Von der Raupe zum Schmetterling',
		content: 'Die Verwandlung eines Schmetterlings ist faszinierend. Alles beginnt mit einem winzigen Ei. Aus dem Ei schlüpft eine kleine Raupe. Die Raupe frisst pausenlos Blätter und wächst schnell. Wenn sie groß genug ist verpuppt sie sich. In der Puppe findet die Verwandlung statt. Nach einigen Wochen schlüpft ein wunderschöner Schmetterling. Seine Flügel sind anfangs noch weich und nass. Bald kann er aber fliegen und Nektar sammeln.',
		theme: 'EDUCATIONAL',
		difficulty: 'INTERMEDIATE',
		gradeLevel: 4,
		wordCount: 76,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// ==================== GRADE 4 - ADVANCED ====================

	// STORIES - Grade 4 ADVANCED
	{
		id: 'story-space-g4-1',
		title: 'Reise zum Mars',
		content: 'Im Jahr 2045 startet die erste bemannte Mission zum Mars. Astronautin Dr. Weber ist Teil der Crew. Die Reise dauert sieben Monate. Während des Fluges führen sie wissenschaftliche Experimente durch. Endlich erreichen sie den roten Planeten. Die Landung ist spektakulär. Dr. Weber betritt als erste Deutsche den Mars. Sie sammelt Gesteinsproben und sucht nach Spuren von Wasser. Die Entdeckungen werden die Wissenschaft revolutionieren.',
		theme: 'STORY',
		difficulty: 'ADVANCED',
		gradeLevel: 4,
		wordCount: 68,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-inventor-g4-1',
		title: 'Die junge Erfinderin',
		content: 'Lisa liebte es Dinge auseinanderzunehmen und wieder zusammenzubauen. In ihrer Werkstatt tüftelte sie an einer besonderen Erfindung: einem Roboter der älteren Menschen im Haushalt helfen sollte. Monatelang arbeitete sie an der Programmierung. Endlich war ihr Roboter fertig. Bei einem Erfinderwettbewerb präsentierte sie ihre Idee. Die Jury war begeistert. Lisa gewann den ersten Preis und ein Stipendium für eine Technik-Universität.',
		theme: 'STORY',
		difficulty: 'ADVANCED',
		gradeLevel: 4,
		wordCount: 71,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'story-time-g4-1',
		title: 'Die Zeitmaschine',
		content: 'In Professor Schneiders Labor steht eine geheimnisvolle Maschine. Sie kann durch die Zeit reisen. Sein Enkel Felix darf sie ausprobieren. Er reist zurück in die Dinosaurierzeit. Riesige Pflanzenfresser stapfen durch Sümpfe. Ein Tyrannosaurus brüllt in der Ferne. Felix macht Fotos mit seiner Spezialkamera. Dann springt er ins Mittelalter zu Rittern und Burgen. Schließlich kehrt er in die Gegenwart zurück voller fantastischer Geschichten.',
		theme: 'STORY',
		difficulty: 'ADVANCED',
		gradeLevel: 4,
		wordCount: 70,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// POEMS - Grade 4 ADVANCED
	{
		id: 'poem-ringelnatz-ameisen-g4',
		title: 'Die Ameisen',
		content: 'In Hamburg lebten zwei Ameisen die wollten nach Australien reisen. Bei Altona auf der Chaussee da taten ihnen die Beine weh und da verzichteten sie weise dann auf den letzten Teil der Reise.',
		theme: 'POEM',
		difficulty: 'ADVANCED',
		gradeLevel: 4,
		wordCount: 37,
		hasUmlauts: false,
		hasNumbers: false,
		hasPunctuation: true,
		author: 'Joachim Ringelnatz'
	},
	{
		id: 'poem-morgenstern-nasobem-g4',
		title: 'Das Nasobēm',
		content: 'Auf seinen Nasen schreitet einher das Nasobēm von seinem Kind dem Nasobēmchen wird es begleitet schon lange. Es steht noch nicht im Brehm. Es steht noch nicht im Meyer. Und auch im Brockhaus nicht. Es trat aus meiner Leyer zum ersten Mal ans Licht.',
		theme: 'POEM',
		difficulty: 'ADVANCED',
		gradeLevel: 4,
		wordCount: 50,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true,
		author: 'Christian Morgenstern'
	},
	{
		id: 'poem-friendship-g4-1',
		title: 'Freundschaft',
		content: 'Ein Freund ist jemand der dich kennt. Der mit dir lacht in guten Zeiten. Der bei dir bleibt wenn Kummer brennt. Bereit ist dich durchs Leben zu begleiten. Mit Freunden teilt man Freud und Leid. Sie machen stark in schweren Stunden. Wahre Freundschaft hält für alle Zeit. Ist das größte was wir je gefunden. Drum halte Freunde stets in Ehren. Pflege diese Bande zart. Sie werden dir das Leben mehr verschönern. Als jeder Schatz von Gold so hart.',
		theme: 'POEM',
		difficulty: 'ADVANCED',
		gradeLevel: 4,
		wordCount: 79,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},

	// EDUCATIONAL - Grade 4 ADVANCED
	{
		id: 'edu-dinosaurs-g4-1',
		title: 'Die Zeit der Dinosaurier',
		content: 'Vor Millionen von Jahren beherrschten Dinosaurier die Erde. Es gab riesige Pflanzenfresser wie den Brachiosaurus der bis zu 23 Meter lang wurde. Gefährliche Raubtiere wie der Tyrannosaurus Rex jagten andere Dinosaurier. Einige Dinosaurier hatten Panzer oder Stacheln zum Schutz. Andere lebten in Herden. Manche Dinosaurier konnten sogar fliegen. Vor 65 Millionen Jahren starben die Dinosaurier aus. Vermutlich traf ein großer Meteorit die Erde. Heute finden Wissenschaftler Fossilien und rekonstruieren wie Dinosaurier lebten.',
		theme: 'EDUCATIONAL',
		difficulty: 'ADVANCED',
		gradeLevel: 4,
		wordCount: 87,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'edu-electricity-g4-1',
		title: 'Elektrizität',
		content: 'Elektrizität ist eine Form von Energie die wir täglich nutzen. Elektrischer Strom fließt durch Kabel in unsere Häuser. Er wird in Kraftwerken erzeugt. Windräder Solaranlagen und Wasserkraftwerke produzieren umweltfreundlichen Strom. Kohle- und Atomkraftwerke gibt es auch aber sie belasten die Umwelt. Strom bringt unsere Lampen zum Leuchten. Er treibt Motoren an und lädt unsere Handys. Ohne Elektrizität wäre unser modernes Leben nicht möglich. Deshalb sollten wir sparsam mit Energie umgehen.',
		theme: 'EDUCATIONAL',
		difficulty: 'ADVANCED',
		gradeLevel: 4,
		wordCount: 82,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	},
	{
		id: 'edu-ancient-egypt-g4-1',
		title: 'Das alte Ägypten',
		content: 'Vor über 4000 Jahren entstand am Nil eine der größten Zivilisationen der Menschheit. Die alten Ägypter bauten beeindruckende Pyramiden als Grabstätten für ihre Pharaonen. Sie entwickelten eine Bilderschrift die Hieroglyphen. Der Nil war die Lebensader Ägyptens. Sein Hochwasser machte das Land fruchtbar. Die Ägypter waren Meister in Mathematik Medizin und Architektur. Sie mumifizierten ihre Toten weil sie an ein Leben nach dem Tod glaubten. Heute erforschen Archäologen die faszinierenden Überreste dieser Hochkultur.',
		theme: 'EDUCATIONAL',
		difficulty: 'ADVANCED',
		gradeLevel: 4,
		wordCount: 87,
		hasUmlauts: true,
		hasNumbers: false,
		hasPunctuation: true
	}
];

/**
 * Get recommended texts based on grade, theme, and difficulty
 */
export function getRecommendedTexts(
	gradeLevel: number,
	theme: 'STORY' | 'POEM' | 'EDUCATIONAL' | 'RHYME' | 'CUSTOM',
	difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
): TextTemplate[] {
	return textLibrary.filter(
		(text) =>
			text.gradeLevel === gradeLevel &&
			text.theme === theme &&
			text.difficulty === difficulty
	);
}
