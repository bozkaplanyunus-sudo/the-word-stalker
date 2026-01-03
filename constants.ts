
import { Word, Category, Language, GrammarExercise, LevelInfo } from './types';

export const CATEGORIES: Category[] = ['Noun', 'Verb', 'Adjective', 'Adverb'];

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
];

export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    welcome: "Welcome!",
    subWelcome: "Choose your languages and start hunting.",
    sourceLabel: "My native language",
    targetLabel: "Target language",
    modeLabel: "Game Mode",
    vocabularyMode: "Vocabulary",
    grammarMode: "Grammar",
    startBtn: "Start hunting 🏹",
    level: "Level",
    score: "Score",
    target: "Target language",
    map: "Map",
    analyzing: "Scanning galaxy...",
    progress: "Progress",
    promoted: "Mission successful!",
    levelClear: "Planet clear",
    nextSector: "Next planet 🚀",
    backToSetup: "Back to languages",
    failed: "Mission failed",
    failedSub: "You must get at least 8/10 to advance.",
    retry: "Retry level 🔄",
    backToMap: "Back to map",
    backToHome: "Back to home",
    startLesson: "Start Lesson",
    lessonTitle: "Lesson Briefing",
    orderingInstruction: "Complete the dialogue!",
    clear: "Clear"
  },
  tr: {
    welcome: "Hoşgeldiniz",
    subWelcome: "Dillerini seç ve avlanmaya başla.",
    sourceLabel: "Ana dilim",
    targetLabel: "Hedef dil",
    modeLabel: "Oyun Modu",
    vocabularyMode: "Kelime",
    grammarMode: "Gramer",
    startBtn: "Avlanmaya başla 🏹",
    level: "Seviye",
    score: "Puan",
    target: "Hedef dil",
    map: "Harita",
    analyzing: "Galaksi taranıyor...",
    progress: "İlerleme",
    promoted: "İz sürme başarıyla tamamlandı",
    levelClear: "Gezegen tamamlandı",
    nextSector: "Sıradaki seviye 🚀",
    backToSetup: "Dillere dön",
    failed: "Görev başarısız",
    failedSub: "İlerlemek için en az 8/10 yapmalısın.",
    retry: "Seviyeyi tekrarla 🔄",
    backToMap: "Haritaya dön",
    backToHome: "Anasayfaya dön",
    startLesson: "Derse Başla",
    lessonTitle: "Görev Bilgilendirmesi",
    orderingInstruction: "Diyaloğu tamamla!",
    clear: "Temizle"
  },
  fr: {
    welcome: "Bienvenue !",
    subWelcome: "Choisissez vos langues et commencez la chasse.",
    sourceLabel: "Ma langue maternelle",
    targetLabel: "Langue cible",
    modeLabel: "Mode de jeu",
    vocabularyMode: "Vocabulaire",
    grammarMode: "Grammaire",
    startBtn: "Commencer la chasse 🏹",
    level: "Niveau",
    score: "Points",
    target: "Langue cible",
    map: "Carte",
    analyzing: "Analyse de la galaxie...",
    progress: "Progression",
    promoted: "Mission réussie !",
    levelClear: "Planète terminée",
    nextSector: "Planète suivante 🚀",
    backToSetup: "Retour aux langues",
    failed: "Mission échouée",
    failedSub: "Vous devez obtenir au moins 8/10 pour avancer.",
    retry: "Réessayer le niveau 🔄",
    backToMap: "Retour à la carte",
    backToHome: "Retour à l'accueil",
    startLesson: "Commencer la leçon",
    lessonTitle: "Briefing de mission",
    orderingInstruction: "Complétez le dialogue !",
    clear: "Effacer"
  }
};

const createNumExample = (n: number, wordEn: string, wordFr: string, wordTr: string) => ({
  label: { tr: wordTr, en: wordEn, fr: wordFr },
  content: { tr: n.toString(), en: n.toString(), fr: n.toString() }
});

export const VOCAB_LEVEL_INFO: Record<Language, Record<number, { title: Record<Language, string> }>> = {
  tr: {
    1: { title: { tr: "İsimler - I", en: "Nouns - I", fr: "Noms - I" } },
    2: { title: { tr: "Fiiller - I", en: "Verbs - I", fr: "Verbes - I" } },
    3: { title: { tr: "Sıfatlar - I", en: "Adjectives - I", fr: "Adjectifs - I" } },
    4: { title: { tr: "Zarflar - I", en: "Adverbs - I", fr: "Adverbes - I" } },
  },
  en: {
    1: { title: { tr: "İsimler - I", en: "Nouns - I", fr: "Noms - I" } },
    2: { title: { tr: "Fiiller - I", en: "Verbs - I", fr: "Verbes - I" } },
    3: { title: { tr: "Sıfatlar - I", en: "Adjectives - I", fr: "Adjectifs - I" } },
    4: { title: { tr: "Zarflar - I", en: "Adverbs - I", fr: "Adverbes - I" } },
  },
  fr: {
    1: { title: { tr: "İsimler - I", en: "Nouns - I", fr: "Noms - I" } },
    2: { title: { tr: "Fiiller - I", en: "Verbs - I", fr: "Verbes - I" } },
    3: { title: { tr: "Sıfatlar - I", en: "Adjectives - I", fr: "Adjectifs - I" } },
    4: { title: { tr: "Zarflar - I", en: "Adverbs - I", fr: "Adverbes - I" } },
  }
};

export const LEVEL_INFO: Record<Language, Record<number, LevelInfo>> = {
  tr: {
    1: {
      title: { tr: "Alfabe", en: "Alphabet", fr: "L'Alphabet" },
      explanation: { 
        tr: "Türkçe’de 29 harf bulunmaktadır. Bunlardan 8 tanesi sesli, 21 tanesi sessizdir.",
        en: "There are 29 letters in the Turkish alphabet. 8 are vowels and 21 are consonants.",
        fr: "L'alphabet turc comprend 29 lettres. 8 sont des voyelles et 21 sont des consonnes."
      },
      examples: [
        { label: { tr: "A", en: "A", fr: "A" }, content: { tr: "Araba", en: "Car", fr: "Voiture" } },
        { label: { tr: "B", en: "B", fr: "B" }, content: { tr: "Baba", en: "Father", fr: "Père" } },
        { label: { tr: "C", en: "C", fr: "C" }, content: { tr: "Ceviz", en: "Walnut", fr: "Noix" } },
        { label: { tr: "Ç", en: "Ch", fr: "Ch" }, content: { tr: "Çiçek", en: "Flower", fr: "Fleur" } }
      ]
    },
    2: {
      title: { tr: "Sayılar", en: "Numbers", fr: "Les Nombres" },
      explanation: {
        tr: "Türkçe sayılar onluk sisteme dayanır.",
        en: "Turkish numbers are based on the decimal system.",
        fr: "Les nombres turcs sont basés sur le système décimal."
      },
      examples: [
        createNumExample(1, "One", "Un", "Bir"), 
        createNumExample(2, "Two", "Deux", "İki"), 
        createNumExample(3, "Three", "Trois", "Üç"),
        createNumExample(10, "Ten", "Dix", "On")
      ]
    },
    3: {
      title: { tr: "Selamlaşma ve Tanışma", en: "Greetings and Introductions", fr: "Salutations et Présentations" },
      explanation: {
        tr: "Selamlaşma ve tanışma, iletişimin ilk adımıdır. Türkçede selamlaşmalar hem resmî hem de samimî olabilir. Duruma, zamana ve karşımızdaki kişiye göre uygun ifadeyi seçeriz.",
        en: "Greetings and introductions are the first steps. In Turkish, they can be formal or informal. We choose the appropriate expression based on the situation, time, and person.",
        fr: "Les salutations et les présentations sont les premières étapes. En turc, elles peuvent être formelles ou informelles. Nous choisissons l'expression appropriée en fonction de la situation, du temps et de la personne."
      },
      examples: [
        { 
          label: { tr: "Merhaba", en: "Hello", fr: "Bonjour" }, 
          content: { tr: "Günün her saati — genel selam", en: "Any time of day — general greeting", fr: "À tout moment — salutation générale" } 
        },
        { 
          label: { tr: "Günaydın", en: "Good morning", fr: "Bonjour" }, 
          content: { tr: "Sabah", en: "In the morning", fr: "Le matin" } 
        },
        { 
          label: { tr: "İyi günler", en: "Good day", fr: "Bonne journée" }, 
          content: { tr: "Gündüz — resmî", en: "Daytime — formal", fr: "Pendant la journée — formel" } 
        },
        { 
          label: { tr: "İyi akşamlar", en: "Good evening", fr: "Bonsoir" }, 
          content: { tr: "Akşam", en: "Evening", fr: "Le soir" } 
        },
        { 
          label: { tr: "İyi geceler", en: "Good night", fr: "Bonne nuit" }, 
          content: { tr: "Gece — hem selam hem veda", en: "Night — both greeting and farewell", fr: "Nuit — à la fois salutation et adieu" } 
        },
        { 
          label: { tr: "Selam", en: "Hi", fr: "Salut" }, 
          content: { tr: "Samimî, arkadaşça", en: "Casual, friendly", fr: "Informel, amical" } 
        },
        { 
          label: { tr: "N'aber?", en: "What's up?", fr: "Quoi de neuf ?" }, 
          content: { tr: "Samimî ('Ne haber'in kısaltması)", en: "Casual (Short for 'What news')", fr: "Informel (Abréviation de 'Quelles nouvelles')" } 
        },
        { 
          label: { tr: "Teşekkürler", en: "Thanks", fr: "Merci" }, 
          content: { tr: "Nezaket ifadesi", en: "Expression of gratitude", fr: "Expression de gratitude" } 
        },
        { 
          label: { tr: "Benim adım ...", en: "My name is ...", fr: "Je m'appelle ..." }, 
          content: { tr: "Kendimizi tanıtırız", en: "Introduce ourselves", fr: "Se présenter" } 
        },
        { 
          label: { tr: "Senin adın ne?", en: "What is your name?", fr: "Comment t'appelles-tu ?" }, 
          content: { tr: "Samimî soru", en: "Casual question", fr: "Question informelle" } 
        },
        { 
          label: { tr: "Sizin adınız ne?", en: "What is your name? (Formal)", fr: "Comment vous appelez-vous ?" }, 
          content: { tr: "Resmî soru", en: "Formal question", fr: "Question formelle" } 
        },
        { 
          label: { tr: "Memnun oldum", en: "Nice to meet you", fr: "Enchanté" }, 
          content: { tr: "Tanışma sonunda söylenir", en: "Said at the end of meeting", fr: "Dit à la fin d'une rencontre" } 
        },
        { 
          label: { tr: "Ben de memnun oldum", en: "Nice to meet you too", fr: "Enchanté aussi" }, 
          content: { tr: "Karşılık ifadesi", en: "The response", fr: "La réponse" } 
        },
        { 
          label: { tr: "Görüşürüz", en: "See you", fr: "À bientôt" }, 
          content: { tr: "Veda ifadesi", en: "Farewell expression", fr: "Expression d'adieu" } 
        },
        { 
          label: { tr: "Hoşça kal", en: "Goodbye", fr: "Au revoir" }, 
          content: { tr: "Kalana söylenir", en: "Said to the one staying", fr: "Dit à celui qui reste" } 
        },
        { 
          label: { tr: "Güle güle", en: "Goodbye", fr: "Au revoir" }, 
          content: { tr: "Gidene söylenir", en: "Said to the one leaving", fr: "Dit à celui qui part" } 
        },
        {
          label: { tr: "Mini Diyalog", en: "Mini Dialog", fr: "Mini Dialogue" },
          content: { 
            tr: "- Merhaba, ben Yunus.\n- Merhaba, ben Ayşe. Memnun oldum.\n- Ben de memnun oldum.\n- Nasılsınız?\n- İyiyim, teşekkür ederim. Siz nasılsınız?\n- Ben de iyiyim, teşekkürler.", 
            en: "- Hello, I'm Yunus.\n- Hello, I'm Ayşe. Nice to meet you.\n- Nice to meet you too.\n- How are you?\n- I'm fine, thank you. How are you?\n- I'm fine too, thanks.", 
            fr: "- Bonjour, je suis Yunus.\n- Bonjour, je suis Ayşe. Enchantée.\n- Enchanté aussi.\n- Comment allez-vous ?\n- Je vais bien, merci. Et vous ?\n- Je vais bien aussi, merci." 
          }
        }
      ]
    }
  },
  en: {
    1: {
      title: { tr: "Alfabe", en: "Alphabet", fr: "L'Alphabet" },
      explanation: { tr: "İngiliz alfabesi 26 harften oluşur.", en: "English alphabet has 26 letters.", fr: "L'alphabet anglais a 26 lettres." },
      examples: [{ label: { tr: "Apple", en: "Apple", fr: "Pomme" }, content: { tr: "Elma", en: "Apple", fr: "Pomme" } }]
    }
  },
  fr: {
    1: {
      title: { tr: "Alfabe", en: "Alphabet", fr: "L'Alphabet" },
      explanation: { tr: "Fransız alfabesi 26 harften oluşur.", en: "French alphabet has 26 letters.", fr: "L'alphabet français a 26 lettres." },
      examples: [{ label: { tr: "Avion", en: "Airplane", fr: "Avion" }, content: { tr: "Uçak", en: "Airplane", fr: "Avion" } }]
    }
  }
};

export const GRAMMAR_DATABASE: GrammarExercise[] = [
  // --- TÜRKÇE SEVİYE 3: SELAMLAŞMA VE TANIŞMA (DİYALOG TAMAMLAMA) ---
  // Kural: 5 Boşluk, 6 Kelime (5 doğru, 1 yanlış)
  {
    id: "tr-l3-d1", language: "tr", type: "dialogue_completion",
    sentence: "Ali: Selam Ayşe, [1]? \nAyşe: [2], sen nasılsın? \nAli: Ben de [3]. [4] oldum. \nAyşe: Ben [5] memnun oldum.",
    translations: { en: "Greeting and meeting dialog.", tr: "Selamlaşma ve tanışma diyaloğu.", fr: "Dialogue de salutation et de rencontre." },
    correctAnswer: "nasılsın,İyiyim,iyiyim,Memnun,de", 
    options: ["nasılsın", "iyiyim", "İyiyim", "Memnun", "de", "Görüşürüz"], 
    topic: "Tanışma", level: 3
  },
  {
    id: "tr-l3-d2", language: "tr", type: "dialogue_completion",
    sentence: "Öğrenci: [1] öğretmenim. \nÖğretmen: Günaydın [2], [3]? \nÖğrenci: [4] öğretmenim. \nÖğretmen: [5] nasılsınız?.",
    translations: { en: "Morning greeting at school.", tr: "Okulda sabah selamlaşması.", fr: "Salutation du matin à l'école." },
    correctAnswer: "Günaydın,Ahmet,nasılsın,İyiyim,Siz", 
    options: ["Günaydın", "Ahmet", "nasılsın", "İyiyim", "Siz", "Hayır"], 
    topic: "Okul", level: 3
  },
  {
    id: "tr-l3-d3", language: "tr", type: "dialogue_completion",
    sentence: "Can: [1] akşamlar. \nSu: İyi akşamlar, [2] [3]? \nCan: [4], teşekkürler. Siz nasılsınız? \nSu: [5] de iyiyim.",
    translations: { en: "Evening greeting.", tr: "Akşam selamlaşması.", fr: "Salutation du soir." },
    correctAnswer: "İyi,nasılsınız,efendim,İyiyim,Ben", 
    options: ["İyi", "nasılsınız", "efendim", "İyiyim", "Ben", "Kötü"], 
    topic: "Resmî Selamlaşma", level: 3
  },
  {
    id: "tr-l3-d4", language: "tr", type: "dialogue_completion",
    sentence: "A: Selam, [1]? \nB: İyilik, [2] n'aber? \nA: Benden de [3]. Tanıştığımıza [4] oldum.",
    translations: { en: "Informal greeting.", tr: "Samimî selamlaşma.", fr: "Salutation informelle." },
    correctAnswer: "n'aber,senden,iyilik,memnun", 
    options: ["n'aber", "senden", "iyilik", "memnun", "Selam"], 
    topic: "Samimî", level: 3
  },
  {
    id: "tr-l3-d5", language: "tr", type: "dialogue_completion",
    sentence: "Anne: [1] geceler tatlım. \nBebek: İyi [2] anne. \nAnne: [3] uykular. \nBebek: [4] da iyi [5].",
    translations: { en: "Bedtime dialog.", tr: "Uyku vakti diyaloğu.", fr: "Dialogue du coucher." },
    correctAnswer: "İyi,geceler,Tatlı,Sana,uykular", 
    options: ["İyi", "geceler", "Tatlı", "Sana", "uykular", "Sabah"], 
    topic: "Gece", level: 3
  },
  {
    id: "tr-l3-d6", language: "tr", type: "dialogue_completion",
    sentence: "Okul Müdürü: [1] günler, hoş geldiniz. \nMüşteri: [2] buldum. \nOkul Müdürü: [3] [4] ne? \nMüşteri: [5] adım John.",
    translations: { en: "At a restaurant.", tr: "Restoranda selamlaşma.", fr: "Au restaurant." },
    correctAnswer: "İyi,Hoş,Sizin,adınız,Benim", 
    options: ["İyi", "Hoş", "Sizin", "adınız", "Benim", "Yemek"], 
    topic: "Resmî", level: 3
  },
  {
    id: "tr-l3-d7", language: "tr", type: "dialogue_completion",
    sentence: "A: Merhaba, [1]? \nB: Merhaba, [2]. Senin [3] ne? \nA: [4] [5] Elif.",
    translations: { en: "Basic meeting.", tr: "Temel tanışma.", fr: "Rencontre de base." },
    correctAnswer: "nasılsın,iyiyim,adın,Benim,adım", 
    options: ["nasılsın", "adım", "iyiyim", "adın", "Benim", "Televizyon"], 
    topic: "Tanışma", level: 3
  },
  {
    id: "tr-l3-d8", language: "tr", type: "dialogue_completion",
    sentence: "Müdür: [1] günler, [2] Bey. \nPersonel: İyi [3], Ahmet Bey. \nMüdür: Tanıştığımıza [4] oldum. \nPersonel: [5] de.",
    translations: { en: "Office greeting.", tr: "Ofis selamlaşması.", fr: "Salutation au bureau." },
    correctAnswer: "İyi,Hakan,günler,memnun,Ben", 
    options: ["İyi", "Hakan", "günler", "memnun", "Ben", "Çay"], 
    topic: "İş Dünyası", level: 3
  },
  {
    id: "tr-l3-d9", language: "tr", type: "dialogue_completion",
    sentence: "Ece: [1] kal Ayşe. \nAyşe: [2] [3] git Ece. \nEce: Yarın [4]. \nAyşe: [5] üzere.",
    translations: { en: "Saying goodbye.", tr: "Vedalaşma diyaloğu.", fr: "Dire au revoir." },
    correctAnswer: "Hoşça,Güle,güle,görüşürüz,Görüşmek", 
    options: ["Hoşça", "Güle", "güle", "görüşürüz", "Görüşmek", "Selam"], 
    topic: "Veda", level: 3
  },
  {
    id: "tr-l3-d10", language: "tr", type: "dialogue_completion",
    sentence: "Yolcu: [1] [2] efendim. \nŞoför: Teşekkürler, [3] de. \nYolcu: [4] [5] ne?",
    translations: { en: "Taxi driver dialog.", tr: "Taksi şoförü ile diyalog.", fr: "Dialogue avec un chauffeur de taxi." },
    correctAnswer: "İyi,günler,size,Sizin,adınız", 
    options: ["İyi", "günler", "size", "Sizin", "adınız", "Nereye"], 
    topic: "Ulaşım", level: 3
  }
];

const createLevelWords = (level: number, words: [string, string, string, Category][]): Word[] => {
  return words.map((w, i) => ({
    id: `l${level}-${i}`,
    en: w[0], fr: w[1], tr: w[2], category: w[3], rarity: level
  }))
};

export const WORD_DATABASE: Word[] = [
  ...createLevelWords(1, [['Time', 'Temps', 'Zaman', 'Noun'], ['Day', 'Jour', 'Gün', 'Noun'], ['Night', 'Nuit', 'Gece', 'Noun']]),
  ...createLevelWords(2, [['To go', 'Aller', 'Gitmek', 'Verb'], ['To come', 'Venir', 'Gelmek', 'Verb']]),
  ...createLevelWords(3, [['Good', 'Bon', 'İyi', 'Adjective'], ['Bad', 'Mauvais', 'Kötü', 'Adjective']]),
];
