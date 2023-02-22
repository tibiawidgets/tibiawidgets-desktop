export type Session = {
  balance: number,
  damage: number,
  damagePerHour: number,
  healing: number,
  healingPerHour: number,
  killedMonsters: KilledMonster[],
  loot: number,
  lootedItems: LootItem[],
  session: {
    end: string,
    duration: string,
    start: string,
  },
  supplies: number,
  xpGain: number,
  xpPerHour: number,
};

export type KilledMonster = {
  count: number,
  name: string,
};

export type LootItem = {
  count: number,
  name: string,
};

export type JSONConfigFile = {
  configPath: string,
  tibiaClientPath: string,
  dirRoot: string,
};
