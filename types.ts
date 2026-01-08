
export enum AttributeName {
  BODY = 'Телосложение',
  AGILITY = 'Ловкость',
  INTELLECT = 'Интеллект',
  EMPATHY = 'Эмпатия',
}
export enum ItemCategory {
  MELEE = 'Оружие ближнего боя',
  RANGED = 'Оружие дальнего боя',
  PISTOLS = 'Пистолеты',
  CARABINS = 'Карабины',
  RIFLES = 'Винтовки',
  SHOTGUNS = 'Дробовики',
  HEAVYS = 'Тяжелое оружие',
  ARMOR = 'Броня',
  OUTFIT = 'Одежда',
  EXPLOSIVE = 'Взрывчатка',
  GEAR = 'Снаряжение',
  ELIXIR = 'Элексир',
  CONSUMABLE = 'consumable',  // аптечки, стимы, гранаты, патроны и т.п.
  TOOL = 'tool',              // инструменты / наборы
  OTHER = 'other',            // всё, что не попало выше
}

export interface ItemModifiers {
  hpBonus?: number;
  energyBonus?: number;
  attributeBonus?: Partial<Record<AttributeName, number>>;
  // при необходимости добавишь сюда урон, броню и т.п.
}

export enum Faction {
  DEMOS = 'Демосы',
  COMMUNE = 'Коммуна',
  PEDDLERS = 'Коробейники',
  FRONTIERS = 'Фронтир',
  CHURCH = 'Единая Церковь',
  OUTCASTS = 'Изгои',
}

export enum GreatClan {
  WOLF = 'Клан Волка',
  EAGLE = 'Клан Орла',
  SNAKE = 'Клан Змеи',
  RAM = 'Клан Овна',
  OWL = 'Клан Совы',
  BEAR = 'Клан Медведя',
}

// Kept for backward compat in logic, but UI will use text input for Clan usually
export enum Clan {
  SVAROG_HEAVY_INDUSTRIES = 'Тяжелая Пром. Сварога',
  PERUN_VANGUARD = 'Авангард Перуна',
  VELES_TRADE_GUILD = 'Торговая Гильдия Велеса',
  MOKOSH_LIFE_WEAVERS = 'Био-Ткачи Мокоши',
  MARA_SHADOWS = 'Тени Мары',
  FREE_COSMONAUT = 'Вольный Космонавт',
}

export enum God {
  ROD = 'Род (Верховный бог неба и земли)',
  SVAROG = 'Сварог (Бог неба)',
  PERUN = 'Перун (Бог грома и молнии)',
  DAZHBOG = 'Даждьбог (Бог плодородия и солнечного света)',
  YARILO = 'Ярило (Бог весеннего солнца)',
  STRIBOG = 'Стрибог (Бог ветров)',
  HORS = 'Хорс (Бог солнца)',
  VELES = 'Велес (Змей мудрости)',
  MOKOSH = 'Мокошь (Пряха судеб)',
  LADA = 'Лада (Женское воплощение Рода)',
  MARA = 'Мара (Хозяйка зимы)',
  MORENA = 'Морена (Богиня ведовства и смерти)',
  CHUR = 'Чур (Хранитель границ)',
  EDINY = 'Единый (Один над всеми)',
  ATHEIST = 'Атеист (Без богов)',
}

export interface Skill {
  id: string;
  name: string;
  baseAttribute: AttributeName | 'Особое';
  value: number;
  isSpecial?: boolean;
}
export type ItemCategory =
  | 'melee'
  | 'ranged'
  | 'PISTOLS'
  | 'CARABINS'
  | 'RIFLES'
  | 'SHOTGUNS'
  | 'HEAVYS'
  | 'armor'
  | 'explosive'
  | 'gear'
  | 'elixir';

export interface WeaponStats {
  // "Мод." из таблицы
  modifier: number;
  // "Иниц." из таблицы
  initiative: number;
  // "Урон" из таблицы
  damage: number;
  // "Дистанция"
  range: number | null;
  // "Крит."
  crit: number | null;
  // "Свойства"
  properties: string[];

  // Вместимость магазина (для оружия, использующего патроны)
  ammoCapacity?: number;
}




export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;

  // Вес одного предмета (в условных единицах для пересчёта в ячейки)
  weight?: number;

  // Надет ли предмет на персонаже
  equipped: boolean;

  // Категория и цена
  category?: ItemCategory;
  price?: number | null;

  // Базовый id из магазина (если предмет куплен)
  baseId?: string;

  // Модификаторы, если есть
  modifiers?: ItemModifier[];

  // Статы оружия
  weaponStats?: WeaponStats;

  // Текущие патроны для оружия с магазином
  ammo?: number;

  // true — предмет хранится в личной каюте и НЕ учитывается в весе
  // false или undefined — предмет в рюкзаке/при себе и учитывается в весе
  storedInCabin?: boolean;
}




export interface ShopItem {
  id: string;              // стабильный ключ в каталоге
  name: string;
  description: string;
  category: ItemCategory;
  price: number;
  weight?: number;
  modifiers?: ItemModifiers;
}



export interface Character {
  id: string;
  name: string;
  concept: string; // Description/Appearance
  specialization: string; // Class/Archetype
  rank: string; // Calculated from Origins
  clan: string;
  patronGod: God;
  level: number;
  experience: number;
  hp: {
    current: number;
    max: number;
  };
  energy: {
    current: number;
    max: number;
  };
  attributes: Record<AttributeName, number>;
  skills: Skill[];
    skillPowers?: {
    [skillId: string]: {
      [level: number]: 'A' | 'B';
    };
  };
  inventory: InventoryItem[];
  credits: number;
  traumas?: Trauma[];
  inventory: InventoryItem[];
  ship?: Ship;
  positiveTraits: string[];
  negativeTraits: string[];

  // Корабль
  ship?: Ship;

  // Traits
  positiveTraits: string[];
  negativeTraits: string[];

  // Social
  reputation: Record<Faction, number>;
  clanRelations: Record<GreatClan, number>;

  backstory: string;
}
export interface Trauma {
  id: string;
  code: string;      // К66: 11–66
  name: string;      // Название травмы
  death: string;     // 'Нет', 'Да', 'Да, –1' и т.п.
  deadline: string;  // Крайний срок (например, 'к6 дней', 'к6 часов', '-')
  effect: string;    // Краткое описание эффекта
  period: string;    // Период восстановления (например, 'к6', '2к6', '-')
}
export type ShipModuleStatus = 'ok' | 'damaged' | 'critical';

export interface ShipModule {
  id: string;
  name: string;
  type: string; // например: 'bridge', 'docking', 'fuel', 'living', 'medbay', 'chapel', 'weapon'
  status: ShipModuleStatus;
  notes?: string;
}

export interface Ship {
  id: string;
  name: string;
  className: string; // например: 'Корвет', 'Фрегат'
  hull: {
    current: number;
    max: number;
  };
  energy: {
    current: number;
    max: number;
  };
  fuel?: { current: number; max: number };
  initiativeBonus?: number;

  conditions?: { id: string; name: string; description: string }[];
  crewRoles?: { id: string; role: string; name: string; notes?: string }[];
  weapons?: { id: string; name: string; damage: string; range?: string; notes?: string }[];

  
   crew: {
    current: number;
    max: number;
  };
  modules: ShipModule[];
  cargoNotes: string;
  personalCabinNotes?: string;
}



// --- New Interfaces for Character Creator ---

export interface EquipmentOption {
  name: string;
  description: string;
  quantity: number;
  equipped: boolean;
}

export interface EquipmentChoice {
  optionA: EquipmentOption;
  optionB: EquipmentOption;
}

export interface SpecializationData {
  name: string;
  variations: string; // Flavor text listing variations
  recommendedSkills: string[];
  reputationMod: number; // Applied to all factions
  equipmentChoices: EquipmentChoice[]; // 4 rows of choices
}
