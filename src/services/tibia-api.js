/**
 * Using Tibia Api to get the data
 * https://docs.tibiadata.com/
 */
import fetch from 'electron-fetch';

// const host = 'https://api.tibiadata.com';
const host = 'https://dev.tibiadata.com/v4';

export const getBosses = async () => {
  const bosses = await fetch(`${host}/boostablebosses`);
  const json = await bosses.json();
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return json.boostable_bosses;
};

export const getCreatures = async () => {
  const creatures = await fetch(`${host}/creatures`);
  const json = await creatures.json();
  return json.creatures;
};

export const getRashidLocation = () => {
  const dayCityMap = {
    monday: 'Svargrond',
    tuesday: 'Liberty Bay',
    wednesday: 'Port Hope',
    thursday: 'Ankrahmun',
    friday: 'Darashia',
    saturday: 'Edron',
    sunday: 'Carlin',
  };
  const date = new Date();
  const dayName = date
    .toLocaleDateString('en', { weekday: 'long' })
    .toLowerCase();
  return dayCityMap[dayName];
};

export const getCharacterInformation = async (characterName) => {
  const characterInfo = await fetch(`${host}/character/${characterName}`);
  const json = await characterInfo.json();
  return json;
};
