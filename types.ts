
export type Language = 'en' | 'fr' | 'tr';

export type Category = 'Noun' | 'Verb' | 'Adjective' | 'Adverb';

export interface Word {
  id: string;
  en: string;
  fr: string;
  tr: string;
  category: Category;
  rarity: number; // 1-20: level mapping
}

export interface GameState {
  score: number;
  currentMapLevel: number; // The level currently being played
  maxUnlockedLevel: number; // The highest level the user has reached
  currentLanguage: Language;
  targetLanguage: Language;
  category: Category | null;
  currentWord: Word | null;
  currentImage: string | null;
  options: string[];
  isCorrect: boolean | null;
  isGenerating: boolean;
  streak: number;
  correctAnswersInLevel: number;
  totalAnswersInLevel: number;
  seenWordIds: string[]; // Track IDs seen in the current level session
  gameStatus: 'setup' | 'map' | 'playing' | 'level-up' | 'level-failed' | 'finished';
}
