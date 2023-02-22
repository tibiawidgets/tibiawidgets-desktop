export type Session = {
  balance: string,
  damage: string,
  damagePerHour: string,
  healing: string,
  healingPerHour: string,
  killedMonsters: KilledMonster[],
  loot: string,
  lootedItems: LootItem[],
  session: {
    end: string,
    duration: string,
    start: string,
  },
  supplies: string,
  xpGain: string,
  xpPerHour: string,
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
