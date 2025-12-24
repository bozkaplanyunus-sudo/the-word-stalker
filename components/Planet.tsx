
import React from 'react';

interface PlanetProps {
  color: string;
  size: number;
  isUnlocked: boolean;
  level: number;
}

const Planet: React.FC<PlanetProps> = ({ color, size, isUnlocked, level }) => {
  const hasRing = level % 4 === 0;
  const hasAtmosphere = level % 3 === 0;
  const hasCraters = level % 2 === 0;

  return (
    <g className={`transition-transform duration-500 ${isUnlocked ? 'hover:scale-110' : 'grayscale opacity-40'}`}>
      {/* Outer Glow / Atmosphere */}
      {hasAtmosphere && isUnlocked && (
        <circle cx="0" cy="0" r={size * 1.4} fill={`url(#glow-${level})`} opacity="0.4" />
      )}
      
      {/* Planet Body Gradient */}
      <defs>
        <radialGradient id={`grad-${level}`} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
        <radialGradient id={`glow-${level}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ring (behind) */}
      {hasRing && (
        <ellipse 
          cx="0" 
          cy="0" 
          rx={size * 2} 
          ry={size * 0.4} 
          fill="none" 
          stroke="rgba(255,255,255,0.2)" 
          strokeWidth="3" 
          transform="rotate(-15)" 
        />
      )}

      {/* Main Sphere */}
      <circle cx="0" cy="0" r={size} fill={color} />
      <circle cx="0" cy="0" r={size} fill={`url(#grad-${level})`} />

      {/* Craters or Surface Texture */}
      {hasCraters && (
        <g opacity="0.3">
          <circle cx={-size * 0.3} cy={-size * 0.2} r={size * 0.15} fill="black" />
          <circle cx={size * 0.4} cy={size * 0.1} r={size * 0.2} fill="black" />
          <circle cx={-size * 0.1} cy={size * 0.5} r={size * 0.1} fill="black" />
        </g>
      )}

      {/* Surface highlights */}
      <circle cx={-size * 0.4} cy={-size * 0.4} r={size * 0.1} fill="white" opacity="0.2" />

      {/* Ring (front) */}
      {hasRing && (
        <path 
          d={`M ${-size * 1.8} 0 A ${size * 1.8} ${size * 0.36} 0 0 0 ${size * 1.8} 0`} 
          fill="none" 
          stroke="rgba(255,255,255,0.4)" 
          strokeWidth="2" 
          transform="rotate(-15)"
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

export default Planet;
