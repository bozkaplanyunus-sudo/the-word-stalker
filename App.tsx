
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GameState, Language, Word } from './types';
import { WORD_DATABASE, LANGUAGES, UI_TRANSLATIONS } from './constants';
import { speakWord } from './geminiService';
import Hero from './components/Hero';
import Planet from './components/Planet';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    score: 0,
    currentMapLevel: 1,
    maxUnlockedLevel: 1,
    currentLanguage: 'tr',
    targetLanguage: 'fr',
    category: null,
    currentWord: null,
    currentImage: null,
    options: [],
    isCorrect: null,
    isGenerating: false,
    streak: 0,
    correctAnswersInLevel: 0,
    totalAnswersInLevel: 0,
    seenWordIds: [],
    gameStatus: 'setup'
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const capitalize = (str: string) => {
    if (!str) return '';
    const clean = str.trim();
    return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  };

  const t = (key: string) => {
    const translations = UI_TRANSLATIONS[state.currentLanguage] || UI_TRANSLATIONS.en;
    const raw = translations[key] || key;
    return capitalize(raw);
  };

  const mapPathPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 20; i++) {
      points.push({
        x: 150 + i * 220, 
        y: 80 + Math.sin(i * 1.5) * 40
      });
    }
    return points;
  }, []);

  const totalMapWidth = 300 + 20 * 220;

  useEffect(() => {
    if (state.gameStatus === 'map' && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const currentPlanetX = mapPathPoints[state.currentMapLevel - 1].x;
      const scrollPos = currentPlanetX - container.clientWidth / 2;
      container.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  }, [state.gameStatus, state.currentMapLevel, mapPathPoints]);

  const startLevelGame = useCallback(async (level: number, isRetry: boolean = false) => {
    setState(prev => {
        const levelChanged = prev.currentMapLevel !== level;
        const resetProgress = isRetry || levelChanged;
        
        return { 
            ...prev, 
            gameStatus: 'playing', 
            isGenerating: true,
            currentMapLevel: level,
            isCorrect: null,
            correctAnswersInLevel: resetProgress ? 0 : prev.correctAnswersInLevel,
            totalAnswersInLevel: resetProgress ? 0 : prev.totalAnswersInLevel,
            seenWordIds: resetProgress ? [] : prev.seenWordIds
        };
    });
    
    setState(prev => {
        const levelWords = WORD_DATABASE.filter(w => w.rarity === level);
        const availableWords = levelWords.filter(w => !prev.seenWordIds.includes(w.id));
        const wordPool = availableWords.length > 0 ? availableWords : levelWords;
        const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
        
        let distractors = levelWords
            .filter(w => w.id !== randomWord.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
            
        const targetLang = prev.targetLanguage;
        const options = [randomWord[targetLang], ...distractors.map(d => d[targetLang])].sort(() => 0.5 - Math.random());

        return {
          ...prev,
          currentWord: randomWord,
          seenWordIds: [...prev.seenWordIds, randomWord.id],
          options,
          isGenerating: false
        };
    });
  }, []);

  const handleSpeak = (e: React.MouseEvent, text: string, lang: Language) => {
    e.stopPropagation();
    const langName = LANGUAGES.find(l => l.code === lang)?.name || 'English';
    speakWord(text, langName);
  };

  const handleAnswer = (answer: string) => {
    if (!state.currentWord || state.isCorrect !== null) return;

    const correct = answer === state.currentWord[state.targetLanguage];
    
    setState(prev => ({
      ...prev,
      isCorrect: correct,
      score: Math.max(0, correct ? prev.score + 10 : prev.score - 5),
      correctAnswersInLevel: correct ? prev.correctAnswersInLevel + 1 : prev.correctAnswersInLevel,
      totalAnswersInLevel: prev.totalAnswersInLevel + 1
    }));

    setTimeout(() => {
        setState(latest => {
            if (latest.totalAnswersInLevel >= 50) {
                if (latest.correctAnswersInLevel >= 40) {
                    return { ...latest, gameStatus: 'level-up' };
                } else {
                    return { ...latest, gameStatus: 'level-failed' };
                }
            } else {
                startLevelGame(latest.currentMapLevel);
                return { ...latest, isCorrect: null };
            }
        });
    }, 1200);
  };

  const nextLevel = () => {
    const nextLvl = Math.min(state.currentMapLevel + 1, 20);
    setState(prev => ({
        ...prev,
        currentMapLevel: nextLvl,
        maxUnlockedLevel: Math.max(prev.maxUnlockedLevel, nextLvl),
        gameStatus: 'map',
        currentWord: null,
        currentImage: null,
        correctAnswersInLevel: 0,
        totalAnswersInLevel: 0,
        seenWordIds: []
    }));
  };

  const retryLevel = () => {
    startLevelGame(state.currentMapLevel, true);
  };

  const returnToMap = () => {
    setState(prev => ({
      ...prev,
      gameStatus: 'map',
      currentWord: null,
      currentImage: null,
      isCorrect: null,
      seenWordIds: []
    }));
  };

  const goToSetup = () => {
    setState(prev => ({ ...prev, gameStatus: 'setup', seenWordIds: [] }));
  };

  const startGame = () => {
    setState(prev => ({ ...prev, gameStatus: 'map', seenWordIds: [] }));
  };

  const planetColors = [
    '#6366F1', '#06B6D4', '#10B981', '#84CC16', '#EAB308',
    '#F97316', '#EF4444', '#EC4899', '#A855F7', '#FFD700',
    '#3B82F6', '#059669', '#D946EF', '#FB923C', '#4ADE80',
    '#F43F5E', '#8B5CF6', '#14B8A6', '#F59E0B', '#FFFFFF'
  ];

  return (
    <div className="min-h-screen bg-[#050B1A] text-white flex flex-col items-center overflow-x-hidden selection:bg-indigo-900 selection:text-white pb-10 relative tracking-[0.03em]">
      
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(80)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full opacity-40 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes sound-wave {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
        .wave-bar { animation: sound-wave 0.8s ease-in-out infinite; }
      `}</style>

      {state.gameStatus !== 'setup' && (
        <header className="w-full max-md:max-w-md px-4 pt-6 pb-2 flex flex-col gap-3 z-30 sticky top-0">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2 bg-indigo-950/80 backdrop-blur-md p-2 pr-5 rounded-3xl shadow-lg border border-indigo-500/30">
                    <div className="w-12 h-12">
                        <Hero mood="neutral" level={state.currentMapLevel} />
                    </div>
                    <div>
                        <h1 className="text-[11px] font-normal text-indigo-400 leading-none opacity-60 uppercase tracking-tighter">Stalker</h1>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-lg font-normal text-white tracking-tighter">{t('level')} {state.currentMapLevel}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-cyan-600 px-4 py-2 rounded-3xl shadow-xl flex flex-col items-center min-w-[80px] border-b-4 border-cyan-800 transition-all hover:scale-105">
                    <span className="text-[10px] text-white/70 font-normal uppercase">{t('score')}</span>
                    <span className="text-lg font-normal text-white">{state.score}</span>
                </div>
            </div>

            <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-3 bg-indigo-900/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10 shadow-sm">
                    <span className="text-[11px] font-normal text-indigo-300 uppercase">{t('target')}</span>
                    <span className="text-xl drop-shadow-sm">{LANGUAGES.find(l => l.code === state.targetLanguage)?.flag}</span>
                </div>
                
                {state.gameStatus !== 'map' && (
                    <button 
                      onClick={returnToMap}
                      className="bg-indigo-950/80 backdrop-blur-sm px-5 py-2.5 rounded-2xl shadow-md border border-indigo-500/50 hover:bg-indigo-900 transition-all flex items-center gap-2 active:scale-90 group"
                    >
                      <span className="transition-transform group-hover:rotate-12">🌌</span>
                      <span className="font-normal text-white text-[11px] tracking-wider uppercase">{t('map')}</span>
                    </button>
                )}
            </div>
        </header>
      )}

      <main className="flex-1 w-full max-w-md relative px-4 flex flex-col items-center justify-start z-10 pt-2">
        {state.gameStatus === 'setup' && (
          <div className="w-full flex flex-col items-center gap-10 py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-40 h-40 transform hover:scale-110 transition-transform cursor-pointer">
                <Hero mood="happy" level={1} />
            </div>
            
            <div className="text-center space-y-3">
                <h1 className="text-5xl font-normal italic tracking-tighter leading-none">
                  <span className="text-cyan-400">Word</span><br/>Stalker
                </h1>
                <p className="text-indigo-300 font-normal px-8 leading-tight">{t('subWelcome')}</p>
            </div>

            <div className="w-full space-y-8 bg-indigo-950/40 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-indigo-500/20">
                <div className="space-y-4">
                    <label className="text-[11px] font-normal text-indigo-300 ml-2 uppercase">{t('sourceLabel')}</label>
                    <div className="grid grid-cols-3 gap-3">
                        {LANGUAGES.map(l => (
                            <button
                                key={l.code}
                                onClick={() => setState(s => ({...s, currentLanguage: l.code as Language}))}
                                className={`py-5 rounded-3xl flex flex-col items-center gap-2 transition-all border-b-4 ${state.currentLanguage === l.code ? 'bg-cyan-600 text-white border-cyan-900 shadow-xl scale-105' : 'bg-indigo-900/30 text-indigo-400 border-indigo-800 hover:bg-indigo-900/50'}`}
                            >
                                <span className="text-3xl">{l.flag}</span>
                                <span className="text-[11px] font-normal tracking-tight">{capitalize(l.name)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[11px] font-normal text-indigo-300 ml-2 uppercase">{t('targetLabel')}</label>
                    <div className="grid grid-cols-3 gap-3">
                        {LANGUAGES.map(l => (
                            <button
                                key={l.code}
                                disabled={state.currentLanguage === l.code}
                                onClick={() => setState(s => ({...s, targetLanguage: l.code as Language}))}
                                className={`py-5 rounded-3xl flex flex-col items-center gap-2 transition-all border-b-4 ${state.targetLanguage === l.code ? 'bg-cyan-600 text-white border-cyan-900 shadow-xl scale-105' : 'bg-indigo-900/30 text-indigo-400 border-indigo-800 hover:bg-indigo-900/50 disabled:opacity-20 disabled:grayscale'}`}
                            >
                                <span className="text-3xl">{l.flag}</span>
                                <span className="text-[11px] font-normal tracking-tight">{capitalize(l.name)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={startGame}
                    className="w-full bg-cyan-600 text-white py-6 rounded-[2.5rem] text-2xl font-normal shadow-2xl hover:bg-cyan-500 active:scale-95 transition-all border-b-8 border-cyan-900 mt-6 flex items-center justify-center gap-3"
                >
                    {t('startBtn')}
                </button>
            </div>
          </div>
        )}

        {state.gameStatus === 'map' && (
          <div className="w-full flex flex-col gap-4 animate-in fade-in duration-500 pb-10">
            <div 
              ref={scrollContainerRef}
              className="w-screen h-[60vh] relative overflow-x-auto hide-scrollbar left-1/2 -translate-x-1/2"
            >
              <div style={{ width: `${totalMapWidth}px`, height: '100%', position: 'relative' }}>
                <svg viewBox={`0 0 ${totalMapWidth} 200`} className="w-full h-full relative z-10" preserveAspectRatio="xMinYMid meet">
                  {mapPathPoints.map((pt, idx) => {
                    const levelNum = idx + 1;
                    const isUnlocked = levelNum <= state.maxUnlockedLevel;
                    const isCurrent = levelNum === state.currentMapLevel;
                    const pColor = planetColors[idx % planetColors.length];
                    
                    return (
                      <g key={idx} transform={`translate(${pt.x}, ${pt.y})`} className={`cursor-pointer touch-manipulation`} onClick={() => isUnlocked && startLevelGame(levelNum)}>
                        <Planet color={pColor} size={isCurrent ? 30 : 20} isUnlocked={isUnlocked} level={levelNum} />
                        <text x="0" y="55" fontSize="14" textAnchor="middle" fontWeight="400" fill={isCurrent ? '#22D3EE' : isUnlocked ? '#FFFFFF' : '#475569'} className="tracking-tighter drop-shadow-md no-uppercase">
                          {t('level')} {levelNum}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3 z-20">
              <button 
                onClick={goToSetup}
                className="w-full bg-indigo-900/30 text-indigo-400 py-3 rounded-2xl text-xs font-normal tracking-widest border border-indigo-800 hover:bg-indigo-900/50 transition-all active:scale-95 uppercase"
              >
                ← {t('backToSetup')}
              </button>
            </div>
          </div>
        )}

        {state.isGenerating && (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 animate-pulse pt-10">
            <div className="w-48 h-48">
                <Hero mood="thinking" level={state.currentMapLevel} />
            </div>
            <div className="text-center space-y-4">
                <div className="flex gap-2 justify-center">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <p className="text-cyan-400 font-normal tracking-[0.3em] text-xs uppercase">{t('analyzing')}</p>
            </div>
          </div>
        )}

        {state.gameStatus === 'playing' && !state.isGenerating && state.currentWord && (
          <div className="w-full flex-1 flex flex-col items-center gap-8 py-2 animate-in fade-in zoom-in duration-500">
            <div className="w-full max-w-[320px] relative group">
                <div className="h-72 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 relative mb-6">
                       <Hero mood={state.isCorrect === true ? 'happy' : state.isCorrect === false ? 'sad' : 'neutral'} level={state.currentMapLevel} />
                    </div>
                    {/* Centered Large Word Display with Separate Audio Button */}
                    <div className="flex items-center gap-2 w-full justify-center">
                        <div className="bg-indigo-950/80 text-white px-8 py-6 rounded-l-[2.5rem] shadow-[0_0_30px_rgba(79,70,229,0.2)] flex-1 flex items-center justify-center border border-indigo-500/30 animate-in slide-in-from-top-4 duration-300 min-h-[100px]">
                            <span className="text-4xl font-normal italic tracking-tighter text-cyan-400 drop-shadow-sm text-center break-words no-uppercase">
                                {capitalize(state.currentWord[state.currentLanguage])}
                            </span>
                        </div>
                        <button 
                            onClick={(e) => handleSpeak(e, state.currentWord![state.currentLanguage], state.currentLanguage)}
                            className="bg-indigo-900/60 p-5 rounded-r-[2.5rem] border border-indigo-500/30 hover:bg-indigo-800 transition-colors flex items-center justify-center shadow-lg active:scale-95 group/audio min-h-[100px]"
                        >
                            <svg className="w-8 h-8 text-cyan-400 transition-transform group-hover/audio:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM3 9v6h4l5 5V4L7 9H3z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col items-center gap-5">
                <div className="flex items-center gap-4 bg-indigo-950/30 px-6 py-3 rounded-[1.5rem] border border-white/5 shadow-inner">
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-normal text-xl tracking-tighter">
                            {state.correctAnswersInLevel}
                        </span>
                        <span className="text-indigo-400 font-normal text-xs opacity-50">/ 50</span>
                    </div>
                    <div className="h-6 w-[1px] bg-indigo-700"></div>
                    <span className="text-[11px] font-normal text-indigo-400 tracking-widest uppercase">{t('progress')}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full px-2 mb-4">
              {state.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 w-full group">
                    <button
                      onClick={() => handleAnswer(opt)}
                      disabled={state.isCorrect !== null}
                      className={`
                        flex-1 p-6 rounded-[2rem] text-xl font-normal transition-all transform shadow-lg touch-manipulation relative overflow-hidden flex items-center justify-center gap-3 text-center no-uppercase
                        ${state.isCorrect === null 
                          ? 'bg-indigo-900/50 hover:bg-indigo-800 border-b-8 border-indigo-950 active:translate-y-1 active:border-b-0 text-white border border-white/10' 
                          : opt === state.currentWord?.[state.targetLanguage]
                            ? 'bg-emerald-500 text-white border-b-8 border-emerald-700 translate-y-1'
                            : 'bg-indigo-950/20 text-indigo-700 border-none opacity-40 grayscale scale-95'
                        }
                      `}
                    >
                      <span className="relative z-10 text-center w-full px-2">{capitalize(opt)}</span>
                    </button>
                    
                    {state.isCorrect === null && (
                        <button 
                            onClick={(e) => handleSpeak(e, opt, state.targetLanguage)}
                            className="bg-indigo-950/50 p-4 rounded-full border border-white/10 hover:bg-indigo-800 transition-colors shadow-md active:scale-90 flex items-center justify-center group/audio-btn h-[72px] w-[72px]"
                        >
                            <svg className="w-6 h-6 text-indigo-400 group-hover/audio-btn:text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM3 9v6h4l5 5V4L7 9H3z"/>
                            </svg>
                        </button>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        {state.gameStatus === 'level-up' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 animate-in slide-in-from-bottom-20 duration-700 px-6 pt-10">
             <div className="w-56 h-56 relative">
                <Hero mood="happy" level={state.currentMapLevel} />
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
             </div>
             <div className="space-y-4 px-4">
                <h1 className="text-4xl font-normal text-emerald-400 italic tracking-tighter leading-tight drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">{t('promoted')}</h1>
                <div className="bg-indigo-950/50 p-4 rounded-3xl border border-emerald-500/30">
                    <span className="text-2xl font-normal text-white">{state.correctAnswersInLevel} / 50</span>
                    <p className="text-[11px] text-indigo-300 font-normal mt-1">{t('levelClear')}</p>
                </div>
             </div>
             <button 
                onClick={nextLevel}
                className="w-full bg-emerald-600 text-white py-7 rounded-[3rem] text-2xl font-normal shadow-2xl hover:bg-emerald-500 active:scale-95 transition-all border-b-8 border-emerald-900 mt-4 flex items-center justify-center gap-4"
             >
                {t('nextSector')}
             </button>
          </div>
        )}

        {state.gameStatus === 'level-failed' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 animate-in slide-in-from-top-20 duration-700 px-6 pt-10">
             <div className="w-56 h-56 relative">
                <Hero mood="sad" level={state.currentMapLevel} />
                <div className="absolute inset-0 bg-rose-400/20 rounded-full blur-3xl animate-pulse"></div>
             </div>
             <div className="space-y-4 px-4">
                <h1 className="text-4xl font-normal text-rose-500 italic tracking-tighter leading-tight drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">{t('failed')}</h1>
                <p className="text-indigo-300 font-normal">{t('failedSub')}</p>
                <div className="bg-indigo-950/50 p-4 rounded-3xl border border-rose-500/30">
                    <span className="text-2xl font-normal text-white">{state.correctAnswersInLevel} / 50</span>
                </div>
             </div>
             <button 
                onClick={retryLevel}
                className="w-full bg-rose-600 text-white py-7 rounded-[3rem] text-2xl font-normal shadow-2xl hover:bg-rose-500 active:scale-95 transition-all border-b-8 border-rose-900 mt-4 flex items-center justify-center gap-4"
             >
                {t('retry')}
             </button>
          </div>
        )}
      </main>

      {state.isCorrect === true && state.gameStatus === 'playing' && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[100] animate-in fade-in duration-300">
          <div className="bg-emerald-500 text-white px-12 py-5 rounded-full text-3xl font-normal shadow-[0_0_40px_rgba(16,185,129,0.6)] animate-bounce border-4 border-white">
            +10
          </div>
        </div>
      )}
      
      {state.isCorrect === false && state.gameStatus === 'playing' && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[100] bg-rose-950/20 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-rose-600 text-white px-12 py-5 rounded-full text-3xl font-normal shadow-[0_0_40px_rgba(225,29,72,0.6)] animate-shake border-4 border-white">
            -5
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
