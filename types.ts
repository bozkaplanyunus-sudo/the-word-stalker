
export type Language = 'en' | 'fr' | 'tr';

export type Category = 'Noun' | 'Verb' | 'Adjective' | 'Adverb' | 'Grammar';

export type GameMode = 'vocabulary' | 'grammar';

export interface GrammarExercise {
  id: string;
  language: Language;
  type: 'choice' | 'ordering'; // Yeni alan: Çoktan seçmeli mi yoksa sıralama mı?
  sentence: string;
  translations: Record<Language, string>;
  correctAnswer: string; // Sıralama tipinde bu alan doğru dizilimi virgülle ayırarak (A,B,C) tutar
  options: string[];
  topic: string;
  level: number;
}

export interface LevelInfo {
  title: string;
  explanation: string;
  examples: { original: string; translated: string }[];
}

export interface Word {
  id: string;
  en: string;
  fr: string;
  tr: string;
  category: Category;
  rarity: number;
}

export interface GameState {
  score: number;
  currentMapLevel: number;
  maxUnlockedLevel: number;
  currentLanguage: Language;
  targetLanguage: Language;
  gameMode: GameMode;
  category: Category | null;
  currentWord: Word | null;
  currentExercise: GrammarExercise | null;
  currentImage: string | null;
  options: string[];
  selectedOption: string | null;
  isCorrect: boolean | null;
  isGenerating: boolean;
  streak: number;
  correctAnswersInLevel: number;
  totalAnswersInLevel: number;
  seenItemIds: string[];
  gameStatus: 'setup' | 'map' | 'explanation' | 'playing' | 'level-up' | 'level-failed' | 'finished';
  orderingState?: string[]; // Sıralama soruları için geçici tutulan sıra
}
