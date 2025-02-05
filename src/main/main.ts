/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import fs from 'fs';
import path from 'path';
import OS from 'os';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  nativeImage,
  Tray,
  Menu,
  MenuItem,
  dialog,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { HuntSession } from 'contexts/HuntSessionsContext';
import { CloudStatusType, JSONConfigFile } from 'types/types';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  getBosses,
  getCreatures,
  getRashidLocation,
  getCharacterInformation,
} from '../services/tibia-api';
import {
  copyHuntsFiles,
  PATH_HUNTS_TIBIA_WIDGETS,
} from '../tools/files-manager';
import MongoDB from '../database/db';

const CLOUD_STATUS: CloudStatusType = 'off';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
const db = new MongoDB(
  'mongodb+srv://gbego91:mhjStMjwRyB1owMy@tibia-widgets.ri0t2zs.mongodb.net/tibia-widgets',
  'tibia-widgets',
  'hunt-sessions'
);
const APP_NAME = 'TibiaWidgets';
const APP_CONFIG_FILE_NAME = 'tw.config.json';
const OS_MAC_TIBIA_CLIENT_PATH =
  '/CipSoft GmbH/TIbia/packages/Tibia/Contents/Resources/';
const OS_WIN32_TIBIA_CLIENT_PATH = '/Local/';
const APP_TIBIA_CLIENT = 'Tibia';
const APP_TIBIA_CLIENT_EXEC = 'Tibia.exe';

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('file-save', async (event, arg) => {
  console.log('Saving File...');
  event.reply('file-save', `File ${arg} saved`);
});

ipcMain.on('close-window', async (event, arg) => {
  console.log('window closed');
  event.reply('close-window');
});

// Create tw.config.json file
function setupAppFiles(appDataPath: string) {
  // provide a default Tibia path "../AppData/Local/Tibia" for Windows
  const tibiaClientDataPath = path.join(
    app.getPath('appData'),
    OS.platform() === 'win32'
      ? OS_WIN32_TIBIA_CLIENT_PATH
      : OS_MAC_TIBIA_CLIENT_PATH,
    APP_TIBIA_CLIENT
  );
  const filenamePath = path.join(appDataPath, APP_CONFIG_FILE_NAME);
  if (!fs.existsSync(appDataPath)) {
    console.log('Creating Tibia Widgets directory');
    fs.mkdirSync(appDataPath);
  }
  if (!fs.existsSync(filenamePath)) {
    console.log(`Creating config files for Tibia Widgets in ${appDataPath}`);
    const initContent: JSONConfigFile = {
      dirRoot: appDataPath,
      configPath: filenamePath,
      tibiaClientPath: tibiaClientDataPath,
    };
    fs.writeFileSync(filenamePath, JSON.stringify(initContent));
  }
}

function readAppConfig(appDataPath: string): JSONConfigFile {
  const configFilePath = path.join(appDataPath, APP_CONFIG_FILE_NAME);
  const file = fs.readFileSync(configFilePath, { encoding: 'utf8', flag: 'r' });
  return JSON.parse(file);
}

function getAppConfig(): JSONConfigFile {
  const appDataPath = path.join(app.getPath('appData'), APP_NAME);
  const filenamePath = path.join(appDataPath, APP_CONFIG_FILE_NAME);
  if (!fs.existsSync(appDataPath) || !fs.existsSync(filenamePath)) {
    setupAppFiles(appDataPath);
  }
  // read config file
  const appConfig = readAppConfig(appDataPath);
  return appConfig;
}

function validateClientPath(tibiaClientPath: string): boolean {
  const execPath = path.join(tibiaClientPath, APP_TIBIA_CLIENT_EXEC);
  if (!fs.existsSync(execPath)) {
    console.log('Tibia Client Path incorrect. Cannot find Tibia.exe.');
    return false;
  }
  return true;
}

function updateClientPath() {
  const dirPath = dialog.showOpenDialogSync({
    properties: ['openDirectory'],
  });
  console.log('Updating Tibia Client path');
  const appConfig = getAppConfig();
  const newAppConfig = {
    ...appConfig,
    tibiaClientPath: dirPath ? dirPath[0] : '',
  };
  const configFilePath = path.join(
    app.getPath('appData'),
    APP_NAME,
    APP_CONFIG_FILE_NAME
  );
  fs.writeFileSync(configFilePath, JSON.stringify(newAppConfig));
}

ipcMain.on('init', async (event, arg) => {
  console.log('Initializing app');
  console.log('Looking for Tibia Widgets Config File');
  let appConfig = getAppConfig();
  if (!validateClientPath(appConfig.tibiaClientPath)) {
    updateClientPath();
    appConfig = getAppConfig();
  }
  // Copy hunt files
  copyHuntsFiles(appConfig.tibiaClientPath, appConfig.dirRoot, false);
  // reply to context
  event.reply('init', appConfig);
});

function removeDuplicatesBySessionStart(
  huntSessions: HuntSession[]
): HuntSession[] {
  const sessionStartMap: { [key: string]: HuntSession[] } = {};

  huntSessions.forEach((huntSession) => {
    if (
      huntSession.session &&
      huntSession.session.session &&
      huntSession.session.session.start
    ) {
      const sessionStart = huntSession.session.session.start;

      if (!sessionStartMap[sessionStart]) {
        sessionStartMap[sessionStart] = [];
      }

      sessionStartMap[sessionStart].push(huntSession);
    }
  });

  const nonDuplicatedSessionLists: HuntSession[] = Object.values(
    sessionStartMap
  )
    .filter((sessionList) => sessionList.length === 1)
    .map((sessionList) => sessionList[0]);

  const mergedSessionLists: HuntSession[] = Object.values(sessionStartMap)
    .filter((sessionList) => sessionList.length > 1)
    .map((sessionList) => {
      const mergedSession = { ...sessionList[0] };

      sessionList.forEach((huntSession) => {
        if (huntSession.session && huntSession.session.session) {
          mergedSession.session = {
            ...mergedSession.session,
            ...huntSession.session,
          };
        }
      });

      return mergedSession;
    });

  return [...nonDuplicatedSessionLists, ...mergedSessionLists];
}

ipcMain.on('getHuntSessions', async (event, arg) => {
  const { dirRoot } = getAppConfig();
  const huntsPath = path.join(dirRoot, PATH_HUNTS_TIBIA_WIDGETS);
  if (huntsPath) {
    const logPath = path.join(huntsPath);
    if (fs.existsSync(logPath)) {
      const files = fs.readdirSync(logPath);
      const jsonFiles = files.filter((file) => {
        return file.match('.json') !== null;
      });
      let hunts: HuntSession[] = [];
      jsonFiles.forEach((fileName) => {
        const jsonFilePath = path.join(logPath, fileName);
        const file = fs.readFileSync(jsonFilePath, {
          encoding: 'utf8',
          flag: 'r',
        });
        const hunt: HuntSession = {
          name: fileName,
          session: JSON.parse(file),
        };
        hunts.push(hunt);
      });

      // remove duplicates by starting date+time
      hunts = removeDuplicatesBySessionStart(hunts);
      hunts.sort((huntA: HuntSession, huntB: HuntSession) => {
        if (huntA.name < huntB.name) {
          return -1;
        }
        return 1;
      });

      event.reply('getHuntSessions', hunts);
    }
  } else {
    console.log('Invalid client path');
  }
});

ipcMain.on('synchHuntSessions', async (event, arg) => {
  console.log('synch hunt sessions');
  let appConfig = getAppConfig();
  if (!validateClientPath(appConfig.tibiaClientPath)) {
    updateClientPath();
    appConfig = getAppConfig();
  }
  // Copy hunt files
  copyHuntsFiles(appConfig.tibiaClientPath, appConfig.dirRoot, true);
  event.reply('synchHuntSessions');
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  if (mainWindow) {
    mainWindow.show();
    return;
  }

  mainWindow = new BrowserWindow({
    show: true,
    width: 1600,
    height: 980,
    resizable: false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      devTools: true,
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  app.on('before-quit', () => {
    if (CLOUD_STATUS === 'on') {
      // Close the MongoDB connection when the window is closed.
      db.disconnect()
        .then(() => {
          console.log('Disconnected from MongoDB');
        })
        .catch((err) => {
          console.error(err);
        });
    }
    mainWindow = null;
  });

  mainWindow.on('closed', () => {});

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'allow' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

/* app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); */

/**
 * Get boosted from category
 */

type CreatureType = {
  name: string;
  race?: string;
  image_url: string;
  featured: boolean;
};

type CreatureListType = {
  boosted: CreatureType;
  boostable_boss_list?: Array<CreatureType>;
  creatureList?: Array<CreatureType>;
};

function getBoosted(list: CreatureListType): CreatureType {
  return list.boosted;
}

function handlerPartyLootShare(menuItem: MenuItem) {
  createWindow();
}

async function connectDB() {
  const client = await db.connect();
  const collection = await db.getAllHuntSessionsByUserId(2);
  global.db = client;
}

/**
 * Add Tray
 */

const addTray = () => {
  let tray: Tray;

  // eslint-disable-next-line promise/catch-or-return
  app.whenReady().then(async () => {
    const icon = nativeImage.createFromPath(getAssetPath('16x16.png'));
    icon.resize({ width: 16 });
    tray = new Tray(icon);
    const rashidLocation = getRashidLocation();
    const bosses = await getBosses();
    const creatures = await getCreatures();
    const boostedBoss = getBoosted(bosses);
    const boostedCreature = getBoosted(creatures);
    const char = getCharacterInformation('Sir Paeris');
    // Nota: su código contextMenu, Tooltip y Title ¡irá aquí!
    const contextMenu = Menu.buildFromTemplate([
      {
        label: `Boosted Boss: ${boostedBoss.name}`,
        type: 'normal',
      },
      { label: `Boosted Creature: ${boostedCreature.name}`, type: 'normal' },
      {
        label: `Rashid is at ${rashidLocation}`,
        type: 'normal',
      },
      { type: 'separator' },
      {
        label: 'Open Tibia Widgets',
        type: 'normal',
        click: handlerPartyLootShare,
      },
      {
        label: 'Exit',
        type: 'normal',
        role: 'quit',
      },
    ]);

    tray.setContextMenu(contextMenu);
    tray.setToolTip('Tibia Widget Desktop');
  });
};

app.on('ready', async () => {
  // connectDB();
});

app
  .whenReady()
  .then(() => {
    createWindow();
    addTray();
  })
  .catch(console.log);
