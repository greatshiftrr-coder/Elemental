import React, { useState } from 'react';
import { ElementData } from '../types/element';
import { CATEGORIES } from '../data/categories';
import { Play, Pause } from 'lucide-react';

interface BohrModelProps {
  element: ElementData;
  size?: number;
}

export const BohrModel: React.FC<BohrModelProps> = ({ element, size = 260 }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [hoveredShell, setHoveredShell] = useState<number | null>(null);

  const shells = element.shells;
  const numShells = shells.length;
  const categoryInfo = CATEGORIES[element.category];
  const accentColor = categoryInfo?.colorHex || '#2563eb';

  const viewBoxSize = 300;
  const center = viewBoxSize / 2;
  const maxRadius = (viewBoxSize / 2) - 22;
  const minRadius = 30;
  const radiusStep = numShells > 1 ? (maxRadius - minRadius) / (numShells - 1) : 0;

  return (
    <div className="flex flex-col items-center w-full max-w-[300px]">
      <div className="relative flex items-center justify-center p-2 rounded-2xl bg-slate-900/5 border border-slate-200/90 w-full aspect-square max-w-[280px]">
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-full h-full overflow-visible select-none"
        >
          {/* Subtle background radial glow */}
          <defs>
            <radialGradient id={`nucleus-glow-${element.number}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.45" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Glow */}
          <circle
            cx={center}
            cy={center}
            r={minRadius + 16}
            fill={`url(#nucleus-glow-${element.number})`}
          />

          {/* Electron Orbit Shells */}
          {shells.map((count, index) => {
            const shellNumber = index + 1;
            const radius = numShells === 1 ? minRadius + 32 : minRadius + index * radiusStep;
            const isHovered = hoveredShell === shellNumber;
            const duration = (13 + index * 4.5) / speed;

            return (
              <g
                key={`shell-${shellNumber}`}
                className="transition-opacity duration-200"
                onMouseEnter={() => setHoveredShell(shellNumber)}
                onMouseLeave={() => setHoveredShell(null)}
                onClick={() => setHoveredShell(hoveredShell === shellNumber ? null : shellNumber)}
              >
                {/* Orbit track */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={isHovered ? accentColor : '#cbd5e1'}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeDasharray={isHovered ? 'none' : '3 3'}
                  className="cursor-pointer transition-all duration-150"
                />

                {/* Rotating group of electrons */}
                <g
                  style={{
                    transformOrigin: `${center}px ${center}px`,
                    animation: isPlaying ? `spin ${duration}s linear infinite` : 'none',
                  }}
                >
                  {Array.from({ length: count }).map((_, electronIndex) => {
                    const angle = (electronIndex * 360) / count;
                    const radian = (angle * Math.PI) / 180;
                    const ex = center + radius * Math.cos(radian);
                    const ey = center + radius * Math.sin(radian);

                    return (
                      <g key={`electron-${shellNumber}-${electronIndex}`}>
                        <circle
                          cx={ex}
                          cy={ey}
                          r={isHovered ? 4.5 : 3.5}
                          fill={accentColor}
                          opacity={0.35}
                        />
                        <circle
                          cx={ex}
                          cy={ey}
                          r={isHovered ? 3.5 : 2.5}
                          fill={isHovered ? '#0f172a' : accentColor}
                          stroke="#ffffff"
                          strokeWidth={1}
                        />
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          })}

          {/* Nucleus */}
          <circle
            cx={center}
            cy={center}
            r={20}
            fill="#ffffff"
            stroke={accentColor}
            strokeWidth={2.5}
            className="filter drop-shadow-sm"
          />
          <text
            x={center}
            y={center - 3}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-mono font-bold fill-slate-900"
            style={{ fontSize: '13px', fontWeight: 800 }}
          >
            {element.symbol}
          </text>
          <text
            x={center}
            y={center + 9}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-mono fill-slate-500 font-semibold"
            style={{ fontSize: '9px' }}
          >
            {element.number}p⁺
          </text>
        </svg>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {/* Controls & Shell readout */}
      <div className="w-full mt-3 flex items-center justify-between text-xs text-slate-600 px-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
            title={isPlaying ? 'Pause orbit animation' : 'Resume orbit animation'}
            aria-label={isPlaying ? 'Pause orbit animation' : 'Resume orbit animation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] transition-colors"
            title="Toggle orbital speed"
          >
            {speed}x
          </button>
        </div>

        <div className="font-mono text-[11px] text-slate-600 font-medium">
          {hoveredShell ? (
            <span className="text-slate-900 font-bold">
              Shell n={hoveredShell}: {shells[hoveredShell - 1]} e⁻
            </span>
          ) : (
            <span>{shells.reduce((a, b) => a + b, 0)} total electrons</span>
          )}
        </div>
      </div>

      {/* Electron Shell Sequence pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 w-full">
        {shells.map((count, idx) => {
          const shellLetters = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
          const letter = shellLetters[idx] || `n${idx + 1}`;
          const isHovered = hoveredShell === idx + 1;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setHoveredShell(isHovered ? null : idx + 1)}
              onMouseEnter={() => setHoveredShell(idx + 1)}
              onMouseLeave={() => setHoveredShell(null)}
              className={`px-2 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                isHovered
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`}
            >
              <span className="text-slate-400 font-sans mr-0.5">{letter}:</span>
              <span className="font-bold">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
