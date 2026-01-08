

export enum ClassType {
  ARTIFICER = 'Artificer',
  BARBARIAN = 'Barbarian',
  BARD = 'Bard',
  CLERIC = 'Cleric',
  DRUID = 'Druid',
  FIGHTER = 'Fighter',
  MONK = 'Monk',
  PALADIN = 'Paladin',
  RANGER = 'Ranger',
  ROGUE = 'Rogue',
  SORCERER = 'Sorcerer',
  WARLOCK = 'Warlock',
  WIZARD = 'Wizard',
  CUSTOM = 'Custom'
}

export enum RaceType {
  AARAKOCRA = 'Aarakocra',
  AASIMAR = 'Aasimar',
  AUTOGNOME = 'Autognome',
  BUGBEAR = 'Bugbear',
  CENTAUR = 'Centaur',
  CHANGELING = 'Changeling',
  DHAMPIR = 'Dhampir',
  DRAGONBORN = 'Dragonborn',
  DWARF = 'Dwarf',
  DWARF1 = 'Dwarf1',
  ELF = 'Elf',
  ELF1 = 'Elf1',
  FAIRY = 'Fairy',
  FIRBOLG = 'Firbolg',
  GENASI = 'Genasi',
  GIFF = 'Giff',
  GITH = 'Gith',
  GNOME = 'Gnome',
  GNOME1 = 'Gnome1',
  GOBLIN = 'Goblin',
  GOLIATH = 'Goliath',
  GOLIATH24 = 'Goliath24',
  GRUNG = 'Grung',
  HADOZEE = 'Hadozee',
  HALF_ELF = 'Half-Elf',
  HALF_ORC = 'Half-Orc',
  HALFLING = 'Halfling',
  HARENGON = 'Harengon',
  HEXBLOOD = 'Hexblood',
  HOBGOBLIN = 'Hobgoblin',
  HUMAN = 'Human',
  HUMANALT = 'HumanAlt',
  KALASHTAR = 'Kalashtar',
  KENKU = 'Kenku',
  KOBOLD = 'Kobold',
  LEONIN = 'Leonin',
  LIZARDFOLK = 'Lizardfolk',
  LOCATHAH = 'Locathah',
  LOXODON = 'Loxodon',
  MINOTAUR = 'Minotaur',
  ORC = 'Orc',
  OWLIN = 'Owlin',
  PLASMOID = 'Plasmoid',
  REBORN = 'Reborn',
  SATYR = 'Satyr',
  SHIFTER = 'Shifter',
  TABAXI = 'Tabaxi',
  THRI_KREEN = 'Thri-kreen',
  TIEFLING = 'Tiefling',
  TIEFLING1 = 'Tiefling1',
  TORTLE = 'Tortle',
  TRITON = 'Triton',
  VERDAN = 'Verdan',
  WARFORGED = 'Warforged',
  YUAN_TI = 'Yuan-Ti',
  KHENRA = 'Khenra',
  CUSTOM = 'Custom'
}

export type Ruleset = '2014' | '2024';

export interface Stats {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface Skill {
  id: string;
  nameRu: string;
  stat: keyof Stats;
  proficient: boolean;
  expertise: boolean;
}

export interface Spell {
  id: string;
  name: string;
  nameRu?: string; // Optional Russian name if source is English
  level: number;
  school: string;
  description: string;
  prepared: boolean;
  classes?: string[]; // Should match ClassType enum values
  ruleset?: Ruleset; // Legacy single ruleset
  rulesets?: Ruleset[]; // New array support for multi-version spells
  
  // Detailed Props
  castingTime?: string;
  range?: string;
  duration?: string;
  components?: string;
  materials?: string; // New: Description of material components
  
  // Logic Props
  ritual?: boolean;
  concentration?: boolean;
  
  // Casting Logic
  type: 'attack' | 'save' | 'heal' | 'utility';
  damage?: string; // Base damage dice e.g. "1d8" or "8d6"
  damageType?: string; // "fire", "necrotic"
  
  scaling?: 'none' | 'slot' | 'character'; // How it scales
  scalingDamage?: string; // Extra dice per slot e.g. "1d8"
  
  savingThrow?: keyof Stats; // "dex", "wis"
  saveEffect?: 'half' | 'none' | 'special'; // What happens on success
  
  addModToDamage?: boolean; // Add spellcasting modifier to damage/heal?
}

export interface Weapon {
  id: string;
  name: string;
  damageDie: string; 
  damageType: string; // New: Base damage type (Slashing, etc.)
  stat: keyof Stats; 
  proficient: boolean;
  magicBonus: number; 
  isRanged: boolean;
  range?: string; 
  usesAmmo: boolean;
  ammoCount: number;
  extraDamage?: {
    die: string; 
    type: string; 
  };
  mastery?: string; // Weapon Mastery (2024)
}

export interface Armor {
  id: string;
  name: string;
  type: 'Light' | 'Medium' | 'Heavy' | 'None';
  baseAC: number;
  dexBonus: boolean; // Does it add Dex?
  maxDex?: number; // Max dex bonus (e.g. 2 for medium)
  stealthDisadvantage: boolean;
  strReq: number;
  description?: string; // New field for custom armor description
  magicBonus?: number; // Magic bonus to AC
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  notes: string; 
}

export interface Wallet {
  cp: number; 
  sp: number; 
  ep: number; 
  gp: number; 
  pp: number; 
}

export interface SpellSlots {
  [level: number]: {
    value: number; 
    max: number;   
  };
}

export interface PactMagicSlots {
  current: number;
  max: number;
  level: number; // The spell level (1-5)
}

 export interface Feature {
	id: string;
	name: string;
	source: 'Race' | 'Class' | 'Subclass' | 'Subrace' | 'Feat' | 'Other';
	description: string;
	ruleset?: Ruleset;      // 2014 или 2024, если черта привязана к редакции
	minLevel?: number;      // минимальный уровень персонажа для этой черты
	uses?: {
	current: number;
    max: number;
	refresh: 'Short' | 'Long' | 'None';
   };
 }

export interface DerivedBonuses {
  initiative: number;
}


export interface Invocation {
  id: string;
  name: string;
  description: string;
  prerequisite?: string;
  minLevel?: number;
  pact?: string;
}

export interface Metamagic {
    id: string;
    name: string;
    description: string;
    cost: number;
    ruleset: Ruleset;
}

export interface Infusion {
    id: string;
    name: string;
    description: string;
    minLevel?: number;
    prerequisite?: string;
}

export interface CharacterClass {
  type: ClassType;
  level: number;
  subclass?: string;
  customName?: string; // User defined name for Custom classes
}

export interface NoteSection {
    id: string;
    title: string;
    content: string;
}

export interface Character {
  id: string;
  name: string;
  ruleset: Ruleset; // New field for 2014 vs 2024
  race: RaceType;
  subrace?: string;
  /**
   * Кастомное название расы (используется когда race === RaceType.CUSTOM)
   */
  raceCustomName?: string;


  // Боевые стили по классам
  fighterFightingStyle?: string | null;  // стиль воина
  paladinFightingStyle?: string | null;  // стиль паладина
  rangerFightingStyle?: string | null;   // стиль следопыта

  // Друид: выбор специализаций/форм
  druidLandCircleTerrain?: string | null; // Круг Земли: выбранная местность
  druidStarryForm?: string | null;        // Круг Звёзд: выбранный звездный облик

  draconicAncestry?: string; // Идентификатор драконьего предка для драконорожденных
  customRaceName?: string;   // User defined name

  initiativeBonus?: number; // Дополнительный бонус к инициативе (от черт, предметов и т.п.)

  
  // Legacy fields kept for backward compat, but `classes` is source of truth
  class: ClassType; // Primary class
  /**
   * Кастомное название класса (используется если игрок выбрал «Свой класс» при создании)
   */
  classCustomName?: string;
  subclass?: string;
  level: number; // Total level
  
  classes: CharacterClass[]; // Multi-class support
  
  inspiration: boolean; // New Field

  stats: Stats;
  savingThrows: (keyof Stats)[]; // explicit list of proficient saves
  hp: {
    current: number;
    max: number;
    temp: number;
  };
  hitDice?: {
      current: number;
      max: number;
  };
  deathSaves: {
    successes: number;
    failures: number;
  };
  ac: number; 
  shield: {
    equipped: boolean;
    bonus: number; 
  };
  equippedArmor?: Armor; // Updated type
  speed: number;
  initiative: number;
  spellcastingAbility: keyof Stats; // 'int', 'wis', 'cha'
  spellSlots: SpellSlots;
  pactMagic: PactMagicSlots; // Warlock slots
  
  proficiencies: string[]; // Custom text tags for tool/lang proficiencies
  skills: Skill[]; 
  weapons: Weapon[];
  inventory: InventoryItem[];
  wallet: Wallet;
  spells: Spell[];
  features: Feature[];
    // Выборы тотемного варвара (Путь Тотемного Воина)
  barbarianTotemChoices?: {
    level3?: 'bear' | 'eagle' | 'wolf' | 'elk' | 'tiger';
    level6?: 'bear' | 'eagle' | 'wolf' | 'elk' | 'tiger';
    level14?: 'bear' | 'eagle' | 'wolf' | 'elk' | 'tiger';
  };

  invocations: string[]; // IDs of learnt invocations
  // Выбор тотемных духов варвара (по уровням 3 / 6 / 14)
  barbarianTotemChoices?: {
    level3?: string;   // id из TOTEM_SPIRITS (bear, eagle, wolf, elk, tiger)
    level6?: string;
    level14?: string;
  };


  // Sorcerer Specific
  sorceryPoints?: {
      current: number;
      max: number;
  };
  metamagic?: string[]; // IDs of learnt metamagics

  // Artificer Specific
  infusions?: string[]; // IDs of known infusions

  backstory: string;
  notes: string; // Legacy
  customNotes: NoteSection[]; // New editable sections
  avatarUrl?: string;
  alignment?: string;
  background?: string;
  /**
   * ID предыстории из мастера создания (например 'acolyte', 'soldier2024', 'custom2014', 'custom2024').
   * Нужен, чтобы можно было понять, какая предыстория выбрана, и при необходимости открыть настройки.
   */
  backgroundId?: string;
  /**
   * Кастомное название предыстории (используется когда backgroundId === 'custom2014' или 'custom2024')
   */
  backgroundCustomName?: string;


  /**
   * Настройки «Своя предыстория» (и при желании — расширение для других предысторий).
   * Поля разделены по редакциям, но могут храниться вместе (зависит от ruleset персонажа).
   */
  customBackground?: {
    // 2014
    skills?: Skill[];              // 2 навыка на выбор
    tools?: string[];              // владения инструментами
    languages?: string[];          // языки
    equipment?: InventoryItem[];   // добавляемые предметы
    gp?: number;                   // добавочное золото

    // 2024
    asiChoices?: (keyof Stats)[];  // 3 характеристики (+1/+1/+1)
    featId?: string;               // черта из FEAT_LIBRARY
    featCustomName?: string;       // своя черта: название
    featCustomText?: string;       // своя черта: описание
    skills2024?: Skill[];          // 2 навыка на выбор (от предыстории)

    tools2024?: string[];          // инструменты (2024)
    equipment2024?: InventoryItem[]; // снаряжение (2024)

    description?: string;          // текстовое описание предыстории
  };

}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// New Interface for passing damage roll data
export interface DamageRollConfig {
    dice: string;
    modifier: number;
    label: string;
    damageType?: string;
    isCritical?: boolean;
}

export const DEFAULT_STATS: Stats = {
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10
};
