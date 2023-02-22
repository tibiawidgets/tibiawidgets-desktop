/* eslint-disable prefer-destructuring */
import { log } from 'electron-log';
import fs from 'fs';
import path from 'path';
import { Session } from 'types/types';

export function readFile() {}

export function writeFile() {}

/**
 * Hunts
 */

const PATH_HUNTS_TIBIA_CLIENT = '/packages/Tibia/log';
const PATH_HUNTS_TIBIA_WIDGETS = '/hunt_sessions';

export function readHuntFiles() {}

export function filterByExtension(files: string[], extensions: string[]) {
  return files.filter((file) => {
    for (let i = 0; i < extensions.length; i++) {
      if (file.endsWith(extensions[i])) {
        return true;
      }
    }
    return false;
  });
}

export function makeDirectoryCopy(fromPath: string, toPath: string) {
  if (!fs.existsSync(fromPath)) {
    log(new Error('Origin path does not exist. Nothing to copy.'));
    return;
  }
  if (!fs.existsSync(toPath)) {
    log('Destination path does not exist, creating it.');
    fs.mkdirSync(toPath);
  }
  const files = fs.readdirSync(fromPath);
  files.forEach((file) => {
    const absFromPath = path.join(fromPath, file);
    const absToPath = path.join(toPath, file);
    fs.readFileSync(absFromPath);
    fs.writeFile(file, absToPath, 'utf-8', (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  });
  /* const filteredJSONFiles = filterByExtension(files, ['.json']);
  const filteredPlainTextFiles = filterByExtension(files, ['.txt']); */
}

export function parsePlainTextToJson(plainText: string): Session {
  const data: Session = {} as Session;

  const regex =
    /^Session data: From (.+), (.+) to (.+), (.+)\nSession: (.+)\nXP Gain: (.+)\nXP\/h: (.+)\nLoot: (.+)\nSupplies: (.+)\nBalance: (.+)\nDamage: (.+)\nDamage\/h: (.+)\nHealing: (.+)\nHealing\/h: (.+)\nKilled Monsters:\n((?:\s{2}\d+x .+\n)*)Looted Items:\n((?:\s{2}\d+x .+\n)*)$/;

  const match = plainText.match(regex);

  if (match) {
    data.session.start = `${match[1]} ${match[2]}`;
    data.session.end = `${match[3]} ${match[4]}`;
    data.session.duration = match[5];
    data.xpGain = match[6];
    data.xpPerHour = match[7];
    data.loot = match[8];
    data.supplies = match[9];
    data.balance = match[10];
    data.damage = match[11];
    data.damagePerHour = match[12];
    data.healing = match[13];
    data.healingPerHour = match[14];

    const killedMonstersString = match[15];
    const killedMonsters = killedMonstersString
      .split('\n')
      .filter((monster) => monster.trim() !== '')
      .map((monster) => {
        const [count, name] = monster.trim().split('x ');
        return {
          count: Number(count),
          name,
        };
      });

    data.killedMonsters = killedMonsters;

    const lootedItemsString = match[16];
    const lootedItems = lootedItemsString
      .split('\n')
      .filter((item) => item.trim() !== '')
      .map((item) => {
        const [count, name] = item.trim().split('x ');
        return {
          count: Number(count),
          name,
        };
      });

    data.lootedItems = lootedItems;
  }
  return data;
}

export function copyHuntsFiles(
  tibiaClientPath: string,
  tibiaWidgetsPath: string
) {
  console.log('Copying hunt files');
  const absTibiaClientHuntsPath = tibiaClientPath + PATH_HUNTS_TIBIA_CLIENT;
  const absTibiaWidgetsHuntsPath = tibiaWidgetsPath + PATH_HUNTS_TIBIA_WIDGETS;
  if (!fs.existsSync(absTibiaWidgetsHuntsPath)) {
    makeDirectoryCopy(absTibiaClientHuntsPath, absTibiaWidgetsHuntsPath);
  }
}
