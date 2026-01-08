
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GameState, Language, Word, GameMode, GrammarExercise } from './types';
import { WORD_DATABASE, GRAMMAR_DATABASE, LANGUAGES, UI_TRANSLATIONS, LEVEL_INFO } from './constants';
import { speakWithBrowser } from './geminiService';
import Planet from './components/Planet';

// Fisher-Yates Shuffle Algoritması
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const SpaceBackground: React.FC = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 3 + 2 + 's'
    }));
  }, []);

  return (
    <div className="space-container">
      <div className="nebula nebula-purple"></div>
      <div className="nebula nebula-blue"></div>
      <div className="nebula nebula-cyan"></div>
      {stars.map(star => (
        <div 
          key={star.id} 
          className="star star-twinkle" 
          style={{ 
            width: `${star.size}px`, 
            height: `${star.size}px`, 
            top: `${star.top}%`, 
            left: `${star.left}%`,
            '--duration': star.duration
          } as any}
        />
      ))}
      {/* Shooting Stars */}
      <div className="shooting-star" style={{ top: '10%', right: '5%', animationDelay: '2s' }}></div>
      <div className="shooting-star" style={{ top: '40%', right: '15%', animationDelay: '7s' }}></div>
      <div className="shooting-star" style={{ top: '70%', right: '25%', animationDelay: '12s' }}></div>
      <div className="rocket-float">🚀</div>
    </div>
  );
};

const App: React.FC = () => {
  const initialShuffledWords = useMemo(() => shuffleArray(WORD_DATABASE), []);
  const initialShuffledGrammar = useMemo(() => shuffleArray(GRAMMAR_DATABASE), []);

  const [state, setState] = useState<GameState & { poolIndex: number; currentLevelItems: (Word | GrammarExercise)[] }>({
    score: 0,
    currentMapLevel: 1,
    maxUnlockedLevel: 1, 
    currentLanguage: 'tr',
    targetLanguage: 'en',
    gameMode: 'vocabulary',
    category: null,
    currentWord: null,
    currentExercise: null,
    currentImage: null,
    options: [],
    selectedOption: null,
    isCorrect: null,
    isGenerating: false,
    streak: 0,
    correctAnswersInLevel: 0,
    totalAnswersInLevel: 0,
    seenItemIds: [],
    gameStatus: 'setup',
    orderingState: [],
    poolIndex: 0,
    currentLevelItems: []
  });

  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLevel = localStorage.getItem('stalker_maxLevel');
    const savedScore = localStorage.getItem('stalker_score');
    if (savedLevel || savedScore) {
      setState(prev => ({
        ...prev,
        maxUnlockedLevel: savedLevel ? parseInt(savedLevel) : 1,
        score: savedScore ? parseInt(savedScore) : 0
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('stalker_maxLevel', state.maxUnlockedLevel.toString());
    localStorage.setItem('stalker_score', state.score.toString());
  }, [state.maxUnlockedLevel, state.score]);

  const mapPathPoints = useMemo(() => {
    const points = [];
    // Gezegenler arası mesafe %10 yakınlaştırıldı (160 -> 144, 120 -> 108)
    for (let i = 0; i < 20; i++) {
      const x = 200 + i * 144;
      const y = 350 + Math.sin(i * 0.8) * 108;
      points.push({ x, y });
    }
    return points;
  }, []);

  const t = (key: string) => {
    const translations = UI_TRANSLATIONS[state.currentLanguage] || UI_TRANSLATIONS.en;
    return translations[key] || key;
  };

  const getLangCode = (lang: Language) => {
    const map = { en: 'en-US', fr: 'fr-FR', tr: 'tr-TR' };
    return map[lang] || 'en-US';
  };

  const currentQuestionId = useMemo(() => {
    return state.currentWord?.id || state.currentExercise?.id || 'none';
  }, [state.currentWord, state.currentExercise]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      selectedOption: null,
      isCorrect: null,
      orderingState: []
    }));
    setActiveAudioId(null);
  }, [currentQuestionId]);

  const handlePlayQuestionAudio = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeAudioId || !state.currentWord) return;
    const id = 'question-main';
    setActiveAudioId(id);
    const text = state.currentWord[state.currentLanguage];
    const langCode = getLangCode(state.currentLanguage);
    speakWithBrowser(text, langCode, () => setActiveAudioId(null));
  }, [activeAudioId, state.currentWord, state.currentLanguage]);

  const handlePlayOptionAudio = useCallback((e: React.MouseEvent, optionText: string) => {
    e.stopPropagation();
    if (activeAudioId) return;
    setActiveAudioId(optionText);
    const targetLangCode = getLangCode(state.targetLanguage);
    speakWithBrowser(optionText, targetLangCode, () => setActiveAudioId(null));
  }, [activeAudioId, state.targetLanguage]);

  const nextQuestion = useCallback(() => {
    setActiveAudioId(null);
    setState(prev => {
      const { poolIndex, currentLevelItems, gameMode, targetLanguage } = prev;
      if (currentLevelItems.length === 0 || poolIndex >= currentLevelItems.length) return prev;
      const nextItem = currentLevelItems[poolIndex];
      const baseUpdate = {
        ...prev,
        poolIndex: poolIndex + 1,
        selectedOption: null,
        isCorrect: null,
        orderingState: []
      };
      if (gameMode === 'vocabulary') {
        const word = nextItem as Word;
        const distractors = WORD_DATABASE
          .filter(w => w.id !== word.id && w.planetId === word.planetId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);
        const options = [word[targetLanguage], ...distractors.map(d => d[targetLanguage])].sort(() => 0.5 - Math.random());
        return { ...baseUpdate, currentWord: word, currentExercise: null, options };
      } else {
        const ex = nextItem as GrammarExercise;
        return { ...baseUpdate, currentWord: null, currentExercise: ex, options: [...ex.options].sort(() => 0.5 - Math.random()) };
      }
    });
  }, []);

  const selectLevel = (level: number) => {
    if (level > state.maxUnlockedLevel) return;
    const isVocab = state.gameMode === 'vocabulary';
    const levelItems = isVocab 
      ? initialShuffledWords.filter(w => w.planetId === level)
      : initialShuffledGrammar.filter(g => g.level === level && g.language === state.targetLanguage);
    if (levelItems.length === 0) {
      alert(isVocab ? "Bu gezegen için kelime içeriği yok." : "Bu gezegen için gramer içeriği yok.");
      return;
    }
    setState(prev => ({
      ...prev,
      currentMapLevel: level,
      gameStatus: prev.gameMode === 'grammar' ? 'explanation' : 'playing',
      correctAnswersInLevel: 0,
      totalAnswersInLevel: 0,
      seenItemIds: [],
      selectedOption: null,
      isCorrect: null,
      orderingState: [],
      currentLevelItems: levelItems,
      poolIndex: 0
    }));
    if (state.gameMode === 'vocabulary') setTimeout(() => nextQuestion(), 50);
  };

  const handleAnswer = (answer: string) => {
    if (state.selectedOption !== null) return;
    const isVocab = state.gameMode === 'vocabulary';
    const correctAnswer = isVocab ? state.currentWord?.[state.targetLanguage] : state.currentExercise?.correctAnswer;
    finishAnswer(answer === correctAnswer, answer);
  };

  const finishAnswer = (correct: boolean, answer: string) => {
    const nextTotalCount = state.totalAnswersInLevel + 1;
    const isLevelOver = nextTotalCount >= state.currentLevelItems.length;
    setState(prev => {
      const newCorrectCount = correct ? prev.correctAnswersInLevel + 1 : prev.correctAnswersInLevel;
      let nextStatus = prev.gameStatus;
      let nextMaxLevel = prev.maxUnlockedLevel;
      if (isLevelOver) {
        const successRate = newCorrectCount / prev.currentLevelItems.length;
        if (successRate >= 0.8) {
          nextStatus = 'level-up';
          if (prev.currentMapLevel === prev.maxUnlockedLevel) {
            nextMaxLevel = prev.currentMapLevel + 1;
          }
        } else {
          nextStatus = 'level-failed';
        }
      }
      return {
        ...prev,
        isCorrect: correct,
        selectedOption: answer,
        score: correct ? prev.score + 10 : prev.score,
        streak: correct ? prev.streak + 1 : 0,
        correctAnswersInLevel: newCorrectCount,
        totalAnswersInLevel: nextTotalCount,
        gameStatus: nextStatus,
        maxUnlockedLevel: nextMaxLevel
      };
    });
    if (!isLevelOver) setTimeout(() => nextQuestion(), 1500);
  };

  const getOptionClasses = (option: string) => {
    const base = "w-full p-5 rounded-2xl text-xl font-bold transition-all border-2 flex items-center justify-center transform bg-slate-800/80 backdrop-blur-sm border-slate-700 text-white shadow-sm ";
    if (state.selectedOption !== null) {
      if (state.selectedOption !== option) return base + "opacity-40 grayscale";
    } else {
      return base + "hover:border-indigo-500 hover:bg-slate-700 active:scale-95";
    }
    return base;
  };

  const startActualPlay = () => {
    setState(prev => ({ ...prev, gameStatus: 'playing' }));
    setTimeout(() => nextQuestion(), 50);
  };

  return (
    <div className="min-h-screen relative text-white">
      <SpaceBackground />
      
      {state.gameStatus === 'setup' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full space-y-8 bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-700 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-indigo-400 mb-2">{t('welcome')}</h1>
              <p className="text-slate-400">{t('subWelcome')}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">{t('sourceLabel')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {LANGUAGES.map(lang => (
                    <button key={lang.code} onClick={() => setState(p => ({ ...p, currentLanguage: lang.code as Language }))} className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${state.currentLanguage === lang.code ? 'border-indigo-500 bg-indigo-500/20' : 'border-slate-700 hover:bg-slate-700'}`}>
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="text-[10px] font-bold uppercase">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">{t('targetLabel')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {LANGUAGES.map(lang => (
                    <button key={lang.code} onClick={() => setState(p => ({ ...p, targetLanguage: lang.code as Language }))} className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${state.targetLanguage === lang.code ? 'border-purple-500 bg-purple-500/20' : 'border-slate-700 hover:bg-slate-700'}`}>
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="text-[10px] font-bold uppercase">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">{t('modeLabel')}</label>
                <div className="flex gap-2">
                  <button onClick={() => setState(p => ({ ...p, gameMode: 'vocabulary' }))} className={`flex-1 p-3 rounded-xl border-2 transition-all ${state.gameMode === 'vocabulary' ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-700'}`}>🚀 {t('vocabularyMode')}</button>
                  <button onClick={() => setState(p => ({ ...p, gameMode: 'grammar' }))} className={`flex-1 p-3 rounded-xl border-2 transition-all ${state.gameMode === 'grammar' ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700'}`}>🧩 {t('grammarMode')}</button>
                </div>
              </div>
            </div>
            <button onClick={() => setState(p => ({ ...p, gameStatus: 'map' }))} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-lg shadow-lg active:scale-95">{t('startBtn')}</button>
          </div>
        </div>
      )}

      {state.gameStatus === 'map' && (
        <div className="h-screen relative overflow-hidden">
          <div className="absolute top-6 left-6 z-20 flex gap-4">
             <button onClick={() => setState(p => ({ ...p, gameStatus: 'setup' }))} className="px-4 py-2 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors flex items-center gap-2">← {t('backToHome')}</button>
             <div className="px-4 py-2 bg-indigo-600/30 border border-indigo-500/40 rounded-xl text-indigo-300 font-bold">🏆 {state.score}</div>
          </div>
          <div ref={scrollContainerRef} className="h-full overflow-x-auto overflow-y-hidden no-scrollbar cursor-grab active:cursor-grabbing relative z-10">
            <div className="h-full relative" style={{ width: 20 * 144 + 400 }}>
              {mapPathPoints.map((p, i) => {
                const planetLevel = i + 1;
                const isUnlocked = planetLevel <= state.maxUnlockedLevel;
                return (
                  <div key={planetLevel} className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`} style={{ left: p.x, top: p.y }} onClick={() => selectLevel(planetLevel)}>
                    <svg width="140" height="140" viewBox="-80 -80 160 160">
                       <Planet level={planetLevel} color={['#f43f5e', '#ec4899', '#a855f7', '#6366f1', '#3b82f6'][i%5]} size={30+(i%3)*8} isUnlocked={isUnlocked} />
                    </svg>
                    <div className="text-center mt-1">
                      <span className="text-[11px] font-black uppercase text-white drop-shadow-md">
                        {isUnlocked ? (LEVEL_INFO[state.currentLanguage]?.[planetLevel]?.title[state.currentLanguage] || t('level') + " " + planetLevel) : 'Locked'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {state.gameStatus === 'explanation' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
          <div className="max-w-3xl w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700 p-8 rounded-[2.5rem] shadow-2xl question-entrance my-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-600/30 rounded-2xl flex items-center justify-center text-3xl">📖</div>
              <h1 className="text-3xl font-black no-uppercase">{LEVEL_INFO[state.currentLanguage]?.[state.currentMapLevel]?.title[state.currentLanguage] || t('level') + " " + state.currentMapLevel}</h1>
            </div>
            <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-700/50">
              <p className="text-slate-300 no-uppercase">{LEVEL_INFO[state.currentLanguage]?.[state.currentMapLevel]?.explanation[state.currentLanguage]}</p>
              <p className="mt-4 text-xs font-bold text-indigo-400 uppercase tracking-widest">Gezegen Görevi: 50 soruda en az 40 doğru yapmalısın.</p>
            </div>
            <button onClick={startActualPlay} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-xl shadow-xl active:scale-95">🚀 {t('startLesson')}</button>
          </div>
        </div>
      )}

      {state.gameStatus === 'playing' && (
        <div className="min-h-screen flex flex-col p-4 sm:p-6 relative z-10">
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <div className="flex-1 pr-8">
                <div className="flex justify-between mb-1">
                  <span className={`text-[10px] font-bold uppercase transition-colors duration-300 ${state.correctAnswersInLevel >= 40 ? 'text-emerald-400' : 'text-rose-400'}`}>
                     {state.correctAnswersInLevel} / {state.currentLevelItems.length}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${state.correctAnswersInLevel >= 40 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${(state.correctAnswersInLevel / state.currentLevelItems.length) * 100}%` }} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase">{t('score')}</p>
                <p className="text-xl font-black text-indigo-400">{state.score}</p>
              </div>
            </div>
            
            <div key={currentQuestionId} className="flex-1 flex flex-col items-center justify-center space-y-8 question-entrance">
              <div className="w-full text-center">
                {state.currentWord && (
                  <div className="space-y-4">
                    <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full uppercase">{state.currentWord.type}</span>
                    <div className="flex items-center justify-center gap-4">
                      <h2 className="text-5xl font-black no-uppercase text-white tracking-tight drop-shadow-md">{state.currentWord[state.currentLanguage]}</h2>
                      <button onClick={handlePlayQuestionAudio} className={`p-1 rounded-xl shadow-lg transition-colors ${activeAudioId === 'question-main' ? 'text-white bg-purple-800' : 'text-purple-400 bg-purple-900/30 hover:bg-purple-900/50'}`} style={{ fontSize: '2.5rem' }}><span className="material-icons" style={{ fontSize: 'inherit' }}>volume_up</span></button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 w-full">
                {state.options.map((option, idx) => {
                  const isSelected = state.selectedOption === option;
                  const isCorrect = option === (state.currentWord?.[state.targetLanguage]);
                  return (
                    <div key={`${currentQuestionId}-opt-${idx}`} className="relative group">
                      <button onClick={() => handleAnswer(option)} disabled={state.selectedOption !== null} className={getOptionClasses(option)}>
                        <span className={`no-uppercase transition-colors duration-300 ${state.selectedOption !== null && isSelected ? (isCorrect ? 'text-correct' : 'text-incorrect animate-shake') : ''}`}>
                          {option}
                        </span>
                      </button>
                      <button onClick={(e) => handlePlayOptionAudio(e, option)} className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg shadow-sm z-10 ${activeAudioId === option ? 'text-white bg-purple-800' : 'text-purple-400 bg-purple-900/40 hover:bg-purple-900/60'}`}><span className="material-icons" style={{ fontSize: '1.25rem' }}>volume_up</span></button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
            <button onClick={() => setState(p => ({ ...p, gameStatus: 'map' }))} className="px-6 py-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl text-slate-400 hover:text-white flex items-center gap-2 shadow-2xl transition-all hover:border-indigo-500">🗺️ {t('backToMap')}</button>
          </div>
        </div>
      )}

      {(state.gameStatus === 'level-up' || state.gameStatus === 'level-failed') && (
        <div className="min-h-screen flex items-center justify-center p-6 text-white relative z-10">
          <div className={`max-w-md w-full p-8 rounded-[2.5rem] border-2 shadow-2xl text-center space-y-8 backdrop-blur-xl ${state.gameStatus === 'level-up' ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-rose-950/30 border-rose-500/30'}`}>
            <div className="text-6xl">{state.gameStatus === 'level-up' ? '🎊' : '💀'}</div>
            <h1 className="text-4xl font-black">{state.gameStatus === 'level-up' ? t('promoted') : t('failed')}</h1>
            <div className="space-y-2">
              <p className={`text-slate-400 font-bold ${state.gameStatus === 'level-up' ? 'text-emerald-400' : 'text-rose-400'}`}>Doğru: {state.correctAnswersInLevel} / {state.currentLevelItems.length}</p>
              <p className="text-sm text-slate-500">{state.gameStatus === 'level-up' ? "Harika! Bir sonraki gezegenin kilidi açıldı." : "Yeterli puana ulaşamadın (en az 40 doğru gerekli). Tekrar dene."}</p>
            </div>
            <div className="flex flex-col gap-3">
              {state.gameStatus === 'level-up' ? (
                <button onClick={() => selectLevel(state.currentMapLevel + 1)} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-lg active:scale-95 shadow-lg shadow-indigo-500/20">{t('nextSector')}</button>
              ) : (
                <button onClick={() => selectLevel(state.currentMapLevel)} className="w-full py-5 bg-rose-600 hover:bg-rose-500 rounded-2xl font-bold text-lg active:scale-95 shadow-lg shadow-rose-500/20">{t('retry')}</button>
              )}
              <button onClick={() => setState(p => ({ ...p, gameStatus: 'map' }))} className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-slate-400 transition-colors">{t('backToMap')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
