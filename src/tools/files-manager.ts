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

export const PATH_HUNTS_TIBIA_CLIENT = '/packages/Tibia/log';
export const PATH_HUNTS_TIBIA_WIDGETS = '/hunt_sessions';

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

export function parsePlainTextToJson(plainText: string): Session {
  // Extract session start and end times
  const sessionTimes = plainText.match(/From (.*) to (.*)/);
  const sessionDurationMatch = plainText.match(/Session: (.*)/);
  let sessionStart = '';
  let sessionEnd = '';
  const sessionDuration = sessionDurationMatch
    ? sessionDurationMatch[1].replace(/,/g, '')
    : '00:00h';
  if (sessionTimes) {
    sessionStart = sessionTimes[1];
    sessionEnd = sessionTimes[2];
  }

  // Extract the numeric data fields using regex
  const xpGainMatch = plainText.match(/XP Gain: ([\d,]*)/);
  const xpGain = xpGainMatch ? Number(xpGainMatch[1].replace(/,/g, '')) : 0;

  const xpPerHourMatch = plainText.match(/XP\/h: ([\d,]*)/);
  const xpPerHour = xpPerHourMatch
    ? Number(xpPerHourMatch[1].replace(/,/g, ''))
    : 0;

  const lootMatch = plainText.match(/Loot: ([\d,]*)/);
  const loot = lootMatch ? Number(lootMatch[1].replace(/,/g, '')) : 0;

  const suppliesMatch = plainText.match(/Supplies: ([\d,]*)/);
  const supplies = suppliesMatch
    ? Number(suppliesMatch[1].replace(/,/g, ''))
    : 0;

  const balanceMatch = plainText.match(/Balance: ([\d,-]*)/);
  const balance = balanceMatch ? Number(balanceMatch[1].replace(/,/g, '')) : 0;

  const damageMatch = plainText.match(/Damage: ([\d,]*)/);
  const damage = damageMatch ? Number(damageMatch[1].replace(/,/g, '')) : 0;

  const damagePerHourMatch = plainText.match(/Damage\/h: ([\d,]*)/);
  const damagePerHour = damagePerHourMatch
    ? Number(damagePerHourMatch[1].replace(/,/g, ''))
    : 0;

  const healingMatch = plainText.match(/Healing: ([\d,]*)/);
  const healing = healingMatch ? Number(healingMatch[1].replace(/,/g, '')) : 0;

  const healingPerHourMatch = plainText.match(/Healing\/h: ([\d,]*)/);
  const healingPerHour = healingPerHourMatch
    ? Number(healingPerHourMatch[1].replace(/,/g, ''))
    : 0;

  // Extract the killed monsters and looted items
  const killedMonstersMatch = plainText.match(
    /Killed Monsters:(.*)Looted Items:/s
  );
  const killedMonsters =
    killedMonstersMatch && !killedMonstersMatch[1].includes('None')
      ? killedMonstersMatch[1]
          .trim()
          .split('\r\n')
          .map((line) => {
            const [count, name] = line.split('x');
            return {
              count: Number(count.trim()),
              name: name.trim(),
            };
          })
      : [];
  const lootedItemsMatch = plainText.match(/Looted Items:(.*)/s);
  const lootedItems =
    lootedItemsMatch && !lootedItemsMatch[1].includes('None')
      ? lootedItemsMatch[1]
          .trim()
          .split('\r\n')
          .map((line) => {
            const [count, name] = line.split('x');
            return {
              count: Number(count.trim()),
              name: name.trim(),
            };
          })
      : [];
  // construct the final object
  const data: Session = {
    session: {
      start: sessionStart,
      end: sessionEnd,
      duration: sessionDuration,
    },
    balance,
    damage,
    damagePerHour,
    healing,
    healingPerHour,
    killedMonsters,
    loot,
    lootedItems,
    supplies,
    xpGain,
    xpPerHour,
  };

  return data;
}

export function standarizeJson(jsonText: string): Session {
  let jsonData;
  let standarizedJson: Session = {} as Session;
  try {
    jsonData = JSON.parse(jsonText, (key, value) => {
      if (
        key === 'Balance' ||
        key === 'Damage' ||
        key === 'Damage/h' ||
        key === 'Healing' ||
        key === 'Healing/h' ||
        key === 'Loot' ||
        key === 'Supplies' ||
        key === 'XP Gain' ||
        key === 'XP/h'
      ) {
        return value.replace(/,/g, '');
      }
      if (key === 'Killed Monsters') {
        return value.map((monster: any) => ({
          count: monster.Count,
          name: monster.Name,
        }));
      }
      if (key === 'Looted Items') {
        return value.map((item: any) => ({
          count: item.Count,
          name: item.Name,
        }));
      }
      if (
        key === 'Session end' ||
        key === 'Session start' ||
        key === 'Session length'
      ) {
        return value.replace(',', '');
      }
      return value;
    });
    standarizedJson = {
      balance: Number(jsonData.Balance),
      damage: Number(jsonData.Damage),
      damagePerHour: Number(jsonData['Damage/h']),
      healing: Number(jsonData.Healing),
      healingPerHour: Number(jsonData['Healing/h']),
      killedMonsters: jsonData['Killed Monsters'],
      loot: Number(jsonData.Loot),
      lootedItems: jsonData['Looted Items'],
      session: {
        end: jsonData['Session end'],
        duration: jsonData['Session length'],
        start: jsonData['Session start'],
      },
      supplies: Number(jsonData.Supplies),
      xpGain: Number(jsonData['XP Gain']),
      xpPerHour: Number(jsonData['XP/h']),
    };
  } catch (e) {
    console.error(`Failed to parse json file `, e);
  }
  return standarizedJson;
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
  files.forEach((fileName) => {
    const absFromPath = path.join(fromPath, fileName);
    const newName = `${fileName.split('.')[0]}.json`;
    const absToPath = path.join(toPath, newName);

    const fileData = fs.readFileSync(absFromPath, 'utf8');
    // validate extension txt is parsed and JSON standarized
    const extension = path.extname(fileName);
    let parsedData: Session = {} as Session;
    if (extension === '.txt') {
      parsedData = parsePlainTextToJson(fileData);
    } else if (extension === '.json') {
      parsedData = standarizeJson(fileData);
    }
    fs.writeFile(absToPath, JSON.stringify(parsedData), 'utf-8', (err) => {
      if (err) throw err;
    });
  });
  console.log('Files finished copying');
}

export function copyHuntsFiles(
  tibiaClientPath: string,
  tibiaWidgetsPath: string
) {
  const fromPath = path.join(tibiaClientPath, PATH_HUNTS_TIBIA_CLIENT);
  const toPath = path.join(tibiaWidgetsPath, PATH_HUNTS_TIBIA_WIDGETS);
  if (!fs.existsSync(toPath)) {
    console.log('Copying hunt files');
    console.log({ fromPath, toPath });
    makeDirectoryCopy(fromPath, toPath);
  }
}
