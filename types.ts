
export type Language = 'en' | 'fr' | 'tr' | 'la';

export type Category = 'Noun' | 'Verb' | 'Adjective' | 'Adverb';

export interface Word {
  id: string;
  en: string;
  fr: string;
  tr: string;
  la: string;
  category: Category;
  rarity: number; // 1-20: level mapping
}

export interface GameState {
  score: number;
  currentMapLevel: number;
  maxUnlockedLevel: number;
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
  seenWordIds: string[];
  gameStatus: 'setup' | 'map' | 'playing' | 'level-up' | 'level-failed' | 'finished';
}
