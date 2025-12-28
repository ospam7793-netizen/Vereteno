
import { AttributeName, Clan, God, Skill, Faction, GreatClan, InventoryItem, SpecializationData, ItemCategory, ShopItem, } from './types';


// Attributes now start at 1 for the character creator
export const INITIAL_ATTRIBUTES: Record<AttributeName, number> = {
  [AttributeName.BODY]: 1,
  [AttributeName.AGILITY]: 1,
  [AttributeName.INTELLECT]: 1,
  [AttributeName.EMPATHY]: 1,
};

export const WHITE_SKILLS = [
  'Ближний бой',
  'Сила',
  'Стрельба',
  'Проворство',
  'Скрытность',
  'Наблюдательность',
  'Выживание',
  'Влияние'
];

export const DEFAULT_SKILLS: Skill[] = [
  // Body
  { id: 's_melee', name: 'Ближний бой', baseAttribute: AttributeName.BODY, value: 0 },
  { id: 's_might', name: 'Сила', baseAttribute: AttributeName.BODY, value: 0 },
  
  // Agility
  { id: 's_shoot', name: 'Стрельба', baseAttribute: AttributeName.AGILITY, value: 0 },
  { id: 's_sleight', name: 'Проворство', baseAttribute: AttributeName.AGILITY, value: 0 },
  { id: 's_stealth', name: 'Скрытность', baseAttribute: AttributeName.AGILITY, value: 0 },
  { id: 's_pilot', name: 'Пилотирование', baseAttribute: AttributeName.AGILITY, value: 0 },

  // Intellect
  { id: 's_percept', name: 'Наблюдательность', baseAttribute: AttributeName.INTELLECT, value: 0 },
  { id: 's_survival', name: 'Выживание', baseAttribute: AttributeName.INTELLECT, value: 0 },
  { id: 's_cyber', name: 'Кибершаманство', baseAttribute: AttributeName.INTELLECT, value: 0 },
  { id: 's_mech', name: 'Механика', baseAttribute: AttributeName.INTELLECT, value: 0 },
  { id: 's_science', name: 'Наука', baseAttribute: AttributeName.INTELLECT, value: 0 },
  { id: 's_med', name: 'Знахарство', baseAttribute: AttributeName.INTELLECT, value: 0 },

  // Empathy
  { id: 's_infl', name: 'Влияние', baseAttribute: AttributeName.EMPATHY, value: 0 },
  { id: 's_lead', name: 'Лидерство', baseAttribute: AttributeName.EMPATHY, value: 0 },
  { id: 's_cult', name: 'Культура', baseAttribute: AttributeName.EMPATHY, value: 0 },
  { id: 's_witch', name: 'Ведовство', baseAttribute: AttributeName.EMPATHY, value: 0 },
];
export const SHOP_ITEMS: ShopItem[] = [
 
  // Твоё ближнее оружие из таблицы
  {
    id: 'melee_knife_simple',
    name: 'Нож',
    description: 'Простой нож для ближнего боя.',
    category: ItemCategory.MELEE,
    price: 500,
    weight: 1,
	weaponStats: {modifier: 0, initiative: 4, damage: 1, crit: 2, range: 1, properties: ['Лёгкое', 'Маленькое'],
  },
  },
{
  id: 'melee_sword',
  name: 'Меч',
  description: 'Стандартный клинок для ближнего боя.',
  category: ItemCategory.MELEE,
  price: 1200,
  weight: 1,
  weaponStats: {
    modifier: 1,
    initiative: 2,
    damage: 2,
    range: 1,
    crit: 2,
    properties: [],
  },
},

  {
    id: 'melee_chainsword',
    name: 'Цепной меч',
    description: 'Клинок с цепным лезвием на энергетическом приводе.',
    category: ItemCategory.MELEE,
    price: 3800,
    weight: 2,
	weaponStats: {
	modifier: 1, 
	initiative: 0, 
	damage: 2, 
	crit: 1, 
	range: 1, 
	properties: ['Энергетическое'],}
  },
  {
    id: 'melee_greatsword',
    name: 'Двуручный меч',
    description: 'Тяжёлый двуручный меч с большим модификатором.',
    category: ItemCategory.MELEE,
    price: 1800,
    weight: 2,
	weaponStats: {modifier: 2, initiative: -2, damage: 2, crit: 2, range: 1, properties: ['Тяжёлое', 'Длинное']}
  },
  {
    id: 'melee_axe',
    name: 'Секира',
    description: 'Мощное рубящее оружие ближнего боя.',
    category: ItemCategory.MELEE,
    price: 1100,
    weight: 2,
	weaponStats: {modifier: 0, initiative: 0, damage: 3, crit: 2, range: 1, properties: []}
  },
  {
    id: 'melee_bardiche',
    name: 'Бердыш',
    description: 'Длинное древковое оружие с широким лезвием.',
    category: ItemCategory.MELEE,
    price: 1600,
    weight: 2,
	weaponStats: {modifier: 0, initiative: -2, damage: 2, crit: 2, range: 1, properties: ['Длинное']
	}
  },
  {
    id: 'melee_handaxe',
    name: 'Топорик',
    description: 'Лёгкий топор для ближнего боя.',
    category: ItemCategory.MELEE,
    price: 900,
    weight: 1,
	weaponStats: {modifier: 0, initiative: 2, damage: 2, crit: 2, range: 1, properties: ['Лёгкое']}
  },
  {
    id: 'melee_sickle',
    name: 'Серп',
    description: 'Крючкообразное лезвие с широким клинком.',
    category: ItemCategory.MELEE,
    price: 700,
    weight: 1,
	weaponStats: {modifier: 1, initiative: -2, damage: 3, crit: 3, range: 1, properties: ['Легкое','Широкое лезвие']}
  },
  {
    id: 'melee_chain_axe',
    name: 'Цепной топор',
    description: 'Топор с цепным лезвием, питающимся от энергии.',
    category: ItemCategory.MELEE,
    price: 2400,
    weight: 2,
		weaponStats: {modifier: 0, initiative: -2, damage: 2, crit: 1, range: 1, properties: ['Энергетическое']}
  },
  {
    id: 'melee_greataxe',
    name: 'Двуручный топор',
    description: 'Тяжёлый двуручный топор с высоким уроном.',
    category: ItemCategory.MELEE,
    price: 1600,
    weight: 2,
		weaponStats: {modifier: 1, initiative: -2, damage: 3, crit: 2, range: 1, properties: ['Тяжелое', 'Длинное']}
  },
  {
    id: 'melee_club',
    name: 'Дубинка',
    description: 'Простое, но эффективное ударное оружие.',
    category: ItemCategory.MELEE,
    price: 300,
    weight: 1,
		weaponStats: {modifier: 2, initiative: 4, damage: 1, crit: 3, range: 1, properties: []}
  },
  {
    id: 'melee_flail',
    name: 'Кистень',
    description: 'Гибкое ударное оружие с цепью.',
    category: ItemCategory.MELEE,
    price: 900,
    weight: 1,
		weaponStats: {modifier: 1, initiative: 2, damage: 2, crit: 2, range: 1, properties: []}
  },
  {
    id: 'melee_staff',
    name: 'Посох',
    description: 'Длинный посох, подходящий для боя и магии.',
    category: ItemCategory.MELEE,
    price: 500,
    weight: 1,
		weaponStats: {modifier: 2, initiative: 2, damage: 1, crit: 3, range: 1, properties: ['Длинное']}
  },
  {
    id: 'melee_hammer',
    name: 'Молот',
    description: 'Тяжёлое оружие, эффективное против брони.',
    category: ItemCategory.MELEE,
    price: 900,
    weight: 2,
		weaponStats: {modifier: 1, initiative: -4, damage: 4, crit: 3, range: 1, properties: ['Тяжёлое', 'Длинное', 'Бронебойное']}
  },
  {
    id: 'melee_great_hammer',
    name: 'Двуручный молот',
    description: 'Массивный двуручный молот с мощным ударом.',
    category: ItemCategory.MELEE,
    price: 1700,
    weight: 3,
		weaponStats: {modifier: 1, initiative: -4, damage: 4, crit: 3, range: 1, properties: ['Тяжёлое', 'Длинное', 'Бронебойное']}
  },
  {
    id: 'melee_whip',
    name: 'Кнут',
    description: 'Гибкое оружие для контроля дистанции.',
    category: ItemCategory.MELEE,
    price: 700,
    weight: 1,
		weaponStats: {modifier: 2, initiative: 2, damage: 1, crit: 4, range: 1, properties: ['Лёгкое', 'Маленькое', 'Гибкое']}
  },
  {
    id: 'melee_spear',
    name: 'Копьё',
    description: 'Длинное колющее древковое оружие.',
    category: ItemCategory.MELEE,
    price: 1300,
    weight: 2,
		weaponStats: {modifier: 1, initiative: 2, damage: 2, crit: 3, range: 1, properties: ['Длинное']}
  },
  {
    id: 'melee_twin_blade',
    name: 'Парный клинок',
    description: 'Двусторонний клинок для стремительных атак.',
    category: ItemCategory.MELEE,
    price: 2400,
    weight: 2,
		weaponStats: {modifier: 0, initiative: 2, damage: 2, crit: 2, range: 1, properties: ['Длинное']}
  },
  {
    id: 'melee_scythe',
    name: 'Коса',
    description: 'Тяжёлая коса с широким лезвием.',
    category: ItemCategory.MELEE,
    price: 1500,
    weight: 2,
		weaponStats: {modifier: 1, initiative: 0, damage: 2, crit: 3, range: 1, properties: ['Тяжёлое', 'Длинное', 'Широкое лезвие']}
  },
  {
    id: 'melee_brass_knuckles',
    name: 'Кастет',
    description: 'Металлический кастет для ударов врукопашную.',
    category: ItemCategory.MELEE,
    price: 500,
    weight: 0.5,
		weaponStats: {modifier: 0, initiative: 4, damage: 2, crit: 3, range: 1, properties: ['Лёгкое', 'Маленькое']}
  },
  {
    id: 'melee_claws',
    name: 'Когти',
    description: 'Наручные когти для ближнего боя.',
    category: ItemCategory.MELEE,
    price: 1600,
    weight: 1,
		weaponStats: {modifier: 0, initiative: 3, damage: 1, crit: 1, range: 1, properties: ['Лёгкое']}
  },
  {
    id: 'melee_torch',
    name: 'Факел',
    description: 'Горящий факел, который можно использовать как оружие.',
    category: ItemCategory.MELEE,
    price: 100,
    weight: 1,
		weaponStats: {modifier: -1, initiative: 1, damage: 1, crit: null, range: 1, properties: ['Лёгкое', 'Воспламеняющее (1)']}
  },
    // --- ПИСТОЛЕТЫ ---

  {
    id: 'pistol_kurovski',
    name: 'Пистолет Куровски',
    description: 'Стандартный пистолет Куровски для боя на средней дистанции.',
    category: ItemCategory.PISTOLS,
    price: 1400,
    weaponStats: {
      modifier: 0,
      initiative: 2,
      damage: 2,
      range: 2, // Средняя
      crit: 2,
      properties: ['Лёгкое'],
	   ammoCapacity: 10,
    },
  },
  {
    id: 'pistol_kurovski_heavy',
    name: 'Тяжёлый пистолет Куровски',
    description: 'Усиленная модель пистолета Куровски с повышенным уроном.',
    category: ItemCategory.PISTOLS,
    price: 1800,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 3,
      range: 2, // Средняя
      crit: 2,
      properties: ['Надёжное'],
	  ammoCapacity: 10,
    },
  },
  {
    id: 'pistol_makov',
    name: 'Пистолет Макова',
    description: 'Пистолет Макова с улучшенной точностью и критическим потенциалом.',
    category: ItemCategory.PISTOLS,
    price: 1399,
    weaponStats: {
      modifier: 1,
      initiative: 2,
      damage: 2,
      range: 2, // Средняя
      crit: 3,
      properties: ['Лёгкое'],
	  ammoCapacity: 10,
    },
  },
  {
    id: 'pistol_makov_pocket',
    name: 'Карманный пистолет Макова',
    description: 'Компактный вариант пистолета Макова, удобен для скрытого ношения.',
    category: ItemCategory.PISTOLS,
    price: 1199,
    weaponStats: {
      modifier: 1,
      initiative: 4,
      damage: 1,
      range: 2, // Средняя
      crit: 3,
      properties: ['Лёгкое', 'маленькое'],
	  ammoCapacity: 6,
    },
  },
  {
    id: 'pistol_makov_laser',
    name: 'Лазерный пистолет Макова',
    description: 'Лазерный пистолет Макова, эффективен на дальней дистанции.',
    category: ItemCategory.PISTOLS,
    price: 3799,
    weaponStats: {
      modifier: 1,
      initiative: 0,
      damage: 2,
      range: 3, // Дальняя
      crit: 2,
      properties: [],
	  ammoCapacity: 15,
    },
  },
  {
    id: 'pistol_kurovski_rail',
    name: 'Рельсовый пистолет Куровски',
    description: 'Рельсовый пистолет Куровски с бесшумным и бронебойным выстрелом.',
    category: ItemCategory.PISTOLS,
    price: 3800,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 2,
      range: 3, // Дальняя
      crit: 1,
      properties: ['Бесшумное', 'бронебойное'],
	  ammoCapacity: 5,
    },
  },
  {
    id: 'revolver_heavy',
    name: 'Крупнокалиберный револьвер',
    description: 'Мощный крупнокалиберный револьвер с увеличенным уроном.',
    category: ItemCategory.PISTOLS,
    price: 2000,
    weaponStats: {
      modifier: -1,
      initiative: -2,
      damage: 4,
      range: 2, // Средняя
      crit: 2,
      properties: [],
	  ammoCapacity: 6,
    },
  },
  {
    id: 'pistol_usi',
    name: 'Укороченный самозарядный испепелитель (УСИ)',
    description: 'Компактный самозарядный испепелитель с автоматическим огнём.',
    category: ItemCategory.PISTOLS,
    price: 2400,
    weaponStats: {
      modifier: -1,
      initiative: 3,
      damage: 2,
      range: 2, // Средняя
      crit: 2,
      properties: ['Автоматическое', 'лёгкое'],
	  ammoCapacity: 3,
    },
  },
  {
    id: 'smg_shagov',
    name: 'Пистолет-пулемёт Шагова',
    description: 'Пистолет-пулемёт Шагова с автоматическим огнём и вместительным магазином.',
    category: ItemCategory.PISTOLS,
    price: 2800,
    weaponStats: {
      modifier: -1,
      initiative: 0,
      damage: 1,
      range: 2, // Средняя
      crit: 3,
      properties: ['Автоматическое', 'вместительный магазин'],
	  ammoCapacity: 30,
    },
  },
  {
    id: 'smg_viktor',
    name: 'Пистолет-пулемёт «Виктор»',
    description: 'Пистолет-пулемёт «Виктор», надёжный автоматический образец.',
    category: ItemCategory.PISTOLS,
    price: 3400,
    weaponStats: {
      modifier: 0,
      initiative: 1,
      damage: 1,
      range: 2, // Средняя
      crit: 3,
      properties: ['Автоматическое'],
	  ammoCapacity: 20,
    },
  },
  {
    id: 'shocker',
    name: 'Шокер',
    description: 'Электрошоковое оружие для боя в упор, с нелетальным действием.',
    category: ItemCategory.PISTOLS,
    price: 1800,
    weaponStats: {
      modifier: 1,
      initiative: 2,
      damage: 2,
      range: 0, // В упор
      crit: 1,
      properties: ['Лёгкое', 'однозарядное', 'нелетальное'],
	  ammoCapacity: 1,
    },
  },
  {
    id: 'flare_gun',
    name: 'Сигнальный пистолет',
    description: 'Сигнальный пистолет для подачи сигналов и воспламенения целей.',
    category: ItemCategory.PISTOLS,
    price: 1000,
    weaponStats: {
      modifier: -2,
      initiative: 2,
      damage: 1,
      range: 1, // Близкая
      crit: null,
      properties: ['Лёгкое', 'однозарядное', 'воспламеняющее (2)', 'специальные боеприпасы'],
	  ammoCapacity: 1,
    },
  },
  // --- КАРАБИНЫ / АВТОМАТЫ ---

  {
    id: 'carbine_kurovski_auto',
    name: 'Автомат Куровски',
    description: 'Автомат Куровски для боя на средней дистанции, с автоматическим огнём.',
    category: ItemCategory.CARABINS,
    price: 4000,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 3,
      range: 2, // Средняя
      crit: 2,
      properties: ['Автоматическое'],
	  ammoCapacity: 30,
    },
  },
  {
    id: 'carbine_kurovski_short',
    name: 'Автомат Куровски сильно укороченный',
    description: 'Сильно укороченный вариант автомата Куровски, более лёгкий и манёвренный.',
    category: ItemCategory.CARABINS,
    price: 3800,
    weaponStats: {
      modifier: 0,
      initiative: 2,
      damage: 2,
      range: 2, // Средняя
      crit: 2,
      properties: ['Автоматическое', 'лёгкое'],
	  ammoCapacity: 25,
    },
  },
  {
    id: 'carbine_kurovski_rail_thunder',
    name: 'Рельсовый карабин Куровски «Громобой»',
    description: 'Рельсовый карабин Куровски «Громобой», бесшумный и бронебойный.',
    category: ItemCategory.CARABINS,
    price: 6800,
    weaponStats: {
      modifier: 1,
      initiative: 0,
      damage: 3,
      range: 3, // Дальняя
      crit: 1,
      properties: ['Автоматическое', 'бесшумное', 'бронебойное'],
	  ammoCapacity: 20,
    },
  },
  {
    id: 'carbine_makov',
    name: 'Карабин Макова',
    description: 'Карабин Макова с автоматическим огнём для средней дистанции.',
    category: ItemCategory.CARABINS,
    price: 3999,
    weaponStats: {
      modifier: 1,
      initiative: 0,
      damage: 2,
      range: 2, // Средняя
      crit: 2,
      properties: ['Автоматическое'],
	  ammoCapacity: 30,
    },
  },
  {
    id: 'carbine_makov_assault',
    name: 'Штурмовой карабин Макова',
    description: 'Штурмовой карабин Макова с улучшенной инициативой и критическим шансом.',
    category: ItemCategory.CARABINS,
    price: 3799,
    weaponStats: {
      modifier: 1,
      initiative: 2,
      damage: 2,
      range: 2, // Средняя
      crit: 3,
      properties: ['Автоматическое'],
	  ammoCapacity: 30,
    },
  },
  {
    id: 'carbine_makov_laser',
    name: 'Лазерный карабин Макова',
    description: 'Лазерный карабин Макова с высоким модификатором точности.',
    category: ItemCategory.CARABINS,
    price: 6799,
    weaponStats: {
      modifier: 2,
      initiative: 0,
      damage: 2,
      range: 2, // Средняя
      crit: 2,
      properties: ['Автоматическое'],
	  ammoCapacity: 20,
    },
  },
  {
    id: 'carbine_lavina',
    name: '«ЛАВина»',
    description: 'Модель «ЛАВина»: тихий автоматический карабин с оптическим прицелом.',
    category: ItemCategory.CARABINS,
    price: 6800,
    weaponStats: {
      modifier: 1,
      initiative: 0,
      damage: 2,
      range: 3, // Дальняя
      crit: 3,
      properties: ['Автоматическое', 'бесшумное', 'оптический прицел'],
	  ammoCapacity: 20,
    },
  },
  {
    id: 'carbine_fenek',
    name: '«Фенёк»',
    description: 'Карабин «Фенёк»: мощный и надёжный автоматический образец.',
    category: ItemCategory.CARABINS,
    price: 6800,
    weaponStats: {
      modifier: 2,
      initiative: 0,
      damage: 3,
      range: 2, // Средняя
      crit: 3,
      properties: ['Автоматическое', 'надёжное'],
	  ammoCapacity: 20,
    },
  },
  {
    id: 'carbine_sych',
    name: '«Сыч»',
    description: 'Карабин «Сыч» с коллиматорным прицелом для точной стрельбы.',
    category: ItemCategory.CARABINS,
    price: 7400,
    weaponStats: {
      modifier: 1,
      initiative: 2,
      damage: 2,
      range: 2, // Средняя
      crit: 2,
	  ammoCapacity: 25,
      properties: ['Автоматическое', 'коллиматорный прицел'],
    },
  },
  // --- ВИНТОВКИ ---

  {
    id: 'rifle_kurovski_akkord',
    name: 'Снайперская винтовка Куровски «Аккорд»',
    description: 'Снайперская винтовка Куровски «Аккорд» с оптическим прицелом.',
    category: ItemCategory.RIFLES,
    price: 4400,
    weaponStats: {
      modifier: 0,
      initiative: -2,
      damage: 3,
      range: 3, // Дальняя
      crit: 2,
      properties: ['Автоматическое', 'оптический прицел'],
	  ammoCapacity: 10,
    },
  },
  {
    id: 'rifle_kurovski_rail',
    name: 'Рельсовая винтовка Куровски',
    description: 'Рельсовая винтовка Куровски, бесшумная и бронебойная.',
    category: ItemCategory.RIFLES,
    price: 6400,
    weaponStats: {
      modifier: 0,
      initiative: -2,
      damage: 3,
      range: 4, // Предельная
      crit: 1,
      properties: ['Бесшумное', 'бронебойное'],
	  ammoCapacity: 5,
    },
  },
  {
    id: 'rifle_makov_garant',
    name: 'Винтовка Макова «Гарант»',
    description: 'Винтовка Макова «Гарант» со штык-ножом.',
    category: ItemCategory.RIFLES,
    price: 4399,
    weaponStats: {
      modifier: 2,
      initiative: -2,
      damage: 2,
      range: 3, // Дальняя
      crit: 2,
      properties: ['Штык-нож'],
	  ammoCapacity: 20,
    },
  },
  {
    id: 'rifle_makov_laser',
    name: 'Лазерная винтовка Макова',
    description: 'Лазерная винтовка Макова для поражения целей на предельной дистанции.',
    category: ItemCategory.RIFLES,
    price: 6399,
    weaponStats: {
      modifier: 2,
      initiative: -2,
      damage: 2,
      range: 4, // Предельная
      crit: 3,
      properties: [],
	  ammoCapacity: 20,
    },
  },
  {
    id: 'rifle_sawed_off',
    name: 'Самодельный обрез винтовки',
    description: 'Самодельный обрез винтовки для боя на средней–дальней дистанции.',
    category: ItemCategory.RIFLES,
    price: 1400,
    weaponStats: {
      modifier: 0,
      initiative: 2,
      damage: 2,
      range: 3, // Дальняя
      crit: 3,
      properties: [],
	  ammoCapacity: 15,
    },
  },
  {
    id: 'rifle_kosin',
    name: 'Винтовка Косина',
    description: 'Винтовка Косина с повышенным уроном.',
    category: ItemCategory.RIFLES,
    price: 2800,
    weaponStats: {
      modifier: 1,
      initiative: 0,
      damage: 3,
      range: 3, // Дальняя
      crit: 3,
      properties: [],
	  ammoCapacity: 20,
    },
  },
  {
    id: 'rifle_laser_musket',
    name: 'Лазерный мушкет',
    description: 'Лазерный мушкет: мощный однозарядный выстрел с длительной перезарядкой.',
    category: ItemCategory.RIFLES,
    price: 2800,
    weaponStats: {
      modifier: 2,
      initiative: 0,
      damage: 2,
      range: 3, // Дальняя
      crit: 3,
      properties: ['Однозарядное', 'длительная перезарядка'],
	  ammoCapacity: 1,
    },
  },
  {
    id: 'rifle_lever',
    name: '«Рычажка»',
    description: 'Винтовка «Рычажка» со скорострельным рычажным механизмом.',
    category: ItemCategory.RIFLES,
    price: 2400,
    weaponStats: {
      modifier: 1,
      initiative: 2,
      damage: 2,
      range: 2, // Средняя
      crit: 2,
      properties: [],
	  ammoCapacity: 20,
    },
  },
  {
    id: 'rifle_khlopok',
    name: '«Хлопок»',
    description: 'Тихая винтовка «Хлопок» с автоматическим огнём и оптическим прицелом.',
    category: ItemCategory.RIFLES,
    price: 9000,
    weaponStats: {
      modifier: 0,
      initiative: -2,
      damage: 3,
      range: 3, // Дальняя
      crit: 3,
      properties: ['Бесшумное', 'автоматическое', 'оптический прицел'],
	  ammoCapacity: 20,
    },
  },
  {
    id: 'rifle_shchelban_svaroga',
    name: '«Щелбан Сварога»',
    description: 'Тяжёлая винтовка «Щелбан Сварога» с колоссальным уроном.',
    category: ItemCategory.RIFLES,
    price: 14000,
    weaponStats: {
      modifier: 0,
      initiative: -6,
      damage: 5,
      range: 4, // Предельная
      crit: 1,
      properties: ['Громоздкое', 'однозарядное', 'бронебойное', 'долгая перезарядка'],
	  ammoCapacity: 1,
    },
  },
  // --- ДРОБОВИКИ ---

  {
    id: 'shotgun_sawed_off_double',
    name: 'Обрез двустволки',
    description: 'Обрез двуствольного дробовика, максимально опасен в упор.',
    category: ItemCategory.SHOTGUNS,
    price: 2400,
    weaponStats: {
      modifier: 2,
      initiative: 3,
      damage: 2,
      range: 0, // В упор
      crit: 2,
      properties: ['Однозарядное', 'разброс'],
	  ammoCapacity: 1,
    },
  },
  {
    id: 'shotgun_double',
    name: 'Двустволка',
    description: 'Классическая двуствольная модель дробовика.',
    category: ItemCategory.SHOTGUNS,
    price: 3400,
    weaponStats: {
      modifier: 2,
      initiative: 0,
      damage: 2,
      range: 2, // Средняя
      crit: 2,
      properties: ['Однозарядное', 'разброс'],
	  ammoCapacity: 1,
    },
  },
  {
    id: 'shotgun_pump',
    name: 'Помповый дробовик',
    description: 'Помповый дробовик с высокой мощностью и долгой перезарядкой.',
    category: ItemCategory.SHOTGUNS,
    price: 3800,
    weaponStats: {
      modifier: 2,
      initiative: -2,
      damage: 2,
      range: 1, // Ближняя
      crit: 2,
      properties: ['Разброс', 'длительная перезарядка'],
	  ammoCapacity: 6,
    },
  },
  {
    id: 'shotgun_spas12',
    name: 'Спасатель-12',
    description: 'Надёжный дробовик «Спасатель-12» для ближнего боя.',
    category: ItemCategory.SHOTGUNS,
    price: 4400,
    weaponStats: {
      modifier: 1,
      initiative: -2,
      damage: 3,
      range: 1, // Ближняя
      crit: 2,
      properties: ['Надёжное', 'разброс'],
	  ammoCapacity: 10,
    },
  },
  {
    id: 'shotgun_supernova',
    name: 'Сверхновая',
    description: 'Мощный дробовик «Сверхновая» с бронебойными боеприпасами.',
    category: ItemCategory.SHOTGUNS,
    price: 4400,
    weaponStats: {
      modifier: 2,
      initiative: 0,
      damage: 3,
      range: 1, // Ближняя
      crit: 3,
      properties: ['Разброс', 'бронебойное'],
	  ammoCapacity: 6,
    },
  },
  {
    id: 'shotgun_taiga',
    name: 'Тайга',
    description: 'Дробовик «Тайга», ориентированный на ближний бой.',
    category: ItemCategory.SHOTGUNS,
    price: 4400,
    weaponStats: {
      modifier: 2,
      initiative: 2,
      damage: 2,
      range: 1, // Ближняя
      crit: 2,
      properties: ['Разброс'],
	  ammoCapacity: 8,
    },
  },
  {
    id: 'shotgun_jackhammer',
    name: '«Отбойный молоток»',
    description: 'Автоматический дробовик «Отбойный молоток» с большим магазином.',
    category: ItemCategory.SHOTGUNS,
    price: 8600,
    weaponStats: {
      modifier: 2,
      initiative: 0,
      damage: 2,
      range: 1, // Ближняя
      crit: 2,
      properties: ['Автоматическое', 'разброс', 'вместительный магазин'],
	  ammoCapacity: 12,
    },
  },
  // --- ТЯЖЁЛОЕ ОРУЖИЕ ---

  {
    id: 'heavy_mg_kurovski',
    name: 'Пулемёт Куровски',
    description: 'Тяжёлый пулемёт Куровски с вместительным магазином.',
    category: ItemCategory.HEAVYS,
    price: 9400,
    weaponStats: {
      modifier: 0,
      initiative: -4,
      damage: 4,
      range: 2, // Средняя
      crit: 2,
      properties: ['Громоздкое', 'вместительный магазин', 'длительная перезарядка'],
	  ammoCapacity: 100,
    },
  },
  {
    id: 'heavy_laser_mg_makov',
    name: 'Лазерный пулемёт Макова',
    description: 'Лазерный пулемёт Макова для дальнего подавляющего огня.',
    category: ItemCategory.HEAVYS,
    price: 9399,
    weaponStats: {
      modifier: 1,
      initiative: -4,
      damage: 3,
      range: 3, // Дальняя
      crit: 2,
      properties: ['Громоздкое', 'вместительный магазин', 'длительная перезарядка'],
	  ammoCapacity: 60,
    },
  },
  {
    id: 'heavy_flamethrower',
    name: 'Огнемёт',
    description: 'Огнемёт для ближнего боя, создающий конус пламени.',
    category: ItemCategory.HEAVYS,
    price: 6800,
    weaponStats: {
      modifier: 1,
      initiative: -2,
      damage: 3,
      range: 1, // Ближняя
      crit: 1,
      properties: ['Тяжёлое', 'воспламеняющее (3)', 'разброс'],
	  ammoCapacity: 10,
    },
  },
  {
    id: 'heavy_grenade_launcher',
    name: 'Гранатомёт',
    description: 'Гранатомёт для стрельбы специальными гранатами.',
    category: ItemCategory.HEAVYS,
    price: 8000,
    weaponStats: {
      modifier: 0,
      initiative: -4,
      damage: 0, // урон зависит от гранаты
      range: 3, // Дальняя
      crit: null,
      properties: ['Тяжёлое', 'однозарядное', 'специальные боеприпасы', 'противотранспортное'],
    ammoCapacity: 1,
	},
  },
  {
    id: 'heavy_at_rifle',
    name: 'ПТ-ружьё',
    description: 'Противотанковое ружьё с огромным уроном по технике.',
    category: ItemCategory.HEAVYS,
    price: 8800,
    weaponStats: {
      modifier: 2,
      initiative: -4,
      damage: 5,
      range: 3, // Дальняя
      crit: 2,
      properties: ['Громоздкое', 'однозарядное', 'противотранспортное'],
	  ammoCapacity: 1,
    },
  },
  {
    id: 'heavy_manpads',
    name: 'Переносной зенитный ракетный комплекс',
    description: 'ПЗРК для поражения воздушных и крупногабаритных целей.',
    category: ItemCategory.HEAVYS,
    price: 8400,
    weaponStats: {
      modifier: 2,
      initiative: -4,
      damage: 5,
      range: 4, // Предельная
      crit: 2,
      properties: ['Тяжёлое', 'однозарядное', 'противотранспортное'],
	  ammoCapacity: 1,
    },
  },
  {
    id: 'heavy_breath_of_morena',
    name: '«Дыхание Морены» (рельсовый пулемёт)',
    description: 'Рельсовый пулемёт «Дыхание Морены» с бронебойным боем.',
    category: ItemCategory.HEAVYS,
    price: 24000,
    weaponStats: {
      modifier: 1,
      initiative: -4,
      damage: 3,
      range: 3, // Дальняя
      crit: 1,
      properties: ['Бронебойное', 'громоздкое', 'вместительный магазин'],
	  ammoCapacity: 75,
    },
  },
  // --- ПРОЧЕЕ ОРУЖИЕ ---

  {
    id: 'stationary_mg',
    name: 'Стационарный пулемёт',
    description: 'Стационарный пулемёт с огромной плотностью огня.',
    category: ItemCategory.RANGED,
    price: 24000,
    weaponStats: {
      modifier: 1,
      initiative: -2,
      damage: 4,
      range: 3, // Дальняя
      crit: 2,
      properties: ['Громоздкое', 'вместительный магазин', 'стационарное'],
	  ammoCapacity: 100,
    },
  },
  {
    id: 'stationary_aa_gun',
    name: 'Стационарная зенитная пушка',
    description: 'Стационарная зенитная пушка для поражения крупной техники и целей.',
    category: ItemCategory.RANGED,
    price: 25000,
    weaponStats: {
      modifier: 2,
      initiative: -2,
      damage: 4,
      range: 4, // Предельная
      crit: 2,
      properties: ['Громоздкое', 'вместительный магазин', 'стационарное', 'противотранспортное'],
    ammoCapacity: 10,
	},
  },
  {
    id: 'stationary_autocannon',
    name: 'Стационарная автопушка',
    description: 'Стационарная автопушка с разрушительным уроном.',
    category: ItemCategory.RANGED,
    price: 34000,
    weaponStats: {
      modifier: 0,
      initiative: -4,
      damage: 5,
      range: 4, // Предельная
      crit: 2,
      properties: ['Громоздкое', 'вместительный магазин', 'стационарное', 'противотранспортное'],
    ammoCapacity: 100,
	},
  },
  {
    id: 'harpoon_gun',
    name: 'Гарпунное ружьё',
    description: 'Гарпунное ружьё для метания гарпунов на средней дистанции.',
    category: ItemCategory.RANGED,
    price: 2800,
    weaponStats: {
      modifier: 1,
      initiative: 0,
      damage: 2,
      range: 2, // Средняя
      crit: null,
      properties: ['Однозарядное', 'специальные боеприпасы'],
    ammoCapacity: 1,
	},
  },
  {
    id: 'blowpipe',
    name: 'Духовая трубка',
    description: 'Духовая трубка для скрытной стрельбы особыми дротиками.',
    category: ItemCategory.RANGED,
    price: 400,
    weaponStats: {
      modifier: 1,
      initiative: 0,
      damage: 1,
      range: 2, // Средняя
      crit: null,
      properties: ['Однозарядное', 'специальные боеприпасы'],
ammoCapacity: 1,   
   },
  },
  {
    id: 'bow',
    name: 'Лук',
    description: 'Классический лук для стрельбы на средней дистанции.',
    category: ItemCategory.RANGED,
    price: 800,
    weaponStats: {
      modifier: 2,
      initiative: 0,
      damage: 2,
      range: 2, // Средняя
      crit: 3,
      properties: ['Однозарядное', 'специальные боеприпасы'],
    ammoCapacity: 1,
	},
  },
  {
    id: 'crossbow',
    name: 'Арбалет',
    description: 'Тяжёлый арбалет для точной стрельбы на дальнюю дистанцию.',
    category: ItemCategory.RANGED,
    price: 1000,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 3,
      range: 3, // Дальняя
      crit: 2,
      properties: ['Однозарядное', 'специальные боеприпасы'],
    ammoCapacity: 1,
	},
  },
  {
    id: 'pneumatic_injector',
    name: 'Пневматический инъектор',
    description: 'Инъектор для доставки химических или медицинских препаратов.',
    category: ItemCategory.RANGED,
    price: 1100,
    weaponStats: {
      modifier: 2,
      initiative: 2,
      damage: 0, // боевой урон не основной
      range: 2, // Средняя
      crit: null,
      properties: ['Лёгкое', 'однозарядное', 'специальные боеприпасы'],
ammoCapacity: 1,   
   },
  },
  {
    id: 'launcher_23mm_privet',
    name: '23-мм «Привет»',
    description: '23-мм «Привет» — мощный нелетальный метатель специальных боеприпасов.',
    category: ItemCategory.RANGED,
    price: 3400,
    weaponStats: {
      modifier: 0,
      initiative: -2,
      damage: 4,
      range: 2, // Средняя
      crit: 1,
      properties: ['Однозарядное', 'нелетальное', 'специальные боеприпасы'],
ammoCapacity: 1,   
   },
  },
  // --- ЛЁГКИЕ ДОСПЕХИ ---

  {
    id: 'armor_light_casual_clothes',
    name: 'Повседневная одежда',
    description: 'Класс защиты: 0. Свойства: лёгкая, климатическая защита, может быть надета поверх/под другую броню.',
    category: ItemCategory.ARMOR,
    price: 500,
  },
  {
    id: 'armor_light_camouflage_robe',
    name: 'Маскировочный халат',
    description: 'Класс защиты: 0. Свойства: лёгкая, камуфляж.',
    category: ItemCategory.ARMOR,
    price: 3000,
  },
  {
    id: 'armor_light_flight_suit',
    name: 'Лётный комбинезон/куртка',
    description: 'Класс защиты: 1. Свойства: лёгкая, огнестойкая (3).',
    category: ItemCategory.ARMOR,
    price: 1200,
  },
  {
    id: 'armor_light_station_suit',
    name: 'Станционный костюм',
    description: 'Класс защиты: 1. Свойства: лёгкая, магнитные ботинки.',
    category: ItemCategory.ARMOR,
    price: 1200,
  },
  {
    id: 'armor_light_dress_suit',
    name: `Официальный костюм с броневставками`,
    description: 'Класс защиты: 1. Свойства: лёгкая.',
    category: ItemCategory.ARMOR,
    price: 2000,
  },
  {
    id: 'armor_light_leather',
    name: 'Кожаная броня',
    description: 'Класс защиты: 2. Свойства: лёгкая.',
    category: ItemCategory.ARMOR,
    price: 3300,
  },
  {
    id: 'armor_light_kevlar_vest',
    name: 'Кевларовый жилет',
    description: 'Класс защиты: 3. Свойства: лёгкая.',
    category: ItemCategory.ARMOR,
    price: 5200,
  },
  {
    id: 'armor_light_combat',
    name: 'Лёгкая боевая броня',
    description: 'Класс защиты: 4. Свойства: лёгкая.',
    category: ItemCategory.ARMOR,
    price: 12000,
  },
  {
    id: 'armor_light_carbon',
    name: 'Углеволоконная броня',
    description: 'Класс защиты: 5. Свойства: лёгкая.',
    category: ItemCategory.ARMOR,
    price: 17000,
  },
  // --- СРЕДНИЕ ДОСПЕХИ ---

  {
    id: 'armor_medium_explorer_suit',
    name: 'Костюм исследователя',
    description: 'Класс защиты: 1. Свойства: датчик движения, встроенное оборудование.',
    category: ItemCategory.ARMOR,
    price: 3500,
  },
  {
    id: 'armor_medium_shirt',
    name: 'Бронерубаха',
    description: 'Класс защиты: 3.',
    category: ItemCategory.ARMOR,
    price: 3200,
  },
  {
    id: 'armor_medium_exosuit',
    name: 'Экзоскафандр',
    description: 'Класс защиты: 2. Свойства: скафандр, запас кислорода, маневровые двигатели, магнитные ботинки, термостатичная.',
    category: ItemCategory.ARMOR,
    price: 4000,
  },
  {
    id: 'armor_medium_pirate_assault',
    name: 'Пиратская штурмовая броня',
    description: 'Класс защиты: 3. Свойства: встроенный реактивный ранец, магнитные ботинки, скафандр, запас кислорода.',
    category: ItemCategory.ARMOR,
    price: 6300,
  },
  {
    id: 'armor_medium_guard',
    name: 'Доспехи стражи',
    description: 'Класс защиты: 4.',
    category: ItemCategory.ARMOR,
    price: 8400,
  },
  {
    id: 'armor_medium_combat',
    name: 'Средняя боевая броня',
    description: 'Класс защиты: 5.',
    category: ItemCategory.ARMOR,
    price: 17000,
  },
  {
    id: 'armor_medium_aramid',
    name: 'Броня из арамида',
    description: 'Класс защиты: 6. Свойства: гидростатический гель.',
    category: ItemCategory.ARMOR,
    price: 34000,
  },
  {
    id: 'armor_medium_elite',
    name: 'Элитный бронекостюм',
    description: 'Класс защиты: 7.',
    category: ItemCategory.ARMOR,
    price: 65000,
  },
  // --- ТЯЖЁЛЫЕ ДОСПЕХИ ---

  {
    id: 'armor_heavy_archaic',
    name: 'Архаичная тяжёлая броня',
    description: 'Класс защиты: 4. Свойства: тяжёлая.',
    category: ItemCategory.ARMOR,
    price: 3000,
  },
  {
    id: 'armor_heavy_plate',
    name: 'Боевые латы',
    description: 'Класс защиты: 5. Свойства: тяжёлая.',
    category: ItemCategory.ARMOR,
    price: 11000,
  },
  {
    id: 'armor_heavy_combat',
    name: 'Тяжёлая боевая броня',
    description: 'Класс защиты: 6. Свойства: тяжёлая.',
    category: ItemCategory.ARMOR,
    price: 18000,
  },
  {
    id: 'armor_heavy_exosuit',
    name: 'Боевой экзоскафандр',
    description: 'Класс защиты: 6. Свойства: тяжёлая, скафандр, запас кислорода, маневровые двигатели, магнитные ботинки, термостатичная.',
    category: ItemCategory.ARMOR,
    price: 30000,
  },
  {
    id: 'armor_heavy_composite',
    name: 'Композитная тяжёлая броня',
    description: 'Класс защиты: 7. Свойства: тяжёлая.',
    category: ItemCategory.ARMOR,
    price: 45000,
  },
  {
    id: 'armor_heavy_power',
    name: 'Силовая броня',
    description: 'Класс защиты: 9. Свойства: громоздкая, усиленные сервоприводы, реактивные двигатели.',
    category: ItemCategory.ARMOR,
    price: 65000,
  },
  {
    id: 'armor_heavy_elite_exo',
    name: 'Элитный экзодоспех',
    description: 'Класс защиты: 10. Свойства: громоздкая, скафандр, запас кислорода, маневровые двигатели, магнитные ботинки, термостатичная, усиленные сервоприводы.',
    category: ItemCategory.ARMOR,
    price: 80000,
  },
  // --- ЩИТЫ ---

  {
    id: 'shield_archaic',
    name: 'Архаичный щит',
    description: 'Класс защиты: 2. Свойства: тяжёлый.',
    category: ItemCategory.ARMOR,
    price: 1000,
  },
  {
    id: 'shield_tactical',
    name: 'Тактический щит',
    description: 'Класс защиты: 4. Свойства: тяжёлый.',
    category: ItemCategory.ARMOR,
    price: 4000,
  },
  {
    id: 'shield_combat',
    name: 'Боевой щит',
    description: 'Класс защиты: 6. Свойства: тяжёлый.',
    category: ItemCategory.ARMOR,
    price: 12000,
  },
  // --- ГРАНАТЫ ---

  {
    id: 'grenade_he',
    name: 'Фугасная граната',
    description: 'Фугасная граната повышенной мощности.',
    category: ItemCategory.EXPLOSIVE,
    price: 700,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 1, // Ближняя
      crit: 2,
      properties: ['Мощность 6', 'противотранспортная'],
    },
  },
  {
    id: 'grenade_frag',
    name: 'Осколочная граната',
    description: 'Осколочная граната для поражения пехоты.',
    category: ItemCategory.EXPLOSIVE,
    price: 900,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 1, // Ближняя
      crit: 1,
      properties: ['Мощность 5'],
    },
  },
  {
    id: 'grenade_shaped',
    name: 'Кумулятивная граната',
    description: 'Кумулятивная граната повышенной бронепробиваемости.',
    category: ItemCategory.EXPLOSIVE,
    price: 1200,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 0, // В упор
      crit: 2,
      properties: ['Мощность 8 (4 против пехоты)', 'противотранспортная'],
    },
  },
  {
    id: 'grenade_incendiary',
    name: 'Зажигательная граната',
    description: 'Зажигательная граната, поджигающая цели.',
    category: ItemCategory.EXPLOSIVE,
    price: 1500,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 1, // Ближняя
      crit: 2,
      properties: ['Мощность 4', 'воспламеняющая (2)'],
    },
  },
  {
    id: 'grenade_thermobaric',
    name: 'Термобарическая граната',
    description: 'Термобарическая граната большой мощности.',
    category: ItemCategory.EXPLOSIVE,
    price: 3000,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 1, // Ближняя
      crit: 1,
      properties: ['Мощность 9', 'воспламеняющая (3)', 'бронебойная'],
    },
  },
  {
    id: 'grenade_flashbang',
    name: 'Светошумовая граната',
    description: 'Светошумовая граната, наносящая урон воле и дезориентирующая.',
    category: ItemCategory.EXPLOSIVE,
    price: 700,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 1, // Ближняя
      crit: null,
      properties: ['Мощность 6', 'шок (3)', 'наносит урон воле'],
    },
  },
  {
    id: 'grenade_smoke',
    name: 'Дымовая граната',
    description: 'Дымовая граната, создающая завесу на средней дистанции от эпицентра.',
    category: ItemCategory.EXPLOSIVE,
    price: 900,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 0,
      range: 2, // Средняя
      crit: null,
      properties: ['создаёт дымовую завесу на средней дистанции от эпицентра взрыва'],
    },
  },
  {
    id: 'grenade_gas',
    name: 'Газовая граната',
    description: 'Газовая граната, выпускающая газ на средней дистанции от эпицентра.',
    category: ItemCategory.EXPLOSIVE,
    price: 1200,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 0,
      range: 2, // Средняя
      crit: null,
      properties: ['выпускает газ на средней дистанции от эпицентра взрыва'],
    },
  },
  {
    id: 'grenade_screening',
    name: 'Экранирующая граната',
    description: 'Экранирующая граната, блокирующая видимость в том числе для сенсоров и тепловизоров.',
    category: ItemCategory.EXPLOSIVE,
    price: 2500,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 0,
      range: 1, // Ближняя
      crit: null,
      properties: ['подобно дымовой, но не видно через сенсоры и тепловизоры'],
    },
  },
  // --- ВЗРЫВЧАТКА ---

  {
    id: 'explosive_mine_anti_personnel_contact',
    name: 'Контактная мина противопехотная',
    description: 'Контактная мина противопехотная, срабатывает без детонатора.',
    category: ItemCategory.EXPLOSIVE,
    price: 900,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 1, // Ближняя
      crit: 2,
      properties: ['Мощность 4', 'не требуется детонатор'],
    },
  },
  {
    id: 'explosive_mine_anti_vehicle_contact',
    name: 'Контактная мина противотранспортная',
    description: 'Контактная противотранспортная мина, срабатывающая без детонатора.',
    category: ItemCategory.EXPLOSIVE,
    price: 1900,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 1, // Ближняя
      crit: 2,
      properties: ['Мощность 6', 'не требуется детонатор', 'противотранспортное'],
    },
  },
  {
    id: 'explosive_charge_single',
    name: 'Подрывной пакет',
    description: 'Подрывной пакет небольшой мощности.',
    category: ItemCategory.EXPLOSIVE,
    price: 600,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 1, // Ближняя
      crit: 2,
      properties: ['Мощность 3', 'лёгкое', 'противотранспортное'],
    },
  },
  {
    id: 'explosive_charge_double',
    name: 'Двойной подрывной пакет',
    description: 'Усиленный двойной подрывной пакет.',
    category: ItemCategory.EXPLOSIVE,
    price: 1200,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 1, // Ближняя
      crit: 2,
      properties: ['Мощность 4', 'противотранспортное'],
    },
  },
  {
    id: 'explosive_charge_triple',
    name: 'Тройной подрывной пакет',
    description: 'Тройной подрывной пакет повышенной мощности.',
    category: ItemCategory.EXPLOSIVE,
    price: 1800,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 1, // Ближняя
      crit: 2,
      properties: ['Мощность 6', 'тяжёлое', 'противотранспортное'],
    },
  },
  {
    id: 'explosive_charge_quad',
    name: 'Четверной подрывной пакет',
    description: 'Четверной подрывной пакет крайне высокой мощности.',
    category: ItemCategory.EXPLOSIVE,
    price: 2400,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 2, // Средняя
      crit: 1,
      properties: ['Мощность 8', 'громоздкое', 'противотранспортное'],
    },
  },
  {
    id: 'explosive_object_mine_small',
    name: 'Объектная мина малая',
    description: 'Малая объектная мина для подрыва техники и объектов.',
    category: ItemCategory.EXPLOSIVE,
    price: 5000,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 1, // Ближняя
      crit: 1,
      properties: ['Мощность 6', 'тяжёлое', 'противотранспортное'],
    },
  },
  {
    id: 'explosive_object_mine_medium',
    name: 'Объектная мина средняя',
    description: 'Средняя объектная мина повышенной мощности.',
    category: ItemCategory.EXPLOSIVE,
    price: 10000,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 2, // Средняя
      crit: 1,
      properties: ['Мощность 8', 'тяжёлое', 'противотранспортное'],
    },
  },
  {
    id: 'explosive_object_mine_heavy',
    name: 'Объектная мина тяжёлая',
    description: 'Тяжёлая объектная мина для крупных целей.',
    category: ItemCategory.EXPLOSIVE,
    price: 20000,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 2, // Средняя
      crit: 1,
      properties: ['Мощность 12', 'громоздкое', 'противотранспортное'],
    },
  },
  {
    id: 'explosive_object_mine_superheavy',
    name: 'Объектная мина сверхтяжёлая',
    description: 'Сверхтяжёлая объектная мина максимальной мощности.',
    category: ItemCategory.EXPLOSIVE,
    price: 40000,
    weaponStats: {
      modifier: 0,
      initiative: 0,
      damage: 1,
      range: 2, // Средняя
      crit: 1,
      properties: ['Мощность 16', 'громоздкое', 'противотранспортное'],
    },
  },
  // --- ЭЛЕКСИРЫ ---

  {
    id: 'elixir_insight',
    name: 'Эликсир Проницательности',
    description:
      'Вы видите мельчайшие детали мимики людей, проще понимать мотивы и оказывать давление. +3 к проверкам влияния. Собеседник может отказаться с вами разговаривать, если узнает, что вы под действием эликсира.',
    category: ItemCategory.ELIXIR,
    price: 1700,
  },
  {
    id: 'elixir_clear_mind',
    name: 'Эликсир Ясного Разума',
    description:
      'Спокойствие наполняет разум, его сложно поколебать. +5 к проверкам сопротивления, влияющим на волю персонажа, включая попытки подчинить эту волю.',
    category: ItemCategory.ELIXIR,
    price: 2100,
  },
  {
    id: 'elixir_battle',
    name: 'Эликсир Битвы',
    description:
      'Время будто замедляется вокруг вас. Вы получаете +2 к навыкам ближнего боя и стрельбы на время действия эликсира.',
    category: ItemCategory.ELIXIR,
    price: 1800,
  },
  {
    id: 'elixir_fire_protection',
    name: 'Эликсир защиты от огня',
    description:
      'Кожа становится почти огнеупорной, покрывается защитной коркой. Даёт +3 к броне против огненного урона.',
    category: ItemCategory.ELIXIR,
    price: 1900,
  },
  {
    id: 'elixir_limitless_strength',
    name: 'Эликсир Беспредельной Силы',
    description:
      'Кровь наливается в жилах, мышцы напряжены до предела. +2 к проверкам Силы, +1 к урону в ближнем бою.',
    category: ItemCategory.ELIXIR,
    price: 1900,
  },
  {
    id: 'elixir_prophecy',
    name: 'Эликсир Провидения',
    description:
      'Вы впадаете в транс и видите картины прошлого, настоящего и будущего. Вы можете задать Мастеру один вопрос; он обязан прямо или косвенно, но честно ответить в ходе описания видения.',
    category: ItemCategory.ELIXIR,
    price: 7000,
  },
  {
    id: 'elixir_inspiration',
    name: 'Эликсир Вдохновения',
    description:
      'Вы ясно понимаете, как лучше всего действовать и использовать свои знания. Даёт +1 ко всем профессиональным навыкам на время действия.',
    category: ItemCategory.ELIXIR,
    price: 2000,
  },
  {
    id: 'elixir_speed',
    name: 'Эликсир Скорости',
    description:
      'Чувство лёгкости наполняет тело. Скорость передвижения персонажа увеличивается вдвое.',
    category: ItemCategory.ELIXIR,
    price: 2200,
  },
  {
    id: 'elixir_water',
    name: 'Эликсир Водяного',
    description:
      'Слизистые оболочки начинают впитывать кислород из воды. Персонаж может дышать под водой на время действия эликсира.',
    category: ItemCategory.ELIXIR,
    price: 3000,
  },
    // --- ПРЕДМЕТЫ ПОВСЕДНЕВНОГО ОБИХОДА ---
  {
    id: 'gear_holograph',
    name: 'Голограф',
    description: 'Бытовой голографический проектор базового класса.',
    category: ItemCategory.GEAR,
    price: 500,
    weight: 2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'gear_loudspeaker',
    name: 'Громкоговоритель',
    description: 'Портативная акустическая система для оповещений и речей.',
    category: ItemCategory.GEAR,
    price: 500,
    weight: 1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'gear_mre',
    name: 'ИРП',
    description: 'Индивидуальный рацион питания на один день.',
    category: ItemCategory.GEAR,
    price: 200,
    weight: 1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'gear_pocket_watch',
    name: 'Карманные часы',
    description: 'Механические или электронные часы в карманном корпусе.',
    category: ItemCategory.GEAR,
    price: 100,
    weight: 0.5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'gear_pda',
    name: 'КПК',
    description: 'Карманный персональный компьютер для заметок и связи.',
    category: ItemCategory.GEAR,
    price: 500,
    weight: 0.5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'gear_computer',
    name: 'Компьютер',
    description: `устройство для обработки данных и выполнения
различных операций. Отличается по производительности
и функциональности, обладает большим диапазоном возможностей,
нежели КПК`,
    category: ItemCategory.GEAR,
    price: 2000,
    weight: 3,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'gear_musical_instrument',
    name: 'Музыкальный инструмент',
    description: `электрогусли, дудка, гитара, небольшой
барабан — всё, что нужно, чтобы скрасить досуг. +1 к проверкам
влияния при попытках произвести впечатление`,
    category: ItemCategory.GEAR,
    price: 300,
    weight: 2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'gear_playing_cards',
    name: 'Набор игральных карт',
    description: 'для развлечения в долгих полётах',
    category: ItemCategory.GEAR,
    price: 50,
    weight: 0.1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'gear_cigarettes',
    name: 'Сигареты',
    description: 'Пачка сигарет или аналогичного табачного изделия.',
    category: ItemCategory.GEAR,
    price: 50,
    weight: 0.1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'gear_fuel_cell',
    name: 'Топливный элемент',
    description: 'Стандартный сменный топливный элемент для техники и генераторов.',
    category: ItemCategory.GEAR,
    price: 300,
    weight: 0.5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'gear_ebook_library',
    name: 'Электронная библиотека',
    description: `хранилище определённого, загруженного
в библиотеку набора данных. При подключении к КПК, компьютеру
или иному устройству с этими данными получится ознакомиться.
Может давать бонусы к проверкам профессиональных навыков от +1
до +3. Чем более узкоспециализированная информация — тем больше
бонус. На изучение информации для получения бонуса требуется
около получаса`,
    category: ItemCategory.GEAR,
    price: 500,
    weight: 0.3,
    modifiers: {},
    weaponStats: null,
  },

  // --- ЗНАХАРСТВО И МЕДИЦИНА ---
  {
    id: 'med_aibolit',
    name: 'АйБо-ЛИТ',
    description: 'Полуавтоматический медблок для диагностики и базовой терапии.',
    category: ItemCategory.GEAR,
    price: 10000,
    weight: 8,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'med_antidepressants',
    name: 'Антидепрессанты',
    description: 'Курс препаратов для стабилизации эмоционального состояния.',
    category: ItemCategory.GEAR,
    price: 200,
    weight: 0.1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'med_antirad_kit',
    name: 'Антирад-набор',
    description: 'Набор препаратов и средств для снижения радиационного поражения.',
    category: ItemCategory.GEAR,
    price: 300,
    weight: 0.5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'med_biomon',
    name: 'Биомонитор',
    description: `подключённый к пациенту позволяет выводить данные
о его текущем состоянии, оставлять заметки и результаты анализов
врачам, а также передавать информацию на другие устройства.
Незаменим в телемедицинской помощи и при консультациях`,
    category: ItemCategory.GEAR,
    price: 900,
    weight: 0.3,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'elixir_combat',
    name: 'Боевые эликсиры',
    description: 'Набор усилителей, временно повышающих боевые качества персонажа.',
    category: ItemCategory.ELIXIR,
    price: 1700,
    weight: 0.5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'med_doctor_case',
    name: 'Докторский чемодан',
    description: 'Даёт дополнительный складывающийся модификатор при оказании первой помощи и лечении травм.',
    category: ItemCategory.GEAR,
    price: 1000,
    weight: 3,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'med_spas_injector_small',
    name: 'СПАС-1',
    description: 'Мгновенно восстанавливает 2 здоровья. Модификатор проверки +1',
    category: ItemCategory.GEAR,
    price: 300,
    weight: 0.1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'med_spas_injector_medium',
    name: 'СПАС-2)',
    description: 'Мгновенно восстанавливает 3 здоровья. Модификатор проверки +2',
    category: ItemCategory.GEAR,
    price: 600,
    weight: 0.1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'med_spas_injector_large',
    name: 'СПАС-3',
    description: 'Мгновенно восстанавливает 4 здоровья. Модификатор проверки +3',
    category: ItemCategory.GEAR,
    price: 1200,
    weight: 0.1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'med_healing_herbs',
    name: 'Целебные травы',
    description: 'Собранные и подготовленные травы для настоев и припарок.',
    category: ItemCategory.GEAR,
    price: 100,
    weight: 0.5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'elixir_healing_small',
    name: 'Эликсир лечения (малый)',
    description: 'Флакон с малой дозой эликсира, восстанавливающего здоровье.',
    category: ItemCategory.ELIXIR,
    price: 300,
    weight: 0.2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'elixir_healing_medium',
    name: 'Эликсир лечения (средний)',
    description: 'Флакон со средней дозой эликсира, восстанавливающего здоровье.',
    category: ItemCategory.ELIXIR,
    price: 600,
    weight: 0.2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'elixir_healing_large',
    name: 'Эликсир лечения (большой)',
    description: 'Флакон с высокой дозой эликсира, восстанавливающего здоровье.',
    category: ItemCategory.ELIXIR,
    price: 1200,
    weight: 0.2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'elixir_poison',
    name: 'Яд',
    description: 'Концентрированный токсин, требующий осторожного обращения.',
    category: ItemCategory.ELIXIR,
    price: 500,
    weight: 0.1,
    modifiers: {},
    weaponStats: null,
  },

  // --- ВЫЖИВАНИЕ ---
  {
    id: 'surv_emergency_beacon',
    name: 'Аварийный сигнальный маяк',
    description: 'Устройство для подачи мощного сигнала бедствия.',
    category: ItemCategory.GEAR,
    price: 500,
    weight: 2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_scuba',
    name: 'Акваланг',
    description: 'Комплект для подводного дыхания и работы под водой.',
    category: ItemCategory.GEAR,
    price: 1500,
    weight: 8,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_rope',
    name: 'Верёвка',
    description: 'Прочная верёвка для подъёма, спуска и страховки.',
    category: ItemCategory.GEAR,
    price: 200,
    weight: 2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_water_filter',
    name: 'Водный фильтр',
    description: 'Переносной фильтр для очистки воды в полевых условиях.',
    category: ItemCategory.GEAR,
    price: 400,
    weight: 0.7,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_water_collector',
    name: 'Водосборник',
    description: 'Устройство для сбора и конденсации влаги.',
    category: ItemCategory.GEAR,
    price: 200,
    weight: 1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_trap',
    name: 'Капкан',
    description: `приспособление для ловли животных, основанное
на принципе зажима или удушения, предназначенное для
обеспечения источника пищи в дикой местности. +1 при проверках
выживания для добычи пищи`,
    category: ItemCategory.GEAR,
    price: 200,
    weight: 2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_compass',
    name: 'Компас',
    description: `устройство для определения направления движения,
основное средство ориентирования в неизвестной местности.
+1 при проверках выживания при ориентировании на местности`,
    category: ItemCategory.GEAR,
    price: 200,
    weight: 0.2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'survival_grappling_hook_rope',
    name: 'Крюк-кошка',
    description: `: специальное приспособление, состоящее из крюка
и троса, предназначенное для лёгкого восхождения по вертикальным
поверхностям или спасательных операций`,
    category: ItemCategory.GEAR,
    price: 400,
    weight: 2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_multitool',
    name: 'Мультитул «Выживальщик»',
    description: `многофункциональный инструмент,
включающий в себя ножик, шуруповёрт, пилу, открывашку и другие
полезные приспособления для выполнения различных задач
в условиях выживания`,
    category: ItemCategory.GEAR,
    price: 700,
    weight: 0.5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_cooking_set',
    name: 'Набор для приготовления пищи',
    description: 'Котелок, посуда и мелкая утварь для готовки в походе.',
    category: ItemCategory.GEAR,
    price: 500,
    weight: 1.5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_tent',
    name: 'Палатка',
    description: 'Двухместная палатка для длительных стоянок.',
    category: ItemCategory.GEAR,
    price: 2000,
    weight: 5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_parachute',
    name: 'Парашют',
    description: 'устройство для плавного спуска с высоты, обеспечивающее безопасное приземление в экстренных ситуациях.',
    category: ItemCategory.GEAR,
    price: 2200,
    weight: 6,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_food_mixer',
    name: 'Пищевой миксер',
    description: 'Портативный миксер для приготовления смесей и коктейлей.',
    category: ItemCategory.GEAR,
    price: 800,
    weight: 1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_generator',
    name: 'Портативный генератор',
    description: 'Компактный генератор электроэнергии.',
    category: ItemCategory.GEAR,
    price: 2000,
    weight: 10,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_gasmask',
    name: 'Противогаз',
    description: 'Средство защиты органов дыхания от токсичных веществ.',
    category: ItemCategory.GEAR,
    price: 700,
    weight: 1.5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_climbing_pins',
    name: 'Скалолазные крюки',
    description: 'Набор крюков и креплений для скалолазания.',
    category: ItemCategory.GEAR,
    price: 400,
    weight: 1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_sleeping_bag',
    name: 'Спальник',
    description: 'Тёплый спальник для ночёвки на открытом воздухе.',
    category: ItemCategory.GEAR,
    price: 500,
    weight: 2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'surv_flashlight',
    name: 'Фонарик',
    description: 'Портативный источник света, работает от батареек или аккумулятора.',
    category: ItemCategory.GEAR,
    price: 200,
    weight: 0.3,
    modifiers: {},
    weaponStats: null,
  },

  // --- СЛЕЖКА И ШПИОНАЖ ---
  {
    id: 'spy_binoculars',
    name: 'Бинокль',
    description: 'Оптический прибор для наблюдения на дальних дистанциях.',
    category: ItemCategory.GEAR,
    price: 400,
    weight: 0.8,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'spy_voice_mimic',
    name: 'Голосовой имитатор',
    description: 'Устройство, позволяющее имитировать чужой голос.',
    category: ItemCategory.GEAR,
    price: 1000,
    weight: 0.5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'spy_lockpick',
    name: 'Механическая отмычка',
    description: 'Набор инструментов для вскрытия механических замков.',
    category: ItemCategory.GEAR,
    price: 100,
    weight: 0.2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'spy_jammer',
    name: 'Постановщик помех',
    description: 'Генератор помех для блокировки связи и датчиков.',
    category: ItemCategory.GEAR,
    price: 2800,
    weight: 2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'spy_probe',
    name: 'Разведзонд',
    description: `небольшой БПЛА, управляемый вручную
или контролирующий местность по заданным параметрам автономно.
Оборудован камерой с 6‑кратным приближением.
Для работы требуется топливный элемент`,
    category: ItemCategory.GEAR,
    price: 4000,
    weight: 3,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'spy_fiberscope',
    name: 'Фиброскоп',
    description: `небольшой провод, подсоединяемый к КПК
или компьютеру с камерой на конце. Удобно просунуть под дверь,
чтобы понять, что вас за ней ждёт`,
    category: ItemCategory.GEAR,
    price: 1000,
    weight: 0.7,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'spy_uav',
    name: 'Шпионский БПЛА',
    description: 'Небольшой разведывательный беспилотник с камерой.',
    category: ItemCategory.GEAR,
    price: 6000,
    weight: 4,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'spy_drone_bug',
    name: 'Шпионский дрон-жук',
    description: 'Миниатюрный дрон в форме насекомого для скрытого наблюдения.',
    category: ItemCategory.GEAR,
    price: 2600,
    weight: 0.2,
    modifiers: {},
    weaponStats: null,
  },

  // --- НАУЧНЫЕ УСТРОЙСТВА ---
  {
    id: 'sci_acoustic_decoy',
    name: 'Акустический датчик-имитатор',
    description: `регистрирует акустические
сигналы животных и их коммуникацию для изучения поведения
и взаимодействия. Понаблюдав достаточное время за животным
и записав данные, вы можете произвести попытку сымитировать
общение с животным и даже отдать короткие команды`,
    category: ItemCategory.GEAR,
    price: 2000,
    weight: 1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'sci_motion_sensor',
    name: 'Датчик движения',
    description: 'Компактный сенсор, реагирующий на движение в зоне охвата.',
    category: ItemCategory.GEAR,
    price: 700,
    weight: 0.3,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'sci_gas_analyzer',
    name: 'Газоанализатор',
    description: 'Прибор для анализа состава воздуха и обнаружения газов.',
    category: ItemCategory.GEAR,
    price: 600,
    weight: 0.5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'sci_gravimeter',
    name: 'Гравиметр',
    description: 'Измеритель локальных гравитационных аномалий.',
    category: ItemCategory.GEAR,
    price: 600,
    weight: 0.5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'sci_field_lab',
    name: 'Полевая лаборатория',
    description: `мобильная лаборатория для анализа образцов
почвы, воды, воздуха и биологических материалов. Оборудована
спектрометрами, хроматографами и другими аналитическими
приборами. С момента запуска системы до выдачи результатов
обычно требуется 1‑2 часа. Для работы требуется топливный элемент
`,
    category: ItemCategory.GEAR,
    price: 3000,
    weight: 6,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'sci_field_microscope',
    name: 'Полевой микроскоп',
    description: 'Компактный микроскоп для изучения образцов на месте.',
    category: ItemCategory.GEAR,
    price: 800,
    weight: 1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'sci_sample_kit',
    name: 'Полевой набор для сбора образцов',
    description: `включает в себя инструменты
для сбора проб почвы, растений, грибов, насекомых, горных пород
и прочих материалов для последующего анализа в лаборатории`,
    category: ItemCategory.GEAR,
    price: 300,
    weight: 1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'sci_locator',
    name: 'Портативный локатор',
    description: 'ПОпределяет местоположение пользователя, сканирует эхолокацией и погружает на интерфейс в режиме реального времени. Запись маршрутов, маркировка точек интереса, карта местности, и прочее.',
    category: ItemCategory.GEAR,
    price: 1800,
    weight: 2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'sci_seismograph',
    name: 'Сейсмограф',
    description: 'Переносной прибор для отслеживания сейсмической активности.',
    category: ItemCategory.GEAR,
    price: 600,
    weight: 3,
    modifiers: {},
    weaponStats: null,
  },

  // --- ПРЕДМЕТЫ КУЛЬТУРЫ ---
  {
    id: 'cult_ancient_decoder',
    name: 'Дешифратор языка Древних',
    description: 'Специализированный прибор для дешифровки древних текстов.',
    category: ItemCategory.GEAR,
    price: 4000,
    weight: 1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'cult_dialect_decoder',
    name: 'Диалектовый декодер',
    description: 'Устройство, помогающее понимать местные диалекты и жаргоны.',
    category: ItemCategory.GEAR,
    price: 400,
    weight: 0.4,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'cult_censer',
    name: 'Кадило',
    description: 'Курильница для благовоний и ритуальных действий.',
    category: ItemCategory.GEAR,
    price: 300,
    weight: 1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'cult_writing_set',
    name: 'Писчие принадлежности',
    description: 'Набор для письма: перья, чернила, бумага или их аналог.',
    category: ItemCategory.GEAR,
    price: 300,
    weight: 0.5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'cult_idol',
    name: 'Фигурка Божества, талисман, молитвенные чётки',
    description: 'Личный культовый предмет для молитв и обрядов.',
    category: ItemCategory.GEAR,
    price: 200,
    weight: 0.3,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'cult_folklore_book',
    name: 'Фольклорный сборник «Мифы и легенды Веретена»',
    description: 'Книга с мифами, легендами и преданиями разных регионов.',
    category: ItemCategory.GEAR,
    price: 700,
    weight: 1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'cult_camera',
    name: 'Фотокамера',
    description: 'Камера для создания снимков в полевых условиях.',
    category: ItemCategory.GEAR,
    price: 800,
    weight: 1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'cult_ethno_journal',
    name: 'Этнографический журнал (пустой)',
    description: 'Пустой журнал для полевых записей и заметок.',
    category: ItemCategory.GEAR,
    price: 500,
    weight: 0.5,
    modifiers: {},
    weaponStats: null,
  },

  // --- КИБЕРШАМАНСКИЕ ПРЕДМЕТЫ ---
  {
    id: 'cyber_broach_empty',
    name: 'Брошка (пустая)',
    description: 'Пустой носитель для кибершаманских паттернов.',
    category: ItemCategory.GEAR,
    price: 200,
    weight: 0.1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'cyber_charm',
    name: 'Заговор',
    description: 'Закодированный кибершаманский ритуал в цифровой форме.',
    category: ItemCategory.GEAR,
    price: 700,
    weight: 0.1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'cyber_drum',
    name: 'Кибершаманский бубен',
    description: 'Инструмент для проведения кибершаманских обрядов.',
    category: ItemCategory.GEAR,
    price: 600,
    weight: 1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'cyber_bridge',
    name: 'Мостик',
    description: 'Интерфейсный модуль для связи с сетями и духами киберпространства.',
    category: ItemCategory.GEAR,
    price: 500,
    weight: 0.5,
    modifiers: {},
    weaponStats: null,
  },

  // --- ИНЖЕНЕРНЫЕ ПРЕДМЕТЫ ---
  {
    id: 'eng_sealant',
    name: 'Герметик',
    description: `специальное вещество, применяемое для создания
герметичных соединений и заполнения трещин и щелей в механизмах
и конструкциях. Способно заделать небольшую пробоину или дыру
в шлеме скафандра`,
    category: ItemCategory.GEAR,
    price: 300,
    weight: 0.5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'eng_arc_cutter',
    name: 'Дуговой резак',
    description: `специализированный инструмент для резки
металлических деталей и конструкций. Работает на принципе
электрического разряда, создавая мощный дуговой огонь,
способный легко прожигать металл. Используется для резки труб,
профильных элементов, листового металла и других металлических
изделий. Ну и гермодверей отсеков, конечно же. После каждого
использования требуется замена топливного элемента`,
    category: ItemCategory.GEAR,
    price: 2500,
    weight: 4,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'eng_spare_parts',
    name: 'Запчасти',
    description: `набор различных деталей и компонентов, используемых
для замены или восстановления изношенных или повреждённых
частей механизмов. Используются для ремонта различных устройств
как расходный материал`,
    category: ItemCategory.GEAR,
    price: 100,
    weight: 1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'eng_uav',
    name: 'Инженерный БПЛА',
    description: 'Беспилотник для инспекции и ремонтных операций.',
    category: ItemCategory.GEAR,
    price: 6000,
    weight: 5,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'eng_pochink',
    name: 'ПОЧИН-К',
    description: `небольшой робот-дройд с простым ИИ, в котором
запрограммированы основные схемы ремонта. Имеет встроенный
набор инструментов. По умолчанию, для ремонта пользуется лучшим
расходным материалом из имеющегося. При проверках считается,
что интеллект этого робота равен 5, а механика и кибершаманство
равны 3`,
    category: ItemCategory.GEAR,
    price: 5000,
    weight: 3,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'eng_jetpack',
    name: 'Реактивный ранец',
    description: `размером с небольшой рюкзак, реактивные
двигатели позволяют носителю взлетать и свободно перемещаться
в условиях невесомости. Использование реактивного ранца
в условиях невесомости даёт бонус +1 к проверкам проворства.
Ему хватает мощности ненадолго поднять в воздух персонажа
общим весом до 80 килограмм даже в условиях обычной гравитации,
позволяя таким образом совершить мощный прыжок в длину
или в высоту. Топлива хватает на час беспрерывной работы`,
    category: ItemCategory.GEAR,
    price: 3700,
    weight: 6,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'eng_repair_kit',
    name: 'Ремонтный набор',
    description: `набор инструментов и материалов, необходимых
для осуществления ремонтных работ. Включает в себя ключи
разных размеров, отвертки, набор гаечных ключей, молоток,
плоскогубцы, клей, электротехнический синий скотч и другие
инструменты, необходимые для быстрого и эффективного устранения
неисправностей или повреждений. Включает в себя 10 запчастей
при покупке, требуется периодически пополнять`,
    category: ItemCategory.GEAR,
    price: 1200,
    weight: 2,
    modifiers: {},
    weaponStats: null,
  },

  // --- ВЕДОВСКИЕ ПРЕДМЕТЫ ---
  {
    id: 'witch_grimoire',
    name: 'Гримуар',
    description: 'Личная книга заклинаний и заметок ведьмы или мага.',
    category: ItemCategory.GEAR,
    price: 800,
    weight: 2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'witch_chalk',
    name: 'Магический мел',
    description: 'используется в различных защитных ритуалах. Помогает очертить зону, в которую нежить лезет очень нехотя.',
    category: ItemCategory.GEAR,
    price: 200,
    weight: 0.2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'witch_nauz1',
    name: 'Малый Науз',
    description: 'Артефакт в виде узла, дает +1 к проверке "завязанного" в науз навыка',
    category: ItemCategory.GEAR,
    price: 500,
    weight: 0.1,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'witch_nauz2',
    name: 'Науз',
    description: 'Артефакт в виде узла, дает +2 к проверке "завязанного" в науз навыка',
    category: ItemCategory.GEAR,
    price: 1250,
    weight: 0.2,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'witch_nauz3',
    name: 'Большой Науз',
    description: 'Артефакт в виде узла, дает +3 к проверке "завязанного" в науз навыка',
    category: ItemCategory.GEAR,
    price: 2000,
    weight: 0.3,
    modifiers: {},
    weaponStats: null,
  },
  {
    id: 'witch_scroll',
    name: 'Свиток с заклятием',
    description: 'Одноразовый магический свиток с записанным заклинанием.',
    category: ItemCategory.GEAR,
    price: 1000,
    weight: 0.1,
    modifiers: {},
    weaponStats: null,
  },


];




export const INITIAL_REPUTATION: Record<Faction, number> = {
  [Faction.DEMOS]: 0,
  [Faction.COMMUNE]: 0,
  [Faction.PEDDLERS]: 0,
  [Faction.FRONTIERS]: 0,
  [Faction.CHURCH]: 0,
  [Faction.OUTCASTS]: 0,
};

export const INITIAL_CLAN_RELATIONS: Record<GreatClan, number> = {
  [GreatClan.WOLF]: 0,
  [GreatClan.EAGLE]: 0,
  [GreatClan.SNAKE]: 0,
  [GreatClan.RAM]: 0,
  [GreatClan.OWL]: 0,
  [GreatClan.BEAR]: 0,
};

// --- Character Creator Data ---

// Origin Options
export const ORIGIN_FAMILY = [
  { label: 'Сирота', desc: 'Вы потеряли родителей в раннем возрасте.', value: -2 },
  { label: 'Неполная семья', desc: 'Отсутствовал один из родителей (смерть, разлука).', value: -1 },
  { label: 'Приемная семья', desc: 'Вас воспитали чужие люди после трагедии.', value: 0 },
  { label: 'Бедная семья', desc: 'Полная семья, но постоянная борьба с нуждой.', value: 0 },
  { label: 'Обычная семья', desc: 'Средний класс, спокойное детство.', value: 1 },
  { label: 'Серебряная ложка', desc: 'Роскошь, слуги, богатство.', value: 2 },
  { label: 'Свой вариант', desc: 'Опишите сами.', value: null }, // Value selected manually
];

export const ORIGIN_PLACE = [
  { label: 'Трущобы', desc: 'Грязь, преступность, выживание.', value: -2 },
  { label: 'Военный городок', desc: 'Дисциплина, казармы, аскетизм.', value: -1 },
  { label: 'Малая колония', desc: 'Все друг друга знают.', value: 0 },
  { label: 'Орбитальная станция', desc: 'Тесные коридоры, искусственный воздух.', value: 0 },
  { label: 'Окраины мегаполиса', desc: 'Средние уровни, шум, суета.', value: 1 },
  { label: 'Центр мегаполиса', desc: 'Высокие технологии, чистота, комфорт.', value: 2 },
  { label: 'Свой вариант', desc: 'Опишите сами.', value: null },
];

export const ORIGIN_EDUCATION = [
  { label: 'Улица', desc: 'Вашим учителем была жизнь.', value: -2 },
  { label: 'Приходская школа', desc: 'Молитвы и грамота.', value: -1 },
  { label: 'Неоконченное высшее', desc: 'Вас отчислили или вы ушли сами.', value: 0 },
  { label: 'Наставник', desc: 'Индивидуальное обучение мастерству.', value: 0 },
  { label: 'Профильное', desc: 'Колледж, училище, специализация.', value: 1 },
  { label: 'Элитное', desc: 'Лучшие академии галактики.', value: 2 },
  { label: 'Свой вариант', desc: 'Опишите сами.', value: null },
];

// New Specializations Data with Equipment Choices
export const SPECIALIZATIONS: SpecializationData[] = [
  {
    name: 'Воин',
    variations: 'Солдат, наемник, дружинник',
    recommendedSkills: ['Ближний бой', 'Стрельба', 'Сила'],
    reputationMod: 0,
    equipmentChoices: [
      {
  optionA: { 
    name: 'Тяжелый пистолет Куровски', 
    description: 'Усиленная модель пистолета Куровски с повышенным уроном. 3 урона, средняя дальность, надежное', 
    quantity: 1, 
    equipped: true,
    shopItemId: 'pistol_kurovski_heavy'
  },
  optionB: { 
    name: 'Меч', 
    description: 'Стандартный клинок для ближнего боя. 2 урона.', 
    quantity: 1, 
    equipped: true,
    shopItemId: 'melee_sword'
  }
},
   {
  optionA: { 
    name: 'СПАС-1', 
    description: 'Мгновенно восстанавливает 2 здоровья', 
    quantity: 2, 
    equipped: false,
    shopItemId: 'med_spas_injector_small'
  },
  optionB: { 
    name: 'Архаичный щит', 
    description: 'Класс защиты: 2. Свойства: тяжёлый.', 
    quantity: 1, 
    equipped: true,
    shopItemId: 'armor_shield_archaic'
  }
      },
      {
        optionA: {
          name: 'Бронерубаха',
          description: 'Класс защиты: 3',
          quantity: 1,
          equipped: true,
          shopItemId: 'armor_medium_shirt'
        },
        optionB: {
          name: 'Архаичная тяжелая броня',
          description: 'Класс защиты: 4. Свойства: тяжёлая.',
          quantity: 1,
          equipped: true,
          shopItemId: 'armor_heavy_archaic'
        }
      },
      {
        optionA: {
          name: 'Бронебойные боеприпасы',
          description: `игнорируют 1 брони цели, но наносят на 1 меньше
урона, если цель вовсе без брони. Сочетаются с аналогичным
свойством оружия`,
          quantity: 4,
          equipped: false,
          shopItemId: 'ammo_armor_piercing'
        },
        optionB: {
          name: 'Осколочная граната',
          description: `Осколочная граната для поражения пехоты.
Мод: 0 · Иниц.: 0
Урон: 1 · Крит: 1
Дистанция: 1
Свойства: Мощность 5`,
          quantity: 1,
          equipped: false,
          shopItemId: 'grenade_frag'
		}
	   }
    ]
  },
  {
   name: 'Ученый',
    variations: 'Экзобиолог, археолог, новатор',
    recommendedSkills: ['Наука', 'Кибершаманство', 'Культура'],
    reputationMod: 1,
    equipmentChoices: [
      {
        optionA: {
          name: 'Акустический датчик-имитатор',
          description: `регистрирует акустические
сигналы животных и их коммуникацию для изучения поведения
и взаимодействия. Понаблюдав достаточное время за животным
и записав данные, вы можете произвести попытку сымитировать
общение с животным и даже отдать короткие команды`,
          quantity: 1,
          equipped: false,
          shopItemId: 'sci_acoustic_decoy'
        },
        optionB: {
          name: 'Полевая лаборатория',
          description: `мобильная лаборатория для анализа образцов
почвы, воды, воздуха и биологических материалов. Оборудована
спектрометрами, хроматографами и другими аналитическими
приборами. С момента запуска системы до выдачи результатов
обычно требуется 1‑2 часа. Для работы требуется топливный элемент
`,
          quantity: 1,
          equipped: false,
          shopItemId: 'sci_field_lab'
        }
      },
      {
        optionA: {
          name: 'Шокер',
          description: `Электрошоковое оружие для боя в упор, с нелетальным действием.
Мод: +1 · Иниц.: +2
Урон: 2 · Крит: 1
Дистанция: 0
Свойства: Лёгкое, однозарядное, нелетальное`,
          quantity: 1,
          equipped: true,
          shopItemId: 'shocker'
        },
        optionB: {
          name: 'Карманный пистолет Макова',
          description: `Компактный вариант пистолета Макова, удобен для скрытого ношения.
Мод: +1 · Иниц.: +4
Урон: 1 · Крит: 3
Дистанция: 2
Свойства: Лёгкое, маленькое`,
          quantity: 1,
          equipped: true,
          shopItemId: 'pistol_makov_pocket'
        }
      },
      {
        optionA: {
          name: 'Электронная библиотека',
          description: `хранилище определённого, загруженного
в библиотеку набора данных. При подключении к КПК, компьютеру
или иному устройству с этими данными получится ознакомиться.
Может давать бонусы к проверкам профессиональных навыков от +1
до +3. Чем более узкоспециализированная информация — тем больше
бонус. На изучение информации для получения бонуса требуется
около получаса`,
          quantity: 1,
          equipped: false,
          shopItemId: 'gear_ebook_library'
        },
        optionB: {
          name: 'Набор для сбора образцов',
          description: `включает в себя инструменты
для сбора проб почвы, растений, грибов, насекомых, горных пород
и прочих материалов для последующего анализа в лаборатории`,
          quantity: 1,
          equipped: false,
          shopItemId: 'sci_sample_kit'
        }
      },
      {
        optionA: {
          name: 'Датчик движения',
          description: 'Компактный сенсор, реагирующий на движение в зоне охвата.',
          quantity: 1,
          equipped: false,
          shopItemId: 'sci_motion_sensor'
        },
        optionB: {
          name: 'Портативный локатор',
          description: 'Определяет местоположение пользователя, сканирует эхолокацией и погружает на интерфейс в режиме реального времени. Запись маршрутов, маркировка точек интереса, карта местности, и прочее',
          quantity: 1,
          equipped: false,
          shopItemId: 'sci_locator'
        }
      }
    ]
  },
  {
    name: 'Златоуст',
    variations: 'Дипломат, капитан, артист',
    recommendedSkills: ['Влияние', 'Лидерство', 'Культура'],
    reputationMod: 1,
    equipmentChoices: [
      {
        optionA: {
          name: 'Музыкальный инструмент',
          description: `электрогусли, дудка, гитара, небольшой
барабан — всё, что нужно, чтобы скрасить досуг. +1 к проверкам
влияния при попытках произвести впечатление`,
          quantity: 1,
          equipped: false,
          shopItemId: 'gear_musical_instrument'
        },
        optionB: {
          name: 'Набор игральных карт',
          description: 'для развлечения в долгих полётах',
          quantity: 1,
          equipped: false,
          shopItemId: 'gear_playing_cards'
        }
      },
      {
        optionA: {
          name: 'Платиновая карта ресторана',
          description: 'Краснодар VIP',
          quantity: 1,
          equipped: false,
          shopItemId: 'vip_restaurant_card'
        },
        optionB: {
          name: 'Официальный костюм с броней',
          description: 'Броня 1, Легкая, Стиль',
          quantity: 1,
          equipped: true,
          shopItemId: 'armor_light_dress_suit'
        }
      },
      {
        optionA: {
          name: 'КПК',
          description: 'устройство для связи и выхода в сеть. ',
          quantity: 1,
          equipped: false,
          shopItemId: 'gear_pda'
        },
        optionB: {
          name: 'Нож с гравировкой',
          description: `Именной нож. Мод: 0 · Иниц.: +4
Урон: 1 · Крит: 2
Дистанция: 1
Свойства: Лёгкое, Маленькое`,
          quantity: 1,
          equipped: true,
          shopItemId: 'melee_knife_simple'
        }
      },
      {
        optionA: {
          name: 'Сахарок',
          description: `кристаллизованные частички туманской росы, расплавленные
и прошедшие обработку с помощью эфира и соляной кислоты дающих
принявшему их небывалый прилив сил и значительное снижение болевого
порога. `,
          quantity: 1,
          equipped: false,
          shopItemId: 'culture_sugar_candy'
        },
        optionB: {
          name: 'Сигареты (Пачка)',
          description: `Восстанавливает 2 воли при применении
(но не чаще, чем раз в 4 часа)`,
          quantity: 3,
          equipped: false,
          shopItemId: 'gear_cigarettes'
        }
      }
    ]
  },
  {
    name: 'Кибершаман',
    variations: 'Аналитик, заговорщик, взломщик',
    recommendedSkills: ['Кибершаманство', 'Наука', 'Механика'],
    reputationMod: 0,
    equipmentChoices: [
      {
        optionA: {
          name: 'Компьютер',
          description: `устройство для обработки данных и выполнения
различных операций. Отличается по производительности
и функциональности, обладает большим диапазоном возможностей,
нежели КПК`,
          quantity: 1,
          equipped: false,
          shopItemId: 'cgear_computer'
        },
        optionB: {
          name: 'Имплант "Ручной ПК"',
          description: `встроенный в ладонь КПК,
проецирующий голографический
интерфейс. Один из самых
распространённых имплантов
у новов`,
          quantity: 1,
          equipped: true,
          shopItemId: 'implant_hand_pc'
        }
      },
      {
        optionA: {
          name: 'Укороченный самозарядный испепелитель (УСИ)',
          description: `Компактный самозарядный испепелитель с автоматическим огнём.
Мод: -1 · Иниц.: +3
Урон: 2 · Крит: 2
Дистанция: 2
Свойства: Автоматическое, лёгкое`,
          quantity: 1,
          equipped: true,
          shopItemId: 'pistol_usi'
        },
        optionB: {
          name: 'Карманный пистолет Макова',
          quantity: 1,
          description: `Компактный вариант пистолета Макова, удобен для скрытого ношения.
Мод: +1 · Иниц.: +4
Урон: 1 · Крит: 3
Дистанция: 2
Свойства: Лёгкое, маленькое`,
          equipped: true,
          shopItemId: 'pistol_makov_pocket'
        }
      },
      {
        optionA: {
          name: 'Электронный набор для взлома',
          description: `это портативное устройство,
позволяющее взламывать электронные замки, защиты и системы
безопасности. Используется для тайного проникновения
в защищённые помещения или получения доступа
к конфиденциальной информации. Не забудьте замести следы!`,
          quantity: 1,
          equipped: false,
          shopItemId: 'hacking_electronic_kit'
        },
        optionB: {
          name: 'Фиброскоп',
          description: `небольшой провод, подсоединяемый к КПК
или компьютеру с камерой на конце. Удобно просунуть под дверь,
чтобы понять, что вас за ней ждёт`,
          quantity: 1,
          equipped: false,
          shopItemId: 'spy_fiberscope'
        }
      },
      {
        optionA: {
          name: 'Брошка с заговором',
          description: 'Один заговор на выбор',
          quantity: 1,
          equipped: true,
          shopItemId: 'brooch_with_spell'
        },
        optionB: {
          name: 'Контакты толмача',
          description: 'Линза-переводчик',
          quantity: 1,
          equipped: true,
          shopItemId: 'cybershaman_translator_contacts'
        }
      }
    ]
  },
  {
    name: 'Механик',
    variations: 'Бортинженер, строитель, разнорабочий',
    recommendedSkills: ['Механика', 'Кибершаманство', 'Сила'],
    reputationMod: 1,
    equipmentChoices: [
      {
        optionA: {
          name: 'Ремонтный комплект',
          description: `набор инструментов и материалов, необходимых
для осуществления ремонтных работ. Включает в себя ключи
разных размеров, отвертки, набор гаечных ключей, молоток,
плоскогубцы, клей, электротехнический синий скотч и другие
инструменты, необходимые для быстрого и эффективного устранения
неисправностей или повреждений. Включает в себя 10 запчастей
при покупке, требуется периодически пополнять`,
          quantity: 1,
          equipped: false,
          shopItemId: 'eng_repair_kit'
        },
        optionB: {
          name: 'Дуговой резак',
          description: `специализированный инструмент для резки
металлических деталей и конструкций. Работает на принципе
электрического разряда, создавая мощный дуговой огонь,
способный легко прожигать металл. Используется для резки труб,
профильных элементов, листового металла и других металлических
изделий. Ну и гермодверей отсеков, конечно же. После каждого
использования требуется замена топливного элемента`,
          quantity: 1,
          equipped: true,
          shopItemId: 'eng_arc_cutter'
        }
      },
      {
        optionA: {
          name: 'Запчасти',
          description: `набор различных деталей и компонентов, используемых
для замены или восстановления изношенных или повреждённых
частей механизмов. Используются для ремонта различных устройств
как расходный материал`,
          quantity: 3,
          equipped: false,
          shopItemId: 'eng_spare_parts'
        },
        optionB: {
          name: 'Герметик',
          description: `специальное вещество, применяемое для создания
герметичных соединений и заполнения трещин и щелей в механизмах
и конструкциях. Способно заделать небольшую пробоину или дыру
в шлеме скафандра`,
          quantity: 3,
          equipped: false,
          shopItemId: 'eng_sealant'
        }
      },
      {
        optionA: {
          name: 'Механическая отмычка',
          description: 'Набор инструментов для вскрытия механических замков.',
          quantity: 1,
          equipped: false,
          shopItemId: 'spy_lockpick'
        },
        optionB: {
          name: 'Станционный костюм',
          description: 'Класс защиты: 1. Свойства: лёгкая, магнитные ботинки.',
          quantity: 1,
          equipped: true,
          shopItemId: 'armor_light_station_suit'
        }
      },
      {
        optionA: {
          name: 'Обрез двустволки',
          description: `Обрез двуствольного дробовика, максимально опасен в упор.
Мод: +2 · Иниц.: +3
Урон: 2 · Крит: 2
Дистанция: 0
Свойства: Однозарядное, разброс`,
          quantity: 1,
          equipped: true,
          shopItemId: 'shotgun_sawed_off_double'
        },
        optionB: {
          name: 'Подрывной пакет',
          description: 'Подрывной пакет небольшой мощности.',
          quantity: 2,
          equipped: false,
          shopItemId: 'explosive_charge_single'
        }
      }
    ]
  },
  {
    name: 'Ведун',
    variations: 'Ведьмак, провидец, беглец',
    recommendedSkills: ['Ведовство', 'Скрытность', 'Проворство'],
    reputationMod: -1,
    equipmentChoices: [
      {
        optionA: {
          name: 'Гримуар',
          description: `книга, наполненная магическими символами, заклинаниями
и инструкциями по проведению ритуалов. Даёт бонус +1 к ведовству
при проведении ритуалов`,
          quantity: 1,
          equipped: false,
          shopItemId: 'witch_grimoire'
        },
        optionB: {
          name: 'Рельсовый пистолет Куровски',
          description: `Рельсовый пистолет Куровски с бесшумным и бронебойным выстрелом.
Мод: 0 · Иниц.: 0
Урон: 2 · Крит: 1
Дистанция: 3
Свойства: Бесшумное, бронебойное`,
          quantity: 1,
          equipped: true,
          shopItemId: 'pistol_kurovski_rail'
        }
      },
      {
        optionA: {
          name: 'Малый науз',
          description: 'Артефакт в виде узла, дает +1 к проверке "завязанного" в науз навыка',
          quantity: 2,
          equipped: true,
          shopItemId: 'witch_nauz1'
        },
        optionB: {
          name: 'Свиток с заклятьем',
          description: 'Одноразовый магический свиток с записанным заклинанием.',
          quantity: 1,
          equipped: false,
          shopItemId: 'witch_scroll'
        }
      },
      {
        optionA: {
          name: 'Магический мел',
          description: 'используется в различных защитных ритуалах. Помогает очертить зону, в которую нежить лезет очень нехотя',
          quantity: 1,
          equipped: false,
          shopItemId: 'witch_chalk'
        },
        optionB: {
          name: 'Кожаная броня',
          description: 'Класс защиты: 2. Свойства: лёгкая',
          quantity: 1,
          equipped: true,
          shopItemId: 'armor_light_leather'
        }
      },
      {
        optionA: {
          name: 'Фальшивый СлавИН',
          description: 'Поддельные документы',
          quantity: 1,
          equipped: false,
          shopItemId: 'fake_id_slavin'
        },
        optionB: {
          name: 'Плащ с капюшоном',
          description: 'Скрытность +1',
          quantity: 1,
          equipped: true,
          shopItemId: 'cloak_hooded'
        }
      }
    ]
  },
  {
    name: 'Плут',
    variations: 'Разбойник, шпион, медвежатник',
    recommendedSkills: ['Скрытность', 'Проворство', 'Наблюдательность'],
    reputationMod: -1,
    equipmentChoices: [
      {
        optionA: {
          name: 'Нож +1',
          description: 'Качественный клинок',
          quantity: 1,
          equipped: true,
          shopItemId: 'melee_knife_simple'
        },
        optionB: {
          name: 'Рельсовый пистолет Куровски',
          description: 'С глушителем',
          quantity: 1,
          equipped: true,
          shopItemId: 'pistol_kurovski_rail'
        }
      },
      {
        optionA: {
          name: 'Механическая отмычка',
          description: 'Набор инструментов для вскрытия механических замков.',
          quantity: 1,
          equipped: false,
          shopItemId: 'spy_lockpick'
        },
        optionB: {
          name: 'Электронный набор для взлома',
          description: `это портативное устройство,
позволяющее взламывать электронные замки, защиты и системы
безопасности. Используется для тайного проникновения
в защищённые помещения или получения доступа
к конфиденциальной информации. Не забудьте замести следы!`,
          quantity: 1,
          equipped: false,
          shopItemId: 'hacking_electronic_kit'
        }
      },
      {
        optionA: {
          name: 'Голосовой имитатор',
          description: 'Подделка голоса',
          quantity: 1,
          equipped: false,
          shopItemId: 'spy_voice_mimic'
        },
        optionB: {
          name: 'Шпионский дрон-жук',
          description: 'Разведка',
          quantity: 1,
          equipped: false,
          shopItemId: 'spy_drone_bug'
        }
      },
      {
        optionA: {
          name: 'Кожаная броня',
          description: 'Класс защиты: 2. Свойства: лёгкая',
          quantity: 1,
          equipped: true,
          shopItemId: 'armor_light_leather'
        },
        optionB: {
          name: 'Маскировочный халат',
          description: 'Класс защиты: 0. Свойства: лёгкая, камуфляж.',
          quantity: 1,
          equipped: true,
          shopItemId: 'armor_light_camouflage_robe'
        }
      }
    ]
  },
  {
    name: 'Следопыт',
    variations: 'Проводник, охотник, детектив',
    recommendedSkills: ['Выживание', 'Наблюдательность', 'Проворство'],
    reputationMod: 0,
    equipmentChoices: [
      {
        optionA: {
          name: 'Копьё',
          description: `Длинное колющее древковое оружие.
Мод: +1 · Иниц.: +2
Урон: 2 · Крит: 3
Дистанция: 1
Свойства: Длинное`,
          quantity: 1,
          equipped: true,
          shopItemId: 'melee_spear'
        },
        optionB: {
          name: 'Нож',
          description: `Простой нож для ближнего боя.
Мод: 0 · Иниц.: +4
Урон: 1 · Крит: 2
Дистанция: 1
Свойства: Лёгкое, Маленькое`,
          quantity: 1,
          equipped: true,
          shopItemId: 'melee_knife_simple'
        }
      },
      {
        optionA: {
          name: 'Винтовка Косина',
          description: `Винтовка Косина с повышенным уроном.
Мод: +1 · Иниц.: 0
Урон: 3 · Крит: 3
Дистанция: 3`,
          quantity: 1,
          equipped: true,
          shopItemId: 'rifle_kosin'
        },
        optionB: {
          name: 'Лук',
          description: `Классический лук для стрельбы на средней дистанции.
Мод: +2 · Иниц.: 0
Урон: 2 · Крит: 3
Дистанция: 2
Свойства: Однозарядное, специальные боеприпасы`,
          quantity: 1,
          equipped: true,
          shopItemId: 'bow'
        }
      },
      {
        optionA: {
          name: 'Компас',
          description: `устройство для определения направления движения,
основное средство ориентирования в неизвестной местности.
+1 при проверках выживания при ориентировании на местности`,
          quantity: 1,
          equipped: false,
          shopItemId: 'surv_compass'
        },
        optionB: {
          name: 'Капкан',
          description: `приспособление для ловли животных, основанное
на принципе зажима или удушения, предназначенное для
обеспечения источника пищи в дикой местности. +1 при проверках
выживания для добычи пищи`,
          quantity: 2,
          equipped: false,
          shopItemId: 'surv_trap'
        }
      },
      {
        optionA: {
          name: 'Палатка и спальник',
          description: 'Палатка: пространство для ночлега. Спальник: переносной спальный мешок с термоизоляцией',
          quantity: 1,
          equipped: false,
          shopItemId: 'surv_tent'
        },
        optionB: {
          name: 'Мультитул "Выживальщик"',
          description: `многофункциональный инструмент,
включающий в себя ножик, шуруповёрт, пилу, открывашку и другие
полезные приспособления для выполнения различных задач
в условиях выживания`,
          quantity: 1,
          equipped: false,
          shopItemId: 'surv_multitool'
        }
      }
    ]
  },
  {
    name: 'Пилот',
    variations: 'Военный пилот, дальнобойщик, оператор дронов',
    recommendedSkills: ['Пилотирование', 'Механика', 'Кибершаманство'],
    reputationMod: 0,
    equipmentChoices: [
      {
        optionA: {
          name: 'Экзоскафандр +1',
          description: 'Скафандр, запас кислорода, маневровые двигатели, магнитные ботинки, термостатичная Броня 2 (+1)',
          quantity: 1,
          equipped: true,
          shopItemId: 'armor_medium_exosuit'
        },
        optionB: {
          name: 'Летная куртка',
          description: 'Легкая, огнестойкая (3), класс защиты: 1',
          quantity: 1,
          equipped: true,
          shopItemId: 'armor_light_flight_suit'
        }
      },
      {
        optionA: {
          name: 'Реактивный ранец',
          description: `размером с небольшой рюкзак, реактивные
двигатели позволяют носителю взлетать и свободно перемещаться
в условиях невесомости. Использование реактивного ранца
в условиях невесомости даёт бонус +1 к проверкам проворства.
Ему хватает мощности ненадолго поднять в воздух персонажа
общим весом до 80 килограмм даже в условиях обычной гравитации,
позволяя таким образом совершить мощный прыжок в длину
или в высоту. Топлива хватает на час беспрерывной работы`,
          quantity: 1,
          equipped: true,
          shopItemId: 'eng_jetpack'
        },
        optionB: {
          name: 'Ремонтный набор',
          description: `набор инструментов и материалов, необходимых
для осуществления ремонтных работ. Включает в себя ключи
разных размеров, отвертки, набор гаечных ключей, молоток,
плоскогубцы, клей, электротехнический синий скотч и другие
инструменты, необходимые для быстрого и эффективного устранения
неисправностей или повреждений. Включает в себя 10 запчастей
при покупке, требуется периодически пополнять`,
          quantity: 1,
          equipped: false,
          shopItemId: 'eng_repair_kit'
        }
      },
      {
        optionA: {
          name: 'ПОЧИН-К',
          description: `небольшой робот-дройд с простым ИИ, в котором
запрограммированы основные схемы ремонта. Имеет встроенный
набор инструментов. По умолчанию, для ремонта пользуется лучшим
расходным материалом из имеющегося. При проверках считается,
что интеллект этого робота равен 5, а механика и кибершаманство
равны 3`,
          quantity: 1,
          equipped: false,
          shopItemId: 'eng_pochink'
        },
        optionB: {
          name: 'Разведзонд',
          description: `небольшой БПЛА, управляемый вручную
или контролирующий местность по заданным параметрам автономно.
Оборудован камерой с 6‑кратным приближением.
Для работы требуется топливный элемент`,
          quantity: 1,
          equipped: false,
          shopItemId: 'spy_probe'
        }
      },
      {
        optionA: {
          name: 'Крюк-кошка с веревкой',
          description: `: специальное приспособление, состоящее из крюка
и троса, предназначенное для лёгкого восхождения по вертикальным
поверхностям или спасательных операций`,
          quantity: 1,
          equipped: false,
          shopItemId: 'survival_grappling_hook_rope'
        },
        optionB: {
          name: 'Парашют',
          description: 'устройство для плавного спуска с высоты, обеспечивающее безопасное приземление в экстренных ситуациях',
          quantity: 1,
          equipped: false,
          shopItemId: 'surv_parachute'
        }
      }
    ]
  },
  {
    name: 'Лекарь',
    variations: 'Знахарь, врач, медбрат',
    recommendedSkills: ['Знахарство', 'Наука', 'Выживание'],
    reputationMod: 1,
    equipmentChoices: [
      {
        optionA: {
          name: 'Биомонитор',
          description: `подключённый к пациенту позволяет выводить данные
о его текущем состоянии, оставлять заметки и результаты анализов
врачам, а также передавать информацию на другие устройства.
Незаменим в телемедицинской помощи и при консультациях`,
          quantity: 1,
          equipped: true,
          shopItemId: 'med_biomon'
        },
        optionB: {
          name: `Докторский чемодан',
          description: 'Даёт дополнительный складывающийся
модификатор при оказании первой помощи
и лечении травм`,
          quantity: 1,
          equipped: false,
          shopItemId: 'med_doctor_case'
        }
      },
      {
        optionA: {
          name: 'Спас-2',
          description: 'Мгновенно восстанавливает 3 здоровья',
          quantity: 3,
          equipped: false,
          shopItemId: 'med_spas_injector_medium'
        },
        optionB: {
          name: 'Средний эликсир лечения',
          description: 'Флакон со средней дозой эликсира, восстанавливающего здоровье. Восстанавливает 1 здоровья в начале каждого хода на протяжении 5 ходов',
          quantity: 3,
          equipped: false,
          shopItemId: 'elixir_healing_medium'
        }
      },
      {
        optionA: {
          name: 'Эликсир Вдохновения',
          description: 'Вы ясно понимаете, как лучше всего действовать и использовать свои знания. Даёт +1 ко всем профессиональным навыкам на время действия.',
          quantity: 1,
          equipped: false,
          shopItemId: 'elixir_inspiration'
        },
        optionB: {
          name: 'Яд (Сила 5)',
          description: 'Концентрированный токсин, требующий осторожного обращения.',
          quantity: 2,
          equipped: false,
          shopItemId: 'elixir_poison'
        }
      },
      {
        optionA: {
          name: 'Пневматический инъектор',
          description: `Инъектор для доставки химических или медицинских препаратов. Мод: +2 · Иниц.: +2
Урон: 0
Дистанция: 2
Свойства: Лёгкое, однозарядное, специальные боеприпасы`,
          quantity: 1,
          equipped: true,
          shopItemId: 'pneumatic_injector'
        },
        optionB: {
          name: 'Карманный пистолет Макова',
          description: `Компактный вариант пистолета Макова, удобен для скрытого ношения.
Мод: +1 · Иниц.: +4
Урон: 1 · Крит: 3
Дистанция: 2
Свойства: Лёгкое, маленькое`,
          quantity: 1,
          equipped: true,
          shopItemId: 'pistol_makov_pocket'
        }
      }
    ]
  },
  {
    name: 'Паломник',
    variations: 'Проповедник, журналист, летописец',
    recommendedSkills: ['Культура', 'Влияние', 'Наблюдательность'],
    reputationMod: 0,
    equipmentChoices: [
      {
        optionA: {
          name: 'Посох',
          description: `Длинный посох, подходящий для боя и магии
Мод: +2 · Иниц.: +2
Урон: 1 · Крит: 3
Дистанция: 1
Свойства: Длинное`,
          quantity: 1,
          equipped: true,
          shopItemId: 'melee_staff'
        },
        optionB: {
          name: 'Бронерубаха',
          description: 'Класс защиты: 3',
          quantity: 1,
          equipped: true,
          shopItemId: 'armor_medium_shirt'
        }
      },
      {
        optionA: {
          name: 'Этнографический журнал',
          description: `Структурированный формат для систематизации наблюдений, 
разделители для разных категорий культурных аспектов. По мере своего наполнения 
может давать бонус к проверкам культуры от +1 до +3`,
          quantity: 1,
          equipped: false,
          shopItemId: 'cult_ethno_journal'
        },
        optionB: {
          name: 'Сборник "Мифы Веретена"',
          description: `Комплект книг или электронных документов, содержащий сборник мифов, 
		  легенд и народных сказаний. Помогает точнее идентифицировать сущности Веретена и их особенности`,
          quantity: 1,
          equipped: false,
          shopItemId: 'culture_myths_book'
        }
      },
      {
        optionA: {
          name: 'Диалектовый декодер',
          description: 'помогает расшифровать различные выражения и фразеологизмы древлян или особенности диалекта крайне прогрессивных новов на более привычный лад и обратно. Работает в режиме считывателя голоса и синхронного перевода',
          quantity: 1,
          equipped: false,
          shopItemId: 'culture_dialect_decoder'
        },
        optionB: {
          name: 'Дешифратор языка Древних',
          description: 'Пытается перевести фрагмент с помощью ИИ. (Бросок к20: 17-19 - общая информация. 20 - близко к дословному переводу. Остальное - ошибка или ложная информация',
          quantity: 1,
          equipped: false,
          shopItemId: 'culture_ancient_decoder'
        }
      },
      {
        optionA: {
          name: 'Талисман',
          description: 'Даёт +1 при перебросе кубов в ходе молитвы раз в сутки',
          quantity: 1,
          equipped: true,
          shopItemId: 'cult_idol'
        },
        optionB: {
          name: 'Фотокамера',
          description: 'для фотографирования артефактов, обрядов и других запоминающихся моментов',
          quantity: 1,
          equipped: false,
          shopItemId: 'cult_camera'
        }
      }
    ]
  }
  ]