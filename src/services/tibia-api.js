/**
 * Using Tibia Api to get the data
 * https://docs.tibiadata.com/
 */

// const host = 'https://api.tibiadata.com';
const host = 'https://dev.tibiadata.com';

export const getBosses = () => {
  return fetch(`${host}/v2/boostablebosses`)
    .then((data) => data.json())
    .then(({ boostable_bosses }) => {
      return boostable_bosses;
    })
    .catch((e) => {
      console.error('Couldnt fetch bosses');
    });
};

export const getCreatures = () => {
  return fetch(`${host}/v2/creatures`)
    .then((data) => data.json())
    .then(({ creatures }) => {
      return creatures;
    })
    .catch((e) => {
      console.error('Couldnt fetch creatures');
    });
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
