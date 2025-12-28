
import React, { useState, useEffect } from 'react';
import { Character, AttributeName, God, Clan, Skill, Faction } from '../types';
import { 
  INITIAL_ATTRIBUTES, 
  DEFAULT_SKILLS, 
  WHITE_SKILLS, 
  INITIAL_REPUTATION, 
  INITIAL_CLAN_RELATIONS, 
  SPECIALIZATIONS, 
  ORIGIN_FAMILY,
  ORIGIN_PLACE,
  ORIGIN_EDUCATION,
   SHOP_ITEMS
} from '../constants';
import { ChevronRight, ChevronLeft, Check, Sparkles, User, Sword, Shield, Book, Star, GraduationCap, Home, Baby, Package } from 'lucide-react';

interface CharacterCreatorProps {
  onComplete: (character: Character) => void;
  onCancel: () => void;
}

const STEPS = [
  'Предыстория', // Origins (Calculates Rank)
  'Личность',
  'Специализация',
  'Характеристики',
  'Навыки',
  'Черты',
  'Снаряжение'
];

type Rank = 'Serf' | 'Citizen' | 'Noble';

interface RankBonuses {
  name: string;
  attrPoints: number; // Target Total Sum of attributes
  skillPoints: number;
  credits: number;
  rep: number;
}

const getRank = (score: number): RankBonuses => {
  if (score <= -3) return { 
    name: 'Челядь', 
    attrPoints: 15, 
    skillPoints: 8, 
    credits: 1000, 
    rep: -1 
  };
  if (score >= 3) return { 
    name: 'Дворянин', 
    attrPoints: 13, 
    skillPoints: 12, 
    credits: 5000, 
    rep: 1 
  };
  return { 
    name: 'Гражданин', 
    attrPoints: 14, 
    skillPoints: 10, 
    credits: 3000, 
    rep: 0 
  };
};

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Origin State
  const [originFamily, setOriginFamily] = useState<{ idx: number, customVal: number, desc: string }>({ idx: -1, customVal: 0, desc: '' });
  const [originPlace, setOriginPlace] = useState<{ idx: number, customVal: number, desc: string }>({ idx: -1, customVal: 0, desc: '' });
  const [originEdu, setOriginEdu] = useState<{ idx: number, customVal: number, desc: string }>({ idx: -1, customVal: 0, desc: '' });

  // Calculate Rank
  const getScore = (selection: { idx: number, customVal: number }, list: any[]): number => {
    if (selection.idx === -1) return 0;
    const item = list[selection.idx];
    return (item.value === null ? selection.customVal : item.value) || 0;
  };
  const totalOriginScore = getScore(originFamily, ORIGIN_FAMILY) + getScore(originPlace, ORIGIN_PLACE) + getScore(originEdu, ORIGIN_EDUCATION);
  const currentRank = getRank(totalOriginScore);

  // Equipment Choices State (indices: 0 = A, 1 = B)
  // 4 rows of choices
  const [equipChoices, setEquipChoices] = useState<number[]>([0, 0, 0, 0]);

  // Draft State
  const [draft, setDraft] = useState<Partial<Character>>({
    name: '',
    concept: '',
    specialization: '', // Stores the name of the specialization
    clan: '',
    patronGod: God.ROD,
    backstory: '',
    attributes: { ...INITIAL_ATTRIBUTES },
    skills: JSON.parse(JSON.stringify(DEFAULT_SKILLS)), // Deep copy
    positiveTraits: [''],
    negativeTraits: [''],
    inventory: [],
    credits: 0,
  });

  // Derived Points
  const usedAttrPoints = Object.values(draft.attributes || {}).reduce((sum: number, val: number) => sum + val, 0);
  const targetAttrPoints = currentRank.attrPoints;
  const remainingAttrPoints = targetAttrPoints - usedAttrPoints;

  const usedSkillPoints = (draft.skills || []).reduce((sum: number, s: Skill) => sum + s.value, 0);
  const targetSkillPoints = currentRank.skillPoints + (draft.patronGod === God.ATHEIST ? 2 : 0);
  const remainingSkillPoints = targetSkillPoints - usedSkillPoints;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      finalizeCharacter();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    } else {
      onCancel();
    }
  };

  const finalizeCharacter = () => {
    // Determine Specialization Data
    const specData = SPECIALIZATIONS.find(s => s.name === draft.specialization);
    const specRepMod = specData ? specData.reputationMod : 0;

    // Apply Rep Multiplier + Specialization Mod
    const finalRep = { ...INITIAL_REPUTATION };
    Object.keys(finalRep).forEach(key => {
      finalRep[key as Faction] = currentRank.rep + specRepMod;
    });

        // Compile Inventory based on Choices
    const finalInventory: InventoryItem[] = [];
    if (specData) {
      specData.equipmentChoices.forEach((choice, index) => {
        const selectedOption = equipChoices[index] === 0 ? choice.optionA : choice.optionB;

        // Пытаемся найти соответствующий предмет в SHOP_ITEMS по имени
       const shopItem = selectedOption.shopItemId
  ? SHOP_ITEMS.find(item => item.id === selectedOption.shopItemId)
  : SHOP_ITEMS.find(item => item.name === selectedOption.name);
  
        if (shopItem) {
          // Если нашли — создаём полноценный предмет, как при покупке в магазине
          finalInventory.push({
            id: `start_${index}_${Math.random().toString(36).substr(2, 5)}`,
            name: shopItem.name,
            description: shopItem.description,
            quantity: selectedOption.quantity,
            equipped: selectedOption.equipped,
            weight: shopItem.weight ?? 1,
            category: shopItem.category,
            price: shopItem.price,
            weaponStats: shopItem.weaponStats,
            ammo: shopItem.weaponStats?.ammoCapacity,
            // если в InventoryItem у тебя есть поле modifiers — раскомментируй строку ниже
            // modifiers: shopItem.modifiers,
          });
        } else {
          // Если в магазине предмет с таким именем не найден — оставляем как простой «пустышечный» предмет
          finalInventory.push({
            id: `start_${index}_${Math.random().toString(36).substr(2, 5)}`,
            name: selectedOption.name,
            description: selectedOption.description,
            quantity: selectedOption.quantity,
            equipped: selectedOption.equipped,
          });
        }
      });
    }


    // Safely calculate attributes
    const body = draft.attributes?.[AttributeName.BODY] || 1;
    const agility = draft.attributes?.[AttributeName.AGILITY] || 1;
    const intellect = draft.attributes?.[AttributeName.INTELLECT] || 1;
    const empathy = draft.attributes?.[AttributeName.EMPATHY] || 1;

    const finalChar: Character = {
      id: Math.random().toString(36).substr(2, 9),
      name: draft.name || 'Безымянный',
      concept: draft.concept || 'Странник',
      specialization: draft.specialization || 'Нет',
      rank: currentRank.name,
      clan: draft.clan || 'Вольный',
      patronGod: draft.patronGod || God.ROD,
      level: 1,
      experience: 0,
      hp: { 
        current: body + agility, 
        max: body + agility 
      },
      energy: { 
        current: intellect + empathy, 
        max: intellect + empathy 
      },
      attributes: draft.attributes as Record<AttributeName, number>,
      skills: draft.skills as Skill[],
      inventory: finalInventory,
      credits: currentRank.credits, // Apply Rank Credits
      positiveTraits: (draft.positiveTraits || []).filter(t => t.trim() !== ''),
      negativeTraits: (draft.negativeTraits || []).filter(t => t.trim() !== ''),
      reputation: finalRep,
      clanRelations: { ...INITIAL_CLAN_RELATIONS },
      backstory: generateBackstoryText(),
    };
    onComplete(finalChar);
  };

  const generateBackstoryText = () => {
    const f = originFamily.idx !== -1 ? ORIGIN_FAMILY[originFamily.idx] : null;
    const p = originPlace.idx !== -1 ? ORIGIN_PLACE[originPlace.idx] : null;
    const e = originEdu.idx !== -1 ? ORIGIN_EDUCATION[originEdu.idx] : null;
    
    return `Происхождение: ${f?.label || 'Неизвестно'}. ${originFamily.desc}
Детство прошло: ${p?.label || 'Неизвестно'}. ${originPlace.desc}
Образование: ${e?.label || 'Неизвестно'}. ${originEdu.desc}`;
  };

  // --- Render Steps ---

  const renderOriginBlock = (
    title: string, 
    icon: any, 
    options: any[], 
    state: { idx: number, customVal: number, desc: string }, 
    setState: (v: any) => void
  ) => (
    <div className="bg-space-800 rounded-xl border border-space-600 overflow-hidden mb-6">
      <div className="p-4 bg-space-900 border-b border-space-700 flex items-center gap-2">
         {icon} <h3 className="font-serif text-white">{title}</h3>
      </div>
      <div className="p-4 space-y-3">
         <select 
           className="w-full bg-space-900 border border-space-600 rounded p-2 text-white"
           value={state.idx}
           onChange={(e) => setState({ ...state, idx: parseInt(e.target.value) })}
         >
            <option value={-1}>Выберите вариант...</option>
            {options.map((opt, i) => (
               <option key={i} value={i}>{opt.label} ({opt.value === null ? '?' : (opt.value > 0 ? `+${opt.value}` : opt.value)})</option>
            ))}
         </select>
         
         {state.idx !== -1 && options[state.idx].value === null && (
            <div className="flex items-center gap-4 bg-space-900 p-2 rounded">
               <span className="text-xs text-gray-400 uppercase">Уровень:</span>
               <input 
                 type="number" 
                 min="-2" max="2"
                 className="w-16 bg-black border border-space-600 rounded px-2 py-1 text-white"
                 value={state.customVal}
                 onChange={(e) => setState({ ...state, customVal: Math.max(-2, Math.min(2, parseInt(e.target.value) || 0)) })}
               />
               <span className="text-xs text-gray-500">(-2 ... +2)</span>
            </div>
         )}
         
         {state.idx !== -1 && (
            <textarea 
               className="w-full bg-space-900 border border-space-600 rounded p-2 text-sm text-gray-300 h-20"
               placeholder="Опишите подробности..."
               value={state.desc}
               onChange={(e) => setState({ ...state, desc: e.target.value })}
            />
         )}
         {state.idx !== -1 && options[state.idx].value !== null && (
            <p className="text-xs text-gray-500 italic">{options[state.idx].desc}</p>
         )}
      </div>
    </div>
  );

  const renderStep1Origins = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-300 pb-20">
      <div className="text-center mb-6">
        <Book className="w-12 h-12 mx-auto text-mythic-red mb-2" />
        <h2 className="text-2xl font-serif text-white">Предыстория</h2>
        <p className="text-gray-400">Ваше прошлое определяет ваши стартовые возможности.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
         <div className="space-y-4">
            {renderOriginBlock('Семья и Детство', <Baby size={18} className="text-mythic-red"/>, ORIGIN_FAMILY, originFamily, setOriginFamily)}
            {renderOriginBlock('Среда Обитания', <Home size={18} className="text-mythic-red"/>, ORIGIN_PLACE, originPlace, setOriginPlace)}
            {renderOriginBlock('Образование', <GraduationCap size={18} className="text-mythic-red"/>, ORIGIN_EDUCATION, originEdu, setOriginEdu)}
         </div>

         <div className="lg:sticky lg:top-4">
            <div className="bg-space-800 p-6 rounded-2xl border border-mythic-red shadow-[0_0_20px_rgba(239,68,68,0.15)]">
               <h3 className="text-center font-serif text-xl text-white mb-6 border-b border-space-600 pb-4">Итог Происхождения</h3>
               
               <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm uppercase">Сумма уровней</span>
                  <span className={`font-mono font-bold text-2xl ${totalOriginScore > 0 ? 'text-green-400' : totalOriginScore < 0 ? 'text-red-400' : 'text-gray-200'}`}>
                     {totalOriginScore > 0 ? `+${totalOriginScore}` : totalOriginScore}
                  </span>
               </div>

               <div className="text-center py-4 bg-space-900 rounded-lg mb-6 border border-space-700">
                  <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Ваш Ранг</span>
                  <span className="text-3xl font-serif text-mythic-red font-bold">{currentRank.name}</span>
               </div>

               <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-space-700 pb-2">
                     <span className="text-gray-400">Пункты Характеристик</span>
                     <span className="text-white font-bold">{currentRank.attrPoints} (Сумма)</span>
                  </div>
                  <div className="flex justify-between border-b border-space-700 pb-2">
                     <span className="text-gray-400">Пункты Навыков</span>
                     <span className="text-white font-bold">{currentRank.skillPoints}</span>
                  </div>
                  <div className="flex justify-between border-b border-space-700 pb-2">
                     <span className="text-gray-400">Стартовая Репутация</span>
                     <span className="text-white font-bold">{currentRank.rep > 0 ? `+${currentRank.rep}` : currentRank.rep}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-gray-400">Сверхкредиты</span>
                     <span className="text-mythic-cyan font-bold font-mono">{currentRank.credits} ₡</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderStep2Identity = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-300">
      <div className="text-center mb-8">
        <User className="w-12 h-12 mx-auto text-mythic-red mb-2" />
        <h2 className="text-2xl font-serif text-white">Личность</h2>
        <p className="text-gray-400">Как вас зовут и во что вы верите?</p>
      </div>
      
      <div className="space-y-4 max-w-xl mx-auto">
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Имя</label>
          <input 
            className="w-full bg-space-900 border border-space-600 rounded-lg p-3 text-white"
            value={draft.name}
            onChange={e => setDraft({ ...draft, name: e.target.value })}
            placeholder="Имя персонажа"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Краткий Концепт</label>
          <input 
            className="w-full bg-space-900 border border-space-600 rounded-lg p-3 text-white"
            value={draft.concept}
            onChange={e => setDraft({ ...draft, concept: e.target.value })}
            placeholder="Пример: Кибер-шаман из пустоши"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Клан / Фракция</label>
          <input 
            className="w-full bg-space-900 border border-space-600 rounded-lg p-3 text-white"
            value={draft.clan}
            onChange={e => setDraft({ ...draft, clan: e.target.value })}
            placeholder="Ваша принадлежность"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Божество-Покровитель</label>
          <select 
            className="w-full bg-space-900 border border-space-600 rounded-lg p-3 text-white"
            value={draft.patronGod}
            onChange={e => setDraft({ ...draft, patronGod: e.target.value as God })}
          >
            {Object.values(God).map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3Specialization = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-300 pb-20">
      <div className="text-center mb-8">
        <Star className="w-12 h-12 mx-auto text-mythic-red mb-2" />
        <h2 className="text-2xl font-serif text-white">Специализация</h2>
        <p className="text-gray-400">Выберите свой путь и предназначение.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SPECIALIZATIONS.map(spec => (
          <button
            key={spec.name}
            onClick={() => {
              setDraft({ ...draft, specialization: spec.name });
              // Reset equipment choices when changing spec
              setEquipChoices([0, 0, 0, 0]);
            }}
            className={`p-6 rounded-xl border text-left transition-all relative overflow-hidden group ${draft.specialization === spec.name ? 'bg-space-800 border-mythic-red shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-space-900 border-space-600 hover:border-gray-400'}`}
          >
            {draft.specialization === spec.name && <div className="absolute top-0 left-0 w-1 h-full bg-mythic-red" />}
            
            <div className="flex justify-between items-start mb-2">
               <div className={`font-bold font-serif text-xl ${draft.specialization === spec.name ? 'text-mythic-red' : 'text-white'}`}>{spec.name}</div>
               {draft.specialization === spec.name && <Check className="text-mythic-red" size={20} />}
            </div>
            
            <div className="text-sm text-gray-400 italic mb-4">{spec.variations}</div>
            
            <div className="space-y-2">
               <div className="flex items-start gap-2 text-xs">
                  <Star size={12} className="mt-0.5 text-mythic-cyan" />
                  <span className="text-gray-300"><span className="text-gray-500 uppercase">Реком. Навыки:</span> {spec.recommendedSkills.join(', ')}</span>
               </div>
               <div className="flex items-start gap-2 text-xs">
                  <User size={12} className="mt-0.5 text-mythic-cyan" />
                  <span className="text-gray-300"><span className="text-gray-500 uppercase">Репутация:</span> {spec.reputationMod > 0 ? `+${spec.reputationMod}` : spec.reputationMod} ко всем фракциям</span>
               </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep4Attributes = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-300">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif text-white">Характеристики</h2>
        <p className="text-gray-400">Ранг <span className="text-mythic-red font-bold">{currentRank.name}</span> дает сумму характеристик: <span className="text-white font-bold">{targetAttrPoints}</span>.</p>
        <p className="text-xs text-gray-500 mt-1">Минимум 1, Максимум 5.</p>
        
        <div className="mt-4 inline-block bg-space-800 px-4 py-2 rounded-full border border-space-600">
          <span className="text-gray-400 uppercase text-xs mr-2">Очков осталось распределить:</span>
          <span className={`font-bold text-xl ${remainingAttrPoints < 0 ? 'text-red-500' : remainingAttrPoints === 0 ? 'text-green-400' : 'text-mythic-red'}`}>{remainingAttrPoints}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {Object.values(AttributeName).map(attr => (
          <div key={attr} className="bg-space-900 p-4 rounded-xl border border-space-700 flex items-center justify-between">
            <span className="font-serif text-lg text-white">{attr}</span>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  const current = draft.attributes![attr];
                  if (current > 1) {
                    setDraft({ ...draft, attributes: { ...draft.attributes!, [attr]: current - 1 } });
                  }
                }}
                className="w-8 h-8 rounded bg-space-800 text-gray-300 hover:text-white hover:bg-space-700 disabled:opacity-30"
                disabled={draft.attributes![attr] <= 1}
              >
                -
              </button>
              <span className="text-2xl font-bold w-6 text-center">{draft.attributes![attr]}</span>
              <button 
                 onClick={() => {
                  const current = draft.attributes![attr];
                  if (current < 5 && remainingAttrPoints > 0) {
                    setDraft({ ...draft, attributes: { ...draft.attributes!, [attr]: current + 1 } });
                  }
                }}
                className="w-8 h-8 rounded bg-space-800 text-gray-300 hover:text-white hover:bg-space-700 disabled:opacity-30"
                disabled={draft.attributes![attr] >= 5 || remainingAttrPoints <= 0}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep5Skills = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-300">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif text-white">Навыки</h2>
        <p className="text-gray-400">Ранг <span className="text-mythic-red font-bold">{currentRank.name}</span> дает очков навыков: <span className="text-white font-bold">{targetSkillPoints}</span>.</p>
        
        <div className="mt-4 inline-block bg-space-800 px-4 py-2 rounded-full border border-space-600">
          <span className="text-gray-400 uppercase text-xs mr-2">Очков осталось:</span>
          <span className={`font-bold text-xl ${remainingSkillPoints < 0 ? 'text-red-500' : remainingSkillPoints === 0 ? 'text-green-400' : 'text-mythic-red'}`}>{remainingSkillPoints}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {draft.skills!.map((skill, idx) => {
          const isWhite = WHITE_SKILLS.includes(skill.name);
          return (
            <div key={skill.id} className="flex items-center justify-between p-3 bg-space-900 rounded-lg border border-space-700">
              <div>
                <div className={`font-medium ${isWhite ? 'text-white' : 'text-mythic-red'}`}>{skill.name}</div>
                <div className="text-xs text-gray-600">{skill.baseAttribute}</div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    if (skill.value > 0) {
                      const newSkills = [...draft.skills!];
                      newSkills[idx] = { ...skill, value: skill.value - 1 };
                      setDraft({ ...draft, skills: newSkills });
                    }
                  }}
                  className="w-6 h-6 rounded bg-space-800 text-gray-400 hover:text-white disabled:opacity-30"
                  disabled={skill.value <= 0}
                >
                  -
                </button>
                <span className="font-mono text-lg w-4 text-center">{skill.value}</span>
                <button 
                   onClick={() => {
                    if (skill.value < 5 && remainingSkillPoints > 0) {
                      const newSkills = [...draft.skills!];
                      newSkills[idx] = { ...skill, value: skill.value + 1 };
                      setDraft({ ...draft, skills: newSkills });
                    }
                  }}
                  className="w-6 h-6 rounded bg-space-800 text-gray-400 hover:text-white disabled:opacity-30"
                  disabled={skill.value >= 5 || remainingSkillPoints <= 0}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );

  const renderStep6Traits = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-300">
      <div className="text-center mb-8">
        <Sparkles className="w-12 h-12 mx-auto text-mythic-red mb-2" />
        <h2 className="text-2xl font-serif text-white">Черты Характера</h2>
        <p className="text-gray-400">Что делает вас особенным?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-green-900/10 p-6 rounded-xl border border-green-900/30">
          <h3 className="text-green-400 font-serif text-lg mb-4 uppercase">Положительная черта</h3>
          <input 
            className="w-full bg-space-900 border border-space-600 rounded p-3 text-white mb-2"
            value={draft.positiveTraits![0]}
            onChange={e => {
              const newTraits = [...draft.positiveTraits!];
              newTraits[0] = e.target.value;
              setDraft({ ...draft, positiveTraits: newTraits });
            }}
            placeholder="Например: Хладнокровие"
          />
        </div>

        <div className="bg-red-900/10 p-6 rounded-xl border border-red-900/30">
          <h3 className="text-red-400 font-serif text-lg mb-4 uppercase">Отрицательная черта</h3>
          <input 
            className="w-full bg-space-900 border border-space-600 rounded p-3 text-white mb-2"
            value={draft.negativeTraits![0]}
            onChange={e => {
              const newTraits = [...draft.negativeTraits!];
              newTraits[0] = e.target.value;
              setDraft({ ...draft, negativeTraits: newTraits });
            }}
            placeholder="Например: Вспыльчивость"
          />
        </div>
      </div>
    </div>
  );

  const renderStep7Equipment = () => {
    const specData = SPECIALIZATIONS.find(s => s.name === draft.specialization);

    if (!specData) {
      return (
        <div className="text-center text-red-500 mt-10">
          Пожалуйста, выберите специализацию на Шаге 3.
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-300 pb-20">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 mx-auto text-mythic-red mb-2" />
          <h2 className="text-2xl font-serif text-white">Снаряжение</h2>
          <p className="text-gray-400 mb-2">Получение имущества согласно специализации <span className="text-white font-bold">{specData.name}</span>.</p>
          <div className="inline-block bg-space-800 px-4 py-2 rounded-full border border-space-600">
             <span className="text-gray-400 uppercase text-xs mr-2">Ваши Сверхкредиты:</span>
             <span className="text-mythic-cyan font-bold font-mono">{currentRank.credits} ₡</span>
          </div>
        </div>
        
        <div className="space-y-4 max-w-4xl mx-auto">
          {specData.equipmentChoices.map((choice, rowIndex) => (
             <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                {/* Visual Connector for "OR" */}
                <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
                   <div className="bg-space-900 text-gray-500 text-xs font-bold px-2 py-1 rounded border border-space-700 z-10">ИЛИ</div>
                </div>

                {/* Option A */}
                <button
                  onClick={() => {
                     const newChoices = [...equipChoices];
                     newChoices[rowIndex] = 0;
                     setEquipChoices(newChoices);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${equipChoices[rowIndex] === 0 ? 'bg-space-800 border-mythic-red shadow-lg ring-1 ring-mythic-red' : 'bg-space-900 border-space-600 hover:border-gray-500'}`}
                >
                   <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-white">{choice.optionA.name}</div>
                      {choice.optionA.quantity > 1 && <span className="text-xs bg-space-700 px-2 py-0.5 rounded text-gray-300">x{choice.optionA.quantity}</span>}
                   </div>
                   <div className="text-sm text-gray-400">{choice.optionA.description}</div>
                </button>

                {/* Option B */}
                <button
                  onClick={() => {
                     const newChoices = [...equipChoices];
                     newChoices[rowIndex] = 1;
                     setEquipChoices(newChoices);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${equipChoices[rowIndex] === 1 ? 'bg-space-800 border-mythic-red shadow-lg ring-1 ring-mythic-red' : 'bg-space-900 border-space-600 hover:border-gray-500'}`}
                >
                   <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-white">{choice.optionB.name}</div>
                      {choice.optionB.quantity > 1 && <span className="text-xs bg-space-700 px-2 py-0.5 rounded text-gray-300">x{choice.optionB.quantity}</span>}
                   </div>
                   <div className="text-sm text-gray-400">{choice.optionB.description}</div>
                </button>
             </div>
          ))}
        </div>
      </div>
    );
  };

  const isValidStep = () => {
    switch(currentStep) {
      case 0: return originFamily.idx !== -1 && originPlace.idx !== -1 && originEdu.idx !== -1;
      case 2: return draft.specialization !== '' && draft.specialization !== undefined;
      case 3: return remainingAttrPoints === 0; 
      case 4: return remainingSkillPoints === 0;
      case 5: return draft.positiveTraits![0] && draft.negativeTraits![0];
      default: return true;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#0f0505] z-50 flex flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-space-600 bg-space-900 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-mythic-red font-bold font-serif text-xl tracking-wider hidden sm:block">СОЗДАНИЕ ПЕРСОНАЖА</div>
          <div className="text-mythic-red font-bold font-serif text-xl tracking-wider sm:hidden">СОЗДАНИЕ</div>
        </div>
        <div className="text-gray-500 text-sm hidden md:block">
          Шаг {currentStep + 1} из {STEPS.length}: <span className="text-white">{STEPS[currentStep]}</span>
        </div>
        <button onClick={onCancel} className="text-gray-500 hover:text-white px-3 py-1 uppercase text-xs font-bold tracking-widest">
          Отмена
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-space-900 h-1">
        <div className="bg-mythic-red h-full transition-all duration-300" style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} />
      </div>

      {/* Content */}
     <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20 md:px-10 md:pt-6 md:pb-10">
        <div className="max-w-4xl mx-auto">
          {currentStep === 0 && renderStep1Origins()}
          {currentStep === 1 && renderStep2Identity()}
          {currentStep === 2 && renderStep3Specialization()}
          {currentStep === 3 && renderStep4Attributes()}
          {currentStep === 4 && renderStep5Skills()}
          {currentStep === 5 && renderStep6Traits()}
          {currentStep === 6 && renderStep7Equipment()}
        </div>
      </div>

       {/* Footer */}
      <div
        className="px-4 py-3 md:px-6 md:py-4 bg-space-900 border-t border-space-600 flex justify-between items-center max-w-full"
      >
	  <button 
          onClick={handleBack}
          className="px-6 py-3 rounded-lg border border-space-600 text-gray-300 hover:bg-space-800 flex items-center gap-2 font-bold uppercase tracking-widest text-sm transition-colors"
        >
          {currentStep === 0 ? 'Отмена' : <><ChevronLeft size={16} /> Назад</>}
        </button>

        <div className="flex gap-2 items-center">
          {currentStep === 3 && remainingAttrPoints !== 0 && <span className="text-red-500 text-xs self-center mr-4 animate-pulse hidden sm:block">Распределите очки!</span>}
          {currentStep === 4 && remainingSkillPoints !== 0 && <span className="text-red-500 text-xs self-center mr-4 animate-pulse hidden sm:block">Распределите очки!</span>}
          
          <button 
            onClick={handleNext}
            disabled={!isValidStep()}
            className="px-8 py-3 rounded-lg bg-mythic-red hover:bg-red-600 text-white flex items-center gap-2 font-bold uppercase tracking-widest text-sm shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {currentStep === STEPS.length - 1 ? <><Check size={16} /> Завершить</> : <>Далее <ChevronRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
};
