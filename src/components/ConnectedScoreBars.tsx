import React from 'react';

interface ConnectedScoreBarsProps {
  netScore: number;
  maxScale: number;
  isFocusMode?: boolean;
}

export const ConnectedScoreBars: React.FC<ConnectedScoreBarsProps> = ({
  netScore,
  maxScale,
  isFocusMode = false,
}) => {
  const safeMax = Math.max(1, maxScale);

  // Positive score drives green bar; negative magnitude drives red bar
  const positivePoints = Math.max(0, netScore);
  const negativeMagnitude = netScore < 0 ? Math.abs(netScore) : 0;

  const greenPercent = Math.min(100, Math.max(0, (positivePoints / safeMax) * 100));
  const redPercent = Math.min(100, Math.max(0, (negativeMagnitude / safeMax) * 100));

  const barHeight = isFocusMode
    ? 'h-10 sm:h-12 md:h-14'
    : 'h-6 sm:h-7';

  const textLabelSize = isFocusMode
    ? 'text-sm sm:text-base md:text-lg font-black tracking-wider'
    : 'text-xs font-bold tracking-wider';

  const numberSize = isFocusMode
    ? 'text-lg sm:text-2xl font-black font-mono-numbers'
    : 'text-sm font-extrabold font-mono-numbers';

  return (
    <div className="w-full flex flex-col gap-2 select-none">
      {/* Top Labels Row: CORRECT vs INCORRECT */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Correct label */}
        <div className="flex items-center justify-between text-emerald-400 pl-1">
          <span className={`flex items-center gap-2 ${textLabelSize}`}>
            <span
              className={`inline-block rounded-xs bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] ${
                isFocusMode ? 'w-3.5 h-3.5' : 'w-2 h-2'
              }`}
            />
            CORRECT
          </span>
          <span className={`${numberSize} text-emerald-300`}>
            {positivePoints > 0 ? `+${positivePoints}` : '0'}
          </span>
        </div>

        {/* Incorrect label */}
        <div className="flex items-center justify-between text-rose-400 pr-1">
          <span className={`flex items-center gap-2 ${textLabelSize}`}>
            <span
              className={`inline-block rounded-xs bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] ${
                isFocusMode ? 'w-3.5 h-3.5' : 'w-2 h-2'
              }`}
            />
            INCORRECT
          </span>
          <span className={`${numberSize} text-rose-300`}>
            {negativeMagnitude > 0 ? `−${negativeMagnitude}` : '0'}
          </span>
        </div>
      </div>

      {/* Two Connected Horizontal Bars Container */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 items-center w-full">
        {/* LEFT BAR: Correct (Green) */}
        <div
          className={`relative w-full ${barHeight} bg-slate-950/90 rounded-lg sm:rounded-xl border border-emerald-900/60 overflow-hidden flex items-center p-0.5 sm:p-1 shadow-inner transition-all duration-300`}
        >
          {/* Zero baseline tick */}
          <div className="absolute left-1 top-1 bottom-1 w-1 sm:w-1.5 bg-emerald-500/50 rounded-xs z-10" />

          {/* Dynamic Fill Bar */}
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 rounded-xs sm:rounded-md transition-all duration-300 ease-out shadow-[0_0_16px_rgba(16,185,129,0.5)] flex items-center justify-end pr-2.5"
            style={{ width: `${greenPercent}%` }}
          >
            {greenPercent > 18 && (
              <span
                className={`font-mono-numbers font-black text-slate-950 drop-shadow-xs ${
                  isFocusMode ? 'text-base sm:text-xl' : 'text-xs sm:text-sm'
                }`}
              >
                +{positivePoints}
              </span>
            )}
          </div>

          {/* Number next to baseline when bar is 0 or very small */}
          {greenPercent <= 18 && (
            <span
              className={`absolute left-3.5 sm:left-4 font-mono-numbers font-bold text-emerald-400/90 ${
                isFocusMode ? 'text-sm sm:text-base' : 'text-xs'
              }`}
            >
              {positivePoints > 0 ? `+${positivePoints}` : '0'}
            </span>
          )}
        </div>

        {/* RIGHT BAR: Incorrect (Red) */}
        <div
          className={`relative w-full ${barHeight} bg-slate-950/90 rounded-lg sm:rounded-xl border border-rose-900/60 overflow-hidden flex items-center p-0.5 sm:p-1 shadow-inner transition-all duration-300`}
        >
          {/* Zero baseline tick */}
          <div className="absolute left-1 top-1 bottom-1 w-1 sm:w-1.5 bg-rose-500/50 rounded-xs z-10" />

          {/* Dynamic Fill Bar */}
          <div
            className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-rose-400 rounded-xs sm:rounded-md transition-all duration-300 ease-out shadow-[0_0_16px_rgba(244,63,94,0.5)] flex items-center justify-end pr-2.5"
            style={{ width: `${redPercent}%` }}
          >
            {redPercent > 18 && (
              <span
                className={`font-mono-numbers font-black text-slate-950 drop-shadow-xs ${
                  isFocusMode ? 'text-base sm:text-xl' : 'text-xs sm:text-sm'
                }`}
              >
                −{negativeMagnitude}
              </span>
            )}
          </div>

          {/* Number next to baseline when bar is 0 or very small */}
          {redPercent <= 18 && (
            <span
              className={`absolute left-3.5 sm:left-4 font-mono-numbers font-bold text-rose-400/90 ${
                isFocusMode ? 'text-sm sm:text-base' : 'text-xs'
              }`}
            >
              {negativeMagnitude > 0 ? `−${negativeMagnitude}` : '0'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
