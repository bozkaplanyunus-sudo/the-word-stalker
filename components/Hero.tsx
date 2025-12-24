
import React from 'react';

interface HeroProps {
  mood: 'happy' | 'neutral' | 'sad' | 'thinking';
  level?: number;
}

const Hero: React.FC<HeroProps> = ({ mood, level = 1 }) => {
  const getColors = () => {
    // Mustard Yellow core, Gray tail
    const mustardYellow = '#E2B100';
    const tailGray = '#9CA3AF';

    switch (mood) {
      case 'happy': return { core: mustardYellow, eye: '#000000', mouth: '#000000', glow: '#FFEB3B' };
      case 'sad': return { core: mustardYellow, eye: '#4B5563', mouth: '#4B5563', glow: '#6B7280' };
      case 'thinking': return { core: mustardYellow, eye: '#000000', mouth: '#000000', glow: '#F59E0B' };
      default: return { core: mustardYellow, eye: '#000000', mouth: '#000000', glow: mustardYellow };
    }
  };

  const colors = getColors();

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="relative w-full h-full select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-lg">
          <defs>
            <linearGradient id={`tail-grad-${level}`} x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#D1D5DB" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4B5563" stopOpacity="0" />
            </linearGradient>
            <radialGradient id={`star-grad-${level}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor={colors.core} />
            </radialGradient>
          </defs>

          {/* Gray Tail */}
          <path
            d="M45,50 L5,35 Q25,50 5,65 Z"
            fill={`url(#tail-grad-${level})`}
            className={mood === 'thinking' ? 'animate-pulse' : ''}
          />
          <path
            d="M45,50 L10,25 Q30,50 10,75 Z"
            fill={`url(#tail-grad-${level})`}
            opacity="0.4"
          />

          {/* Mustard Yellow Star Shape */}
          <path
            d="M70,20 L78,40 L98,40 L82,55 L88,75 L70,63 L52,75 L58,55 L42,40 L62,40 Z"
            fill={`url(#star-grad-${level})`}
            stroke="#B8860B"
            strokeWidth="1.5"
          />

          {/* Face on the Star */}
          <g transform="translate(70, 50)">
            {/* Left Eye */}
            <g transform="translate(-7, -4)">
              {mood === 'happy' ? (
                <path d="M0,3 Q2.5,0 5,3" fill="none" stroke={colors.eye} strokeWidth="2" strokeLinecap="round" />
              ) : mood === 'sad' ? (
                <path d="M0,0 Q2.5,3 5,0" fill="none" stroke={colors.eye} strokeWidth="2" strokeLinecap="round" />
              ) : (
                <circle cx="2.5" cy="2.5" r="2" fill={colors.eye} />
              )}
            </g>

            {/* Right Eye */}
            <g transform="translate(2, -4)">
              {mood === 'happy' ? (
                <path d="M0,3 Q2.5,0 5,3" fill="none" stroke={colors.eye} strokeWidth="2" strokeLinecap="round" />
              ) : mood === 'sad' ? (
                <path d="M0,0 Q2.5,3 5,0" fill="none" stroke={colors.eye} strokeWidth="2" strokeLinecap="round" />
              ) : (
                <circle cx="2.5" cy="2.5" r="2" fill={colors.eye} />
              )}
            </g>

            {/* Mouth */}
            <path
              d={mood === 'happy' ? "M-5,8 Q0,13 5,8" : mood === 'sad' ? "M-5,12 Q0,7 5,12" : "M-3,10 L3,10"}
              fill="none"
              stroke={colors.eye}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* Elite level details */}
          {level >= 10 && (
            <g fill="white" className="animate-pulse">
              <circle cx="85" cy="25" r="1.5" />
              <circle cx="55" cy="35" r="1" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default Hero;
