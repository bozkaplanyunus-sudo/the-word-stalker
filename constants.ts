
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
    orderingInstruction: "Put them in order!",
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
    orderingInstruction: "Sıraya diz!",
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
    orderingInstruction: "Mettez en ordre !",
    clear: "Effacer"
  }
};

const createNumExample = (n: number, word: string) => ({
  label: { tr: n.toString(), en: n.toString(), fr: n.toString() },
  content: word
});

// Grammar Level Info
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
        { 
          label: { tr: "Sesli Harfler", en: "Vowels", fr: "Voyelles" }, 
          content: "a, e, ı, i, o, ö, u, ü" 
        },
        { 
          label: { tr: "Sessiz Harfler", en: "Consonants", fr: "Consonnes" }, 
          content: "b, c, ç, d, f, g, ğ, h, j, k, l, m, n, p, r, s, ş, t, v, y, z" 
        }
      ]
    },
    2: {
      title: { tr: "Sayılar", en: "Numbers", fr: "Les Nombres" },
      explanation: {
        tr: "Türkçe sayılar onluk sisteme dayanır. Bir'den yirmi'ye kadar olan temel sayıları ve onluk ritmik saymayı öğreniyoruz.",
        en: "Turkish numbers are based on the decimal system. We are learning basic numbers from one to twenty and counting by tens.",
        fr: "Les nombres turcs sont basés sur le système décimal. Nous apprenons les nombres de base de un à vingt et le comptage par dizaines."
      },
      examples: [
        createNumExample(1, "Bir"), createNumExample(2, "İki"), createNumExample(3, "Üç"),
        createNumExample(4, "Dört"), createNumExample(5, "Beş"), createNumExample(6, "Altı"),
        createNumExample(7, "Yedi"), createNumExample(8, "Sekiz"), createNumExample(9, "Dokuz"),
        createNumExample(10, "On"), createNumExample(11, "On Bir"), createNumExample(12, "On İki"),
        createNumExample(13, "On Üç"), createNumExample(14, "On Dört"), createNumExample(15, "On Beş"),
        createNumExample(16, "On Altı"), createNumExample(17, "On Yedi"), createNumExample(18, "On Sekiz"),
        createNumExample(19, "On Dokuz"), createNumExample(20, "Yirmi"),
        createNumExample(30, "Otuz"), createNumExample(40, "Kırk"), createNumExample(50, "Elli"),
        createNumExample(60, "Altmış"), createNumExample(70, "Yetmiş"), createNumExample(80, "Seksen"),
        createNumExample(90, "Doksan"), createNumExample(100, "Yüz")
      ]
    }
  },
  en: {
    1: {
      title: { tr: "Alfabe", en: "Alphabet", fr: "L'Alphabet" },
      explanation: {
        tr: "İngiliz alfabesi 26 harften oluşur: 5 sesli ve 21 sessiz harf.",
        en: "The English alphabet consists of 26 letters: 5 vowels and 21 consonants.",
        fr: "L'alphabet anglais se compose de 26 lettres : 5 voyelles et 21 consonnes."
      },
      examples: [
        { 
          label: { tr: "Sesli Harfler", en: "Vowels", fr: "Voyelles" }, 
          content: "a, e, i, o, u" 
        },
        { 
          label: { tr: "Sessiz Harfler", en: "Consonants", fr: "Consonnes" }, 
          content: "b, c, d, f, g, ..." 
        }
      ]
    },
    2: {
      title: { tr: "Sayılar", en: "Numbers", fr: "Les Nombres" },
      explanation: {
        tr: "İngilizce'de bir'den yirmi'ye kadar olan sayıları ve onluk sistemi öğreniyoruz.",
        en: "In English, we learn numbers from one to twenty and the decimal system.",
        fr: "En anglais, nous apprenons les nombres de un à vingt et le système décimal."
      },
      examples: [
        createNumExample(1, "One"), createNumExample(2, "Two"), createNumExample(3, "Three"),
        createNumExample(4, "Four"), createNumExample(5, "Five"), createNumExample(6, "Six"),
        createNumExample(7, "Seven"), createNumExample(8, "Eight"), createNumExample(9, "Nine"),
        createNumExample(10, "Ten"), createNumExample(11, "Eleven"), createNumExample(12, "Twelve"),
        createNumExample(13, "Thirteen"), createNumExample(14, "Fourteen"), createNumExample(15, "Fifteen"),
        createNumExample(16, "Sixteen"), createNumExample(17, "Seventeen"), createNumExample(18, "Eighteen"),
        createNumExample(19, "Nineteen"), createNumExample(20, "Twenty"),
        createNumExample(30, "Thirty"), createNumExample(40, "Forty"), createNumExample(50, "Fifty"),
        createNumExample(60, "Sixty"), createNumExample(70, "Seventy"), createNumExample(80, "Eighty"),
        createNumExample(90, "Ninety"), createNumExample(100, "Hundred")
      ]
    }
  },
  fr: {
    1: {
      title: { tr: "Alfabe", en: "Alphabet", fr: "L'Alphabet" },
      explanation: {
        tr: "Fransız alfabesi 26 harften oluşur. 'y' harfi de bazen sesli sayılır.",
        en: "The French alphabet has 26 letters. 'y' is sometimes treated as a vowel.",
        fr: "L'alphabet français comprend 26 lettres. Le 'y' est parfois traité como une voyelle."
      },
      examples: [
        { 
          label: { tr: "Sesli Harfler", en: "Vowels", fr: "Voyelles" }, 
          content: "a, e, i, o, u, y" 
        },
        { 
          label: { tr: "Sessiz Harfler", en: "Consonants", fr: "Consonnes" }, 
          content: "b, c, d, f, g, ..." 
        }
      ]
    },
    2: {
      title: { tr: "Sayılar", en: "Numbers", fr: "Les Nombres" },
      explanation: {
        tr: "Fransızca'da sayı saymayı öğrenmek (1-20 ve onluklar) dili kullanmak için esastır.",
        en: "Learning to count in French (1-20 and tens) is essential for using the language.",
        fr: "Apprendre à compter en français (1-20 et dizaines) est essentiel pour utiliser la langue."
      },
      examples: [
        createNumExample(1, "Un"), createNumExample(2, "Deux"), createNumExample(3, "Trois"),
        createNumExample(4, "Quatre"), createNumExample(5, "Cinq"), createNumExample(6, "Six"),
        createNumExample(7, "Sept"), createNumExample(8, "Huit"), createNumExample(9, "Neuf"),
        createNumExample(10, "Dix"), createNumExample(11, "Onze"), createNumExample(12, "Douze"),
        createNumExample(13, "Treize"), createNumExample(14, "Quatorze"), createNumExample(15, "Quinze"),
        createNumExample(16, "Seize"), createNumExample(17, "Dix-sept"), createNumExample(18, "Dix-huit"),
        createNumExample(19, "Dix-neuf"), createNumExample(20, "Vingt"),
        createNumExample(30, "Trente"), createNumExample(40, "Quarante"), createNumExample(50, "Cinquante"),
        createNumExample(60, "Soixante"), createNumExample(70, "Soixante-dix"), createNumExample(80, "Quatre-vingts"),
        createNumExample(90, "Quatre-vingt-dix"), createNumExample(100, "Cent")
      ]
    }
  }
};

// Grammar Exercises
export const GRAMMAR_DATABASE: GrammarExercise[] = [
  // --- TÜRKÇE SEVİYE 1: ALFABE ---
  {
    id: "tr-l1-full",
    language: "tr",
    type: "ordering",
    sentence: "TÜM ALFABE: Harflerin tamamını doğru sıraya diz!",
    translations: { en: "FULL ALPHABET: Put all letters in order!", tr: "TÜM ALFABE: Tüm harfleri sıraya diz!", fr: "ALPHABET COMPLET : Mettez toutes les lettres dans l'ordre !" },
    correctAnswer: "A,B,C,Ç,D,E,F,G,Ğ,H,I,İ,J,K,L,M,N,O,Ö,P,R,S,Ş,T,U,Ü,V,Y,Z",
    options: ["A", "B", "C", "Ç", "D", "E", "F", "G", "Ğ", "H", "I", "İ", "J", "K", "L", "M", "N", "O", "Ö", "P", "R", "S", "Ş", "T", "U", "Ü", "V", "Y", "Z"],
    topic: "Alfabe",
    level: 1
  },
  {
    id: "tr-l1-g1",
    language: "tr",
    type: "ordering",
    sentence: "Grup 1: A'dan D'ye",
    translations: { en: "Group 1: A to D", tr: "Grup 1: A'dan D'ye", fr: "Groupe 1 : A à D" },
    correctAnswer: "A,B,C,Ç,D",
    options: ["B", "Ç", "A", "D", "C"],
    topic: "Alfabe",
    level: 1
  },
  {
    id: "tr-l1-g2",
    language: "tr",
    type: "ordering",
    sentence: "Grup 2: E'den H'ye",
    translations: { en: "Group 2: E to H", tr: "Grup 2: E'den H'ye", fr: "Groupe 2 : E à H" },
    correctAnswer: "E,F,G,Ğ,H",
    options: ["Ğ", "F", "H", "E", "G"],
    topic: "Alfabe",
    level: 1
  },
  {
    id: "tr-l1-g3",
    language: "tr",
    type: "ordering",
    sentence: "Grup 3: I'dan L'ye",
    translations: { en: "Group 3: I to L", tr: "Grup 3: I'dan L'ye", fr: "Groupe 3 : I à L" },
    correctAnswer: "I,İ,J,K,L",
    options: ["İ", "J", "L", "I", "K"],
    topic: "Alfabe",
    level: 1
  },
  {
    id: "tr-l1-g4",
    language: "tr",
    type: "ordering",
    sentence: "Grup 4: M'den P'ye",
    translations: { en: "Group 4: M to P", tr: "Grup 4: M'den P'ye", fr: "Groupe 4 : M à P" },
    correctAnswer: "M,N,O,Ö,P",
    options: ["O", "N", "P", "M", "Ö"],
    topic: "Alfabe",
    level: 1
  },
  {
    id: "tr-l1-g5",
    language: "tr",
    type: "ordering",
    sentence: "Grup 5: R'den U'ya",
    translations: { en: "Group 5: R to U", tr: "Grup 5: R'den U'ya", fr: "Groupe 5 : R à U" },
    correctAnswer: "R,S,Ş,T,U",
    options: ["Ş", "S", "U", "R", "T"],
    topic: "Alfabe",
    level: 1
  },
  {
    id: "tr-l1-g6",
    language: "tr",
    type: "ordering",
    sentence: "Grup 6: Ü'den Z'ye",
    translations: { en: "Group 6: Ü to Z", tr: "Grup 6: Ü'den Z'ye", fr: "Groupe 6 : Ü à Z" },
    correctAnswer: "Ü,V,Y,Z",
    options: ["Z", "V", "Y", "Ü"],
    topic: "Alfabe",
    level: 1
  },
  {
    id: "tr-l1-vowel-1",
    language: "tr",
    type: "choice",
    sentence: "Hangisi sesli harf değildir?",
    translations: { en: "Which letter is NOT a vowel?", tr: "Hangisi sesli harf değildir?", fr: "Quelle lettre n'est pas une voyelle ?" },
    correctAnswer: "k",
    options: ["a", "e", "k"],
    topic: "Alfabe",
    level: 1
  },
  {
    id: "tr-l1-vowel-2",
    language: "tr",
    type: "choice",
    sentence: "Hangisi sesli harftir?",
    translations: { en: "Which one is a vowel?", tr: "Hangisi sesli harftir?", fr: "Lequel est une voyelle ?" },
    correctAnswer: "o",
    options: ["h", "m", "o"],
    topic: "Alfabe",
    level: 1
  },
  {
    id: "tr-l1-cons-1",
    language: "tr",
    type: "choice",
    sentence: "Hangisi sessiz harftir?",
    translations: { en: "Which one is a consonant?", tr: "Hangisi sessiz harftir?", fr: "Lequel est une consonne ?" },
    correctAnswer: "b",
    options: ["a", "u", "b"],
    topic: "Alfabe",
    level: 1
  },

  // --- TÜRKÇE SEVİYE 2: SAYILAR ---
  {
    id: "tr-l2-ord-1",
    language: "tr",
    type: "ordering",
    sentence: "1'den 5'e kadar sayıları sıraya diz!",
    translations: { en: "Order numbers from 1 to 5!", tr: "1'den 5'e kadar sayıları sıraya diz!", fr: "Ordonnez les nombres de 1 à 5 !" },
    correctAnswer: "Bir,İki,Üç,Dört,Beş",
    options: ["İki", "Dört", "Bir", "Beş", "Üç"],
    topic: "Sayılar",
    level: 2
  },
  {
    id: "tr-l2-ord-2",
    language: "tr",
    type: "ordering",
    sentence: "6'dan 10'a kadar sayıları sıraya diz!",
    translations: { en: "Order numbers from 6 to 10!", tr: "6'dan 10'a kadar sayıları sıraya diz!", fr: "Ordonnez les nombres de 6 à 10 !" },
    correctAnswer: "Altı,Yedi,Sekiz,Dokuz,On",
    options: ["Dokuz", "Altı", "On", "Yedi", "Sekiz"],
    topic: "Sayılar",
    level: 2
  },
  {
    id: "tr-l2-ord-10s",
    language: "tr",
    type: "ordering",
    sentence: "10'ar 10'ar 100'e kadar sayıları sıraya diz!",
    translations: { en: "Order numbers by 10s up to 100!", tr: "10'ar 10'ar 100'e kadar sayıları sıraya diz!", fr: "Ordonnez les nombres par 10 jusqu'à 100 !" },
    correctAnswer: "On,Yirmi,Otuz,Kırk,Elli,Altmış,Yetmiş,Seksen,Doksan,Yüz",
    options: ["Elli", "On", "Altmış", "Doksan", "Yirmi", "Yüz", "Otuz", "Yetmiş", "Seksen", "Kırk"],
    topic: "Sayılar",
    level: 2
  },
  {
    id: "tr-l2-choice-1",
    language: "tr",
    type: "choice",
    sentence: "3 sayısının yazılışı hangisidir?",
    translations: { en: "Number: 3. Which one is the written form?", tr: "3 sayısının yazılışı hangisidir?", fr: "Nombre : 3. Quelle est la forme écrite ?" },
    correctAnswer: "Üç",
    options: ["İki", "Üç", "Dört"],
    topic: "Sayılar",
    level: 2
  },
  {
    id: "tr-l2-choice-2",
    language: "tr",
    type: "choice",
    sentence: "5 sayısının yazılışı hangisidir?",
    translations: { en: "Number: 5. Which one is the written form?", tr: "5 sayısının yazılışı hangisidir?", fr: "Nombre : 5. Quelle est la forme écrite ?" },
    correctAnswer: "Beş",
    options: ["Beş", "Altı", "Yedi"],
    topic: "Sayılar",
    level: 2
  },
  {
    id: "tr-l2-choice-3",
    language: "tr",
    type: "choice",
    sentence: "Yedi sayısının rakamla yazılışı hangisidir?",
    translations: { en: "Written: 'Yedi'. Which digit is it?", tr: "'Yedi' yazılışı hangi rakamdır?", fr: "Écrit : 'Yedi'. Quel chiffre est-ce ?" },
    correctAnswer: "7",
    options: ["6", "7", "8"],
    topic: "Sayılar",
    level: 2
  },
  {
    id: "tr-l2-choice-4",
    language: "tr",
    type: "choice",
    sentence: "10 sayısının yazılışı hangisidir?",
    translations: { en: "Number: 10. Which one is the written form?", tr: "10 sayısının yazılışı hangisidir?", fr: "Nombre : 10. Quelle est la forme écrite ?" },
    correctAnswer: "On",
    options: ["On", "Yirmi", "Otuz"],
    topic: "Sayılar",
    level: 2
  },
  {
    id: "tr-l2-choice-5",
    language: "tr",
    type: "choice",
    sentence: "20 sayısının yazılışı hangisidir?",
    translations: { en: "Number: 20. Which one is the written form?", tr: "20 sayısının yazılışı hangisidir?", fr: "Nombre : 20. Quelle est la forme écrite ?" },
    correctAnswer: "Yirmi",
    options: ["On", "Yirmi", "Kırk"],
    topic: "Sayılar",
    level: 2
  },
  {
    id: "tr-l2-choice-6",
    language: "tr",
    type: "choice",
    sentence: "12 sayısının yazılışı hangisidir?",
    translations: { en: "Number: 12. Which one is the written form?", tr: "12 sayısının yazılışı hangisidir?", fr: "Nombre : 12. Quelle est la forme écrite ?" },
    correctAnswer: "On İki",
    options: ["On İki", "On Bir", "On Üç"],
    topic: "Sayılar",
    level: 2
  },
  {
    id: "tr-l2-choice-7",
    language: "tr",
    type: "choice",
    sentence: "100 sayısının yazılışı hangisidir?",
    translations: { en: "Number: 100. Which one is the written form?", tr: "100 sayısının yazılışı hangisidir?", fr: "Nombre : 100. Quelle est la forme écrite ?" },
    correctAnswer: "Yüz",
    options: ["Yüz", "Bin", "On"],
    topic: "Sayılar",
    level: 2
  },
  {
    id: "tr-l2-choice-8",
    language: "tr",
    type: "choice",
    sentence: "Elli sayısının sayıyla yazılışı hangisidir?",
    translations: { en: "Written: 'Fifty'. Which digit is it?", tr: "'Elli' yazılışı hangi rakamdır?", fr: "Écrit : 'Cinquante'. Quel chiffre est-ce ?" },
    correctAnswer: "50",
    options: ["40", "50", "60"],
    topic: "Sayılar",
    level: 2
  }
];

const createLevelWords = (level: number, words: [string, string, string, Category][]): Word[] => {
  return words.map((w, i) => ({
    id: `l${level}-${i}`,
    en: w[0],
    fr: w[1],
    tr: w[2],
    category: w[3],
    rarity: level
  }))
};

export const WORD_DATABASE: Word[] = [
  ...createLevelWords(1, [['One', 'Un', 'Bir', 'Noun'], ['Time', 'Temps', 'Zaman', 'Noun'], ['Day', 'Jour', 'Gün', 'Noun'], ['Night', 'Nuit', 'Gece', 'Noun'], ['Week', 'Semaine', 'Hafta', 'Noun']]),
  ...createLevelWords(2, [['Book', 'Livre', 'Kitap', 'Noun'], ['Pen', 'Stylo', 'Kalem', 'Noun'], ['Apple', 'Pomme', 'Elma', 'Noun'], ['Child', 'Enfant', 'Çocuk', 'Noun'], ['Table', 'Table', 'Masa', 'Noun']])
];
