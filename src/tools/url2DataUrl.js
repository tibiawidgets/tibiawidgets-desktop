import fetch from 'electron-fetch';
import fs from 'fs';

const toDataURL = async (url, callback) => {
  const file = await fetch(url);
  const blob = await file.buffer();
  return blob;
};

export default toDataURL;
