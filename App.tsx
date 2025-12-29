
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GameState, Language, Word, GameMode, GrammarExercise } from './types';
import { WORD_DATABASE, GRAMMAR_DATABASE, LANGUAGES, UI_TRANSLATIONS, CATEGORIES, LEVEL_INFO } from './constants';
import { speakWord } from './geminiService';
import Planet from './components/Planet';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    score: 0,
    currentMapLevel: 1,
    maxUnlockedLevel: 20, // Tasarım ve test için tüm seviyeler açıldı
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
    orderingState: []
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => {
    const translations = UI_TRANSLATIONS[state.currentLanguage] || UI_TRANSLATIONS.en;
    return translations[key] || key;
  };

  const mapPathPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 20; i++) {
      points.push({
        x: 150 + i * 220, 
        y: 400 + Math.sin(i * 1.5) * 80 
      });
    }
    return points;
  }, []);

  useEffect(() => {
    if (state.gameStatus === 'map' && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const currentPlanetX = mapPathPoints[state.currentMapLevel - 1]?.x || 150;
      const scrollPos = currentPlanetX - container.clientWidth / 2;
      container.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  }, [state.gameStatus, state.currentMapLevel, mapPathPoints]);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      const isVocab = prev.gameMode === 'vocabulary';
      
      const baseUpdate = {
        ...prev,
        selectedOption: null,
        isCorrect: null,
        orderingState: []
      };

      if (isVocab) {
        const levelWords = WORD_DATABASE.filter(w => w.rarity === prev.currentMapLevel);
        const availableWords = levelWords.filter(w => !prev.seenItemIds.includes(w.id));
        const wordPool = availableWords.length > 0 ? availableWords : (levelWords.length > 0 ? levelWords : WORD_DATABASE);
        
        if (wordPool.length === 0) return { ...baseUpdate, gameStatus: 'setup' };

        const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
        const distractors = WORD_DATABASE
            .filter(w => w.id !== randomWord.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
            
        const options = [randomWord[prev.targetLanguage], ...distractors.map(d => d[prev.targetLanguage])].sort(() => 0.5 - Math.random());

        return {
          ...baseUpdate,
          currentWord: randomWord,
          currentExercise: null,
          options,
          seenItemIds: [...prev.seenItemIds, randomWord.id]
        };
      } else {
        // HATA DÜZELTME: Sadece mevcut seviyenin sorularını filtrele
        const levelEx = GRAMMAR_DATABASE.filter(g => g.level === prev.currentMapLevel && g.language === prev.targetLanguage);
        const availableEx = levelEx.filter(g => !prev.seenItemIds.includes(g.id));
        
        // Eğer bu seviye için hiç soru yoksa haritaya dön
        if (levelEx.length === 0) {
          console.warn("No grammar exercises found for this specific level/language.");
          return { ...baseUpdate, gameStatus: 'map' };
        }

        // Eğer yeni soru kalmadıysa mevcut seviye havuzundan rastgele seç (tüm havuzdan değil!)
        const exPool = availableEx.length > 0 ? availableEx : levelEx;

        const randomEx = exPool[Math.floor(Math.random() * exPool.length)];
        
        return {
          ...baseUpdate,
          currentWord: null,
          currentExercise: randomEx,
          options: [...(randomEx.options || [])].sort(() => 0.5 - Math.random()),
          seenItemIds: [...prev.seenItemIds, randomEx.id]
        };
      }
    });
  }, []);

  const selectLevel = (level: number) => {
    const hasGrammar = GRAMMAR_DATABASE.some(g => g.level === level && g.language === state.targetLanguage);
    
    setState(prev => ({
      ...prev,
      currentMapLevel: level,
      gameStatus: prev.gameMode === 'grammar' ? (hasGrammar ? 'explanation' : 'map') : 'playing',
      correctAnswersInLevel: 0,
      totalAnswersInLevel: 0,
      seenItemIds: [],
      selectedOption: null,
      isCorrect: null,
      orderingState: []
    }));

    if (state.gameMode === 'vocabulary' || (state.gameMode === 'grammar' && !hasGrammar)) {
      if (state.gameMode === 'vocabulary') setTimeout(() => nextQuestion(), 50);
      else alert("Bu seviye için henüz gramer içeriği yok.");
    }
  };

  const startActualPlay = () => {
    setState(prev => ({ ...prev, gameStatus: 'playing' }));
    setTimeout(() => nextQuestion(), 50);
  };

  const handleAnswer = (answer: string) => {
    if (state.selectedOption !== null) return;

    const isVocab = state.gameMode === 'vocabulary';
    const exercise = state.currentExercise;
    
    if (!isVocab && exercise?.type === 'ordering') {
      const currentOrder = [...(state.orderingState || []), answer];
      const remainingOptions = state.options.filter(o => !currentOrder.includes(o));
      
      setState(prev => ({ ...prev, orderingState: currentOrder }));

      if (remainingOptions.length === 0) {
        setTimeout(() => {
          const correctOrder = exercise.correctAnswer;
          const userOrder = currentOrder.join(',');
          const isCorrect = userOrder === correctOrder;
          finishAnswer(isCorrect, userOrder);
        }, 300);
      }
      return;
    }

    const correctAnswer = isVocab 
      ? state.currentWord?.[state.targetLanguage]
      : state.currentExercise?.correctAnswer;

    const correct = answer === correctAnswer;
    finishAnswer(correct, answer);
  };

  const finishAnswer = (correct: boolean, answer: string) => {
    const isVocab = state.gameMode === 'vocabulary';
    if (correct && isVocab && state.currentWord) {
      speakWord(state.currentWord[state.targetLanguage], LANGUAGES.find(l => l.code === state.targetLanguage)?.name || 'English');
    }

    const nextTotalCount = state.totalAnswersInLevel + 1;
    const isLevelOver = nextTotalCount >= 10;

    setState(prev => {
      const newCorrectCount = correct ? prev.correctAnswersInLevel + 1 : prev.correctAnswersInLevel;
      let nextStatus = prev.gameStatus;
      if (isLevelOver) {
        nextStatus = newCorrectCount >= 8 ? 'level-up' : 'level-failed';
      }

      return {
        ...prev,
        isCorrect: correct,
        selectedOption: answer,
        score: correct ? prev.score + 10 : prev.score,
        streak: correct ? prev.streak + 1 : 0,
        correctAnswersInLevel: newCorrectCount,
        totalAnswersInLevel: nextTotalCount,
        gameStatus: nextStatus
      };
    });

    if (!isLevelOver) {
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    }
  };

  const getOptionClasses = (option: string) => {
    const isVocab = state.gameMode === 'vocabulary';
    const exercise = state.currentExercise;

    if (!isVocab && exercise?.type === 'ordering') {
      const isSelected = state.orderingState?.includes(option);
      const isLargeSet = state.options.length > 10;
      
      const baseSize = isLargeSet ? "p-2 text-lg sm:p-3 sm:text-xl" : "p-4 text-2xl";
      const base = `${baseSize} rounded-xl font-black transition-all border-2 flex items-center justify-center transform active:scale-90 `;
      
      if (state.selectedOption !== null) {
        const correctOrder = exercise.correctAnswer;
        const isNowCorrect = state.selectedOption === correctOrder;
        return base + (isNowCorrect ? "bg-emerald-600 border-emerald-400" : "bg-rose-600 border-rose-400");
      }

      return isSelected 
        ? base + "bg-indigo-600 border-indigo-400 opacity-20 scale-90" 
        : base + "bg-slate-800 border-slate-700 hover:border-indigo-500 text-white shadow-lg";
    }

    const correctAnswer = isVocab 
      ? state.currentWord?.[state.targetLanguage]
      : state.currentExercise?.correctAnswer;

    const base = "w-full p-5 rounded-2xl text-xl font-bold transition-all border-2 flex items-center justify-center transform active:scale-95 ";
    
    if (state.selectedOption === null) {
      return base + "bg-slate-800 border-slate-700 hover:border-indigo-500 hover:bg-slate-700 text-white shadow-sm";
    }

    if (state.selectedOption === option) {
      return option === correctAnswer
        ? base + "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]"
        : base + "bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-500/20";
    }

    if (option === correctAnswer) {
      return base + "bg-emerald-600/40 border-emerald-500/50 text-emerald-100";
    }

    return base + "bg-slate-900 border-slate-800 opacity-40 grayscale text-slate-500";
  };

  if (state.gameStatus === 'setup') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white bg-slate-900">
        <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-indigo-400 mb-2 font-['Nunito']">{t('welcome')}</h1>
            <p className="text-slate-400">{t('subWelcome')}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">{t('sourceLabel')}</label>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setState(p => ({ ...p, currentLanguage: lang.code as Language }))}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${state.currentLanguage === lang.code ? 'border-indigo-500 bg-indigo-500/20' : 'border-slate-700 hover:bg-slate-700'}`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">{t('targetLabel')}</label>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setState(p => ({ ...p, targetLanguage: lang.code as Language }))}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${state.targetLanguage === lang.code ? 'border-purple-500 bg-purple-500/20' : 'border-slate-700 hover:bg-slate-700'}`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">{t('modeLabel')}</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setState(p => ({ ...p, gameMode: 'vocabulary' }))}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${state.gameMode === 'vocabulary' ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-700 hover:bg-slate-700'}`}
                >
                  🚀 {t('vocabularyMode')}
                </button>
                <button
                  onClick={() => setState(p => ({ ...p, gameMode: 'grammar' }))}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${state.gameMode === 'grammar' ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700 hover:bg-slate-700'}`}
                >
                  🧩 {t('grammarMode')}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setState(p => ({ ...p, gameStatus: 'map' }))}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
          >
            {t('startBtn')}
          </button>
        </div>
      </div>
    );
  }

  if (state.gameStatus === 'map') {
    return (
      <div className="h-screen bg-[#050B1A] relative overflow-hidden">
        <div className="absolute top-6 left-6 z-20 flex gap-4">
           <button 
            onClick={() => setState(p => ({ ...p, gameStatus: 'setup' }))}
            className="px-4 py-2 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← {t('backToHome')}
          </button>
          <div className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400 font-bold flex items-center gap-2">
            🏆 {state.score}
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="h-full overflow-x-auto overflow-y-hidden no-scrollbar cursor-grab active:cursor-grabbing"
        >
          <div className="h-full relative" style={{ width: 20 * 220 + 400 }}>
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <path 
                d={`M ${mapPathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeDasharray="8 8" 
                opacity="0.1" 
              />
            </svg>

            {mapPathPoints.map((p, i) => {
              const level = i + 1;
              const isUnlocked = level <= state.maxUnlockedLevel;
              const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b', '#f97316'];
              const levelTitle = LEVEL_INFO[state.targetLanguage]?.[level]?.title || t('level') + " " + level;

              return (
                <div 
                  key={level}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: p.x, top: p.y }}
                  onClick={() => isUnlocked && selectLevel(level)}
                >
                  <div className="relative group">
                    <svg width="160" height="160" viewBox="-80 -80 160 160">
                      <Planet 
                        level={level} 
                        color={colors[i % colors.length]} 
                        size={35 + (i % 3) * 10} 
                        isUnlocked={isUnlocked} 
                      />
                    </svg>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 text-center w-[200px]">
                      <span className={`text-sm font-black uppercase tracking-widest drop-shadow-md ${isUnlocked ? 'text-white' : 'text-slate-600'}`}>
                        {levelTitle}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (state.gameStatus === 'explanation') {
    const topic = LEVEL_INFO[state.targetLanguage]?.[state.currentMapLevel];
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white overflow-y-auto no-scrollbar">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl question-entrance my-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center text-2xl shadow-inner">📖</div>
            <div>
              <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px]">{t('lessonTitle')}</p>
              <h1 className="text-2xl font-black leading-tight">{topic?.title || t('level') + " " + state.currentMapLevel}</h1>
            </div>
          </div>

          <div className="space-y-4">
            {topic?.explanation && (
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-slate-300 leading-snug text-sm no-uppercase">
                  {topic.explanation}
                </p>
              </div>
            )}

            {topic?.examples && topic.examples.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Details</p>
                <div className={`grid gap-2 ${topic.examples.length > 6 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
                  {topic.examples.map((ex, i) => (
                    <div key={i} className="flex flex-col p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 transition-colors hover:bg-slate-800/50">
                      <span className="font-bold text-indigo-100 text-sm no-uppercase">{ex.original}</span>
                      <span className="text-slate-500 text-xs italic no-uppercase">{ex.translated}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={startActualPlay}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg shadow-xl shadow-indigo-500/10 transition-all active:scale-95"
            >
              🚀 {t('startLesson')}
            </button>
            <button
              onClick={() => setState(p => ({ ...p, gameStatus: 'map' }))}
              className="w-full py-2 text-slate-500 font-bold text-xs hover:text-white transition-colors"
            >
              {t('backToMap')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.gameStatus === 'playing') {
    const isVocab = state.gameMode === 'vocabulary';
    const exercise = state.currentExercise;
    const progress = (state.totalAnswersInLevel / 10) * 100;
    const uniqueQuestionKey = `q-key-${state.totalAnswersInLevel}-${state.currentWord?.id || state.currentExercise?.id || 'none'}`;

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col text-white p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col pb-24">
          <div className="flex justify-between items-center mb-12">
            <div className="flex-1 pr-8">
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('score')}</p>
              <p className="text-xl font-black text-indigo-400">{state.score}</p>
            </div>
          </div>

          <div key={uniqueQuestionKey} className="flex-1 flex flex-col items-center justify-center -mt-10 space-y-8 question-entrance">
            <div className="text-center w-full">
              {isVocab && state.currentWord ? (
                <div className="space-y-4">
                  <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full uppercase tracking-tighter border border-indigo-500/30">
                    {state.currentWord.category}
                  </span>
                  <h2 className="text-5xl font-black no-uppercase text-white tracking-tight leading-tight">
                    {state.currentWord[state.currentLanguage]}
                  </h2>
                </div>
              ) : exercise && (
                <div className="space-y-6">
                   <span className="px-4 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full uppercase tracking-tighter border border-blue-500/30">
                    {exercise.topic}
                  </span>
                  
                  {exercise.type === 'choice' ? (
                    <h2 className="text-4xl font-bold no-uppercase text-slate-100 leading-snug">
                      {exercise.sentence.split('______').map((part, i, arr) => (
                        <React.Fragment key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="inline-block min-w-[100px] border-b-4 border-indigo-500 text-indigo-400 mx-2 text-center">
                              {state.selectedOption || " "}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </h2>
                  ) : (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-widest">{t('orderingInstruction')}</h2>
                      <div className="flex flex-wrap justify-center gap-1.5 min-h-[60px] p-4 bg-slate-900/60 border-2 border-dashed border-slate-700 rounded-3xl overflow-y-auto max-h-[160px] no-scrollbar">
                        {(state.orderingState || []).map((char, i) => (
                          <div key={i} className={`px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 rounded-xl font-black animate-bounce ${exercise.options.length > 10 ? 'text-lg' : 'text-2xl'}`}>
                            {char}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 p-3 bg-slate-900/40 border border-slate-800 rounded-2xl">
                    <p className="text-slate-400 italic text-md no-uppercase max-w-md mx-auto">
                      {exercise.translations[state.currentLanguage]}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {exercise?.type === 'ordering' ? (
              <div className="w-full space-y-4">
                <div className={`grid gap-2 w-full ${exercise.options.length > 15 ? 'grid-cols-6 sm:grid-cols-8' : 'grid-cols-4 sm:grid-cols-5'}`}>
                  {state.options.map((option, idx) => (
                    <button
                      key={`${uniqueQuestionKey}-opt-${idx}`}
                      onClick={() => handleAnswer(option)}
                      disabled={state.selectedOption !== null || state.orderingState?.includes(option)}
                      className={getOptionClasses(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setState(p => ({ ...p, orderingState: [] }))}
                  disabled={state.selectedOption !== null}
                  className="w-full py-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors bg-slate-800/30 rounded-lg border border-slate-700/50"
                >
                  ↺ {t('clear')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 w-full">
                {state.options.map((option, idx) => (
                  <button
                    key={`${uniqueQuestionKey}-opt-${idx}`}
                    onClick={() => handleAnswer(option)}
                    disabled={state.selectedOption !== null}
                    className={getOptionClasses(option)}
                  >
                    <span className="no-uppercase">{option}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
          <button 
            onClick={() => setState(p => ({ ...p, gameStatus: 'map' }))}
            className="px-6 py-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl text-slate-400 hover:text-white transition-all flex items-center gap-2 shadow-2xl active:scale-95"
          >
            🗺️ {t('backToMap')}
          </button>
        </div>
      </div>
    );
  }

  if (state.gameStatus === 'level-up' || state.gameStatus === 'level-failed') {
    const win = state.gameStatus === 'level-up';
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <div className={`max-w-md w-full p-8 rounded-[2.5rem] border-2 shadow-2xl text-center space-y-8 ${win ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'}`}>
          <div className="text-6xl">{win ? '🎊' : '💀'}</div>
          <div>
            <h1 className="text-4xl font-black mb-2">{win ? t('promoted') : t('failed')}</h1>
            <p className="text-slate-400">{win ? t('levelClear') : t('failedSub')}</p>
          </div>
          
          <div className="flex justify-center gap-8 py-4 bg-slate-900/50 rounded-3xl border border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Accurate</p>
              <p className="text-2xl font-black text-white">{state.correctAnswersInLevel}/10</p>
            </div>
            <div className="w-px bg-slate-800" />
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">XP Gained</p>
              <p className="text-2xl font-black text-indigo-400">+{state.correctAnswersInLevel * 10}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {win ? (
              <button
                onClick={() => {
                  setState(p => ({
                    ...p,
                    gameStatus: 'map',
                    maxUnlockedLevel: Math.max(p.maxUnlockedLevel, p.currentMapLevel + 1),
                    currentMapLevel: p.currentMapLevel + 1
                  }));
                }}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
              >
                {t('nextSector')}
              </button>
            ) : (
              <button
                onClick={() => selectLevel(state.currentMapLevel)}
                className="w-full py-5 bg-rose-600 hover:bg-rose-500 rounded-2xl font-bold text-lg shadow-xl shadow-rose-500/20 transition-all active:scale-95"
              >
                {t('retry')}
              </button>
            )}
            <button
              onClick={() => setState(p => ({ ...p, gameStatus: 'map' }))}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-slate-400 transition-all"
            >
              {t('backToMap')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
};

export default App;
