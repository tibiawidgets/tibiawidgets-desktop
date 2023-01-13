export type Session = {
  Balance: string,
  Damage: string,
  'Damage/h': string,
  Healing: string,
  'Healing/h': string,
  'Killed Monsters': KilledMonsters[],
  Loot: string,
  'Looted Items': LootItem[],
  'Session end': string,
  'Session length': string,
  'Session start': string,
  Supplies: string,
  'XP Gain': string,
  'XP/h': string,
};

export type KilledMonsters = {
  Count: number,
  Name: string,
};

export type LootItem = {
  Count: number,
  Name: string,
};

export type JSONConfigFile = {
  configPath: string,
  tibiaClientPath: string,
};
