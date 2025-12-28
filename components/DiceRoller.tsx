import React, { useState, useEffect } from 'react';
import { X, RefreshCcw, Hand } from 'lucide-react';

// D20 Icon
export const D20Icon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m10 2-7.3 6.6L8 22l8-10.4L10 2Z" />
    <path d="m21.3 8.6-7.3-6.6-4.6 9.4 6.7 10.6 5.2-13.4Z" />
    <path d="m2.7 8.6 4.3 13.4" />
    <path d="M10 2h4" />
    <path d="M22 13h-6" />
  </svg>
);

interface DiceResult {
  id: number;
  value: number;
  type: 'crit-fail' | 'fail' | 'success' | 'crit-success';
  selectedForReroll: boolean;
  isRerolled: boolean;
}

interface DiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  attributeName: string;
  attributeValue: number;
  skillName: string;
  skillValue: number;
  isRedSkill: boolean; // "Red" skills require rank > 0 to roll
  currentWill: number;
  onSpendWill: (amount: number) => void;
}

export const DiceModal: React.FC<DiceModalProps> = ({
  isOpen, onClose, attributeName, attributeValue, skillName, skillValue, isRedSkill, currentWill, onSpendWill
}) => {
  const [step, setStep] = useState<'setup' | 'rolling' | 'result'>('setup');
  const [modifier, setModifier] = useState(0);
  const [diceResults, setDiceResults] = useState<DiceResult[]>([]);
  
  // Calculate Base Pool
  const canRoll = !isRedSkill || (isRedSkill && skillValue > 0);
  const basePool = canRoll ? (attributeValue + skillValue) : 0;
  
  useEffect(() => {
    if (isOpen) {
      setStep('setup');
      setModifier(0);
      setDiceResults([]);
    }
  }, [isOpen]);

  const getResultType = (val: number) => {
    if (val === 20) return 'crit-success';
    if (val >= 17) return 'success';
    if (val === 1) return 'crit-fail';
    return 'fail';
  };

  const rollDice = () => {
    const poolSize = Math.max(0, basePool + modifier);
    
    if (poolSize === 0) {
      // Just show empty
      setDiceResults([]);
      setStep('result');
      return;
    }

    setStep('rolling');
    // Animation delay
    setTimeout(() => {
      const newResults: DiceResult[] = Array.from({ length: poolSize }).map((_, i) => {
        const val = Math.floor(Math.random() * 20) + 1;
        return {
          id: i,
          value: val,
          type: getResultType(val),
          selectedForReroll: false,
          isRerolled: false
        };
      });
      setDiceResults(newResults);
      setStep('result');
    }, 800);
  };

  const toggleDieSelection = (id: number) => {
    setDiceResults(prev => prev.map(d => 
      d.id === id ? { ...d, selectedForReroll: !d.selectedForReroll } : d
    ));
  };

  const handlePrayer = () => {
    const selectedDice = diceResults.filter(d => d.selectedForReroll);
    if (selectedDice.length === 0) return;
    if (currentWill < 1) {
      alert("Недостаточно Воли для Молитвы!");
      return;
    }

    // Spend 1 Will immediately
    let willCost = 1;
    let extraPenalty = 0;

    // Reroll logic
    const newResults = diceResults.map(d => {
      if (d.selectedForReroll) {
        const newVal = Math.floor(Math.random() * 20) + 1;
        if (newVal === 1) extraPenalty++;
        return {
          ...d,
          value: newVal,
          type: getResultType(newVal),
          selectedForReroll: false,
          isRerolled: true
        };
      }
      return d;
    });

    setDiceResults(newResults);
    onSpendWill(willCost + extraPenalty);
    
    if (extraPenalty > 0) {
      alert(`Боги гневаются! Выпала единица при молитве. Потеряно дополнительно ${extraPenalty} Воли.`);
    }
  };

  const calculateTotalSuccesses = () => {
    return diceResults.reduce((acc, d) => {
      if (d.type === 'crit-success') return acc + 2;
      if (d.type === 'success') return acc + 1;
      if (d.type === 'crit-fail') return acc - 2;
      return acc;
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-space-800 w-full max-w-lg rounded-2xl border border-space-600 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-space-600 flex justify-between items-center bg-space-900">
           <div>
             <h2 className="text-xl font-serif text-white">{skillName || attributeName}</h2>
             <div className="text-xs text-gray-400">Проверка навыка</div>
           </div>
           <button onClick={onClose} className="text-gray-500 hover:text-white"><X /></button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          
          {step === 'setup' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                 <div className="bg-space-900 p-3 rounded-lg border border-space-700">
                    <div className="text-gray-500 text-xs uppercase">Характеристика</div>
                    <div className="text-2xl font-serif text-white">{attributeValue}</div>
                 </div>
                 <div className="bg-space-900 p-3 rounded-lg border border-space-700">
                    <div className="text-gray-500 text-xs uppercase">Навык</div>
                    <div className={`text-2xl font-serif ${isRedSkill ? 'text-mythic-red' : 'text-white'}`}>{skillValue}</div>
                 </div>
              </div>

              {!canRoll ? (
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-center text-red-400">
                  <p className="font-bold">Невозможно совершить проверку</p>
                  <p className="text-sm mt-1">Красные навыки требуют минимум 1 ранг.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 text-center">Дополнительные кубы (Модификатор)</label>
                    <div className="flex justify-center items-center gap-4">
                      <button onClick={() => setModifier(m => m - 1)} className="w-10 h-10 bg-space-700 rounded hover:bg-space-600 text-white font-bold text-xl">-</button>
                      <span className="text-3xl font-mono text-mythic-cyan w-12 text-center">{modifier > 0 ? `+${modifier}` : modifier}</span>
                      <button onClick={() => setModifier(m => m + 1)} className="w-10 h-10 bg-space-700 rounded hover:bg-space-600 text-white font-bold text-xl">+</button>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-gray-500 text-xs uppercase mb-1">Итоговый Пул</div>
                    <div className="text-4xl font-serif text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                      {Math.max(0, basePool + modifier)} <span className="text-lg text-gray-500">d20</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 'rolling' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <RefreshCcw className="w-16 h-16 text-mythic-cyan animate-spin" />
              <div className="text-mythic-cyan text-lg font-serif animate-pulse">Судьба вертится...</div>
            </div>
          )}

                    {step === 'result' && (
            <div className="space-y-6">
              {diceResults.length === 0 ? (
                <div className="text-center text-gray-500">Нет кубов для броска.</div>
              ) : (
                <>
                  <p className="text-xs text-gray-400 text-center">
                    Для использования «Молитвы» выберите кубики, которые хотите перебросить, просто нажимая на них.
                  </p>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {diceResults.map((die) => (
                      <button
                        key={die.id}
                        onClick={() => toggleDieSelection(die.id)}
                        className={`
                          relative flex items-center justify-center h-16 rounded-xl border-2 transition-all duration-200 group
                          ${die.selectedForReroll ? 'ring-2 ring-mythic-cyan scale-105' : ''}
                          ${die.type === 'crit-success' ? 'bg-mythic-gold/10 border-mythic-gold text-mythic-gold' : ''}
                          ${die.type === 'success' ? 'bg-green-900/20 border-green-500/50 text-green-400' : ''}
                          ${die.type === 'fail' ? 'bg-space-900 border-space-700 text-gray-500' : ''}
                        `}
                      >
                        <div className="text-2xl font-mono font-bold">{die.value}</div>
                        {die.isRerolled && (
                          <span className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-mythic-cyan/20 text-mythic-cyan border border-mythic-cyan/40">
                            R
                          </span>
                        )}
                        {die.selectedForReroll && (
                          <span className="absolute inset-0 rounded-xl border-2 border-mythic-cyan/60 pointer-events-none" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="flex flex-col items-center justify-center bg-space-900 p-4 rounded-xl border border-space-700">
                <div className="text-xs text-gray-500 uppercase tracking-widest">Успехи</div>
                <div className={`text-5xl font-serif font-bold ${calculateTotalSuccesses() > 0 ? 'text-mythic-gold' : calculateTotalSuccesses() < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                  {calculateTotalSuccesses()}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 px-2">
                <span>20 = +2 успеха</span>
                <span>17-19 = +1 успех</span>
                <span>1 = -2 успеха</span>
              </div>
            </div>
          )}


        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-space-600 bg-space-900 flex gap-3">
          {step === 'setup' && (
            <button 
              onClick={rollDice} 
              disabled={!canRoll}
              className="w-full py-3 bg-mythic-red hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg uppercase tracking-wider transition-colors"
            >
              Бросить кости
            </button>
          )}
          
          {step === 'result' && (
            <>
               <button 
                 onClick={handlePrayer}
                 disabled={currentWill < 1 || !diceResults.some(d => d.selectedForReroll)}
                 className="flex-1 py-3 bg-indigo-900 hover:bg-indigo-800 disabled:opacity-50 disabled:bg-space-800 text-indigo-200 border border-indigo-700/50 rounded-lg uppercase tracking-wider text-sm font-bold flex items-center justify-center gap-2 transition-colors"
               >
                 <Hand size={18} /> Молитва (1 Воля)
               </button>
               <button 
                 onClick={onClose} 
                 className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg uppercase tracking-wider text-sm font-bold transition-colors"
               >
                 Принять
               </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};