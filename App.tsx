import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import React, { useState, useEffect, useRef, } from 'react';
import { 
  Users, 
  Scroll, 
  Sword, 
  Sparkles, 
  Save, 
  Shield, 
  Zap,
  Microchip,
  Plus,
  Trash2,
  Pencil,
  Check,
  Menu,
  X,
  User,
  Brain,
  Handshake,
  Activity,
  Wind,
  Coins,
  Weight,
  Dna,
  Download,
  Upload,
  Rocket
} from 'lucide-react';
import { AttributeName, Character, Clan, Faction, God, GreatClan, Skill, ItemCategory, ShopItem, InventoryItem } from './types';
import { INITIAL_ATTRIBUTES, DEFAULT_SKILLS, WHITE_SKILLS, INITIAL_REPUTATION, INITIAL_CLAN_RELATIONS, SHOP_ITEMS, MELEE_WEAPONS } from './constants';
import { DiceModal, D20Icon } from './components/DiceRoller';
import { CharacterCreator } from './components/CharacterCreator';
const DEFAULT_SHIP: Ship = {
  id: 'default-ship',
  name: 'Корабль экипажа',
  className: 'Корвет',
  hull: {
    current: 10,
    max: 10,
  },
  energy: {
    current: 5,
    max: 5,
  },
  // новое — базовый запас топлива
  fuel: {
    current: 3,
    max: 3,
  },
  // новое — модификатор инициативы корабля
  initiativeBonus: 0,
  crew: {
    current: 4,
    max: 6,
  },
  // новое — пустые списки, чтобы не было undefined
  conditions: [],
  crewRoles: [],
  weapons: [],
  cargoNotes: '',
  personalCabinNotes: '',
  modules: [
    { id: 'bridge',   name: 'Мостик',             type: 'bridge',   status: 'ok' },
    { id: 'docking',  name: 'Стыковочный отсек',  type: 'docking',  status: 'ok' },
    { id: 'fuel',     name: 'Топливные баки',     type: 'fuel',     status: 'ok' },
    { id: 'living',   name: 'Жилой модуль',       type: 'living',   status: 'ok' },
    { id: 'medbay',   name: 'Медотсек',           type: 'medbay',   status: 'ok' },
    { id: 'chapel',   name: 'Часовня',            type: 'chapel',   status: 'ok' },
    { id: 'cargo',    name: 'Склад',              type: 'cargo',    status: 'ok', notes: '' },
    { id: 'weapons',  name: 'Орудийный отсек',    type: 'weapon',   status: 'ok' },
    { id: 'cargo-bay-1', name: 'Грузовой отсек (Склад)', type: 'cargo', status: 'ok', notes: '' },
  ],
};




const generateId = () => Math.random().toString(36).substr(2, 9);
const formatSigned = (value: number) => (value > 0 ? `+${value}` : value.toString());
type NoteSection = {
  id: string;
  title: string;
  text: string;
};
const STORAGE_KEYS = {
  characters: 'stellar_spindle_characters',
  activeId: 'stellar_spindle_active_id',
  notes: 'stellar_spindle_notes',
} as const;

const SNAPSHOT_FILE = 'stellar_spindle_snapshot.json';

type AppSnapshot = {
  characters: Character[];
  activeCharId: string;
  notesByCharacter: Record<string, NoteSection[]>;
};

const safeJsonParse = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const normalizeCharactersFromAny = (parsed: any): Character[] => {
  if (!Array.isArray(parsed)) return [];

  return parsed.map((c: any) => {
    const safeAttributes =
      c?.attributes && typeof c.attributes === 'object' ? c.attributes : {};
    const safeReputation =
      c?.reputation && typeof c.reputation === 'object' ? c.reputation : {};
    const safeClanRelations =
      c?.clanRelations && typeof c.clanRelations === 'object' ? c.clanRelations : {};
    const safeSkills = Array.isArray(c?.skills) ? c.skills : [];

    const safeShip =
      c?.ship && typeof c.ship === 'object'
        ? { ...DEFAULT_SHIP, ...c.ship }
        : c?.ship;

    return {
      ...DEFAULT_CHARACTER,
      ...c,
      attributes: { ...INITIAL_ATTRIBUTES, ...safeAttributes },
      reputation: { ...INITIAL_REPUTATION, ...safeReputation },
      clanRelations: { ...INITIAL_CLAN_RELATIONS, ...safeClanRelations },
      skills: safeSkills.length > 0 ? safeSkills : DEFAULT_SKILLS,
      ship: safeShip,
    };
  });
};

const normalizeNotesFromAny = (parsed: any): Record<string, NoteSection[]> => {
  if (!parsed || typeof parsed !== 'object') return {};
  const result: Record<string, NoteSection[]> = {};

  Object.entries(parsed).forEach(([charId, list]) => {
    if (!Array.isArray(list)) return;
    result[charId] = (list as any[]).map((n) => ({
      id: typeof (n as any).id === 'string' ? (n as any).id : generateId(),
      title: typeof (n as any).title === 'string' ? (n as any).title : '',
      text: typeof (n as any).text === 'string' ? (n as any).text : '',
    }));
  });

  return result;
};

const writeSnapshotToLocalStorage = (snapshot: AppSnapshot) => {
  try {
    localStorage.setItem(STORAGE_KEYS.characters, JSON.stringify(snapshot.characters));
    localStorage.setItem(STORAGE_KEYS.activeId, snapshot.activeCharId || '');
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(snapshot.notesByCharacter));
  } catch (e) {
    console.error('Не удалось записать snapshot в localStorage', e);
  }
};

const readSnapshotFromLocalStorage = (): AppSnapshot => {
  const rawChars = safeJsonParse<any>(localStorage.getItem(STORAGE_KEYS.characters));
  const rawNotes = safeJsonParse<any>(localStorage.getItem(STORAGE_KEYS.notes));
  const activeCharId = localStorage.getItem(STORAGE_KEYS.activeId) || '';

  return {
    characters: normalizeCharactersFromAny(rawChars),
    activeCharId,
    notesByCharacter: normalizeNotesFromAny(rawNotes),
  };
};

const writeSnapshotToFileIfNative = async (snapshot: AppSnapshot) => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await Filesystem.writeFile({
      path: SNAPSHOT_FILE,
      data: JSON.stringify(snapshot),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
  } catch (e) {
    console.error('Не удалось записать snapshot в файл устройства', e);
  }
};

const readSnapshotFromFileIfNative = async (): Promise<AppSnapshot | null> => {
  if (!Capacitor.isNativePlatform()) return null;

  try {
    const file = await Filesystem.readFile({
      path: SNAPSHOT_FILE,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    const parsed = safeJsonParse<any>(typeof file.data === 'string' ? file.data : String(file.data));
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      characters: normalizeCharactersFromAny((parsed as any).characters),
      activeCharId: typeof (parsed as any).activeCharId === 'string' ? (parsed as any).activeCharId : '',
      notesByCharacter: normalizeNotesFromAny((parsed as any).notesByCharacter),
    };
  } catch {
    return null;
  }
};


const DEFAULT_CHARACTER: Character = {
  id: 'default',
  name: "Неизвестный Странник",
  concept: "Новичок пустоши",
  specialization: "Бродяга",
  rank: "Гражданин",
  clan: Clan.FREE_COSMONAUT,
  patronGod: God.ROD,
  level: 1,
  experience: 0,
  hp: { current: 10, max: 10 },
  energy: { current: 10, max: 10 },
  attributes: { 
    [AttributeName.BODY]: 1, 
    [AttributeName.AGILITY]: 1, 
    [AttributeName.INTELLECT]: 1, 
    [AttributeName.EMPATHY]: 1 
  },
  skills: [...DEFAULT_SKILLS],
  inventory: [],
  credits: 0,
  traumas: [],
  positiveTraits: [],
  negativeTraits: [],
  reputation: { ...INITIAL_REPUTATION },
  clanRelations: { ...INITIAL_CLAN_RELATIONS },
  backstory: "..."
};
const TRAUMA_TABLE: {
  code: string;
  name: string;
  death: string;
  deadline: string;
  effect: string;
  period: string;
}[] = [
  {
    code: '11',
    name: 'Сбитое дыхание',
    death: 'Нет',
    deadline: '-',
    effect: 'Шок (2).',
    period: '-',
  },
  {
    code: '12',
    name: 'Дезориентация',
    death: 'Нет',
    deadline: '-',
    effect: 'Шок (2).',
    period: '-',
  },
  {
    code: '13',
    name: 'Растяжение запястья',
    death: 'Нет',
    deadline: '-',
    effect:
      'Персонаж роняет то, что держит в руках; –1 к проверкам стрельбы и ближнего боя.',
    period: 'к6',
  },
  {
    code: '14',
    name: 'Растяжение лодыжки',
    death: 'Нет',
    deadline: '-',
    effect: 'Персонаж сбит с ног; –1 к проверкам проворства и скрытности.',
    period: 'к6',
  },
  {
    code: '15',
    name: 'Сотрясение мозга',
    death: 'Нет',
    deadline: '-',
    effect: 'Шок (2); –1 ко всем проверкам профессиональных навыков.',
    period: 'к6',
  },
  {
    code: '16',
    name: 'Ушиб стопы',
    death: 'Нет',
    deadline: '-',
    effect: 'Персонаж сбит с ног; –1 к проверкам проворства и скрытности.',
    period: '2к6',
  },
  {
    code: '21',
    name: 'Перелом носа',
    death: 'Нет',
    deadline: '-',
    effect: 'Шок (2); –2 к проверкам влияния.',
    period: 'к6',
  },
  {
    code: '22',
    name: 'Перелом кисти',
    death: 'Нет',
    deadline: '-',
    effect:
      'Персонаж роняет то, что держит в руках; –2 к проверкам стрельбы и ближнего боя.',
    period: '2к6',
  },
  {
    code: '23',
    name: 'Перелом стопы',
    death: 'Нет',
    deadline: '-',
    effect: 'Шок (3); –2 к проверкам проворства и скрытности.',
    period: '2к6',
  },
  {
    code: '24',
    name: 'Перелом челюсти',
    death: 'Нет',
    deadline: '-',
    effect: 'Шок (3); –2 к проверкам влияния.',
    period: '2к6',
  },
  {
    code: '25',
    name: 'Ушиб паховой области',
    death: 'Нет',
    deadline: '-',
    effect:
      'Шок (4); по 1 пункту урона за каждую проверку силы, проворства и ближнего боя.',
    period: '2к6',
  },
  {
    code: '26',
    name: 'Вывих плеча',
    death: 'Нет',
    deadline: '-',
    effect: 'Шок (2); –3 к проверкам силы и ближнего боя.',
    period: 'к6',
  },
  {
    code: '31',
    name: 'Перелом рёбер',
    death: 'Нет',
    deadline: '-',
    effect: 'Шок (4); –2 к проверкам проворства и ближнего боя.',
    period: '2к6',
  },
  {
    code: '32',
    name: 'Перелом руки',
    death: 'Нет',
    deadline: '-',
    effect: 'Шок (3); –3 к проверкам стрельбы и ближнего боя.',
    period: '3к6',
  },
  {
    code: '33',
    name: 'Перелом ноги',
    death: 'Нет',
    deadline: '-',
    effect:
      'Шок (3); персонаж сбит с ног, скорость снижена вдвое, –2 к проверкам проворства и скрытности.',
    period: '3к6',
  },
  {
    code: '34',
    name: 'Разрыв уха',
    death: 'Нет',
    deadline: '-',
    effect: 'Шок (3); –2 к проверкам наблюдательности.',
    period: '3к6',
  },
  {
    code: '35',
    name: 'Травма глаза',
    death: 'Нет',
    deadline: '-',
    effect: 'Шок (4); –2 к проверкам стрельбы и наблюдательности.',
    period: '3к6',
  },
  {
    code: '36',
    name: 'Сквозное ранение лёгкого',
    death: 'Да',
    deadline: 'к6 дней',
    effect: 'Шок (4); –3 к проверкам проворства.',
    period: '2к6',
  },
  {
    code: '41',
    name: 'Разрыв почки',
    death: 'Да',
    deadline: 'к6 дней',
    effect:
      'Шок (5); по 1 пункту урона за каждую проверку силы, проворства и ближнего боя.',
    period: '3к6',
  },
  {
    code: '42',
    name: 'Сложный перелом ноги',
    death: 'Да',
    deadline: 'к6 дней',
    effect:
      'Шок (5); персонаж сбит с ног, скорость снижена вдвое, –2 к проверкам проворства и скрытности.',
    period: '4к6',
  },
  {
    code: '43',
    name: 'Сложный перелом руки',
    death: 'Да',
    deadline: 'к6 дней',
    effect:
      'Шок (5); –2 к проверкам силы и ближнего боя, нельзя использовать двуручное оружие.',
    period: '4к6',
  },
  {
    code: '44',
    name: 'Перелом коленной чашечки',
    death: 'Да',
    deadline: 'к6 часов',
    effect:
      'Шок (5); персонаж сбит с ног, скорость уменьшена вдвое, –3 к проверкам проворства и скрытности.',
    period: '4к6',
  },
  {
    code: '45',
    name: 'Перелом лицевой кости',
    death: 'Да',
    deadline: 'к6 часов',
    effect: 'Шок (6); –2 к проверкам влияния.',
    period: '4к6',
  },
  {
    code: '46',
    name: 'Повреждение внутренних органов',
    death: 'Да',
    deadline: 'к6 часов',
    effect:
      'Шок (5); по 1 пункту урона каждый час, пока не оказана неотложная помощь.',
    period: '2к6',
  },
  {
    code: '51',
    name: 'Перелом позвоночника',
    death: 'Да',
    deadline: 'к6 часов',
    effect:
      'Персонаж теряет сознание на к6 часов; паралич ниже пояса. Без лечения паралич становится постоянным.',
    period: '4к6',
  },
  {
    code: '52',
    name: 'Перелом шеи',
    death: 'Да',
    deadline: 'к6 часов',
    effect:
      'Персонаж теряет сознание на к6 часов; паралич ниже шеи. Без лечения паралич становится постоянным.',
    period: '4к6',
  },
  {
    code: '53',
    name: 'Проникающее ранение в живот',
    death: 'Да',
    deadline: 'к6 минут',
    effect:
      'По 1 пункту урона каждый ход, пока не оказана неотложная помощь.',
    period: 'к6',
  },
  {
    code: '54',
    name: 'Внутреннее кровотечение',
    death: 'Да, –1',
    deadline: 'к6 минут',
    effect:
      'Персонаж теряет сознание на к6 часов; по 1 пункту урона за каждую проверку силы, проворства и ближнего боя.',
    period: '2к6',
  },
  {
    code: '55',
    name: 'Артериальное кровотечение (рука)',
    death: 'Да, –1',
    deadline: 'к6 минут',
    effect:
      'Шок (3); Кровотечение (3); –1 к проверкам стрельбы и ближнего боя.',
    period: 'к6',
  },
  {
    code: '56',
    name: 'Артериальное кровотечение (нога)',
    death: 'Да, –1',
    deadline: 'к6 минут',
    effect:
      'Персонаж теряет сознание на к6 часов; –2 к проверкам проворства.',
    period: 'к6',
  },
  {
    code: '61',
    name: 'Травматическая ампутация руки',
    death: 'Да, –1',
    deadline: 'к6 минут',
    effect:
      'Персонаж теряет сознание на к6 часов; Кровотечение (3); –2 к проверкам проворства; персонаж лишается руки и не может пользоваться двуручным и тяжёлым оружием.',
    period: '3к6',
  },
  {
    code: '62',
    name: 'Травматическая ампутация ноги',
    death: 'Да, –1',
    deadline: 'к6 минут',
    effect:
      'Персонаж теряет сознание на к6 часов; –2 к проверкам проворства; персонаж лишается ноги, его скорость уменьшается вдвое.',
    period: '3к6',
  },
  {
    code: '63',
    name: 'Разрыв яремной вены',
    death: 'Да, –1',
    deadline: 'к6 минут',
    effect:
      'Персонаж теряет сознание на к6 часов; –1 к проверкам проворства.',
    period: 'к6',
  },
  {
    code: '64',
    name: 'Разрыв аорты',
    death: 'Да, –1',
    deadline: 'к6 минут',
    effect:
      'Персонаж теряет сознание на к6 часов; Кровотечение (5); –2 к проверкам проворства.',
    period: '2к6',
  },
  {
    code: '65',
    name: 'Проникающее ранение в сердце',
    death: 'Да',
    deadline: '-',
    effect:
      'Сердце персонажа останавливается навсегда. Если вы игрок — создайте нового героя.',
    period: '-',
  },
  {
    code: '66',
    name: 'Проникающее ранение в мозг',
    death: 'Да',
    deadline: '-',
    effect:
      'Мгновенная и кровавая смерть. Если вы игрок — создайте нового героя.',
    period: '-',
  },
];

const TRAUMA_BY_CODE: Record<string, (typeof TRAUMA_TABLE)[number]> = TRAUMA_TABLE.reduce(
  (acc, trauma) => {
    acc[trauma.code] = trauma;
    return acc;
  },
  {} as Record<string, (typeof TRAUMA_TABLE)[number]>,
);

const App: React.FC = () => {
  const [dbLoaded, setDbLoaded] = useState(false);
  const bootRef = useRef(false);

  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;

    let cancelled = false;

    (async () => {
      try {
        // Если уже подняли персонажей синхронно из localStorage (useState initializer ниже),
        // не делаем вторую тяжёлую загрузку/нормализацию.
        if (Array.isArray(characters) && characters.length > 0) {
          if (!cancelled) setDbLoaded(true);
          return;
        }

        const db = await loadOfflineDb();
        if (cancelled) return;

        // characters
        const parsed = Array.isArray(db.characters) ? db.characters : [];
        const normalized = parsed.map((c: any) => {
          const safeAttributes =
            c.attributes && typeof c.attributes === 'object' ? c.attributes : {};
          const safeReputation =
            c.reputation && typeof c.reputation === 'object' ? c.reputation : {};
          const safeClanRelations =
            c.clanRelations && typeof c.clanRelations === 'object'
              ? c.clanRelations
              : {};
          const safeSkills = Array.isArray(c.skills) ? c.skills : [];

          const safeShip =
            c.ship && typeof c.ship === 'object'
              ? { ...DEFAULT_SHIP, ...c.ship }
              : c.ship;

          return {
            ...DEFAULT_CHARACTER,
            ...c,
            attributes: { ...INITIAL_ATTRIBUTES, ...safeAttributes },
            reputation: { ...INITIAL_REPUTATION, ...safeReputation },
            clanRelations: { ...INITIAL_CLAN_RELATIONS, ...safeClanRelations },
            skills: safeSkills.length > 0 ? safeSkills : DEFAULT_SKILLS,
            ship: safeShip,
          };
        });

        setCharacters(normalized);
        setActiveCharId(typeof db.activeCharId === 'string' ? db.activeCharId : '');
        setNotesByCharacter(
          db.notesByCharacter && typeof db.notesByCharacter === 'object'
            ? (db.notesByCharacter as any)
            : {}
        );

        setDbLoaded(true);
      } catch (e) {
        console.error('Ошибка загрузки локальной БД:', e);
        if (!cancelled) setDbLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);


  // --- View State ---
  const [viewMode, setViewMode] = useState<'sheet' | 'creator'>('sheet');


   // --- Sheet State ---
  const [activeTab, setActiveTab] = useState<
    'stats' | 'skills' | 'inventory' | 'shop' | 'ship' | 'notes'
  >('stats');

  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [traumaPanelOpen, setTraumaPanelOpen] = useState(false);

  // Фильтр подтипов дальнобойного оружия в магазине
   // Фильтр категорий магазина (по типу предметов)
  const [shopCategoryFilter, setShopCategoryFilter] = useState<'all' | ItemCategory>('all');


  const fileInputRef = useRef<HTMLInputElement | null>(null);

 const [characters, setCharacters] = useState<Character[]>(() => {
  try {
    const saved = localStorage.getItem('stellar_spindle_characters');
    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }

          return parsed.map((c: any) => {
        const safeAttributes =
          c.attributes && typeof c.attributes === 'object' ? c.attributes : {};
        const safeReputation =
          c.reputation && typeof c.reputation === 'object' ? c.reputation : {};
        const safeClanRelations =
          c.clanRelations && typeof c.clanRelations === 'object'
            ? c.clanRelations
            : {};
        const safeSkills = Array.isArray(c.skills) ? c.skills : [];

        // Нормализуем корабль: поверх DEFAULT_SHIP накладываем сохранённый
        const safeShip =
          c.ship && typeof c.ship === 'object'
            ? { ...DEFAULT_SHIP, ...c.ship }
            : c.ship;

        return {
          ...DEFAULT_CHARACTER,
          ...c,
          attributes: { ...INITIAL_ATTRIBUTES, ...safeAttributes },
          reputation: { ...INITIAL_REPUTATION, ...safeReputation },
          clanRelations: { ...INITIAL_CLAN_RELATIONS, ...safeClanRelations },
          skills: safeSkills.length > 0 ? safeSkills : DEFAULT_SKILLS,
          ship: safeShip,
        };
      });

  } catch (e) {
    console.error('Ошибка загрузки персонажей:', e);
    return [];
  }
});






  const [activeCharId, setActiveCharId] = useState<string>(() => {
    return localStorage.getItem('stellar_spindle_active_id') || '';
  });

  // If no characters exist, force creator mode
  useEffect(() => {
    if (characters.length === 0 && viewMode !== 'creator') {
      setViewMode('creator');
    }
  }, [characters, viewMode]);

  const character = characters.find(c => c.id === activeCharId) || characters[0];

  // Initiative roll state
  const [initiativeModalOpen, setInitiativeModalOpen] = useState(false);
  const [initiativeResult, setInitiativeResult] = useState<null | {
	 
    die: number;
    agility: number;
    weaponInitiative: number;
    total: number;
  }>(null);
  // Инициатива корабля
  const [shipInitiativeModalOpen, setShipInitiativeModalOpen] = useState(false);
  const [shipInitiativeResult, setShipInitiativeResult] = useState<null | {
    die: number;
    modifier: number;
    total: number;
  }>(null);
    // --- Модалка добавления предмета в инвентарь ---
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [newItemForm, setNewItemForm] = useState<{
    name: string;
    description: string;
    kind: 'melee' | 'ranged' | 'armor' | 'elixir' | 'other';
    weight: string;
    weaponModifier: string;
    weaponInitiative: string;
    weaponDamage: string;
    weaponCrit: string;
    weaponProperties: string;
    weaponRange: string;
    armorDefense: string;
    armorProperty: string;
  }>({
    name: '',
    description: '',
    kind: 'other',
    weight: '',
    weaponModifier: '0',
    weaponInitiative: '0',
    weaponDamage: '',
    weaponCrit: '',
    weaponProperties: '',
    weaponRange: '',
    armorDefense: '',
    armorProperty: '',
  });

  // --- Skill abilities state ---
  // skillPowers: для каждого навыка (по id) храним выбор A/B для уровней 1–5
  const skillPowers: {
    [skillId: string]: { [level: number]: 'A' | 'B' };
  } = (character?.skillPowers ?? {}) as {
    [skillId: string]: { [level: number]: 'A' | 'B' };
  };

  // Показывать только навыки, которые ещё можно прокачать способностями
  const [showUpgradeableSkillsOnly, setShowUpgradeableSkillsOnly] =
    useState(false);
	  // Режим вкладки "Навыки": полный список или только доступное персонажу
  const [skillsReferenceMode, setSkillsReferenceMode] = useState<
    'full' | 'available'
  >('available');

  // Последний модуль, получивший критический урон (для показа в UI)
  const [lastCriticalModule, setLastCriticalModule] =
    useState<ShipModule | null>(null);

  // --- Заметки по персонажам ---
  const [notesByCharacter, setNotesByCharacter] = useState<Record<string, NoteSection[]>>(() => {
    try {
      const raw = localStorage.getItem('stellar_spindle_notes');
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return {};

      const result: Record<string, NoteSection[]> = {};

      Object.entries(parsed).forEach(([charId, list]) => {
        if (Array.isArray(list)) {
          result[charId] = (list as any[]).map((n) => ({
            id: typeof (n as any).id === 'string' ? (n as any).id : generateId(),
            title: typeof (n as any).title === 'string' ? (n as any).title : '',
            text: typeof (n as any).text === 'string' ? (n as any).text : '',
          }));
        }
      });

      return result;
    } catch (e) {
      console.error('Не удалось прочитать сохранённые заметки', e);
      return {};
    }
  });
  
  
  // Гарантируем, что у текущего персонажа есть хотя бы 3 базовые секции
  useEffect(() => {
    if (!character) return;

    setNotesByCharacter((prev) => {
      const current = prev[character.id];
      if (current && current.length > 0) {
        return prev;
      }

      return {
        ...prev,
        [character.id]: [
          { id: generateId(), title: 'Важные заметки', text: '' },
          { id: generateId(), title: 'НПС', text: '' },
          { id: generateId(), title: 'Квесты', text: '' },
        ],
      };
    });
  }, [character?.id]);

// Товар, который пользователь собирается купить (для подтверждения)
  const [pendingPurchase, setPendingPurchase] = useState<ShopItem | null>(null);
  
   const handleChooseSkillPower = (
    skillId: string,
    level: number,
    variant: 'A' | 'B'
  ) => {
    if (!character) return;

    updateCharacter((prev) => {
      const prevPowers = prev.skillPowers ?? {};
      const prevForSkill = prevPowers[skillId] ?? {};

      return {
        skillPowers: {
          ...prevPowers,
          [skillId]: {
            ...prevForSkill,
            [level]: variant,
          },
        },
      };
    });
  };

  const handleResetSkillPowers = (skillId: string) => {
    if (!character) return;

    updateCharacter((prev) => {
      const prevPowers = prev.skillPowers ?? {};
      const { [skillId]: _removed, ...rest } = prevPowers;

      return {
        skillPowers: rest,
      };
    });
  };



const getInitiativeValues = () => {
  if (!character) {
    return { agility: 0, weaponInitiative: 0 };
  }

  // Здесь "agility" — это именно НАВЫК "Проворство", а не атрибут
  const agility =
    character.skills.find((s) => s.name === 'Проворство')?.value ?? 0;

  // Берём лучший модификатор инициативы из НАДЕТЫХ оружий
  const weaponInitiative = character.inventory
    .filter((item) => item.equipped && item.weaponStats)
    .reduce((best, item) => {
      const value = item.weaponStats?.initiative ?? 0;
      return value > best ? value : best;
    }, 0);

  return { agility, weaponInitiative };
};

  
    const handleAddRandomTrauma = () => {
    if (!character) return;

    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const code = `${die1}${die2}`;

    const template = TRAUMA_BY_CODE[code];

    const base = template || {
      code,
      name: 'Неизвестная травма',
      death: '-',
      deadline: '-',
      effect: 'Опишите эффект вручную.',
      period: '-',
    };

    const newTrauma = {
      id: generateId(),
      ...base,
    };

    updateCharacter((prev) => ({
      traumas: [...(prev.traumas || []), newTrauma],
    }));
  };

  const handleDeleteTrauma = (traumaId: string) => {
    updateCharacter((prev) => ({
      traumas: (prev.traumas || []).filter((t) => t.id !== traumaId),
    }));
  };
  const handleInitiativeRoll = () => {
    if (!character) return;

    const armor = getArmorClass(); // текущий класс брони

    if (!armor || armor <= 0) {
      // если брони нет — бросать нечего
      return;
    }

    // Здесь мы НЕ генерируем кубы вручную.
    // DiceModal сам бросает d20, а количество кубов определяется attributeValue.
    openDiceModal(
      'Броня',  // attributeName — подпись в модалке
      armor,    // attributeValue — КОЛИЧЕСТВО d20 (равно классу брони)
      '',       // skillName — пустой (неважно для брони)
      0,        // skillValue — 0
      false     // isRedSkill — броня не «красный» навык
    );
  };

  const getArmorClass = () => {
    if (!character || !character.inventory) return 0;

    return character.inventory
      .filter((item) => item.equipped)
      .reduce((sum, item) => {
        const text = item.description || '';

        // Сначала ищем "Класс защиты: N"
        let match = text.match(/Класс защиты\s*:\s*(\d+)/i);

        // Если нет — пробуем формат "Броня N"
        if (!match) {
          match = text.match(/Броня\s+(\d+)/i);
        }

        if (!match) return sum;

        const value = parseInt(match[1], 10);
        if (Number.isNaN(value)) return sum;

        return sum + value;
      }, 0);
  };

     const rollInitiative = () => {
    const { agility, weaponInitiative } = getInitiativeValues();
    const die = Math.floor(Math.random() * 20) + 1;
    const total = die + agility + weaponInitiative;

    setInitiativeResult({
      die,
      agility,
      weaponInitiative,
      total,
    });
    setInitiativeModalOpen(true);
  };
  const rollShipInitiative = () => {
    if (!character || !character.ship) return;

    const ship = character.ship as Ship;
    const modifier = ship.initiativeBonus ?? 0;
    const die = Math.floor(Math.random() * 20) + 1;
    const total = die + modifier;

    setShipInitiativeResult({ die, modifier, total });
    setShipInitiativeModalOpen(true);
  };




  // Dice Modal State
  const [diceModalOpen, setDiceModalOpen] = useState(false);
  const [activeRoll, setActiveRoll] = useState<{
    attrName: string;
    attrVal: number;
    skillName: string;
    skillVal: number;
    isRed: boolean;
  } | null>(null);
const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const didHydrateRef = useRef(false);

useEffect(() => {
  const snapshot: AppSnapshot = {
    characters,
    activeCharId,
    notesByCharacter,
  };



  // 1) Всегда сохраняем в localStorage (офлайн для Web + базовый офлайн для native)
  writeSnapshotToLocalStorage(snapshot);

  // 2) На native дополнительно пишем в файл устройства (Directory.Data) с дебаунсом
  if (!Capacitor.isNativePlatform()) return;

  if (persistTimerRef.current) clearTimeout(persistTimerRef.current);

  persistTimerRef.current = setTimeout(() => {
    writeSnapshotToFileIfNative(snapshot);
  }, 300);

  return () => {
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
  };
}, [characters, activeCharId, notesByCharacter]);

 
  // Derived Stats Update Check
  useEffect(() => {
    if (!character) return;
    // Recalculate Max HP and Max Will based on new rules
    const body = character.attributes[AttributeName.BODY];
    const agi = character.attributes[AttributeName.AGILITY];
    const int = character.attributes[AttributeName.INTELLECT];
    const emp = character.attributes[AttributeName.EMPATHY];

    const newMaxHP = body + agi;
    const newMaxWill = int + emp;

    if (newMaxHP !== character.hp.max || newMaxWill !== character.energy.max) {
      updateCharacter(c => ({
        hp: { ...c.hp, max: newMaxHP },
        energy: { ...c.energy, max: newMaxWill }
      }));
    }
  }, [character?.attributes]);

// --- Renderers ---

// Вспомогательный тип, который, вероятно, был утерян. 
// Если его нет в './types', он может потребоваться для ShipModule.
type ShipModule = Character['ship']['modules'][number];
type ShipModuleStatus = ShipModule['status'];

const handleModuleChange = (moduleId: string, patch: Partial<ShipModule>) => {
  if (!character || !character.ship) return;

  updateCharacter({
    ship: {
      ...(character.ship as Ship),
      modules: (character.ship as Ship).modules.map((m) =>
        m.id === moduleId ? { ...m, ...patch } : m
      ),
    },
  });
};
  const handleRandomCriticalHit = () => {
    if (!character || !character.ship) return;

    const ship = character.ship as Ship;
    const modules = ship.modules;

    if (!modules || modules.length === 0) return;

    // случайный индекс модуля
    const index = Math.floor(Math.random() * modules.length);
    const selected = modules[index];

    // сохраняем, чтобы показать в UI
    setLastCriticalModule(selected);

    // обновляем статус модуля до "Критический"
    updateCharacter((c) => {
      const currentShip = c.ship as Ship;
      const updatedModules = currentShip.modules.map((m, i) =>
        i === index ? { ...m, status: 'critical' as ShipModuleStatus } : m
      );

      return {
        ship: {
          ...currentShip,
          modules: updatedModules,
        },
      };
    });
  };

  const getModuleRulesSummary = (type: string): string | null => {
    switch (type) {
      case 'docking':
        return 'Стыковочный отсек: даёт возможность швартоваться к станциям и другим кораблям; без него стыковка невозможна.';
      case 'fuel':
        return 'Хранилище топлива: базовый запас топлива корабля; при критическом повреждении может вызвать возгорание (мощность = класс корабля).';
      case 'living':
        return 'Жилой модуль: размещение экипажа; по умолчанию комнаты по формуле «класс корабля × 3» с возможностью уплотнения до ×6 мест.';
      default:
        return null;
    }
  };
  // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ЗАМЕТОК ---

  const getCurrentNotes = (): NoteSection[] => {
    if (!character) return [];
    return notesByCharacter[character.id] ?? [];
  };

  const handleAddNoteSection = () => {
    if (!character) return;
    setNotesByCharacter((prev) => {
      const list = prev[character.id] ?? [];
      return {
        ...prev,
        [character.id]: [
          ...list,
          {
            id: generateId(),
            title: 'Новая заметка',
            text: '',
          },
        ],
      };
    });
  };

  const handleUpdateNoteSectionTitle = (id: string, title: string) => {
    if (!character) return;
    setNotesByCharacter((prev) => {
      const list = prev[character.id] ?? [];
      return {
        ...prev,
        [character.id]: list.map((section) =>
          section.id === id ? { ...section, title } : section
        ),
      };
    });
  };

  const handleUpdateNoteSectionText = (id: string, text: string) => {
    if (!character) return;
    setNotesByCharacter((prev) => {
      const list = prev[character.id] ?? [];
      return {
        ...prev,
        [character.id]: list.map((section) =>
          section.id === id ? { ...section, text } : section
        ),
      };
    });
  };

  const handleDeleteNoteSection = (id: string) => {
    if (!character) return;
    setNotesByCharacter((prev) => {
      const list = prev[character.id] ?? [];
      return {
        ...prev,
        [character.id]: list.filter((section) => section.id !== id),
      };
    });
  };

  const renderNotesTab = () => {
    if (!character) return null;

    const sections = getCurrentNotes();

    return (
      <div className="animate-in fade-in duration-500 pb-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-fantasy text-xl text-white">Заметки</h2>
          <button
            type="button"
            onClick={handleAddNoteSection}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-space-800 border border-space-600 text-gray-200 hover:bg-space-700"
          >
            <Plus size={14} />
            Добавить раздел
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Здесь можно хранить важные заметки, информацию о НПС и квестах.
          Заголовок каждого блока редактируется.
        </p>

        {sections.length === 0 && (
          <div className="text-center text-sm text-gray-500 border border-dashed border-space-700 rounded-xl p-6">
            Пока здесь пусто. Нажмите «Добавить раздел», чтобы создать первую заметку.
          </div>
        )}

        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-space-800 border border-space-600 rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-space-900">
                <input
                  className="flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-gray-600"
                  value={section.title}
                  onChange={(e) =>
                    handleUpdateNoteSectionTitle(section.id, e.target.value)
                  }
                  placeholder="Заголовок заметки"
                />
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteNoteSection(section.id)}
                    className="ml-2 text-gray-500 hover:text-red-400"
                    aria-label="Удалить раздел"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <textarea
                className="w-full bg-space-800 px-4 py-3 text-sm text-gray-200 border-t border-space-700 outline-none resize-none min-h-[120px]"
                value={section.text}
                onChange={(e) =>
                  handleUpdateNoteSectionText(section.id, e.target.value)
                }
                placeholder="Текст заметки."
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

const renderShipTab = () => {
  if (!character) return null;

  const ship = character.ship;

  if (!ship) {
    return (
      <div className="animate-in fade-in duration-500 pb-10 flex flex-col items-center justify-center gap-4">
        <div className="text-center max-w-md text-sm text-gray-300">
          <div className="text-lg font-serif text-white mb-2">
            Корабль ещё не создан
          </div>
          <p className="text-gray-400">
            У этого персонажа пока нет корабля. Нажмите кнопку ниже, чтобы
            создать базовый корабль экипажа. Все параметры можно будет
            изменить позже.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            updateCharacter((c) => ({
              ship: {
                ...(DEFAULT_SHIP as Ship),
                // уникальный id, чтобы у каждого персонажа был свой корабль
                id: generateId(),
              },
            }))
          }
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-space-700 hover:bg-space-600 border border-space-500 text-sm text-white uppercase tracking-widest"
        >
          <Rocket size={16} className="text-mythic-red" />
          Создать корабль
        </button>
      </div>
    );
  }
  const getCurrentNotes = (): NoteSection[] => {
    if (!character) return [];
    return notesByCharacter[character.id] ?? [];
  };

  const handleAddNoteSection = () => {
    if (!character) return;
    setNotesByCharacter((prev) => {
      const list = prev[character.id] ?? [];
      return {
        ...prev,
        [character.id]: [
          ...list,
          {
            id: generateId(),
            title: 'Новая заметка',
            text: '',
          },
        ],
      };
    });
  };

  const handleUpdateNoteSectionTitle = (id: string, title: string) => {
    if (!character) return;
    setNotesByCharacter((prev) => {
      const list = prev[character.id] ?? [];
      return {
        ...prev,
        [character.id]: list.map((section) =>
          section.id === id ? { ...section, title } : section
        ),
      };
    });
  };

  const handleUpdateNoteSectionText = (id: string, text: string) => {
    if (!character) return;
    setNotesByCharacter((prev) => {
      const list = prev[character.id] ?? [];
      return {
        ...prev,
        [character.id]: list.map((section) =>
          section.id === id ? { ...section, text } : section
        ),
      };
    });
  };

  const handleDeleteNoteSection = (id: string) => {
    if (!character) return;
    setNotesByCharacter((prev) => {
      const list = prev[character.id] ?? [];
      return {
        ...prev,
        [character.id]: list.filter((section) => section.id !== id),
      };
    });
  };

  const renderNotesTab = () => {
    if (!character) return null;

    const sections = getCurrentNotes();

    return (
      <div className="animate-in fade-in duration-500 pb-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-fantasy text-xl text-white">Заметки</h2>
          <button
            type="button"
            onClick={handleAddNoteSection}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-space-800 border border-space-600 text-gray-200 hover:bg-space-700"
          >
            <Plus size={14} />
            Добавить раздел
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Здесь можно хранить важные заметки, информацию о НПС и квестах. Заголовок каждого блока редактируется.
        </p>

        {sections.length === 0 && (
          <div className="text-center text-sm text-gray-500 border border-dashed border-space-700 rounded-xl p-6">
            Пока здесь пусто. Нажмите «Добавить раздел», чтобы создать первую заметку.
          </div>
        )}

        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-space-800 border border-space-600 rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-space-900">
                <input
                  className="flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-gray-600"
                  value={section.title}
                  onChange={(e) =>
                    handleUpdateNoteSectionTitle(section.id, e.target.value)
                  }
                  placeholder="Заголовок заметки"
                />
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteNoteSection(section.id)}
                    className="ml-2 text-gray-500 hover:text-red-400"
                    aria-label="Удалить раздел"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <textarea
                className="w-full bg-space-800 px-4 py-3 text-sm text-gray-200 border-t border-space-700 outline-none resize-none min-h-[120px]"
                value={section.text}
                onChange={(e) =>
                  handleUpdateNoteSectionText(section.id, e.target.value)
                }
                placeholder="Текст заметки..."
              />
            </div>
          ))}
        </div>
      </div>
    );
  };


const shipConditions =
    ((ship as any).conditions ?? []) as { id: string; name: string; description?: string }[];

  const crewRoles =
    ((ship as any).crewRoles ?? []) as { id: string; role: string; name: string; notes?: string }[];

  const shipWeapons =
    ((ship as any).weapons ?? []) as {
      id: string;
      name: string;
      damage: string;
      range?: string;
      notes?: string;
    }[];

  const damagedModules = (ship as Ship).modules.filter((m) => m.status === 'damaged');
  const criticalModules = (ship as Ship).modules.filter((m) => m.status === 'critical');

 
  return (
    <div className="animate-in fade-in duration-500 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">

           {/* Общие параметры корабля */}
      <div className="bg-space-800 p-6 rounded-2xl border border-space-600 lg:col-span-1 space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Имя корабля</label>
          <input
            className="w-full bg-space-900 border border-space-600 rounded px-3 py-2 text-white"
            value={ship.name}
            onChange={(e) =>
              updateCharacter(c => ({
                ship: { ...(c.ship as Ship), name: e.target.value }
              }))
            }
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Класс корабля</label>
          <input
            className="w-full bg-space-900 border border-space-600 rounded px-3 py-2 text-white"
            value={ship.className}
            onChange={(e) =>
              updateCharacter(c => ({
                ship: { ...(c.ship as Ship), className: e.target.value }
              }))
            }
          />
        </div>
        {/* Бонус инициативы корабля */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">
            Бонус инициативы корабля
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-20 bg-space-900 border border-space-600 rounded px-3 py-2 text-white text-right"
              value={ship.initiativeBonus ?? 0}
              onChange={(e) => {
                const raw = Number(e.target.value);
                const val = Number.isNaN(raw) ? 0 : raw;
                updateCharacter(c => ({
                  ship: {
                    ...(c.ship as Ship),
                    initiativeBonus: val,
                  },
                }));
              }}
            />
            <button
              type="button"
              onClick={rollShipInitiative}
              className="flex-1 text-xs uppercase tracking-widest px-3 py-2 rounded-lg bg-space-700 hover:bg-space-600 text-white"
            >
              Кинуть инициативу корабля
            </button>
          </div>
        </div>
        {/* Топливо */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 uppercase mb-1">
            <span>Топливо</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateCharacter(c => ({
                  ship: {
                    ...(c.ship as Ship),
                    fuel: {
                      ...(c.ship as Ship).fuel,
                      current: Math.max(0, ((c.ship as Ship).fuel?.current ?? 0) - 1),
                    },
                  },
                }))
              }
              className="bg-space-700 p-1 rounded hover:bg-red-900/50 text-white text-xs"
            >
              -1
            </button>
            <div className="flex-1 bg-space-900 h-8 rounded-lg border border-space-700 relative overflow-hidden flex items-center justify-center">
              <div
                className="absolute left-0 top-0 h-full bg-amber-500/40 transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (((ship.fuel?.current ?? 0) / Math.max(1, ship.fuel?.max ?? 1)) * 100)
                  )}%`,
                }}
              />
              <span className="relative z-10 font-bold text-white">
                {ship.fuel?.current ?? 0} / {ship.fuel?.max ?? 0}
              </span>
            </div>
            <button
              onClick={() =>
                updateCharacter(c => ({
                  ship: {
                    ...(c.ship as Ship),
                    fuel: {
                      ...(c.ship as Ship).fuel,
                      current: Math.min(
                        (c.ship as Ship).fuel?.max ?? 0,
                        ((c.ship as Ship).fuel?.current ?? 0) + 1
                      ),
                    },
                  },
                }))
              }
              className="bg-space-700 p-1 rounded hover:bg-green-900/50 text-white text-xs"
            >
              +1
            </button>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-gray-400">
            <span>Максимум топлива</span>
            <input
              type="number"
              className="w-16 bg-space-900 border border-space-700 rounded px-2 py-1 text-xs text-white text-right"
              value={ship.fuel?.max ?? 0}
              onChange={(e) => {
                const raw = Number(e.target.value);
                const newMax = Number.isNaN(raw) ? 0 : Math.max(0, raw);
                updateCharacter(c => {
                  const s = c.ship as Ship;
                  const current = s.fuel?.current ?? 0;
                  return {
                    ship: {
                      ...s,
                      fuel: {
                        current: Math.min(current, newMax),
                        max: newMax,
                      },
                    },
                  };
                });
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
            <span>Прыжок</span>
            <button
              type="button"
              onClick={() =>
                updateCharacter(c => {
                  const s = c.ship as Ship;
                  const fuel = s.fuel ?? { current: 0, max: 0 };
                  return {
                    ship: {
                      ...s,
                      fuel: {
                        ...fuel,
                        current: Math.max(0, fuel.current - 1),
                      },
                    },
                  };
                })
              }
              className="px-3 py-1 rounded-lg bg-amber-600/80 hover:bg-amber-500 text-[11px] text-black font-semibold"
            >
              Совершить прыжок (-1 топливо)
            </button>
          </div>
        </div>

        {/* Корпус */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 uppercase mb-1">
            <span>Корпус (прочность)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateCharacter(c => ({
                  ship: {
                    ...(c.ship as Ship),
                    hull: {
                      ...(c.ship as Ship).hull,
                      current: Math.max(0, (c.ship as Ship).hull.current - 1),
                    },
                  },
                }))
              }
              className="bg-space-700 p-1 rounded hover:bg-red-900/50 text-white"
            >
              -
            </button>
            <div className="flex-1 bg-space-900 h-8 rounded-lg border border-space-700 relative overflow-hidden flex items-center justify-center">
              <div
                className="absolute left-0 top-0 h-full bg-mythic-red/40 transition-all"
                style={{ width: `${(ship.hull.current / ship.hull.max) * 100}%` }}
              />
              <span className="relative z-10 font-bold text-white">
                {ship.hull.current} / {ship.hull.max}
              </span>
            </div>
            <button
              onClick={() =>
                updateCharacter(c => ({
                  ship: {
                    ...(c.ship as Ship),
                    hull: {
                      ...(c.ship as Ship).hull,
                      current: Math.min(
                        (c.ship as Ship).hull.max,
                        (c.ship as Ship).hull.current + 1
                      ),
                    },
                  },
                }))
              }
              className="bg-space-700 p-1 rounded hover:bg-green-900/50 text-white"
            >
              +
            </button>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-gray-400">
            <span>Максимум корпуса</span>
            <input
              type="number"
              className="w-16 bg-space-900 border border-space-700 rounded px-2 py-1 text-xs text-white text-right"
              value={ship.hull.max}
              onChange={(e) => {
                const raw = Number(e.target.value);
                const newMax = Number.isNaN(raw) ? 1 : Math.max(1, raw);
                updateCharacter(c => ({
                  ship: {
                    ...(c.ship as Ship),
                    hull: {
                      ...(c.ship as Ship).hull,
                      max: newMax,
                      current: Math.min((c.ship as Ship).hull.current, newMax),
                    },
                  },
                }));
              }}
            />
          </div>
        </div>

        {/* Энергия */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 uppercase mb-1">
            <span>Энергия</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateCharacter(c => ({
                  ship: {
                    ...(c.ship as Ship),
                    energy: {
                      ...(c.ship as Ship).energy,
                      current: Math.max(0, (c.ship as Ship).energy.current - 1),
                    },
                  },
                }))
              }
              className="bg-space-700 p-1 rounded hover:bg-red-900/50 text-white"
            >
              -
            </button>
            <div className="flex-1 bg-space-900 h-8 rounded-lg border border-space-700 relative overflow-hidden flex items-center justify-center">
              <div
                className="absolute left-0 top-0 h-full bg-mythic-cyan/40 transition-all"
                style={{ width: `${(ship.energy.current / ship.energy.max) * 100}%` }}
              />
              <span className="relative z-10 font-bold text-white">
                {ship.energy.current} / {ship.energy.max}
              </span>
            </div>
            <button
              onClick={() =>
                updateCharacter(c => ({
                  ship: {
                    ...(c.ship as Ship),
                    energy: {
                      ...(c.ship as Ship).energy,
                      current: Math.min(
                        (c.ship as Ship).energy.max,
                        (c.ship as Ship).energy.current + 1
                      ),
                    },
                  },
                }))
              }
              className="bg-space-700 p-1 rounded hover:bg-green-900/50 text-white"
            >
              +
            </button>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-gray-400">
            <span>Максимум энергии</span>
            <input
              type="number"
              className="w-16 bg-space-900 border border-space-700 rounded px-2 py-1 text-xs text-white text-right"
              value={ship.energy.max}
              onChange={(e) => {
                const raw = Number(e.target.value);
                const newMax = Number.isNaN(raw) ? 1 : Math.max(1, raw);
                updateCharacter(c => ({
                  ship: {
                    ...(c.ship as Ship),
                    energy: {
                      ...(c.ship as Ship).energy,
                      max: newMax,
                      current: Math.min((c.ship as Ship).energy.current, newMax),
                    },
                  },
                }));
              }}
            />
          </div>
        </div>

        {/* Экипаж */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 uppercase mb-1">
            <span>Экипаж</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateCharacter(c => {
                  const ship = c.ship as Ship;
                  const current = ship.crew?.current ?? 0;
                  const max = ship.crew?.max ?? 0;
                  return {
                    ship: {
                      ...ship,
                      crew: {
                        current: Math.max(0, current - 1),
                        max,
                      },
                    },
                  };
                })
              }
              className="bg-space-700 p-1 rounded hover:bg-red-900/50 text-white"
            >
              -
            </button>
            <div className="flex-1 bg-space-900 h-8 rounded-lg border border-space-700 flex items-center justify-center">
              <span className="font-bold text-white">
                {(ship.crew?.current ?? 0)} / {(ship.crew?.max ?? 0)}
              </span>
            </div>
            <button
              onClick={() =>
                updateCharacter(c => {
                  const ship = c.ship as Ship;
                  const current = ship.crew?.current ?? 0;
                  const max = ship.crew?.max ?? 0;
                  return {
                    ship: {
                      ...ship,
                      crew: {
                        current: Math.min(max, current + 1),
                        max,
                      },
                    },
                  };
                })
              }
              className="bg-space-700 p-1 rounded hover:bg-green-900/50 text-white"
            >
              +
            </button>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-gray-400">
            <span>Максимум экипажа</span>
            <input
              type="number"
              className="w-16 bg-space-900 border border-space-700 rounded px-2 py-1 text-xs text-white text-right"
              value={ship.crew?.max ?? 0}
              onChange={(e) => {
                const raw = Number(e.target.value);
                const newMax = Number.isNaN(raw) ? 0 : Math.max(0, raw);
                updateCharacter(c => {
                  const ship = c.ship as Ship;
                  const current = ship.crew?.current ?? 0;
                  return {
                    ship: {
                      ...ship,
                      crew: {
                        current: Math.min(current, newMax),
                        max: newMax,
                      },
                    },
                  };
                });
              }}
            />
          </div>
        </div>
      </div>


      {/* Отсеки */}
      <div className="bg-space-800 p-6 rounded-2xl border border-space-600 lg:col-span-2">
        <div className="mb-6 pb-6 border-b border-space-700">
  <h3 className="text-white font-serif text-lg flex items-center gap-2 mb-3">
    Склад и Груз <Weight size={18} className="text-gray-400" />
  </h3>
  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">
    Содержимое склада (Заметки)
  </label>
  <textarea
    className="w-full bg-space-900 border border-space-700 rounded px-3 py-2 text-sm text-gray-200"
    rows={6}
    placeholder="Опишите, что хранится в грузовых отсеках корабля..."
    value={ship.cargoNotes || ''}
    onChange={(e) =>
      updateCharacter(c => ({
        ship: { ...(c.ship as Ship), cargoNotes: e.target.value }
      }))
    }
  />
</div>
        <div className="mb-6 pb-6 border-b border-space-700">
          <h3 className="text-white font-serif text-lg flex items-center gap-2 mb-3">
            Личная каюта
          </h3>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">
            Описание личной каюты (заметки)
          </label>
          <textarea
            className="w-full bg-space-900 border border-space-700 rounded px-3 py-2 text-sm text-gray-200"
            rows={4}
            placeholder="Опишите важные вещи, хранящиеся в личной каюте..."
            value={ship.personalCabinNotes || ''}
            onChange={(e) =>
              updateCharacter(c => ({
                ship: { ...(c.ship as Ship), personalCabinNotes: e.target.value }
              }))
            }
          />
        </div>

				<div className="flex items-center justify-between mb-4 gap-2">
          <h3 className="text-white font-serif text-lg flex items-center gap-2">
            Отсеки и модули
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRandomCriticalHit}
              className="text-[11px] uppercase tracking-widest px-3 py-1 rounded-lg border border-red-500/70 text-red-300 hover:bg-red-900/40"
            >
              Критический отсек
            </button>
            <button
              type="button"
              onClick={() =>
                updateCharacter((c) => ({
                  ship: {
                    ...(c.ship as Ship),
                    modules: [
                      ...(c.ship as Ship).modules,
                      {
                        id: generateId(),
                        name: 'Новый модуль',
                        type: 'module',
                        status: 'ok' as ShipModuleStatus,
                      },
                    ],
                  },
                }))
              }
              className="text-xs uppercase tracking-widest px-3 py-1 rounded-lg bg-space-700 hover:bg-space-600 text-white"
            >
              + Добавить модуль
            </button>
          </div>
        </div>

        {lastCriticalModule && (
          <div className="mb-3 bg-space-900/70 border border-red-500/40 rounded-xl px-3 py-2 text-[12px] text-gray-200">
            <div className="font-semibold text-red-400 mb-1">
              Последний критический урон
            </div>
            <div>
              Отсек:{' '}
              <span className="text-white">
                {lastCriticalModule.name || 'Без названия'}
              </span>
            </div>
            {lastCriticalModule.type && (
              <div className="text-[11px] text-gray-400 mt-1">
                Тип: {lastCriticalModule.type}
              </div>
            )}
            <div className="text-[11px] text-gray-500 mt-1">
              Статус отсека в списке модулей обновлён до «Критический».
            </div>
          </div>
        )}
        <div className="space-y-3">
                    {ship.modules.map((mod) => {
            const rulesHint = getModuleRulesSummary(mod.type);

            return (
              <div
                key={mod.id}
                className="bg-space-900/60 border border-space-700 rounded-xl px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <input
                      className="bg-space-900 border border-space-700 rounded px-2 py-1 text-xs text-white w-full"
                      value={mod.name}
                      onChange={(e) => handleModuleChange(mod.id, { name: e.target.value })}
                    />
                    <input
                      className="bg-space-900 border border-space-800 rounded px-2 py-1 text-[10px] text-gray-300 uppercase tracking-widest w-full"
                      value={mod.type}
                      onChange={(e) => handleModuleChange(mod.id, { type: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={mod.status}
                      onChange={(e) =>
                        handleModuleChange(mod.id, {
                          status: e.target.value as ShipModuleStatus,
                        })
                      }
                      className="bg-space-900 border border-space-600 rounded px-2 py-1 text-xs text-white"
                    >
                      <option value="ok">Норма</option>
                      <option value="damaged">Повреждён</option>
                      <option value="critical">Критический</option>
                    </select>
                  </div>
                </div>

                {rulesHint && (
                  <p className="mt-2 text-[11px] text-gray-400">
                    {rulesHint}
                  </p>
                )}

                <div className="mt-2 text-right">
                  <button
                    onClick={() =>
                      updateCharacter(c => ({
                        ship: {
                          ...(c.ship as Ship),
                          modules: (c.ship as Ship).modules.filter(m => m.id !== mod.id),
                        },
                      }))
                    }
                    className="text-red-500/80 hover:text-red-400 text-xs flex items-center gap-1 ml-auto"
                  >
                    <Trash2 size={12} /> Удалить модуль
                  </button>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

  // --- Helpers ---
  const updateCharacter = (updates: Partial<Character> | ((prev: Character) => Partial<Character>)) => {
    setCharacters(prevChars => prevChars.map(c => {
      if (c.id === activeCharId) {
        const newValues = typeof updates === 'function' ? updates(c) : updates;
        return { ...c, ...newValues };
      }
      return c;
    }));
  };
  // Перевод "сырого" веса предмета (weight из ShopItem/InventoryItem) в ячейки и человекочитаемый тип
  const getWeightSlots = (weight?: number): { baseSlots: number; typeLabel: string } => {
    const w = typeof weight === 'number' ? weight : 0;

    // Карта весов под твои типы:
    // 0.1–0.2  → маленький (0 ячеек)
    // 0.3–0.7  → лёгкий (0.5 яч.)
    // 0.8–1.5  → стандартный (1 яч.)
    // 2–3      → тяжёлый (2 яч.)
    // 4+       → громоздкий (4+ яч.)
    if (w <= 0.2) {
      return { baseSlots: 0, typeLabel: 'Маленький (0 ячеек)' };
    }
    if (w <= 0.7) {
      return { baseSlots: 0.5, typeLabel: 'Лёгкий (0.5 ячейки)' };
    }
    if (w <= 1.5) {
      return { baseSlots: 1, typeLabel: 'Стандартный (1 ячейка)' };
    }
    if (w <= 3) {
      return { baseSlots: 2, typeLabel: 'Тяжёлый (2 ячейки)' };
    }
    return { baseSlots: 4, typeLabel: 'Громоздкий (4+ ячейки)' };
  };

  // Снижение типа для надетой брони и одного оружия:
  // тяжёлый (2) → стандартный (1)
  // стандартный (1) → лёгкий (0.5)
  // лёгкий (0.5) → маленький (0)
  // громоздкий (4+) → тяжёлый (2)
   // --- Helpers ---
  const getDiscountedSlotsForEquipped = (baseSlots: number): number => {
    if (baseSlots >= 4) return 2;
    if (baseSlots >= 2) return 1;
    if (baseSlots >= 1) return 0.5;
    if (baseSlots > 0) return 0;
    return 0;
  };

  // Расчёт нагрузки для произвольного персонажа (норма + перегрузка)
  // Теперь считаем ВСЕ предметы, которые не лежат в личной каюте (storedInCabin !== true),
  // а скидка "предыдущего типа" применяется только к НАДЕТОЙ броне и одному самому тяжёлому оружию.
  const calculateLoadFor = (char: Character | null) => {
    if (!char) {
      return {
        current: 0,
        used: 0,
        max: 0,
        overloadMax: 0,
        isOverloaded: false,
      };
    }

    const bodyVal = char.attributes[AttributeName.BODY] || 1;
    const strengthSkill = char.skills.find((s) => s.name === 'Сила')?.value || 0;

    // Норма: телосложение * 2 + сила
    const maxSlots = bodyVal * 2 + strengthSkill;

    // Перегрузка: можно тащить до 2 * нормы
    const overloadMax = maxSlots * 2;

    const inventory = char.inventory || [];

    // Всё, что не в личной каюте — считается как "при себе" (рюкзак / на персонаже)
    const carriedItems = inventory.filter((item) => !item.storedInCabin);

    const weaponCategories: ItemCategory[] = [
      ItemCategory.MELEE,
      ItemCategory.RANGED,
      ItemCategory.PISTOLS,
      ItemCategory.CARABINS,
      ItemCategory.RIFLES,
      ItemCategory.SHOTGUNS,
      ItemCategory.HEAVYS,
    ];

    // Надетые предметы из того, что мы реально тащим
    const equippedCarriedItems = carriedItems.filter((item) => item.equipped);
    const equippedWeapons = equippedCarriedItems.filter((item) =>
      weaponCategories.includes(item.category as ItemCategory)
    );

    // ОДНО оружие из НАДЕТЫХ получает скидку — самое "тяжёлое"
    let discountedWeaponId: string | null = null;

    if (equippedWeapons.length > 0) {
      let maxWeaponSlots = -1;
      for (const w of equippedWeapons) {
        const { baseSlots } = getWeightSlots(w.weight);
        const totalForThis = baseSlots * (w.quantity || 1);
        if (totalForThis > maxWeaponSlots) {
          maxWeaponSlots = totalForThis;
          discountedWeaponId = w.id;
        }
      }
    }

    let usedSlots = 0;

    for (const item of carriedItems) {
      const { baseSlots } = getWeightSlots(item.weight);
      if (baseSlots <= 0) continue;

      const count = item.quantity || 1;
      let slots = baseSlots * count;

      const isArmor = item.category === ItemCategory.ARMOR && item.equipped;
      const isDiscountedWeapon = discountedWeaponId && item.id === discountedWeaponId;

      // Надетая броня и одно оружие — "предыдущий тип" по ячейкам
      if (isArmor || isDiscountedWeapon) {
        const discounted = getDiscountedSlotsForEquipped(baseSlots);
        slots = discounted * count;
      }

      usedSlots += slots;
    }

    const isOverloaded = usedSlots > maxSlots;
    const remainingNormal = Math.max(0, maxSlots - usedSlots);

    return {
      // current — оставшийся запас в пределах НОРМЫ
      current: remainingNormal,
      used: usedSlots,        // реально занято ячеек
      max: maxSlots,          // норма
      overloadMax,            // максимум с перегрузкой (норма * 2)
      isOverloaded,
    };
  };



  const calculateLoad = () => calculateLoadFor(character || null);


  const handleBuyItem = (shopItem: ShopItem) => {
  if (!character) return;

  if ((character.credits || 0) < shopItem.price) {
    alert('Недостаточно кредитов для покупки.');
    return;
  }

  const newItem: InventoryItem = {
    id: generateId(),
    name: shopItem.name,
    description: shopItem.description,
    quantity: 1,
    weight: shopItem.weight ?? 1,
    equipped: false,
    category: shopItem.category,
    price: shopItem.price,
    baseId: shopItem.id,
	    storedInCabin: false,
    modifiers: shopItem.modifiers,
    weaponStats: shopItem.weaponStats,
	 ammo: shopItem.weaponStats?.ammoCapacity,
	 storedInCabin: false,
  };

  const updatedInventory = [...character.inventory, newItem];

  updateCharacter({
    credits: (character.credits || 0) - shopItem.price,
    inventory: updatedInventory,
  });
};
const handleAddItemFromShop = (shopItem: ShopItem) => {
  if (!character) return;

  const newItem: InventoryItem = {
    id: generateId(),
    name: shopItem.name,
    description: shopItem.description,
    quantity: 1,
    weight: shopItem.weight ?? 1,
    equipped: false,
    category: shopItem.category,
    price: shopItem.price,
    baseId: shopItem.id,
    storedInCabin: false,
    modifiers: shopItem.modifiers,
    weaponStats: shopItem.weaponStats,
    ammo: shopItem.weaponStats?.ammoCapacity,
  };

  updateCharacter({
    inventory: [...character.inventory, newItem],
  });
};


  const openDiceModal = (attrName: string, attrVal: number, skillName: string, skillVal: number, isRed: boolean) => {
    setActiveRoll({ attrName, attrVal, skillName, skillVal, isRed });
    setDiceModalOpen(true);
  };
const downloadJson = (data: unknown, filename: string) => {
  const json = JSON.stringify(data, null, 2);

  // Если запускаемся как нативное приложение (Android/iOS) — используем Filesystem
  if (Capacitor.isNativePlatform()) {
    Filesystem.writeFile({
      path: filename,
      data: json,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    })
      .then(() => {
        alert(`Файл сохранён как ${filename} в каталоге Documents приложения.`);
      })
      .catch((e) => {
        console.error('Ошибка сохранения JSON через Filesystem', e);
        alert('Не удалось сохранить JSON-файл.');
      });

    return;
  }

  // Браузерный вариант (как у тебя было)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};



const handleExportCurrentCharacter = () => {
  if (!character) return;

  const safeName = (character.name || 'noname')
    .trim()
    .replace(/[^0-9a-zA-Zа-яА-ЯёЁ_\- ]/g, '_');

  downloadJson(character, `character-${safeName}.json`);
};


const handleExportAllCharacters = () => {
  if (!characters.length) {
    alert('Нет сохранённых персонажей.');
    return;
  }

  downloadJson(characters, 'characters-all.json');
};


  const handleClickImport = () => {
    fileInputRef.current?.click();
  };

  const handleImportCharacters = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        const parsed = JSON.parse(text);

        // Если в файле массив — считаем, что это несколько персонажей
        if (Array.isArray(parsed)) {
          const normalized: Character[] = parsed.map((c: any) => ({
            ...DEFAULT_CHARACTER,
            ...c,
            id: c.id || generateId(),
            attributes: { ...INITIAL_ATTRIBUTES, ...(c.attributes || {}) },
            reputation: { ...INITIAL_REPUTATION, ...(c.reputation || {}) },
            clanRelations: { ...INITIAL_CLAN_RELATIONS, ...(c.clanRelations || {}) },
            skills: c.skills && c.skills.length > 0 ? c.skills : DEFAULT_SKILLS
          }));

          setCharacters(normalized);
          if (normalized.length > 0) {
            setActiveCharId(normalized[0].id);
            setViewMode('sheet');
          }
        } else {
          // Если объект — это один персонаж
          const c: any = parsed;
          const normalized: Character = {
            ...DEFAULT_CHARACTER,
            ...c,
            id: c.id || generateId(),
            attributes: { ...INITIAL_ATTRIBUTES, ...(c.attributes || {}) },
            reputation: { ...INITIAL_REPUTATION, ...(c.reputation || {}) },
            clanRelations: { ...INITIAL_CLAN_RELATIONS, ...(c.clanRelations || {}) },
            skills: c.skills && c.skills.length > 0 ? c.skills : DEFAULT_SKILLS
          };

          setCharacters([normalized]);
          setActiveCharId(normalized.id);
          setViewMode('sheet');
        }
      } catch (error) {
        alert('Не удалось прочитать JSON: ' + (error as Error).message);
      }
    };

    reader.readAsText(file, 'utf-8');
    event.target.value = '';
  };

  const handleSpendWill = (amount: number) => {
    updateCharacter(c => ({
      energy: { ...c.energy, current: Math.max(0, c.energy.current - amount) }
    }));
  };
    const handleBuyWeapon = (weapon: ShopItem) => {
    if (!character) return;

    if (weapon.price == null) {
      alert('Этот предмет нельзя купить в магазине.');
      return;
    }

    const currentCredits = character.credits || 0;

    if (currentCredits < weapon.price) {
      alert('Недостаточно сверхкредитов для покупки.');
      return;
    }

 const newItem: InventoryItem = {
      id: generateId(),
      name: weapon.name,
      description: weapon.description,
      quantity: 1,
      equipped: false,
            category: weapon.category,
      price: weapon.price,
      modifiers: weapon.modifiers,
      weaponStats: weapon.weaponStats,
      weight: weapon.weight ?? 1,
      storedInCabin: false,

    };

    updateCharacter({
      credits: currentCredits - weapon.price,
      inventory: [...character.inventory, newItem],
    });
  };
  const handleAddShopItem = (item: ShopItem) => {
  if (!character) return;

  const itemNameForConfirm = (item.name || '').trim() || 'Предмет';
  if (!window.confirm(`Добавить «${itemNameForConfirm}» в инвентарь?`)) return;

  const newItem: InventoryItem = {
    id: generateId(),
    name: item.name,
    description: item.description,
    quantity: 1,
    equipped: false,
    category: item.category,
    price: item.price ?? 0,
    modifiers: item.modifiers,
    weaponStats: item.weaponStats,
    weight: item.weight ?? 1,
    storedInCabin: false,
  };

  updateCharacter({
    inventory: [...character.inventory, newItem],
  });
};


// --- Функция Импорта ---
const importCharacter = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const importedCharacter = JSON.parse(content);
      
      // Здесь должна быть логика валидации, но пока просто загружаем
      // Важно: Мы используем setCharacter для полной замены состояния
      setCharacter(importedCharacter); 
      setActiveTab('stats'); // Переключаем на вкладку статов после загрузки
      alert(`Персонаж "${importedCharacter.name}" успешно загружен!`);

    } catch (error) {
      console.error("Ошибка при чтении или парсинге JSON:", error);
      alert("Неверный формат файла JSON или ошибка при чтении.");
    }
  };

  reader.readAsText(file);
};
// --- Конец функции Импорта ---

  // --- Handlers ---
  const handleCreateNewClick = () => {
    setViewMode('creator');
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleCharacterCreated = (newChar: Character) => {
    setCharacters(prev => [...prev, newChar]);
    setActiveCharId(newChar.id);
    setViewMode('sheet');
  };

  const deleteCharacter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Вы уверены, что хотите удалить этого персонажа?")) {
      const newChars = characters.filter(c => c.id !== id);
      setCharacters(newChars);
      if (newChars.length > 0) {
        if (activeCharId === id) setActiveCharId(newChars[0].id);
      } else {
        setActiveCharId('');
        setViewMode('creator'); // If all deleted, go to creator
      }
    }
  };

  // Enforce 1-5 limit
  const updateAttribute = (attr: AttributeName, delta: number) => {
    updateCharacter(prev => ({
      attributes: {
        ...prev.attributes,
        [attr]: Math.max(1, Math.min(5, prev.attributes[attr] + delta))
      }
    }));
  };

  // --- Render Sections ---

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-space-900 border-r border-space-600 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static flex flex-col shadow-2xl`}>
      <div className="p-4 border-b border-space-600 flex items-center justify-between bg-space-900">
        <div className="flex items-center gap-2 text-mythic-red font-serif text-lg font-bold tracking-wider">
           <Dna className="w-6 h-6" /> ВЕРЕТЕНО
        </div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 p-2">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-space-900">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 font-serif">Досье</h3>
        {characters.map(char => (
          <div 
            key={char.id}
            onClick={() => {
              setActiveCharId(char.id);
              setViewMode('sheet'); // Ensure we go back to sheet if clicking a char
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
            className={`group relative p-3 rounded-lg border transition-all duration-200 cursor-pointer flex items-center justify-between ${char.id === activeCharId && viewMode === 'sheet' ? 'bg-space-800 border-mythic-red shadow-[inset_3px_0_0_0_#ef4444]' : 'bg-transparent border-transparent hover:bg-space-800 hover:border-space-700'}`}
          >
            <div className="min-w-0 pr-2">
              <div className={`font-medium truncate font-sans ${char.id === activeCharId && viewMode === 'sheet' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{char.name}</div>
              <div className="text-xs text-gray-600 truncate">{char.specialization}</div>
            </div>
			
            <button 
              onClick={(e) => deleteCharacter(char.id, e)}
              className="p-2 rounded text-gray-600 hover:bg-red-900/50 hover:text-red-400 transition-opacity z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
               <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
	  
      <div className="p-4 border-t border-space-600 bg-space-900">
         <button onClick={handleCreateNewClick} className="w-full py-2 bg-space-800 hover:bg-space-700 text-white border border-space-600 rounded flex items-center justify-center gap-2 transition-colors text-sm font-medium font-sans">
           <Plus size={16} /> Новое Досье
         </button>
      </div>
    </div>
  );
  const ATTRIBUTE_CHECK_LABEL: Record<AttributeName, string> = {
    [AttributeName.BODY]: 'Телосложения',
    [AttributeName.AGILITY]: 'Ловкости',
    [AttributeName.INTELLECT]: 'Интеллекта',
    [AttributeName.EMPATHY]: 'Эмпатии',
  };

    const AttributeCard = ({ attr, icon: Icon }: { attr: AttributeName, icon: any }) => {
    const val = character.attributes[attr];

    return (
      <div className="bg-space-900 p-4 rounded-xl border border-space-700 flex flex-col items-center relative overflow-hidden group">
        <div className="absolute top-1 right-1 opacity-10 text-mythic-red">
          <Icon size={48} />
        </div>

        <div className="z-10 text-gray-400 text-xs uppercase tracking-widest font-serif mb-1">
          {attr}
        </div>

        <div className="z-10 flex items-center gap-4">
          {isEditing && (
            <button
              type="button"
              onClick={() => updateAttribute(attr, -1)}
              className="text-gray-500 hover:text-white"
            >
              -
            </button>
          )}

          <span className="text-4xl font-bold text-white font-serif">{val}</span>

          {isEditing && (
            <button
              type="button"
              onClick={() => updateAttribute(attr, 1)}
              className="text-gray-500 hover:text-white"
            >
              +
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => openDiceModal(ATTRIBUTE_CHECK_LABEL[attr] ?? String(attr), val, '', 0, false)}
          className="z-10 mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium bg-space-800 border border-space-700 text-gray-300 hover:text-white hover:border-mythic-red transition"
        >
          <D20Icon size={14} />
          Бросок
        </button>

        <div className="text-[10px] text-gray-600 mt-1 uppercase">Характеристика</div>
      </div>
    );
  };

type SkillAbilityVariant = {
  title: string;
  description: string;
};

type SkillAbilityLevel = {
  A: SkillAbilityVariant;
  B: SkillAbilityVariant;
};

const SKILL_ABILITIES: Record<string, Record<number, SkillAbilityLevel>> = {
  'Ближний бой': {
    1: {
      A: {
        title: 'Фирменный подшаг',
        description: 'Короткая перебежка на ближнее расстояние для атаки в ближнем бою не тратит очков действия.',
      },
      B: {
        title: 'Всегда наготове',
        description:
          'Достать оружие ближнего боя в начале сражения не требует очков действия. Если оружие уже было готово к бою, вы получаете +4 к инициативе.',
      },
    },
    2: {
      A: {
        title: 'Бросок кобры',
        description:
          'Метание оружия ближнего боя теперь требует проверки ближнего боя, а не силы.',
      },
      B: {
        title: 'Вот это нож',
        description:
          'Значение урона от оружия ближнего боя добавляется в качестве модификатора при запугивании этим оружием.',
      },
    },
    3: {
      A: {
        title: 'Защитная стойка',
        description:
          'Вы получаете +2 к проверке ближнего боя при защите.',
      },
      B: {
        title: 'Берсерк',
        description:
          'Каждый противник, находящийся в эффективном радиусе вашего оружия ближнего боя, даёт +1 к броне.',
      },
    },
    4: {
      A: {
        title: 'Вихрь ударов',
        description:
          'Быстрые атаки имеют модификатор -1 вместо -2.',
      },
      B: {
        title: 'Пробивающие удары',
        description:
          'Атаки в ближнем бою игнорируют 2 брони цели.',
      },
    },
    5: {
      A: {
        title: 'Жажда крови',
        description:
          'Каждое попадание с нанесённым уроном даёт накапливающийся бонус +1 при атаках в ближнем бою. Отсутствие урона после атаки, передвижение или получение урона обнуляют накопленный бонус.',
      },
      B: {
        title: 'Разрушающий удар *',
        description:
          'При нанесении травмы сильным ударом вы можете дважды перебросить получившийся при проверке тяжести наносимой травмы результат и применить любой из выпавших результатов на выбор.',
      },
    },
  },

  'Сила': {
    1: {
      A: {
        title: 'Дай-ка мне',
        description:
          'Помогая другим персонажам в их проверках навыков с помощью силы, вы даёте бонус +2 вместо +1.',
      },
      B: {
        title: 'Пудовые кулаки',
        description:
          'Безоружные атаки и атаки метательным оружием наносят на 1 больше урона.',
      },
    },
    2: {
      A: {
        title: 'Становая тяга',
        description:
          'Вы получаете +3 к проверкам силы при попытках нести груз свыше допустимого.',
      },
      B: {
        title: 'Это легко',
        description:
          'Вы получаете 2 дополнительные ячейки снаряжения.',
      },
    },
    3: {
      A: {
        title: 'Угрожающий вид',
        description:
          'Вы можете использовать силу вместо влияния при запугивании.',
      },
      B: {
        title: 'Размашистые удары',
        description:
          'Вы можете использовать силу вместо ближнего боя, атакуя без оружия или импровизированным оружием.',
      },
    },
    4: {
      A: {
        title: 'Здоровяк',
        description:
          'Вы получаете +2 к максимальному здоровью.',
      },
      B: {
        title: 'Не упал *',
        description:
          'При падении здоровья до нуля вы проходите проверку силы. При успехе вы моментально приходите в себя и восстанавливаете здоровье, равное количеству успехов.',
      },
    },
    5: {
      A: {
        title: 'Всего лишь царапина *',
        description:
          'Вы можете поменять местами десятки и единицы при получении травмы.',
      },
      B: {
        title: 'Мышцы из стали *',
        description:
          'Пройдите проверку силы. На 3 раунда вы получаете дополнительную броню, равную количеству успехов.',
      },
    },
  },

  'Стрельба': {
    1: {
      A: {
        title: 'Самая быстрая рука в Славии',
        description:
          'Достать оружие дальнего боя в начале сражения не требует очков действия. Если оружие уже было готово к бою, вы получаете +4 к инициативе.',
      },
      B: {
        title: 'Добрым словом и пистолетом…',
        description:
          'Значение урона от оружия дальнего боя добавляется в качестве модификатора при запугивании этим оружием.',
      },
    },
    2: {
      A: {
        title: 'Скользящие передвижения',
        description:
          'Короткая перебежка один раз за ход для смены укрытия на ближней дистанции не тратит очков действия.',
      },
      B: {
        title: 'Крепкое плечо',
        description:
          'Поставить оружие в упор за укрытием становится свободным действием.',
      },
    },
    3: {
      A: {
        title: 'Контрольный выстрел',
        description:
          'Первый за раунд выстрел навскидку по цели без укрытия игнорирует штраф -2.',
      },
      B: {
        title: 'Меткий глаз',
        description:
          'Штраф за дистанцию до цели и её размер не может быть меньше -1. Эффективная дальность оружия при этом учитывается как обычно.',
      },
    },
    4: {
      A: {
        title: 'Быстрая перезарядка',
        description:
          'Перезарядка оружия дальнего боя становится быстрым действием.',
      },
      B: {
        title: 'Готов ко всему',
        description:
          'Смена оружия становится свободным действием.',
      },
    },
    5: {
      A: {
        title: 'Снайперский огонь',
        description:
          'Каждый прицельный выстрел по одной и той же цели даёт накапливающийся модификатор +2 на следующий прицельный выстрел. Смена цели, передвижение и получение урона обнуляют накопленный бонус.',
      },
      B: {
        title: 'Целься в голову *',
        description:
          'При проведении проверки стрельбы считается, что у вас уже есть два успеха ещё до броска кубов.',
      },
    },
  },

  'Проворство': {
    1: {
      A: {
        title: 'Салки',
        description:
          'Вы получаете +2 ко всем проверкам проворства при погонях.',
      },
      B: {
        title: 'Широкий шаг',
        description:
          'Скорость вашего персонажа увеличена на 2.',
      },
    },
    2: {
      A: {
        title: 'Уклонение от ударов',
        description:
          'Раз в ход вы можете попробовать уклониться от атаки в ближнем бою свободным действием, успешно пройдя проверку проворства.',
      },
      B: {
        title: 'Уклонение от выстрелов',
        description:
          'Раз в ход вы можете попробовать уклониться от выстрела в секторе обстрела свободным действием, успешно пройдя проверку проворства.',
      },
    },
    3: {
      A: {
        title: 'Удары по касательной',
        description:
          'Если вы носите лёгкую броню или не носите её вовсе, вы получаете дополнительно +1 к броне.',
      },
      B: {
        title: 'Бей первым',
        description:
          'Если вы носите лёгкую броню или не носите её вовсе, вы получаете дополнительно +4 к инициативе.',
      },
    },
    4: {
      A: {
        title: 'Перекаты',
        description:
          'Получив урон, вы свободным действием можете сменить свою позицию, передвинувшись на близкое расстояние.',
      },
      B: {
        title: 'В два прыжка',
        description:
          'Первым передвижением за ход вы можете пройти вдвое большее расстояние.',
      },
    },
    5: {
      A: {
        title: 'Мастер уворотов *',
        description:
          'Вы гарантированно уклоняетесь от любого урона, даже после броска кубиков противником.',
      },
      B: {
        title: 'Акробат *',
        description:
          'Вы мастерски преодолеваете любое препятствие, требующее проверки проворства. При проведении проверки проворства считается, что у вас уже есть два успеха ещё до броска кубов.',
      },
    },
  },

  'Скрытность': {
    1: {
      A: {
        title: 'Вы этого не видели',
        description:
          'Вы получаете +3 к скрытности при попытках скрыть своё оружие или снаряжение.',
      },
      B: {
        title: 'Мелкий воришка',
        description:
          'Вы получаете +1 к скрытности при воровстве мелких и лёгких предметов из инвентаря другого персонажа.',
      },
    },
    2: {
      A: {
        title: 'Лёгкий шаг',
        description:
          'Вы передвигаетесь с полной скоростью, находясь в скрытности.',
      },
      B: {
        title: 'Ночник',
        description:
          'Вы получаете +2 к проверкам скрытности против спящих или уставших персонажей.',
      },
    },
    3: {
      A: {
        title: 'Бесшумный убийца',
        description:
          'Вы можете использовать скрытность вместо ближнего боя при атаке из скрытности.',
      },
      B: {
        title: 'Мастер взлома',
        description:
          'Вы можете использовать скрытность вместо механики при взломе механических замков.',
      },
    },
    4: {
      A: {
        title: 'Кажется послышалось',
        description:
          'Находясь в скрытности, первое передвижение за ход является свободным действием.',
      },
      B: {
        title: 'Держитесь в моей тени',
        description:
          'Персонажи, крадущиеся рядом с вами, получают +2 к проверкам скрытности.',
      },
    },
    5: {
      A: {
        title: 'Сворачиватель шей',
        description:
          'Причинив урон здоровью при внезапной атаке, вы гарантированно наносите 4 дополнительного урона здоровью.',
      },
      B: {
        title: 'Пыль в глаза *',
        description:
          'Вы моментально пропадаете из поля зрения противника, перемещаясь свободным действием за ближайшее укрытие в радиусе средней дистанции.',
      },
    },
  },

  'Наблюдательность': {
    1: {
      A: {
        title: 'Соколиный взор',
        description:
          '+1 к проверкам наблюдательности на свету.',
      },
      B: {
        title: 'Совиный взор',
        description:
          '+1 к проверкам наблюдательности в темноте.',
      },
    },
    2: {
      A: {
        title: 'Дозорный',
        description:
          '+2 к проверкам наблюдательности, пока вы находитесь в дозоре.',
      },
      B: {
        title: 'Развитое периферийное зрение',
        description:
          'Вы игнорируете штраф -2 при поиске противника в условиях плохой видимости.',
      },
    },
    3: {
      A: {
        title: 'Мастер досмотра',
        description:
          'Проверки наблюдательности при осмотре или досмотре других персонажей в попытках найти импланты, скрытое оружие и подобные детали игнорируют отрицательные модификаторы.',
      },
      B: {
        title: 'Обмани меня',
        description:
          'Поговорив с персонажем более двух минут подряд, вы получаете +2 к проверкам наблюдательности для определения, лжёт вам собеседник или нет.',
      },
    },
    4: {
      A: {
        title: 'Аккуратнее, тут ловушка',
        description:
          '+2 к проверкам наблюдательности при попытках обнаружить ловушку.',
      },
      B: {
        title: 'Аккуратнее, тут засада',
        description:
          '+2 к проверкам наблюдательности при попытках обнаружить засаду.',
      },
    },
    5: {
      A: {
        title: 'Глаз-алмаз *',
        description:
          'Вы обнаруживаете важную улику или деталь, необходимую для решения текущей задачи или обхода препятствия.',
      },
      B: {
        title: 'Цельтесь в глаза! *',
        description:
          'Вы находите слабое место противника. Все, кто атакует его в это слабое место, игнорируют 2 брони цели и наносят на 1 урона больше в течение двух раундов.',
      },
    },
  },

  'Выживание': {
    1: {
      A: {
        title: 'Курсы первой помощи',
        description:
          'При стабилизации травм вы игнорируете штраф -1.',
      },
      B: {
        title: 'Следопыт',
        description:
          'Вы без проверок навыков можете определить, как давно был оставлен найденный след.',
      },
    },
    2: {
      A: {
        title: 'Тёртый калач',
        description:
          'Все воздействующие на вас отрицательные состояния (шок, кровотечение, отравление и т.п.) имеют силу на 1 меньше.',
      },
      B: {
        title: 'Единение с природой',
        description:
          '+4 к броне против ситуативного урона от окружающей среды.',
      },
    },
    3: {
      A: {
        title: 'Вместе мы сила',
        description:
          'Вы получаете +1 ко всем проверкам общих навыков, если на средней дистанции от вас есть как минимум два союзника.',
      },
      B: {
        title: 'Волк-одиночка',
        description:
          'Вы получаете +1 ко всем проверкам общих навыков, если на средней дистанции от вас нет союзников.',
      },
    },
    4: {
      A: {
        title: 'Я знаю короткий путь *',
        description:
          'Вы находите кратчайший путь до цели, сокращая его вдвое и избегая при этом случайных нежелательных встреч.',
      },
      B: {
        title: 'В укрытие! *',
        description:
          'Вы и ваша команда полностью избегаете угрозы и/или ситуативного урона от окружающей среды.',
      },
    },
    5: {
      A: {
        title: 'Второе дыхание *',
        description:
          'Вы «перезаряжаете» все активные способности.',
      },
      B: {
        title: 'Крепкий орешек *',
        description:
          'При получении травмы вы можете дважды перебросить результат проверки тяжести травмы и применить любой из выпавших результатов.',
      },
    },
  },

  'Влияние': {
    1: {
      A: {
        title: 'Это поможет освежить вашу память?',
        description:
          '+1 к проверкам влияния при попытках подкупа.',
      },
      B: {
        title: 'Я сейчас уйду',
        description:
          '+1 к проверкам влияния при торговле.',
      },
    },
    2: {
      A: {
        title: 'Я один из вас',
        description:
          'Штраф из-за разницы в репутации не может быть меньше -1.',
      },
      B: {
        title: 'Всё было не так *',
        description:
          'Вы умело скрываете своё последнее действие — оно не оказывает влияния на вашу репутацию.',
      },
    },
    3: {
      A: {
        title: 'Мастер запугивания',
        description:
          '+2 к проверкам влияния при попытках повлиять на волю другого персонажа.',
      },
      B: {
        title: 'Я рядом, если надо поговорить',
        description:
          'Вы можете использовать влияние вместо лидерства для воодушевления.',
      },
    },
    4: {
      A: {
        title: 'Ловелас',
        description:
          '+1 к проверкам влияния при взаимодействии с женщинами.',
      },
      B: {
        title: 'Свой в доску',
        description:
          '+1 к проверкам влияния при взаимодействии с мужчинами.',
      },
    },
    5: {
      A: {
        title: 'Ты выбрал не ту сторону *',
        description:
          'Вы уговариваете потерявшего волю противника-человека перейти на вашу сторону. Он восстанавливает половину от максимального значения воли (с округлением в большую сторону) и сражается за вас.',
      },
      B: {
        title: 'Не имей сто сверков… *',
        description:
          'Вы находите себе новых друзей, которые предоставят временный кров, поделятся информацией и т.п.',
      },
    },
  },

  'Пилотирование': {
    1: {
      A: {
        title: 'Догнать за 60 секунд',
        description:
          '+2 к проверкам пилотирования при погонях.',
      },
      B: {
        title: 'Аккуратный водитель',
        description:
          '+2 к проверкам пилотирования, когда требуется вести транспортное средство крайне аккуратно или скрытно.',
      },
    },
    2: {
      A: {
        title: 'Я сам своего рода учёный',
        description:
          'Вы можете использовать пилотирование вместо науки и наблюдательности в проверках, связанных с транспортными средствами.',
      },
      B: {
        title: 'Я лучше знаю свою ласточку',
        description:
          'Вы можете использовать пилотирование вместо механики и кибершаманства в проверках, связанных с транспортными средствами.',
      },
    },
    3: {
      A: {
        title: 'Гонщик',
        description:
          '+1 к скорости и манёвренности управляемого вами транспортного средства (+5 для наземного и воздушного транспорта).',
      },
      B: {
        title: 'Нет пробития',
        description:
          '+2 к броне у управляемого вами транспортного средства.',
      },
    },
    4: {
      A: {
        title: 'Ты слишком предсказуем *',
        description:
          'Успешно пройдя проверку пилотирования, вы угадываете следующий манёвр транспортного средства противника. Мастер сообщает вам, какой будет следующий ход противника.',
      },
      B: {
        title: 'У Сварога/Единого за пазухой',
        description:
          'Союзники, находящиеся в управляемом вами транспортном средстве, получают +2 к броне.',
      },
    },
    5: {
      A: {
        title: 'Ещё на ходу *',
        description:
          'При падении прочности управляемого вами транспортного средства до нуля вы проходите проверку пилотирования и восстанавливаете прочность, равную количеству успехов, но не менее 1.',
      },
      B: {
        title: 'Рикошет *',
        description:
          'Вы полностью избегаете урона от попадания по управляемому вами транспортному средству.',
      },
    },
  },

  'Кибершаманство': {
    1: {
      A: {
        title: 'Поиск на форумах',
        description:
          '+1 к проверкам кибершаманства при поиске информации в открытых источниках, не требующих прямого подключения к базе данных.',
      },
      B: {
        title: 'Я внутри',
        description:
          '+1 к проверкам кибершаманства при поиске информации в закрытых источниках, требующих прямого подключения к базе данных.',
      },
    },
    2: {
      A: {
        title: 'Разряд!',
        description:
          '+1 к проверкам при атаках разрядным оружием.',
      },
      B: {
        title: 'Прямо как в игре',
        description:
          'Вы можете использовать кибершаманство вместо пилотирования, управляя дронами, роботами и транспортом удалённо.',
      },
    },
    3: {
      A: {
        title: 'Человек из машины',
        description:
          '+1 к броне за каждый установленный имплант.',
      },
      B: {
        title: 'Как влитой',
        description:
          'Вы сразу привыкаете к установленному киберимпланту или протезу, без отрицательных модификаторов после установки.',
      },
    },
    4: {
      A: {
        title: 'Мастер-заговорщик',
        description:
          '+2 к проверкам кибершаманства при создании заговоров.',
      },
      B: {
        title: 'Под присмотром',
        description:
          'Вы можете отдавать приказы союзникам, используя кибершаманство вместо лидерства, если дистанционно помогаете им (наблюдаете через камеры и даёте указания).',
      },
    },
    5: {
      A: {
        title: 'Ты теперь мой друг *',
        description:
          'Вы внедряетесь в код роботизированного существа ниже 3 класса опасности, заставляя его сражаться за вас 3 раунда.',
      },
      B: {
        title: 'Кибершаманская легенда *',
        description:
          'Вы находите лазейку в любой программе. При проверке кибершаманства считается, что у вас уже есть два успеха ещё до броска кубов.',
      },
    },
  },

  'Механика': {
    1: {
      A: {
        title: 'Тяжёлый ключ',
        description:
          'Атакуя различными инструментами, вы получаете +1 к ближнему бою или стрельбе (в зависимости от механизма действия инструмента).',
      },
      B: {
        title: 'Синяя изолента',
        description:
          'Вы можете использовать запчасти вместо герметика.',
      },
    },
    2: {
      A: {
        title: 'Привычка к невесомости',
        description:
          'Находясь в условиях невесомости, вы получаете +1 ко всем проверкам навыков.',
      },
      B: {
        title: 'Экзотехник',
        description:
          'Находясь в экзоустройстве, вы получаете +2 к проверкам силы и проворности.',
      },
    },
    3: {
      A: {
        title: 'Подгонка брони *',
        description:
          'Вы подгоняете броню так, что игнорируете первые 2 критические неудачи, повреждающие броню.',
      },
      B: {
        title: 'Эта винтовка моя *',
        description:
          'Вы проводите техническое обслуживание оружия, давая ему временный статус «надёжное» до следующей перезарядки.',
      },
    },
    4: {
      A: {
        title: 'Получай, железяка',
        description:
          'Вы получаете +1 ко всем проверкам, атакуя или взаимодействуя с роботами, дронами и подобными механическими существами.',
      },
      B: {
        title: 'Дистанционный ремонт',
        description:
          'Вы можете использовать механику вместо пилотирования, управляя дронами, роботами и инженерными транспортными средствами.',
      },
    },
    5: {
      A: {
        title: 'Тысяча карманов *',
        description:
          'У вас в карманах всегда находится нужный в моменте лёгкий или мелкий инструмент или иной функциональный предмет снаряжения.',
      },
      B: {
        title: 'Золотые руки *',
        description:
          'При проверке механики считается, что у вас уже есть два успеха ещё до броска кубов.',
      },
    },
  },

  'Наука': {
    1: {
      A: {
        title: 'Я возьму образец',
        description:
          '+1 к проверкам науки при попытках добыть новые данные или образцы с помощью научных устройств.',
      },
      B: {
        title: 'Аналитик',
        description:
          '+1 к проверкам науки при попытках интерпретации данных на научных устройствах.',
      },
    },
    2: {
      A: {
        title: 'Я читал об этом *',
        description:
          'Вы можете использовать любой навык так, как будто его значение равно 2.',
      },
      B: {
        title: 'Холодный расчёт',
        description:
          'Вы получаете на 1 меньше урона воле от любого источника, но не меньше 1.',
      },
    },
    3: {
      A: {
        title: 'Практик',
        description:
          'Выберите четыре верхнеуровневых научных темы, в которых вы поверхностно, но хорошо разбираетесь, и получите +1 при проверках науки, связанных с этими темами.',
      },
      B: {
        title: 'Доктор наук',
        description:
          'Выберите две узкоспециализированные научные темы, в которых вы отлично разбираетесь, и получите +2 при проверках науки, связанных с этими темами.',
      },
    },
    4: {
      A: {
        title: 'Это работает вот так',
        description:
          '+2 к проверкам науки при попытках понять свойства артефактов и уникальных передовых технологий.',
      },
      B: {
        title: 'В мире животных',
        description:
          '+2 к проверкам науки при изучении естественной флоры и фауны.',
      },
    },
    5: {
      A: {
        title: 'Чертоги разума *',
        description:
          'Вы уходите в чертоги разума. Мастер помогает сопоставить имеющиеся у вас зацепки и информацию, создавая цельную картину или наводя на нужный путь для решения задачи.',
      },
      B: {
        title: 'Знание — сила',
        description:
          'Вы получаете +2 к проверке всех навыков при любом взаимодействии с полностью изученными представителями флоры и фауны.',
      },
    },
  },

  'Знахарство': {
    1: {
      A: {
        title: 'Травматолог',
        description:
          'Вы игнорируете отрицательные модификаторы тяжести травм при их лечении.',
      },
      B: {
        title: 'И это пройдёт',
        description:
          'Время выздоровления от травм и болезней вылеченного вами персонажа уменьшается ещё вполовину.',
      },
    },
    2: {
      A: {
        title: 'Психолог',
        description:
          'Вы можете использовать знахарство вместо лидерства, вдохновляя персонажей.',
      },
      B: {
        title: 'Он еле дышит',
        description:
          'Успешно пройдя проверку знахарства, вы определяете точное текущее значение здоровья персонажа, потратив на это быстрое действие.',
      },
    },
    3: {
      A: {
        title: 'Сожми руку в кулак',
        description:
          'Применив лечение к союзнику с использованием расходного предмета, восстанавливающего здоровье, вы даёте ему +2 к броне на 3 раунда.',
      },
      B: {
        title: 'Точная дозировка',
        description:
          'Применив лечение к союзнику с использованием расходного предмета, восстанавливающего здоровье, вы даёте ему +1 к проверкам общих навыков на 3 раунда.',
      },
    },
    4: {
      A: {
        title: 'Побить по щекам',
        description:
          'Успешно вылечив персонажа, вы также снимаете с него все кратковременные отрицательные эффекты (шок, оглушение, кровотечение и т.п.).',
      },
      B: {
        title: 'Транспортировка раненых',
        description:
          'Перенос людей или схожих по размеру персонажей без сознания не требует проверки силы.',
      },
    },
    5: {
      A: {
        title: 'Быстрое лечение',
        description:
          'Любое лечение тратит на одно очко действия меньше.',
      },
      B: {
        title: 'Не в мою смену *',
        description:
          'При проверке знахарства считается, что у вас уже есть два успеха ещё до броска кубов.',
      },
    },
  },

  'Лидерство': {
    1: {
      A: {
        title: 'Полевой командир',
        description:
          '+1 к проверкам лидерства при отдаче приказов на открытых пространствах.',
      },
      B: {
        title: 'Командир штурмового отряда',
        description:
          '+1 к проверкам лидерства при отдаче приказов в закрытых помещениях.',
      },
    },
    2: {
      A: {
        title: 'У тебя всё получится!',
        description:
          'Вдохновлённый вами персонаж, восстановивший волю, получает +1 к проверкам всех навыков на следующие 3 раунда.',
      },
      B: {
        title: 'Держись!',
        description:
          'Вдохновлённый вами персонаж, восстановивший волю, получает +1 к броне на следующие 3 раунда.',
      },
    },
    3: {
      A: {
        title: 'Продвигаемся дальше!',
        description:
          'Убив или обезвредив врага, ваш союзник восстанавливает 1 единицу воли.',
      },
      B: {
        title: 'Ну что там?',
        description:
          'Успешно пройдя проверку лидерства, вы можете помочь союзнику в проверке профессионального навыка, которым вы сами не обладаете.',
      },
    },
    4: {
      A: {
        title: 'Стратегическое командование',
        description:
          '+2 к проверке лидерства при отдаче приказа, но приказ становится продолжительным действием.',
      },
      B: {
        title: 'Тактическое командование',
        description:
          '-2 к проверке лидерства при отдаче приказа, но приказ становится быстрым действием.',
      },
    },
    5: {
      A: {
        title: 'Всем занять свои позиции! *',
        description:
          'В начале боя вы свободным действием указываете союзникам позиции в радиусе одного действия движения. Перемещение на эти позиции в свой ход является для них свободным действием.',
      },
      B: {
        title: 'Ну-ка, все вместе! *',
        description:
          'Вы вдохновляете всю команду, давая каждому +1 к первым трём проверкам навыков.',
      },
    },
  },

  'Культура': {
    1: {
      A: {
        title: 'Рубаха-парень',
        description:
          'Вы можете использовать культуру вместо влияния, общаясь с обычными людьми.',
      },
      B: {
        title: 'Знание манер',
        description:
          'Вы можете использовать культуру вместо влияния, общаясь с элитой общества.',
      },
    },
    2: {
      A: {
        title: 'Вижу в людях только хорошее',
        description:
          'Успешно пройдя проверку культуры, вы узнаёте все положительные черты персонажа-человека.',
      },
      B: {
        title: 'У всех свои недостатки',
        description:
          'Успешно пройдя проверку культуры, вы узнаёте все негативные черты персонажа-человека.',
      },
    },
    3: {
      A: {
        title: 'Антиквар',
        description:
          '+2 к проверкам культуры при попытках идентификации артефактов.',
      },
      B: {
        title: 'Мифолог',
        description:
          '+2 к проверкам культуры при попытках идентификации сущностей Веретена.',
      },
    },
    4: {
      A: {
        title: 'Наследие предков',
        description:
          'Использование вами артефактов Древних даёт Мастеру на 1 жетон Чернобога меньше, вплоть до нуля.',
      },
      B: {
        title: 'Я вас не боюсь',
        description:
          'Вы получаете на 1 меньше урона здоровью и воле от существ Веретена и Древних (но не меньше 1).',
      },
    },
    5: {
      A: {
        title: 'Благословитель *',
        description:
          'Вы благословляете союзника, и он получает +3 к следующей проверке навыка.',
      },
      B: {
        title: 'Судьба — не случайность *',
        description:
          'Выбираете любой из брошенных вами кубов и переворачиваете его другой стороной, используя новое значение.',
      },
    },
  },
};
type WitchcraftAbility = {
  level: number;
  name: string;
  description: string;
};

const WITCHCRAFT_BRANCHES: Record<string, WitchcraftAbility[]> = {
  Манипулятор: [
    {
      level: 1,
      name: 'Забывчивость',
      description:
        'Вы оглушаете персонажа в радиусе вашей видимости на один ход в бою за каждый успех или заставляете его забыть какую-то незначительную, рутинную вещь, которую он хотел сделать в обычной жизни.',
    },
    {
      level: 2,
      name: 'Телепатическое общение',
      description:
        'Вы можете нашёптывать персонажу, которого вы знаете, свои мысли на любом расстоянии от него, а он может на них отвечать. Если персонаж не хочет с вами разговаривать — сеанс связи прекратится по его желанию.',
    },
    {
      level: 3,
      name: 'Устрашение',
      description:
        'Вы подавляете волю противника, заставляя бояться вас. Вы оказываете воздействие на волю персонажа, сила которого равна удвоенному значению количества успехов.',
    },
    {
      level: 4,
      name: 'Вселение',
      description:
        'Вы вселяетесь в разум персонажа, которого вы видели до этого вживую, на любом расстоянии от него и можете видеть его глазами и слышать обрывки фраз, которые сейчас слышит он. Его мысли и эмоции при этом вам недоступны.',
    },
    {
      level: 5,
      name: 'Чтение мыслей',
      description:
        'Вы можете прочесть мысли персонажа на ближней дистанции. Они в основном поверхностны, импульсивны и сиюминутны, сокровенные желания и мотивы остаются недоступны.',
    },
  ],
  Кинетик: [
    {
      level: 1,
      name: 'Телекинез',
      description:
        'Вы получаете телекинетические способности, позволяющие поднимать лёгкие и мелкие предметы в воздух и управляемо передвигать их на средней дистанции, в том числе метая их во врагов.',
    },
    {
      level: 2,
      name: 'Фотокинез',
      description:
        'Вы гасите или зажигаете выбранные источники света в радиусе средней дистанции.',
    },
    {
      level: 3,
      name: 'Силовая волна',
      description:
        'Вы генерируете конусообразный поток энергии, наносящий урон стоящим перед вами на ближней дистанции противникам. Урон и дополнительные успехи можно распределить между целями. Модификатор +1, урон 5, критический урон 3, противники сбиваются с ног.',
    },
    {
      level: 4,
      name: 'Силовой барьер',
      description:
        'Вы создаёте перед собой неподвижное прозрачное энергетическое поле примерно 1×1 м, выступающее в роли укрытия с бронёй 5. Дополнительные успехи можно потратить, чтобы увеличить броню или размер поля.',
    },
    {
      level: 5,
      name: 'Морок',
      description:
        'Вы создаёте иллюзию, морок, полностью повторяющий текущее положение вашего персонажа. При первом физическом контакте морок рассеивается с лёгким дымком.',
    },
  ],
  Экзорцист: [
    {
      level: 1,
      name: 'Порча',
      description:
        'Вы накладываете порчу на персонажа в радиусе вашей видимости. Следующие несколько его проверок навыков (по количеству успехов) получают модификатор −3.',
    },
    {
      level: 2,
      name: 'Защитный круг',
      description:
        'Вы очерчиваете вокруг себя круг. Все персонажи в пределах круга получают бонус к броне против сущностей Веретена, равный количеству успехов.',
    },
    {
      level: 3,
      name: 'Чудесное прикосновение',
      description:
        'Вы генерируете направленную положительную энергию через прямое касание. Она наносит урон существам Веретена, игнорируя их броню, или лечит вас/союзников. Величина урона или лечения равна количеству успехов.',
    },
    {
      level: 4,
      name: 'Изгнание',
      description:
        'Взяв персонажа в захват, вы можете провести ритуал экзорцизма, изгоняя вселившуюся сущность, или нанести серьёзный урон воле сущности Веретена, равный удвоенному количеству успехов.',
    },
    {
      level: 5,
      name: 'Освобождение силы',
      description:
        'Вы высвобождаете энергию на ближней дистанции с мощностью, равной удвоенному количеству успехов проверки. Сущности Веретена, получившие урон, воспламеняются с силой, равной половине количества успехов (округляя в большую сторону).',
    },
  ],
  Ясновидец: [
    {
      level: 1,
      name: 'Сверхъестественное чутьё',
      description:
        'Вы чувствуете, грозит ли вам непосредственная опасность в ближайшие несколько минут. Чем больше успехов, тем точнее источник и характер угрозы.',
    },
    {
      level: 2,
      name: 'Общение с духами',
      description:
        'Вы обращаетесь к духам предков и можете задать несколько вопросов по количеству успехов. Духи отвечают «да» или «нет», но могут промолчать, если ответ неоднозначен или повредит вам.',
    },
    {
      level: 3,
      name: 'Познание',
      description:
        'Погрузившись в транс, вы постигаете значение артефакта и можете задать Мастеру вопросы по количеству успехов проверки ведовства, на которые Мастер должен ответить прямо.',
    },
    {
      level: 4,
      name: 'Выход из тела',
      description:
        'Ваш дух выходит из тела. В образе бестелесного существа вы можете передвигаться сквозь стены в радиусе дальней дистанции от тела. Вас не видят, но ощущают холодок. Вы видите и слышите происходящее, но не можете взаимодействовать физически.',
    },
    {
      level: 5,
      name: 'Ясновидение',
      description:
        'Погрузившись в транс, вы видите события выбранного временного отрезка в прошлом или будущем, как если бы находились в эпицентре. Чем шире отрезок и масштаб событий, тем гуще «туман» и менее чёткие детали.',
    },
  ],
};

const getSkillAbility = (skillName: string, level: number) =>
  SKILL_ABILITIES[skillName]?.[level];


  const SkillGroup = ({
  attr,
  skills,
  skillPowers,
  onChooseSkillPower,
  onResetSkillPowers,
  showUpgradeableOnly,
}: {
  attr: AttributeName;
  skills: Skill[];
  skillPowers: { [skillId: string]: { [level: number]: 'A' | 'B' } };
  onChooseSkillPower: (skillId: string, level: number, variant: 'A' | 'B') => void;
  onResetSkillPowers: (skillId: string) => void;
  showUpgradeableOnly: boolean;
}) => {
  if (!character) return null;

  const attrVal = character.attributes[attr] ?? 0;

  // Фильтр "показывать только навыки, которые ещё можно прокачать"
  const filteredSkills = skills.filter((skill) => {
    const maxLevels = Math.min(5, skill.value || 0);

    if (!showUpgradeableOnly) {
      return true;
    }

    if (maxLevels <= 0) {
      return false;
    }

    const chosenForSkill = skillPowers[skill.id] || {};

    // если есть хотя бы один уровень без выбранного варианта — навык ещё можно прокачивать
    for (let level = 1; level <= maxLevels; level += 1) {
      if (!chosenForSkill[level]) {
        return true;
      }
    }

    return false;
  });

    if (filteredSkills.length === 0) {
    return null;
  }

  // БЕЛЫЕ НАВЫКИ: доступны даже при 0, всегда считаются "белыми"
  const WHITE_SKILLS = [
    'Ближний бой',
    'Сила',
    'Стрельба',
    'Проворство',
    'Скрытность',
    'Наблюдательность',
    'Выживание',
    'Влияние',
  ];

  return (
    <div className="space-y-2">
      {filteredSkills.map((skill) => {
        const isWhiteBaseSkill = WHITE_SKILLS.includes(skill.name);
        const isWhite = isWhiteBaseSkill || skill.value > 0;

        const maxLevels = Math.min(5, skill.value || 0);
        const chosenForSkill = skillPowers[skill.id] || {};

        return (
          <div
            key={skill.id}
            className="bg-black/20 border border-space-700 rounded-xl p-3"
          >
            {/* Шапка строки навыка */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div
                  className={`text-sm font-medium ${
                    isWhite ? 'text-white' : 'text-mythic-red'
                  }`}
                >
                  {skill.name}
                </div>

                {skill.value > 0 && (
                  <div className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Sparkles size={10} />
                    <span>Особые слоты: {skill.value}</span>
                  </div>
                )}
              </div>

             <div className="flex items-center gap-3">
  <div className="flex items-center gap-1">
    {isEditing && (
      <button
        type="button"
        className="w-6 h-6 flex items-center justify-center rounded-full border border-space-700 text-xs text-gray-300 hover:bg-space-700 hover:text-white"
        onClick={() => {
          if (!character) return;
          const newValue = Math.max(0, (skill.value || 0) - 1);
          const newSkills = character.skills.map((s) =>
            s.id === skill.id ? { ...s, value: newValue } : s
          );
          updateCharacter({ skills: newSkills });
        }}
      >
        –
      </button>
    )}

    <span className="text-sm text-gray-200 font-mono w-6 text-center">
      {skill.value}
    </span>

    {isEditing && (
      <button
        type="button"
        className="w-6 h-6 flex items-center justify-center rounded-full border border-space-700 text-xs text-gray-300 hover:bg-space-700 hover:text-white"
        onClick={() => {
          if (!character) return;
          const newValue = Math.min(5, (skill.value || 0) + 1);
          const newSkills = character.skills.map((s) =>
            s.id === skill.id ? { ...s, value: newValue } : s
          );
          updateCharacter({ skills: newSkills });
        }}
      >
        +
      </button>
    )}
  </div>

  {/* Кнопка броска по навыку */}
  <button
    type="button"
    onClick={() =>
      openDiceModal(attr, attrVal, skill.name, skill.value, !isWhite)
    }
    className="w-8 h-8 flex items-center justify-center rounded-full border border-space-700 text-gray-300 hover:text-white hover:bg-space-700 transition-colors"
  >
    <D20Icon className="w-5 h-5" />
  </button>
</div>

            </div>

            {/* Блок выбранных способностей — ТОЛЬКО ПРОСМОТР, без выбора */}
            {maxLevels > 0 && (
              <div className="mt-2 pt-2 border-t border-space-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-gray-500 uppercase tracking-widest">
                    Выбранные способности
                  </span>
                  {Object.keys(chosenForSkill).length > 0 && (
                    <button
                      type="button"
                      onClick={() => onResetSkillPowers(skill.id)}
                      className="text-[11px] text-mythic-cyan hover:text-mythic-cyan/80"
                    >
                      Сбросить выбор
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  {Array.from({ length: maxLevels }, (_, index) => {
                    const level = index + 1;
                    const chosen = chosenForSkill[level];
                    const ability = getSkillAbility(skill.name, level);

                    return (
                      <div
                        key={level}
                        className="flex items-center justify-between gap-2 text-[11px]"
                      >
                        <span className="text-gray-400">Уровень {level}</span>
                        <span className="text-gray-300">
                          {chosen
                            ? chosen === 'A'
                              ? ability?.A?.title ?? 'Вариант A'
                              : ability?.B?.title ?? 'Вариант B'
                            : '— не выбрано —'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};



    const TraitList = ({
    title,
    traits,
    type,
  }: {
    title: string;
    traits: string[];
    type: 'pos' | 'neg';
  }) => (
    <div
      className={`p-4 rounded-xl border ${
        type === 'pos'
          ? 'bg-green-900/10 border-green-900/30'
          : 'bg-red-900/10 border-red-900/30'
      }`}
    >
      <h3
        className={`font-serif text-sm uppercase tracking-widest mb-2 ${
          type === 'pos' ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {title}
      </h3>
      {isEditing ? (
        <div className="space-y-2">
          {traits.map((trait, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                className="w-full bg-space-900 border border-space-600 rounded px-2 py-1 text-sm text-gray-200"
                defaultValue={trait}
                placeholder="Введите черту..."
                onBlur={(e) => {
                  const value = e.target.value.trim();

                  updateCharacter((prev) => {
                    const field =
                      type === 'pos' ? 'positiveTraits' : 'negativeTraits';
                    const currentList = [
                      ...(((prev as any)[field] as string[]) || []),
                    ];

                    // Если строку стерли — удаляем эту черту
                    if (!value) {
                      const filtered = currentList.filter(
                        (_t, i) => i !== idx,
                      );
                      return { [field]: filtered } as Partial<Character>;
                    }

                    currentList[idx] = value;
                    return { [field]: currentList } as Partial<Character>;
                  });
                }}
              />
              <button
                type="button"
                onClick={() => {
                  updateCharacter((prev) => {
                    const field =
                      type === 'pos' ? 'positiveTraits' : 'negativeTraits';
                    const currentList = [
                      ...(((prev as any)[field] as string[]) || []),
                    ];
                    const filtered = currentList.filter(
                      (_t, i) => i !== idx,
                    );
                    return { [field]: filtered } as Partial<Character>;
                  });
                }}
                className="text-gray-500 hover:text-red-400"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              updateCharacter((prev) => {
                const field =
                  type === 'pos' ? 'positiveTraits' : 'negativeTraits';
                const currentList = [
                  ...(((prev as any)[field] as string[]) || []),
                  '',
                ];
                return { [field]: currentList } as Partial<Character>;
              });
            }}
            className="text-xs text-gray-500 hover:text-white flex items-center gap-1"
          >
            + Добавить
          </button>
        </div>
      ) : (
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
          {traits.length === 0 && (
            <li className="text-gray-600 italic">Нет черт</li>
          )}
          {traits.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  );


  const renderStatsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Header Card (Bio) - Full Width */}
      <div className="lg:col-span-12 bg-space-800 p-6 rounded-2xl border border-space-600 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-mythic-red" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div>
             <label className="text-xs text-gray-500 uppercase tracking-widest mb-1 block font-serif">Имя</label>
             {isEditing ? (
               <input 
                 className="w-full bg-space-900 border border-space-600 rounded px-3 py-2 text-white"
                 value={character.name}
                 onChange={(e) => updateCharacter({ name: e.target.value })}
               />
             ) : <div className="text-2xl font-serif text-white tracking-wide">{character.name}</div>}
           </div>
           <div>
             <label className="text-xs text-gray-500 uppercase tracking-widest mb-1 block font-serif">Концепт</label>
             {isEditing ? (
               <input 
                 className="w-full bg-space-900 border border-space-600 rounded px-3 py-2 text-white"
                 value={character.concept}
                 onChange={(e) => updateCharacter({ concept: e.target.value })}
               />
             ) : <div className="text-white text-lg">{character.concept}</div>}
           </div>
           <div>
             <label className="text-xs text-gray-500 uppercase tracking-widest mb-1 block font-serif">Специализация</label>
             {isEditing ? (
               <input 
                 className="w-full bg-space-900 border border-space-600 rounded px-3 py-2 text-white"
                 value={character.specialization}
                 onChange={(e) => updateCharacter({ specialization: e.target.value })}
               />
             ) : <div className="text-mythic-red font-mono font-bold uppercase">{character.specialization}</div>}
           </div>
        </div>
        {/* Backstory Accordionish */}
        <div className="mt-4 pt-4 border-t border-space-700">
             <label className="text-xs text-gray-500 uppercase tracking-widest mb-1 block font-serif">История</label>
             {isEditing ? (
               <textarea 
                 className="w-full bg-space-900 border border-space-600 rounded px-3 py-2 text-white text-sm h-20"
                 value={character.backstory}
                 onChange={(e) => updateCharacter({ backstory: e.target.value })}
               />
             ) : <p className="text-gray-400 text-sm italic">{character.backstory}</p>}
        </div>
      </div>

      {/* 2. Attributes Row - 4 Columns */}
      <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
         <AttributeCard attr={AttributeName.BODY} icon={Activity} />
         <AttributeCard attr={AttributeName.AGILITY} icon={Wind} />
         <AttributeCard attr={AttributeName.INTELLECT} icon={Brain} />
         <AttributeCard attr={AttributeName.EMPATHY} icon={Handshake} />
      </div>

         {/* 3. Skills & Stats - Split Layout */}
      <div className="lg:col-span-8 space-y-6">
        {/* Skills Panel */}
        <div className="bg-space-800 p-6 rounded-2xl border border-space-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-serif text-lg flex items-center gap-2">
              <Sword className="w-5 h-5 text-mythic-red" /> Навыки
            </h3>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SkillGroup
              attr={AttributeName.BODY}
              skills={character.skills.filter(
                (s) => s.baseAttribute === AttributeName.BODY
              )}
              skillPowers={skillPowers}
              onChooseSkillPower={handleChooseSkillPower}
              onResetSkillPowers={handleResetSkillPowers}
              showUpgradeableOnly={showUpgradeableSkillsOnly}
            />
            <SkillGroup
              attr={AttributeName.AGILITY}
              skills={character.skills.filter(
                (s) => s.baseAttribute === AttributeName.AGILITY
              )}
              skillPowers={skillPowers}
              onChooseSkillPower={handleChooseSkillPower}
              onResetSkillPowers={handleResetSkillPowers}
              showUpgradeableOnly={showUpgradeableSkillsOnly}
            />
            <SkillGroup
              attr={AttributeName.INTELLECT}
              skills={character.skills.filter(
                (s) => s.baseAttribute === AttributeName.INTELLECT
              )}
              skillPowers={skillPowers}
              onChooseSkillPower={handleChooseSkillPower}
              onResetSkillPowers={handleResetSkillPowers}
              showUpgradeableOnly={showUpgradeableSkillsOnly}
            />
            <SkillGroup
              attr={AttributeName.EMPATHY}
              skills={character.skills.filter(
                (s) => s.baseAttribute === AttributeName.EMPATHY
              )}
              skillPowers={skillPowers}
              onChooseSkillPower={handleChooseSkillPower}
              onResetSkillPowers={handleResetSkillPowers}
              showUpgradeableOnly={showUpgradeableSkillsOnly}
            />

            {/* Special Skills */}
            <div className="md:col-span-2 mt-4 pt-4 border-t border-space-700">
              <h4 className="text-mythic-cyan text-xs uppercase tracking-widest mb-2 font-serif flex justify-between items-center">
                Особые Навыки (Открыты)
                {isEditing && (
                  <button
                    onClick={() =>
                      updateCharacter({
  skills: [
    ...character.skills,
    {
      id: generateId(),
      name: 'Новый навык',
      baseAttribute: 'Особое',
      value: 0,
      isSpecial: true,
    },
  ],
})

                    }
                    className="text-xs bg-space-700 px-2 py-1 rounded hover:bg-space-600 text-white"
                  >
                    + Добавить
                  </button>
                )}
              </h4>

              {character.skills
                .filter((s) => s.baseAttribute === 'Особое' || s.isSpecial)
                .map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-2 bg-space-900/50 rounded mb-2"
                  >
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          className="bg-transparent border-b border-space-600 text-sm text-white w-full"
                          value={skill.name}
                          onChange={(e) => {
                           const ns = character.skills.map((s) =>
  s.id === skill.id
    ? { ...s, name: e.target.value }
    : s
);
updateCharacter({ skills: ns });

                          }}
                        />
                      ) : (
                        <span className="text-sm text-mythic-gold">
                          {skill.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {isEditing && (
                        <button
                          onClick={() =>
                            updateCharacter({
                              skills: character.skills.filter(
                                (s) => s.id !== skill.id
                              ),
                            })
                          }
                          className="text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            {/* Faction relations */}
            <div className="mb-6">
              <h4 className="text-gray-500 text-xs uppercase tracking-widest mb-3 border-b border-space-700 pb-1">
                Отношения (Фракции)
              </h4>
              <div className="space-y-2">
                {Object.entries(character.reputation || INITIAL_REPUTATION).map(
                  ([key, val]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-300">{key}</span>
                      <div className="flex items-center gap-2">
                        {isEditing && (
                          <button
                            onClick={() => {
                              const current =
                                character.reputation || INITIAL_REPUTATION;
                              updateCharacter({
                                reputation: {
                                  ...current,
                                  [key]: (current as any)[key] - 1,
                                },
                              });
                            }}
                            className="text-gray-600 hover:text-red-400"
                          >
                            -
                          </button>
                        )}
                        <span
                          className={`font-mono w-8 text-center ${
                            (val as number) < 0
                              ? 'text-red-400'
                              : 'text-gray-500'
                          }`}
                        >
                          {val as number}
                        </span>
                        {isEditing && (
                          <button
                            onClick={() => {
                              const current =
                                character.reputation || INITIAL_REPUTATION;
                              updateCharacter({
                                reputation: {
                                  ...current,
                                  [key]: (current as any)[key] + 1,
                                },
                              });
                            }}
                            className="text-gray-600 hover:text-green-400"
                          >
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Clan relations */}
            <div>
              <h4 className="text-gray-500 text-xs uppercase tracking-widest mb-3 border-b border-space-700 pb-1">
                Отношения (Великие Кланы)
              </h4>
              <div className="space-y-2">
                {Object.entries(
                  character.clanRelations || INITIAL_CLAN_RELATIONS
                ).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-300">{key}</span>
                    <div className="flex items-center gap-2">
                      {isEditing && (
                        <button
                          onClick={() => {
                            const current =
                              character.clanRelations || INITIAL_CLAN_RELATIONS;
                            updateCharacter({
                              clanRelations: {
                                ...current,
                                [key]: (current as any)[key] - 1,
                              },
                            });
                          }}
                          className="text-gray-600 hover:text-red-400"
                        >
                          -
                        </button>
                      )}
                      <span
                        className={`font-mono w-8 text-center ${
                          (val as number) < 0
                            ? 'text-red-400'
                            : 'text-gray-500'
                        }`}
                      >
                        {val as number}
                      </span>
                      {isEditing && (
                        <button
                          onClick={() => {
                            const current =
                              character.clanRelations || INITIAL_CLAN_RELATIONS;
                            updateCharacter({
                              clanRelations: {
                                ...current,
                                [key]: (current as any)[key] + 1,
                              },
                            });
                          }}
                          className="text-gray-600 hover:text-green-400"
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 4. Right Sidebar (Vitals & Traits) */}
      <div className="lg:col-span-4 space-y-6">
         {/* HP/Energy */}
         <div className="bg-space-800 p-6 rounded-2xl border border-space-600">
             <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-xs text-gray-500 uppercase mb-1">
                     <span>Здоровье</span>
                     <span className="text-[10px] lowercase text-gray-600">(тело + ловкость)</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <button onClick={() => updateCharacter(c => ({ hp: { ...c.hp, current: Math.max(0, c.hp.current - 1) } }))} className="bg-space-700 p-1 rounded hover:bg-red-900/50 text-white">-</button>
                      <div className="flex-1 bg-space-900 h-8 rounded border border-space-700 relative overflow-hidden flex items-center justify-center">
                         <div className="absolute left-0 top-0 h-full bg-red-900/40 transition-all" style={{ width: `${(character.hp.current/character.hp.max)*100}%` }} />
                         <span className="relative z-10 font-bold text-white">{character.hp.current} / {character.hp.max}</span>
                      </div>
					   <button
                    onClick={() =>
                      openDiceModal(
                        'Здоровье',
                        character.hp.current, // количество кубов = текущее здоровье
                        '',
                        0,
                        false
                      )
                    }
                    className="mt-2 inline-flex items-center px-3 py-1 rounded-lg bg-space-700 hover:bg-space-600 text-[10px] uppercase tracking-widest text-mythic-gold"
                  >
                    <D20Icon size={16} className="mr-2" /> Бросок здоровья
                  </button>
                      <button onClick={() => updateCharacter(c => ({ hp: { ...c.hp, current: Math.min(c.hp.max, c.hp.current + 1) } }))} className="bg-space-700 p-1 rounded hover:bg-green-900/50 text-white">+</button>
                   </div>
                </div>
				
                <div>
                   <div className="flex justify-between text-xs text-gray-500 uppercase mb-1">
                     <span>Воля</span>
                     <span className="text-[10px] lowercase text-gray-600">(интеллект + эмпатия)</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <button onClick={() => updateCharacter(c => ({ energy: { ...c.energy, current: Math.max(0, c.energy.current - 1) } }))} className="bg-space-700 p-1 rounded hover:bg-red-900/50 text-white">-</button>
                      <div className="flex-1 bg-space-900 h-8 rounded border border-space-700 relative overflow-hidden flex items-center justify-center">
                         <div className="absolute left-0 top-0 h-full bg-indigo-500/20 transition-all" style={{ width: `${(character.energy.current/character.energy.max)*100}%` }} />
                         <span className="relative z-10 font-bold text-white">{character.energy.current} / {character.energy.max}</span>
                      </div>
					                    <button
                    onClick={() =>
                      openDiceModal(
                        'Воля',
                        character.energy.current, // количество кубов = текущая воля
                        '',
                        0,
                        false
                      )
                    }
                    className="mt-2 inline-flex items-center px-3 py-1 rounded-lg bg-space-700 hover:bg-space-600 text-[10px] uppercase tracking-widest text-mythic-gold"
                  >
                    <D20Icon size={16} className="mr-2" /> Бросок воли
                  </button>

                      <button onClick={() => updateCharacter(c => ({ energy: { ...c.energy, current: Math.min(c.energy.max, c.energy.current + 1) } }))} className="bg-space-700 p-1 rounded hover:bg-green-900/50 text-white">+</button>
                   </div>
                </div>
             </div>
         </div>
		                     <div className="bg-space-900 border border-space-700 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-gray-400 uppercase tracking-[0.2em]">
              БРОНЯ
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-400">
                {getArmorClass()}
              </span>
              <span className="text-xs text-gray-500">класс защиты</span>
            </div>
          </div>

          {character && (
            <div className="flex items-center gap-2">
              {/* СТАРАЯ РАБОЧАЯ КНОПКА — НЕ ТРОГАЕМ ЛОГИКУ */}
              <button
                type="button"
                onClick={() => {
                  handleInitiativeRoll();
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-space-700 hover:bg-space-600 text-xs font-medium text-gray-100 border border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
              >
                <D20Icon className="w-4 h-4" />
                Бросок брони
              </button>

              {/* НОВАЯ КНОПКА ТРАВМ */}
              <button
                type="button"
                onClick={() => setTraumaPanelOpen((prev) => !prev)}
                className="inline-flex items-center px-2 py-1 rounded-lg border border-space-600 text-[11px] text-gray-300 hover:bg-space-700"
              >
                Травмы
              </button>
            </div>
          )}
        </div>

        {/* ПАНЕЛЬ ТРАВМ — НИЖЕ, НЕ ПЕРЕКРЫВАЕТ КНОПКУ */}
        {traumaPanelOpen && character && (
          <div className="mt-2 bg-space-950/80 border border-space-700 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] text-gray-400 uppercase tracking-[0.2em]">
                Список травм
              </span>
              <button
                type="button"
                onClick={handleAddRandomTrauma}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-900/30 border border-amber-500/60 text-[11px] text-amber-300 hover:bg-amber-900/50"
              >
                <D20Icon className="w-3 h-3" />
                К66 травма
              </button>
            </div>

            {(!character.traumas || character.traumas.length === 0) && (
              <div className="text-[11px] text-gray-500">
                Травм нет. Нажмите «К66 травма», чтобы добавить результат броска 2d6 по таблице.
              </div>
            )}

            {character.traumas && character.traumas.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {character.traumas.map((trauma) => (
                  <div
                    key={trauma.id}
                    className="border border-space-700 rounded-md p-2 text-[11px] text-gray-200 bg-space-900/80"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="font-semibold">
                          {trauma.code} — {trauma.name}
                        </div>
                        <div className="mt-0.5 text-[10px] text-gray-400">
                          {trauma.effect}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-gray-500">
                          <span>Смерть: {trauma.death}</span>
                          {trauma.deadline !== '-' && (
                            <span>Крайний срок: {trauma.deadline}</span>
                          )}
                          {trauma.period !== '-' && (
                            <span>Период: {trauma.period}</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteTrauma(trauma.id)}
                        className="mt-0.5 text-gray-500 hover:text-red-400"
                        aria-label="Удалить травму"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>



                <div>
                  <div className="flex justify-between text-xs text-gray-500 uppercase mb-1">
                    <span>Инициатива</span>
                    <span className="text-[10px] lowercase text-gray-600">(Проворство + Инициатива оружия)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-space-900 h-8 rounded-full border border-space-700 relative overflow-hidden flex items-center justify-center text-xs text-gray-300">
                      {(() => {
                        const { agility, weaponInitiative } = getInitiativeValues();
                        const total = agility + weaponInitiative;
                        const iniText =
                          weaponInitiative >= 0
                            ? `+${weaponInitiative}`
                            : `${weaponInitiative}`;

                        return (
                          <>
                            <span className="relative z-10 font-bold text-white mr-2">
                              {total}
                            </span>
                            <span className="relative z-10 text-[10px] text-gray-500">
                              Проворство {agility} · Иниц. оружия {iniText}
                            </span>
                          </>
                        );
                      })()}
                    </div>

                                       <button
                      onClick={rollInitiative}
                      className="mt-2 inline-flex items-center p-1.5 px-3 rounded-full border border-mythic-gold/40 bg-space-800 hover:bg-space-600 text-[10px] uppercase tracking-widest text-mythic-gold"
                    >
                      <D20Icon size={14} className="mr-2" /> Кинуть инициативу
                    </button>

                  </div>
                </div>

                 {/* Traits */}
         <div className="bg-space-800 p-6 rounded-2xl border border-space-600 space-y-4">
            <TraitList
              title="Положительные черты"
              traits={character.positiveTraits || []}
              type="pos"
            />
            <TraitList
              title="Отрицательные черты"
              traits={character.negativeTraits || []}
              type="neg"
            />

            {/* Ведовство — сводка выбранных веток и доступных способностей */}
            {(() => {
              // ищем навык "Ведовство" у персонажа
              const witchSkill = character.skills.find(
                (s) => s.name === 'Ведовство'
              );
              const witchLevel = witchSkill?.value || 0;

              // ветки ведовства, выбранные для персонажа
              const chosenBranches: string[] =
                ((character as any).witchcraftBranches as string[]) || [];

              // если нет навыка, уровня или веток — ничего не показываем
              if (!witchSkill || witchLevel <= 0 || chosenBranches.length === 0) {
                return null;
              }

              // максимум две ветки — слева и справа
              const visibleBranches = chosenBranches.slice(0, 2);

              // собираем данные по каждой колонке
              const columns = visibleBranches.map((branch) => {
                const allAbilities =
                  (WITCHCRAFT_BRANCHES as any)[branch] || [];
                const unlocked = allAbilities.filter(
                  (a: any) => witchLevel >= a.level
                );
                return { branch, abilities: unlocked };
              });

              // если по уровню пока ничего не открыто — тоже не рисуем блок
              if (columns.every((col) => col.abilities.length === 0)) {
                return null;
              }

              return (
                <div className="pt-4 border-t border-space-700">
                  <div className="text-[11px] text-gray-500 uppercase tracking-widest mb-2">
                    Навыки ведовства
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {columns.map((col, idx) => (
                      <div key={col.branch || idx} className="space-y-1">
                        <div className="text-[11px] text-mythic-cyan uppercase tracking-widest truncate">
                          {col.branch}
                        </div>
                        {col.abilities.map((ability: any) => (
  <div
    key={ability.level}
    className="rounded-lg border border-space-700 bg-space-900 px-2 py-1"
  >
    <div className="text-[10px] text-gray-500">
      Уровень {ability.level}
    </div>
    <div className="text-[12px] text-gray-100">
      {ability.name}
    </div>

    {ability.description && (
      <div className="mt-1 text-[11px] text-gray-400 leading-snug">
        {ability.description}
      </div>
    )}
  </div>
))}

                      </div>
                    ))}

                    {/* если выбрана только одна ветка — вторая колонка-заглушка */}
                    {columns.length === 1 && (
                      <div className="opacity-40 text-[11px] text-gray-500 flex items-center justify-center text-center px-2">
                        Вторая ветка не выбрана
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
         </div>

      </div>

    </div>
  );
  
    const renderSkillsReferenceTab = () => {
  if (!character) return null;

  const modeBtnBase =
    'px-3 py-1 rounded-full border text-xs transition';
  const modeBtnActive =
    'border-mythic-cyan bg-mythic-cyan/10 text-mythic-cyan';
  const modeBtnIdle =
    'border-space-600 text-gray-200 hover:border-mythic-cyan hover:text-mythic-cyan';

  const skillEntries = Object.entries(SKILL_ABILITIES).filter(([skillName]) => {
    if (skillsReferenceMode === 'full') return true;

    const skill = character.skills.find((s) => s.name === skillName);
    const maxLevel = skill ? Math.min(5, skill.value || 0) : 0;

    // "Доступное": показываем только навыки, которые уже доступны персонажу
    return maxLevel > 0;
  });

  const witchSkill = character.skills.find((s) => s.name === 'Ведовство');
  const witchLevel = witchSkill?.value || 0;

  return (
    <div className="animate-in fade-in duration-500 pb-10 space-y-6">
      <div className="bg-space-800 p-6 rounded-2xl border border-space-600 shadow-xl">
        <h2 className="text-xl font-serif text-white mb-2">
          Навыки и особые способности
        </h2>

        <div className="flex flex-wrap gap-2 mt-3">
          <button
            type="button"
            onClick={() => setSkillsReferenceMode('available')}
            className={[
              modeBtnBase,
              skillsReferenceMode === 'available' ? modeBtnActive : modeBtnIdle,
            ].join(' ')}
          >
            Доступное
          </button>

          <button
            type="button"
            onClick={() => setSkillsReferenceMode('full')}
            className={[
              modeBtnBase,
              skillsReferenceMode === 'full' ? modeBtnActive : modeBtnIdle,
            ].join(' ')}
          >
            Полный
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-3">
          {skillsReferenceMode === 'available'
            ? 'Показываются только навыки и уровни, которые уже доступны вашему персонажу (уровни 1..рейтинг).'
            : 'Показываются все навыки и все уровни — как справочник.'}
        </p>
      </div>

      {skillEntries.map(([skillName, levels]) => {
        const skill = character.skills.find((s) => s.name === skillName);
        const maxLevel = skill ? Math.min(5, skill.value || 0) : 0;
        const chosenForSkill =
          skill && skillPowers[skill.id] ? skillPowers[skill.id] : {};

        const levelEntries = Object.entries(
          levels as Record<
            string,
            {
              A: { title: string; description: string };
              B: { title: string; description: string };
            }
          >
        ).sort(([a], [b]) => Number(a) - Number(b));

        const visibleLevelEntries =
          skillsReferenceMode === 'available'
            ? levelEntries.filter(([lvl]) => Number(lvl) <= maxLevel)
            : levelEntries;

        return (
          <div
            key={skillName}
            className="bg-space-800 p-4 rounded-2xl border border-space-600 space-y-3"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-serif text-white">{skillName}</h3>
                {skill ? (
                  <p className="text-xs text-gray-400">
                    Текущий рейтинг навыка: {skill.value}. Доступно уровней
                    способностей: {maxLevel}.
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    У персонажа пока нет этого навыка — блок работает только как
                    справочник.
                  </p>
                )}
              </div>

              {skill && Object.keys(chosenForSkill).length > 0 && (
                <button
                  type="button"
                  onClick={() => handleResetSkillPowers(skill.id)}
                  className="text-[11px] text-mythic-cyan hover:text-mythic-cyan/80"
                >
                  Сбросить выбор
                </button>
              )}
            </div>

            <div className="mt-3 space-y-3">
              {visibleLevelEntries.map(([levelStr, variants]) => {
                const level = Number(levelStr);
                const v = variants;
                const isUnlocked = maxLevel >= level;
                const chosen =
                  skill && chosenForSkill ? (chosenForSkill as any)[level] : undefined;

                const baseButtonClasses =
                  'w-full text-left rounded-xl border p-3 text-sm transition-colors';
                const disabledClasses =
                  'opacity-40 cursor-not-allowed border-space-800 bg-space-900';
                const selectableClasses =
                  'cursor-pointer border-space-700 hover:border-mythic-cyan/60 hover:bg-space-800';
                const chosenClasses =
                  'border-mythic-cyan bg-mythic-cyan/10 shadow-[0_0_0_1px_rgba(56,189,248,0.5)]';

                return (
                  <div
                    key={level}
                    className="border-top border-space-700 pt-3 space-y-2 border-t"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Уровень {level}
                        {skill && skillsReferenceMode === 'full' && (
                          <>
                            {' '}
                            {isUnlocked ? (
                              <span className="text-mythic-cyan">— доступен</span>
                            ) : (
                              <span className="text-gray-500">
                                — недоступен (требуется рейтинг {level})
                              </span>
                            )}
                          </>
                        )}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      {/* Вариант A */}
                      <button
                        type="button"
                        disabled={!skill || !isUnlocked}
                        onClick={() =>
                          skill &&
                          isUnlocked &&
                          handleChooseSkillPower(skill.id, level, 'A')
                        }
                        className={[
                          baseButtonClasses,
                          !skill || !isUnlocked ? disabledClasses : selectableClasses,
                          chosen === 'A' ? chosenClasses : '',
                        ].join(' ')}
                      >
                        <div className="text-[13px] font-semibold text-gray-100 mb-1">
                          {v.A.title}
                        </div>
                        <div className="text-[12px] text-gray-400 whitespace-pre-line">
                          {v.A.description}
                        </div>
                      </button>

                      {/* Вариант B */}
                      <button
                        type="button"
                        disabled={!skill || !isUnlocked}
                        onClick={() =>
                          skill &&
                          isUnlocked &&
                          handleChooseSkillPower(skill.id, level, 'B')
                        }
                        className={[
                          baseButtonClasses,
                          !skill || !isUnlocked ? disabledClasses : selectableClasses,
                          chosen === 'B' ? chosenClasses : '',
                        ].join(' ')}
                      >
                        <div className="text-[13px] font-semibold text-gray-100 mb-1">
                          {v.B.title}
                        </div>
                        <div className="text-[12px] text-gray-400 whitespace-pre-line">
                          {v.B.description}
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Ведовство — особая система */}
      {(skillsReferenceMode === 'full' || witchLevel > 0) &&
        (() => {
          const maxBranches = 2;
          const chosenBranches: string[] =
            ((character as any).witchcraftBranches as string[]) || [];

          const toggleBranch = (branch: string) => {
            if (!witchSkill) return;
            const current =
              (((character as any).witchcraftBranches as string[]) || []).slice();
            const index = current.indexOf(branch);
            if (index >= 0) {
              current.splice(index, 1);
            } else {
              if (current.length >= maxBranches) return;
              current.push(branch);
            }

            updateCharacter({
              ...({ witchcraftBranches: current } as any),
            });
          };

          return (
            <div className="bg-space-800 p-4 md:p-6 rounded-2xl border border-space-600 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-serif text-white">Ведовство</h3>
                  <p className="text-xs text-gray-400">
                    Навык ведовства работает иначе: вы выбираете до двух веток
                    (Манипулятор, Кинетик, Экзорцист, Ясновидец), и способности
                    в них открываются по уровню навыка.
                  </p>
                  {witchSkill ? (
                    <p className="text-xs text-gray-400 mt-1">
                      Текущий рейтинг ведовства: {witchLevel}.
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      У персонажа пока нет навыка «Ведовство» — блок работает как
                      справочник.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] text-gray-500 uppercase tracking-widest">
                  Ветки ведовства (максимум 2)
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(WITCHCRAFT_BRANCHES).map((branch) => {
                    const isChosen = chosenBranches.includes(branch);
                    const disabled =
                      !isChosen &&
                      (chosenBranches.length >= maxBranches ||
                        !witchSkill ||
                        witchLevel <= 0);

                    return (
                      <button
                        key={branch}
                        type="button"
                        disabled={disabled}
                        onClick={() => toggleBranch(branch)}
                        className={[
                          'px-3 py-1 rounded-full border text-xs transition',
                          disabled && !isChosen
                            ? 'border-space-700 text-gray-500 cursor-not-allowed'
                            : 'border-space-600 text-gray-200 hover:border-mythic-cyan hover:text-mythic-cyan',
                          isChosen
                            ? 'border-mythic-cyan bg-mythic-cyan/10 text-mythic-cyan'
                            : '',
                        ].join(' ')}
                      >
                        {branch}
                      </button>
                    );
                  })}
                </div>
                {!witchSkill && (
                  <p className="text-[11px] text-gray-500">
                    Чтобы выбирать ветки, добавьте навык «Ведовство» и повысьте его уровень.
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {chosenBranches.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    Ветки ещё не выбраны. По правилам вы можете открыть не более двух веток
                    ведовства, если у персонажа есть соответствующие положительные черты.
                  </p>
                ) : (
                  chosenBranches.map((branch) => {
                    const abilities = WITCHCRAFT_BRANCHES[branch] || [];
                    return (
                      <div
                        key={branch}
                        className="border-t border-space-700 pt-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-white">
                            {branch}
                          </h4>
                          <span className="text-[11px] text-gray-500">
                            Доступные способности зависят от уровня ведовства
                          </span>
                        </div>

                        <div className="space-y-2">
                          {abilities.map((ability) => {
                            const unlocked = witchLevel >= ability.level;
                            return (
                              <div
                                key={ability.level}
                                className={[
                                  'rounded-lg border p-3',
                                  unlocked
                                    ? 'border-mythic-cyan/50 bg-space-900'
                                    : 'border-space-700 bg-space-900/60 opacity-70',
                                ].join(' ')}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[11px] text-gray-500 uppercase tracking-widest">
                                    Уровень {ability.level}
                                  </span>
                                  <span
                                    className={
                                      unlocked
                                        ? 'text-[11px] text-mythic-cyan'
                                        : 'text-[11px] text-gray-500'
                                    }
                                  >
                                    {unlocked ? 'доступно' : 'требуется больший уровень'}
                                  </span>
                                </div>
                                <div className="text-[13px] font-semibold text-gray-100">
                                  {ability.name}
                                </div>
                                <div className="text-[12px] text-gray-400">
                                  {ability.description}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })()}
    </div>
  );
};




  
  const renderShopTab = () => {
    if (!character) return null;

    // Категории, как они описаны в constants/SHOP_ITEMS
    const sectionCategories: { key: ItemCategory; label: string }[] = [
      { key: ItemCategory.MELEE,     label: 'Ближний бой' },
      { key: ItemCategory.PISTOLS,   label: 'Пистолеты' },
      { key: ItemCategory.CARABINS,  label: 'Карабины' },
      { key: ItemCategory.RIFLES,    label: 'Винтовки' },
      { key: ItemCategory.SHOTGUNS,  label: 'Дробовики' },
      { key: ItemCategory.HEAVYS,    label: 'Тяжёлое оружие' },
      { key: ItemCategory.RANGED,    label: 'Прочее оружие' },
      { key: ItemCategory.ARMOR,     label: 'Броня' },
      { key: ItemCategory.EXPLOSIVE, label: 'Взрывчатка' },
      { key: ItemCategory.GEAR,      label: 'Снаряжение' },
      { key: ItemCategory.ELIXIR,    label: 'Эликсиры' },
    ];

    // Кнопки фильтра: "Все" + все категории
    const filterButtons: { key: 'all' | ItemCategory; label: string }[] = [
      { key: 'all', label: 'Все' },
      ...sectionCategories,
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif text-white flex items-center gap-2">
            <Coins className="text-mythic-red" />
            Магазин
          </h2>
          <div className="text-sm text-gray-300">
            Баланс:{' '}
            <span className="font-mono text-white">
              {character.credits || 0} ₡
            </span>
          </div>
        </div>

        {/* Горизонтальный фильтр по типам предметов */}
        <div className="flex flex-wrap gap-2 mt-2">
          {filterButtons.map(({ key, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => setShopCategoryFilter(key)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                shopCategoryFilter === key
                  ? 'bg-mythic-red text-white border-mythic-red shadow-[0_0_12px_rgba(248,113,113,0.6)]'
                  : 'bg-space-900 text-gray-300 border-space-700 hover:bg-space-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Секции магазина */}
        <div className="space-y-6 pt-2">
          {sectionCategories.map(({ key, label }) => {
            // Если выбран конкретный фильтр — показываем только эту категорию
            if (shopCategoryFilter !== 'all' && shopCategoryFilter !== key) {
              return null;
            }

            const items = SHOP_ITEMS.filter((i) => i.category === key);
            if (items.length === 0) return null;

            return (
              <div key={key} className="space-y-3">
                <h3 className="text-md font-semibold text-gray-200 flex items-center gap-2">
                  <span className="inline-block w-1 h-4 bg-mythic-red rounded-full" />
                  {label}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {items.map((item) => {
                    const canAfford = (character.credits || 0) >= item.price;

                    return (
                      <div
                        key={item.id}
                        className="bg-space-800 border border-space-600 rounded-xl p-4 flex flex-col justify-between shadow-md hover:border-mythic-red/60 hover:shadow-[0_0_25px_rgba(248,113,113,0.25)] transition-all"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-semibold text-white">
                                {item.name}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">
                                {item.description}
                              </div>
                            </div>
                            <div className="text-right text-sm">
                              <div className="text-mythic-gold font-mono">
                                {item.price} ₡
                              </div>
                            </div>
                          </div>

                          {item.modifiers && (
                            <div className="mt-2 text-[11px] text-gray-300 space-y-0.5">
                              {item.modifiers.energyBonus !== undefined &&
                                item.modifiers.energyBonus !== 0 && (
                                  <div>
                                    +{item.modifiers.energyBonus} к максимальной
                                    Энергии
                                  </div>
                                )}
                              {item.modifiers.attributeBonus && (
                                <div>
                                  {Object.entries(
                                    item.modifiers.attributeBonus
                                  ).map(([attr, bonus]) => (
                                    <span
                                      key={attr}
                                      className="inline-block mr-2"
                                    >
                                      +{bonus} к {attr}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {item.weaponStats && (
                            <div className="mt-1 text-[11px] text-gray-300 space-y-0.5">
                              <div>
                                Мод:{' '}
                                {formatSigned(item.weaponStats.modifier)} ·
                                Иниц.:{' '}
                                {formatSigned(item.weaponStats.initiative)}
                              </div>
                              <div>
                                Урон: {item.weaponStats.damage}
                                {item.weaponStats.crit !== null && (
                                  <> · Крит: {item.weaponStats.crit}</>
                                )}
                              </div>
                              {item.weaponStats.range !== null && (
                                <div>Дистанция: {item.weaponStats.range}</div>
                              )}
                              {item.weaponStats.properties.length > 0 && (
                                <div>
                                  Свойства:{' '}
                                  {item.weaponStats.properties.join(', ')}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
                         <div>
                            {(() => {
                              const { baseSlots, typeLabel } = getWeightSlots(item.weight);
                              return (
                                <>
                                  Вес: {typeLabel} · {baseSlots} яч.
                                </>
                              );
                            })()}
                          </div>

                                                   <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPendingPurchase(item)}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition ${
                                canAfford
                                  ? 'bg-mythic-red text-white hover:bg-red-500'
                                  : 'bg-space-800 text-gray-500 cursor-not-allowed'
                              }`}
                              disabled={!canAfford}
                            >
                              <Coins size={12} />
                              Купить
                            </button>

                            <button
                              type="button"
                              onClick={() => handleAddShopItem(item)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition bg-space-800 text-gray-200 hover:bg-space-700 border border-space-700 hover:border-mythic-red"
                            >
                              <Plus size={12} />
                              Добавить
                            </button>
                          </div>


                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };


   const renderInventoryTab = () => {
    const load = calculateLoad();
    const loadPercent =
      load.overloadMax && load.overloadMax > 0
        ? Math.min(100, (load.used / load.overloadMax) * 100)
        : 0;

    const loadBarClass =
      load.used <= load.max
        ? 'bg-gray-400'            // в пределах нормы
        : load.used <= load.overloadMax
          ? 'bg-yellow-500'        // перегрузка, но в допустимых пределах
          : 'bg-red-500';          // выше максимума (нельзя)



 
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 pb-10">
        <div className="lg:col-span-2 space-y-4">
           {/* Economy & Load Header */}
           <div className="bg-space-800 p-4 rounded-xl border border-space-600 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3 w-full md:w-auto">
                 <div className="p-2 bg-yellow-500/10 rounded-full text-yellow-500"><Coins size={20} /></div>
                 <div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">Сверхкредиты</div>
                    {isEditing ? (
                       <input 
                         type="number"
                         className="bg-space-900 border-b border-space-600 text-white font-mono w-32"
                         value={character.credits || 0}
                         onChange={(e) => updateCharacter({ credits: parseInt(e.target.value) || 0 })}
                       />
                    ) : <div className="text-xl font-mono text-white">{character.credits || 0} ₡</div>}
                 </div>
              </div>

                            <div className="flex-1 w-full md:mx-6">
                               <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Weight size={12} /> Нагрузка (ячейки)
                    </span>
                    <span>
                      {load.used} / {load.max}
                      {load.overloadMax > load.max && (
                        <span className="text-[11px] text-gray-500 ml-2">
                          макс. с перегрузкой: {load.overloadMax}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-space-900 h-2 rounded-full overflow-hidden border border-space-700">
                    <div
                      className={`h-full transition-all duration-300 ${loadBarClass}`}
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>

            
              </div>

           </div>

                      <h3 className="text-white font-serif text-lg mb-2 flex items-center gap-2">
              <Save className="w-5 h-5 text-mythic-red" /> Снаряжение
           </h3>
           <p className="text-xs text-gray-400 mb-4">
             Нажмите «Редактировать» у предмета, чтобы изменить его параметры и переместить его в личную каюту.
           </p>
           
           {character.inventory.map((item, index) => (

             <div key={item.id} className="flex items-start justify-between p-4 bg-space-800 rounded-xl border border-space-700 hover:border-space-600 transition-colors">
               <div className="flex gap-4 w-full">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors ${item.equipped ? 'bg-mythic-red text-white' : 'bg-space-900 text-gray-600 border border-space-700'}`}>
                    {item.equipped ? <Shield size={20} /> : <div className="text-[10px] uppercase font-bold">Вещь</div>}
                  </div>
                  
                  {isEditing ? (
                    <div className="flex-1 grid gap-2 mr-4">
                       <div className="flex gap-2">
                         <input 
                           className="flex-1 bg-space-900 border border-space-600 rounded px-2 py-1 text-white font-medium focus:border-mythic-red outline-none"
                           value={item.name}
                           onChange={(e) => {
                             const newInv = [...character.inventory];
                             newInv[index] = { ...item, name: e.target.value };
                             updateCharacter({ inventory: newInv });
                           }}
                           placeholder="Название"
                         />
                         <input 
                            type="number"
                            className="w-16 bg-space-900 border border-space-600 rounded px-2 py-1 text-gray-300 text-sm text-center focus:border-mythic-red outline-none"
                            value={item.quantity}
                            onChange={(e) => {
                              const newInv = [...character.inventory];
                              newInv[index] = { ...item, quantity: parseInt(e.target.value) || 1 };
                              updateCharacter({ inventory: newInv });
                            }}
                         />
                       </div>
                       <input 
                         className="w-full bg-space-900 border border-space-600 rounded px-2 py-1 text-gray-400 text-sm focus:border-mythic-red outline-none"
                         value={item.description}
                         onChange={(e) => {
                           const newInv = [...character.inventory];
                           newInv[index] = { ...item, description: e.target.value };
                           updateCharacter({ inventory: newInv });
                         }}
                         placeholder="Описание"
                       />
					           <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
          <span>Расположение:</span>
          <button
            type="button"
            className={
              'px-2 py-0.5 rounded border ' +
              (!item.storedInCabin
                ? 'border-mythic-cyan text-mythic-cyan bg-mythic-cyan/10'
                : 'border-space-700 text-gray-400 hover:border-space-500')
            }
            onClick={() => {
              if (!character) return;
              const newInv = character.inventory.map((i, idx) =>
                idx === index ? { ...i, storedInCabin: false } : i
              );
              updateCharacter({ inventory: newInv });
            }}
          >
            Рюкзак
          </button>
          <button
            type="button"
            className={
              'px-2 py-0.5 rounded border ' +
              (item.storedInCabin
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-space-700 text-gray-400 hover:border-space-500')
            }
            onClick={() => {
              if (!character) return;

              // Нельзя спрятать в каюту надетый предмет
              if (item.equipped) {
                alert('Сначала снимите предмет, прежде чем убирать его в личную каюту.');
                return;
              }

              const newInv = character.inventory.map((i, idx) =>
                idx === index ? { ...i, storedInCabin: true } : i
              );
              updateCharacter({ inventory: newInv });
            }}
          >
            Личная каюта
          </button>
        </div>

					                         

                    </div>
                                   ) : (
                    <div>
                      <h4 className="text-white font-medium text-lg font-serif">{item.name}</h4>
                      <p className="text-gray-400 text-sm">{item.description}</p>

      <div className="mt-1 text-[11px]">
        <span
          className={
            'inline-flex items-center px-2 py-0.5 rounded-full border ' +
            (!item.storedInCabin
              ? 'border-mythic-cyan text-mythic-cyan'
              : 'border-sky-500 text-sky-300')
          }
        >
          {!item.storedInCabin
            ? 'Рюкзак · учитывается в весе'
            : 'Личная каюта · не учитывается в весе'}
        </span>
      </div>

                      {item.weaponStats && (
                        <div className="mt-1 text-xs text-gray-400 space-y-0.5">
                          <div>
                            Мод: {formatSigned(item.weaponStats.modifier)} · Иниц.: {formatSigned(item.weaponStats.initiative)}
                          </div>
                          <div>
                            Урон: {item.weaponStats.damage}
                            {item.weaponStats.crit !== null && (
                              <> · Крит: {item.weaponStats.crit}</>
                            )}
                          </div>
                          {item.weaponStats.range !== null && (
                            <div>Дистанция: {item.weaponStats.range}</div>
                          )}
                          {item.weaponStats.properties.length > 0 && (
                            <div>Свойства: {item.weaponStats.properties.join(', ')}</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

               </div>
                                       {item.weaponStats && (
                                        <div className="mt-1 text-[11px] text-gray-300 flex items-center gap-2 flex-wrap">
                                          {/* Блок патронов и кнопок для оружия с магазином */}
                                          {item.weaponStats.ammoCapacity && (
                                            <>
                                              <span>Патроны:</span>
                                              {(() => {
                                                const capacity = item.weaponStats?.ammoCapacity ?? 0;
                                                const currentAmmo = item.ammo ?? capacity;

                                                return (
                                                  <>
                                                    <span className="font-mono">
                                                      {currentAmmo} / {capacity}
                                                    </span>

                                                    {/* Кнопка "Выстрел" */}
                                                    <button
                                                      onClick={() => {
                                                        if (!character) return;

                                                        const cap = item.weaponStats?.ammoCapacity ?? 0;
                                                        const ammoNow = item.ammo ?? cap;

                                                        if (ammoNow <= 0) {
                                                          alert('Патроны закончились. Нужно перезарядиться.');
                                                          return;
                                                        }

                                                        // --- Выбор количества очков действия игроком ---
                                                        const maxActions = 3;
                                                        const input = window.prompt(
                                                          'Сколько очков действия потратить на выстрел (0–3)?',
                                                          '1'
                                                        );

                                                        if (input === null) {
                                                          return;
                                                        }

                                                        let spentActions = parseInt(input, 10);

                                                        if (Number.isNaN(spentActions)) {
                                                          spentActions = 0;
                                                        }

                                                        if (spentActions < 0) spentActions = 0;
                                                        if (spentActions > maxActions) spentActions = maxActions;

                                                        if (spentActions === 0) {
                                                          alert('Нужно потратить хотя бы 1 очко действия для выстрела.');
                                                          return;
                                                        }

                                                                                                             // --- Модификаторы стрельбы и оружия ---
                                                        const agility =
                                                          character.attributes[AttributeName.AGILITY] || 0;

                                                        const shootingMod =
                                                          character.skills.find(
                                                            (s) => s.name === 'Стрельба'
                                                          )?.value ?? 0;

                                                        const weaponMod = item.weaponStats?.modifier ?? 0;

                                                        // Базовый пул: Ловкость + Стрельба + мод. оружия
                                                        const baseDice = agility + shootingMod + weaponMod;

                                                        // Бонус/штраф от действий:
                                                        // 1 действие → -2 куба
                                                        // 2 действия → 0 кубов
                                                        // 3 действия → +2 куба
                                                        const actionBonus = (spentActions - 2) * 2;

                                                        const totalDice = Math.max(0, baseDice + actionBonus);

                                                        openDiceModal(
                                                          `Выстрел: ${item.name}`,
                                                          totalDice,
                                                          '',
                                                          0,
                                                          false
                                                        );



                                                        // --- Тратим 1 патрон после броска ---
                                                        const newInventory = character.inventory.map((i) =>
                                                          i.id === item.id
                                                            ? { ...i, ammo: ammoNow - 1 }
                                                            : i
                                                        );

                                                        updateCharacter({ inventory: newInventory });
                                                      }}
                                                      className="ml-2 px-2 py-0.5 text-[10px] rounded bg-mythic-red/30 hover:bg-mythic-red/50 border border-mythic-red/60 uppercase tracking-widest disabled:bg-space-900 disabled:text-gray-500"
                                                      disabled={
                                                        (item.ammo ?? item.weaponStats?.ammoCapacity ?? 0) <= 0
                                                      }
                                                    >
                                                      Выстрел
                                                    </button>

                                                    {/* Кнопка "Перезарядка" */}
                                                    <button
                                                      onClick={() => {
                                                        if (!character) return;

                                                        const cap = item.weaponStats?.ammoCapacity ?? 0;
                                                        const ammoNow = item.ammo ?? cap;

                                                        if (ammoNow >= cap) {
                                                          alert('Магазин уже полон.');
                                                          return;
                                                        }

                                                        const newInventory = character.inventory.map((i) =>
                                                          i.id === item.id
                                                            ? { ...i, ammo: cap }
                                                            : i
                                                        );

                                                        updateCharacter({ inventory: newInventory });
                                                      }}
                                                      className="px-2 py-0.5 text-[10px] rounded bg-space-700 hover:bg-space-600 border border-space-500 uppercase tracking-widest disabled:bg-space-900 disabled:text-gray-500"
                                                      disabled={
                                                        (item.ammo ?? item.weaponStats?.ammoCapacity ?? 0) >=
                                                        (item.weaponStats?.ammoCapacity ?? 0)
                                                      }
                                                    >
                                                      Перезарядка
                                                    </button>
                                                  </>
                                                );
                                              })()}
                                            </>
                                          )}

                                          {/* Кнопка "Атака" для оружия ближнего боя */}
                                          {item.category === ItemCategory.MELEE && (
                                            <button
                                              className="ml-2 px-2 py-0.5 text-[10px] rounded bg-mythic-red/30 hover:bg-mythic-red/50 border border-mythic-red/60 uppercase tracking-widest"
                                              onClick={() => {
                                                if (!character) return;

                                                // --- Выбор количества очков действия игроком ---
                                                const maxActions = 3;
                                                const input = window.prompt(
                                                  'Сколько очков действия потратить на атаку (0–3)?',
                                                  '1'
                                                );

                                                if (input === null) {
                                                  return;
                                                }

                                                let spentActions = parseInt(input, 10);

                                                if (Number.isNaN(spentActions)) {
                                                  spentActions = 0;
                                                }

                                                if (spentActions < 0) spentActions = 0;
                                                if (spentActions > maxActions) spentActions = maxActions;

                                                if (spentActions === 0) {
                                                  alert('Нужно потратить хотя бы 1 очко действия для атаки.');
                                                  return;
                                                }

                                                // --- Модификаторы ближнего боя и оружия ---
                                                const body =
                                                  character.attributes[AttributeName.BODY] || 0;

                                                const meleeMod =
                                                  character.skills.find(
                                                    (s) => s.name === 'Ближний бой'
                                                  )?.value ?? 0;

                                                const weaponMod = item.weaponStats?.modifier ?? 0;

                                                // Базовый пул: Сила + Ближний бой + мод. оружия
                                                const baseDice = body + meleeMod + weaponMod;

                                                // Бонус/штраф от действий:
                                                // 1 действие → -2 куба
                                                // 2 действия → 0 кубов
                                                // 3 действия → +2 куба
                                                const actionBonus = (spentActions - 2) * 2;

                                                const totalDice = Math.max(0, baseDice + actionBonus);

                                                openDiceModal(
                                                  `Атака: ${item.name}`,
                                                  totalDice,
                                                  '',
                                                  0,
                                                  false
                                                );


                                              }}
                                            >
                                              Атака
                                            </button>
                                          )}
                                        </div>
                                      )}



               <div className="flex flex-col items-end gap-2">
                 {!isEditing && <span className="px-2 py-1 bg-space-900 rounded text-xs text-gray-500 border border-space-700">x{item.quantity}</span>}
                 {isEditing ? (
                    <button className="p-2 text-red-500 hover:bg-red-900/20 rounded transition-colors" onClick={() => {
                        const newInv = character.inventory.filter(i => i.id !== item.id);
                        updateCharacter({ inventory: newInv });
                      }}>
                      <Trash2 size={18} />
                    </button>
                 ) : (
<button 
  className={`text-xs px-4 py-1.5 rounded transition-colors ${
    item.equipped
      ? 'bg-space-700 text-green-300 hover:bg-space-600'
      : 'bg-mythic-red/20 text-mythic-red hover:bg-mythic-red/30'
  }`}
  onClick={() => {
    if (!character) return;

    // Если пытаемся НАДЕТЬ вещь — проверяем, хватит ли запаса нагрузки
    if (!item.equipped) {
  const load = calculateLoad();

  const itemWeight =
    (typeof item.weight === 'number' ? item.weight : 0) *
    (item.quantity || 1);

  if (itemWeight <= 0) {
    // Нулевой вес нас не интересует
  } else {
    const projectedUsed = load.used + itemWeight;

    // Запрещаем надевать, если превысим предел с перегрузкой
    if (projectedUsed > load.overloadMax) {
      alert('Перегрузка: нельзя превысить двойную норму нагрузки.');
      return;
    }
  }
}


    const newInv = character.inventory.map((i) => {
      if (i.id !== item.id) return i;

      const newEquipped = !i.equipped;

      // Если НАДЕВАЕМ предмет — он автоматически считается "при себе",
      // т.е. уже не в личной каюте
      if (newEquipped) {
        return {
          ...i,
          equipped: true,
          storedInCabin: false,
        };
      }

      // Если СНИМАЕМ — просто снимаем, место хранения не трогаем
      return {
        ...i,
        equipped: false,
      };
    });

    updateCharacter({ inventory: newInv });
  }}
>
  {item.equipped ? 'Снять' : 'Надеть'}
</button>


                 )}
               </div>
             </div>
           ))}
                                <button
              type="button"
              className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-space-600 text-xs text-gray-300 hover:bg-space-800"
              onClick={() => {
                setNewItemForm({
                  name: '',
                  description: '',
                  kind: 'other',
                  weight: '',
                  weaponModifier: '0',
                  weaponInitiative: '0',
                  weaponDamage: '',
                  weaponCrit: '',
                  weaponProperties: '',
                  weaponRange: '',
                  armorDefense: '',
                  armorProperty: '',
                });
                setAddItemModalOpen(true);
              }}
            >
              + Добавить предмет
            </button>


        </div>

        <div className="bg-space-800 p-6 rounded-2xl border border-space-600 h-fit shadow-lg">
          <h3 className="text-white font-serif text-lg mb-4">Экипировка</h3>
          <div className="space-y-3">
            {character.inventory.filter(i => i.equipped).length === 0 && (
              <p className="text-gray-600 text-sm italic py-4 text-center">Персонаж не экипирован.</p>
            )}
            {character.inventory.filter(i => i.equipped).map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm border-b border-space-700 pb-2 last:border-0">
                <span className="text-gray-200">{item.name}</span>
                <Shield size={14} className="text-mythic-red" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Main Layout ---
  if (viewMode === 'creator') {
    return (
      <CharacterCreator 
        onComplete={handleCharacterCreated}
        onCancel={() => {
          if (characters.length > 0) setViewMode('sheet');
        }}
      />
    );
  }

  if (!character) {
     // Fallback if state is somehow broken/empty
     return <div className="h-screen flex items-center justify-center bg-black text-white">Загрузка...</div>;
  }

  return (
   <div className="flex min-h-screen bg-space-900 text-gray-200 font-sans selection:bg-mythic-red selection:text-white overflow-x-hidden pt-2 md:pt-0 pb-4 md:pb-0">
      <Sidebar />
	   <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportCharacters}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f0505] relative z-0">
        {/* Mobile Header */}
               {/* Mobile Header */}
        <div className="md:hidden bg-space-900 border-b border-space-700 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-300 mr-2"
            >
              <Menu size={24} />
            </button>
            <div className="text-mythic-red font-serif font-bold truncate max-w-[150px]">
              {character.name}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCurrentCharacter}
              className="p-2 rounded-lg bg-space-800 border border-space-600 text-gray-200"
              title="Сохранить персонажа в JSON"
            >
              <Download size={18} />
            </button>
            <button
              type="button"
              onClick={handleClickImport}
              className="p-2 rounded-lg bg-space-800 border border-space-600 text-gray-200"
              title="Загрузить из JSON"
            >
              <Upload size={18} />
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isEditing
                  ? 'bg-mythic-red text-white shadow-[0_0_15px_rgba(248,113,113,0.6)]'
                  : 'bg-space-900 text-gray-300 hover:bg-space-700 border border-space-600'
              }`}
            >
              {isEditing ? <Check size={20} /> : <Pencil size={20} />}
            </button>
          </div>
        </div>


  
                {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-space-900/80 backdrop-blur border-b border-space-600">
          <div>
            <h1 className="text-2xl font-serif text-white tracking-wide">{character.name}</h1>
            <div className="flex gap-2">
              <div className="text-xs text-mythic-red uppercase tracking-widest">{character.clan}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">• {character.specialization}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportCurrentCharacter}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-space-800 border border-space-600 text-gray-200 hover:bg-space-700 transition"
            >
              <Download size={14} />
              <span>Текущий JSON</span>
            </button>
            <button
              type="button"
              onClick={handleExportAllCharacters}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-space-800 border border-space-600 text-gray-200 hover:bg-space-700 transition"
            >
              <Download size={14} />
              <span>Все JSON</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isEditing
                  ? 'bg-mythic-red text-white shadow-[0_0_15px_rgba(248,113,113,0.6)]'
                  : 'bg-space-900 text-gray-300 hover:bg-space-700 border border-space-600'
              }`}
            >
              {isEditing ? <Check size={16} /> : <Pencil size={16} />}
              {isEditing ? 'Сохранить' : 'Редактировать'}
            </button>
          </div>
        </header>

        {/* Основное содержимое вкладок — прокручиваемый блок */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-24">
          {activeTab === 'stats' && renderStatsTab()}
          {activeTab === 'skills' && renderSkillsReferenceTab()}
          {activeTab === 'inventory' && renderInventoryTab()}
          {activeTab === 'shop' && renderShopTab()}
          {activeTab === 'ship' && renderShipTab()}
          {activeTab === 'notes' && renderNotesTab()}
        </main>


               {/* Нижняя панель вкладок, фиксированная к низу экрана */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-space-800 bg-space-900 px-4 md:px-8 py-2 flex justify-center z-20">
          <div className="flex p-1 space-x-1 bg-space-800 rounded-xl max-w-sm w-full border border-space-700">
            <TabButton
              active={activeTab === 'stats'}
              onClick={() => setActiveTab('stats')}
              icon={<Users size={18} />}
              label="Досье"
            />
            <TabButton
              active={activeTab === 'skills'}
              onClick={() => setActiveTab('skills')}
              icon={<Sparkles size={18} />}
              label="Навыки"
            />
            <TabButton
              active={activeTab === 'inventory'}
              onClick={() => setActiveTab('inventory')}
              icon={<Scroll size={18} />}
              label="Рюкзак"
            />
            <TabButton
              active={activeTab === 'shop'}
              onClick={() => setActiveTab('shop')}
              icon={<Coins size={18} />}
              label="Магазин"
            />

            <TabButton
              active={activeTab === 'ship'}
              onClick={() => setActiveTab('ship')}
              icon={<Rocket size={18} />}
              label="Корабль"
            />
			<TabButton
              active={activeTab === 'notes'}
              onClick={() => setActiveTab('notes')}
              icon={<Brain size={18} />}
              label="Заметки"
            />
          </div>
        </div>



      </div>

      {/* Модалка добавления предмета в рюкзак */}
      {addItemModalOpen && character && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-space-900 border border-space-600 rounded-2xl shadow-2xl px-6 py-5 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-serif text-lg mb-3">
              Добавить предмет
            </h3>

            <div className="space-y-3 text-sm text-gray-200">
              {/* Название */}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">
                  Название
                </label>
                <input
                  className="w-full bg-space-950 border border-space-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mythic-red"
                  value={newItemForm.name}
                  onChange={(e) =>
                    setNewItemForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Например: Тактический нож"
                />
              </div>

              {/* Описание */}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">
                  Описание
                </label>
                <textarea
                  className="w-full bg-space-950 border border-space-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mythic-red resize-none"
                  rows={3}
                  value={newItemForm.description}
                  onChange={(e) =>
                    setNewItemForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Короткое описание предмета..."
                />
              </div>

              {/* Тип предмета */}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">
                  Тип предмета
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'melee', label: 'Оружие (ближнее)' },
                    { key: 'ranged', label: 'Оружие (дальнее)' },
                    { key: 'armor', label: 'Броня' },
                    { key: 'elixir', label: 'Эликсир' },
                    { key: 'other', label: 'Прочее' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() =>
                        setNewItemForm((f) => ({
                          ...f,
                          kind: opt.key as typeof f.kind,
                        }))
                      }
                      className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-widest border ${
                        newItemForm.kind === opt.key
                          ? 'bg-mythic-red text-white border-mythic-red'
                          : 'bg-space-950 text-gray-300 border-space-700 hover:bg-space-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Вес */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">
                    Вес (в условных единицах)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full bg-space-950 border border-space-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mythic-red"
                    value={newItemForm.weight}
                    onChange={(e) =>
                      setNewItemForm((f) => ({
                        ...f,
                        weight: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Параметры оружия */}
              {(newItemForm.kind === 'melee' ||
                newItemForm.kind === 'ranged') && (
                <div className="border-t border-space-700 pt-3 space-y-2">
                  <div className="text-xs text-gray-400 uppercase tracking-widest">
                    Параметры оружия
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">
                        Модификатор
                      </label>
                      <input
                        type="number"
                        className="w-full bg-space-950 border border-space-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-mythic-red"
                        value={newItemForm.weaponModifier}
                        onChange={(e) =>
                          setNewItemForm((f) => ({
                            ...f,
                            weaponModifier: e.target.value,
                          }))
                        }
                        placeholder="Напр.: 1"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">
                        Инициатива
                      </label>
                      <input
                        type="number"
                        className="w-full bg-space-950 border border-space-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-mythic-red"
                        value={newItemForm.weaponInitiative}
                        onChange={(e) =>
                          setNewItemForm((f) => ({
                            ...f,
                            weaponInitiative: e.target.value,
                          }))
                        }
                        placeholder="Напр.: 0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">
                        Урон
                      </label>
                      <input
                        className="w-full bg-space-950 border border-space-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-mythic-red"
                        value={newItemForm.weaponDamage}
                        onChange={(e) =>
                          setNewItemForm((f) => ({
                            ...f,
                            weaponDamage: e.target.value,
                          }))
                        }
                        placeholder="Напр.: 1d6+1"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">
                        Крит
                      </label>
                      <input
                        className="w-full bg-space-950 border border-space-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-mythic-red"
                        value={newItemForm.weaponCrit}
                        onChange={(e) =>
                          setNewItemForm((f) => ({
                            ...f,
                            weaponCrit: e.target.value,
                          }))
                        }
                        placeholder="Напр.: x2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      Свойства (через запятую)
                    </label>
                    <input
                      className="w-full bg-space-950 border border-space-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-mythic-red"
                      value={newItemForm.weaponProperties}
                      onChange={(e) =>
                        setNewItemForm((f) => ({
                          ...f,
                          weaponProperties: e.target.value,
                        }))
                      }
                      placeholder="Напр.: Лёгкое, Метательное"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      Дистанция
                    </label>
                    <input
                      className="w-full bg-space-950 border border-space-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-mythic-red"
                      value={newItemForm.weaponRange}
                      onChange={(e) =>
                        setNewItemForm((f) => ({
                          ...f,
                          weaponRange: e.target.value,
                        }))
                      }
                      placeholder="Напр.: 20/60"
                    />
                  </div>
                </div>
              )}

              {/* Параметры брони */}
              {newItemForm.kind === 'armor' && (
                <div className="border-t border-space-700 pt-3 space-y-2">
                  <div className="text-xs text-gray-400 uppercase tracking-widest">
                    Параметры брони
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">
                        Класс защиты
                      </label>
                      <input
                        type="number"
                        className="w-full bg-space-950 border border-space-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-mythic-red"
                        value={newItemForm.armorDefense}
                        onChange={(e) =>
                          setNewItemForm((f) => ({
                            ...f,
                            armorDefense: e.target.value,
                          }))
                        }
                        placeholder="Напр.: 2"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">
                        Свойство
                      </label>
                      <input
                        className="w-full bg-space-950 border border-space-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-mythic-red"
                        value={newItemForm.armorProperty}
                        onChange={(e) =>
                          setNewItemForm((f) => ({
                            ...f,
                            armorProperty: e.target.value,
                          }))
                        }
                        placeholder="Напр.: Тяжёлая, Мощная"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAddItemModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-space-600 text-sm text-gray-200 hover:bg-space-800"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!character) return;
const itemNameForConfirm = (newItemForm.name || '').trim() || 'Новый предмет';
if (!window.confirm(`Добавить предмет «${itemNameForConfirm}» в инвентарь?`)) return;

                  const kind = newItemForm.kind;

                  let category: ItemCategory;
                  switch (kind) {
                    case 'melee':
                      category = ItemCategory.MELEE;
                      break;
                    case 'ranged':
                      category = ItemCategory.RANGED;
                      break;
                    case 'armor':
                      category = ItemCategory.ARMOR;
                      break;
                    case 'elixir':
                      category = ItemCategory.ELIXIR;
                      break;
                    default:
                      category = ItemCategory.GEAR;
                      break;
                  }

                  const weight =
                    parseFloat(
                      (newItemForm.weight || '0').replace(',', '.'),
                    ) || 0;

                  let weaponStats:
                    | {
                        modifier: number;
                        initiative: number;
                        damage: string;
                        crit: string | null;
                        properties: string[];
                        range: string | null;
                        ammoCapacity?: number;
                      }
                    | undefined;

                  if (kind === 'melee' || kind === 'ranged') {
                    const modifier =
                      parseInt(newItemForm.weaponModifier || '0', 10) || 0;
                    const initiative =
                      parseInt(newItemForm.weaponInitiative || '0', 10) || 0;
                    const damage = newItemForm.weaponDamage.trim();
                    const critStr = newItemForm.weaponCrit.trim();
                    const crit = critStr.length > 0 ? critStr : null;
                    const properties =
                      newItemForm.weaponProperties
                        .split(',')
                        .map((p) => p.trim())
                        .filter(Boolean) || [];
                    const rangeStr = newItemForm.weaponRange.trim();
                    const range = rangeStr.length > 0 ? rangeStr : null;

                    weaponStats = {
                      modifier,
                      initiative,
                      damage,
                      crit,
                      properties,
                      range,
                    };
                  }

                  // Для брони класс защиты и свойство добавляем в описание
                  let finalDescription = newItemForm.description.trim();

                  if (kind === 'armor') {
                    const parts: string[] = [];
                    if (newItemForm.armorDefense.trim()) {
                      parts.push(
                        `Класс защиты: ${newItemForm.armorDefense.trim()}`,
                      );
                    }
                    if (newItemForm.armorProperty.trim()) {
                      parts.push(
                        `Свойство: ${newItemForm.armorProperty.trim()}`,
                      );
                    }
                    if (parts.length > 0) {
                      finalDescription = [finalDescription, parts.join(' · ')]
                        .filter(Boolean)
                        .join('\n');
                    }
                  }

                  const newItem: InventoryItem = {
                    id: generateId(),
                    name: newItemForm.name.trim() || 'Новый предмет',
                    description: finalDescription,
                    quantity: 1,
                    equipped: false,
                    storedInCabin: false,
                    category,
                    weight,
                    ...(weaponStats ? { weaponStats } : {}),
                  };

                  updateCharacter({
                    inventory: [...character.inventory, newItem],
                  });

                  setAddItemModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-mythic-red text-sm text-white hover:bg-red-500 shadow-[0_0_15px_rgba(248,113,113,0.5)]"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

{/* Модалка подтверждения покупки */}
{pendingPurchase && character && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="bg-space-900 border border-space-600 rounded-2xl shadow-2xl px-6 py-5 max-w-sm w-full mx-4">
      <h3 className="text-white font-serif text-lg mb-3 flex items-center gap-2">
        <Coins size={20} className="text-mythic-gold" />
        Подтвердить покупку
      </h3>

      <div className="space-y-2 text-sm text-gray-200">
        <div className="font-semibold text-base">
          {pendingPurchase.name}
        </div>

        {pendingPurchase.description && (
          <div className="text-gray-400 text-[13px]">
            {pendingPurchase.description}
          </div>
        )}

        <div className="pt-2 text-[13px]">
          <span className="text-gray-400">Цена:</span>{' '}
          <span className="font-semibold text-mythic-gold">
            {pendingPurchase.price} кр.
          </span>
        </div>

        <div className="text-[12px] text-gray-400">
          У вас сейчас {character.credits} кр. После покупки останется{' '}
          <span className="text-gray-200">
            {Math.max(
              0,
              (character.credits || 0) - (pendingPurchase.price || 0)
            )}
          </span>{' '}
          кр.
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setPendingPurchase(null)}
          className="px-4 py-2 rounded-lg border border-space-600 text-sm text-gray-200 hover:bg-space-800"
        >
          Отмена
        </button>

        <button
          type="button"
          onClick={() => {
            handleBuyItem(pendingPurchase);
            setPendingPurchase(null);
          }}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-mythic-red text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
          disabled={(character.credits || 0) < (pendingPurchase.price || 0)}
        >
          <Coins size={14} />
          Купить
        </button>
      </div>
    </div>
  </div>
)}

	  
      {activeRoll && (
        <DiceModal 
          isOpen={diceModalOpen}
          onClose={() => setDiceModalOpen(false)}
          attributeName={activeRoll.attrName}
          attributeValue={activeRoll.attrVal}
          skillName={activeRoll.skillName}
          skillValue={activeRoll.skillVal}
          isRedSkill={activeRoll.isRed}
          currentWill={character.energy.current}
          onSpendWill={handleSpendWill}
        />
      )}

      {initiativeModalOpen && initiativeResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-space-900 border border-space-600 rounded-2xl shadow-2xl px-6 py-5 max-w-sm w-full mx-4">
            <h3 className="text-white font-serif text-lg mb-3 flex items-center gap-2">
              <D20Icon size={20} className="text-mythic-gold" />
              Бросок инициативы
            </h3>

            <div className="space-y-1 text-sm text-gray-200">
              <div>
                <span className="text-gray-400">Кость:</span>{' '}
                d20 = {initiativeResult.die}
              </div>
              <div>
                <span className="text-gray-400">Проворство:</span>{' '}
                {initiativeResult.agility}
              </div>
              <div>
                <span className="text-gray-400">Бонус оружия:</span>{' '}
                {initiativeResult.weaponInitiativeBonus >= 0 ? '+' : ''}
                {initiativeResult.weaponInitiativeBonus}
              </div>
              <div className="pt-2 border-t border-space-700 mt-2">
                <span className="text-gray-400">Итого:</span>{' '}
                <span className="font-mono text-xl text-amber-400">
                  {initiativeResult.total}
                </span>
              </div>
            </div>

            <div className="mt-4 text-right">
              <button
                type="button"
                onClick={() => setInitiativeModalOpen(false)}
                className="inline-flex items-center px-4 py-2 rounded-lg hover:bg-space-700 text-sm text-gray-100 border border-space-600"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {shipInitiativeModalOpen && shipInitiativeResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-space-900 border border-space-600 rounded-2xl shadow-2xl px-6 py-5 max-w-sm w-full mx-4">
            <h3 className="text-white font-serif text-lg mb-3 flex items-center gap-2">
              <D20Icon size={20} className="text-mythic-gold" />
              Инициатива корабля
            </h3>

            <div className="space-y-1 text-sm text-gray-200">
              <div>
                <span className="text-gray-400">Кость:</span>{' '}
                <span className="font-mono text-lg">
                  d20 = {shipInitiativeResult.die}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Бонус корабля:</span>{' '}
                <span className="font-mono text-lg">
                  {shipInitiativeResult.modifier >= 0 ? '+' : ''}
                  {shipInitiativeResult.modifier}
                </span>
              </div>
              <div className="pt-2 border-т border-space-700 mt-2">
                <span className="text-gray-400">Итого:</span>{' '}
                <span className="font-mono text-xl text-amber-400">
                  {shipInitiativeResult.total}
                </span>
              </div>
            </div>

            <div className="mt-4 text-right">
              <button
                type="button"
                onClick={() => setShipInitiativeModalOpen(false)}
                className="inline-flex items-center px-4 py-2 rounded-lg hover:bg-space-700 text-sm text-gray-100 border border-space-600"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};



const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      // делаем кнопку квадратной и колонкой
      'flex flex-col items-center justify-center flex-1 aspect-square',
      'text-[10px] md:text-xs',
      'rounded-xl transition-colors',
      active
        ? 'bg-amber-500/80 text-black shadow shadow-black/50 ring-1 ring-amber-300'
        : 'text-gray-400 hover:text-gray-200 hover:bg-space-700/50',
    ].join(' ')}
  >
    <div className="mb-1 flex items-center justify-center">
      {icon}
    </div>
    <span className="leading-tight text-center">{label}</span>
  </button>
);

export default App;

