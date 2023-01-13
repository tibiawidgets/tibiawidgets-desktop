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
import { JSONConfigFile } from 'types/types';
import { HuntSession } from 'contexts/HuntSessionsContext';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  getBosses,
  getCreatures,
  getRashidLocation,
} from '../services/tibia-api';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
const APP_NAME = 'TibiaWidgets';
const APP_CONFIG_FILE_NAME = 'tw.config.json';
const OS_MAC_TIBIA_CLIENT_PATH =
  '/CipSoft GmbH/TIbia/packages/Tibia/Contents/Resources/';
const OS_WIN32_TIBIA_CLIENT_PATH = '/Local/';
const APP_TIBIA_CLIENT = 'Tibia';

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('file-save', async (event, arg) => {
  console.log('Saving File...');
  event.reply('file-save', `File ${arg} saved`);
});

function setupAppConfig(appDataPath: string) {
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
  setupAppConfig(appDataPath);
  // read config file
  const appConfig = readAppConfig(appDataPath);
  return appConfig;
}

function validateClientPath(): boolean {
  const { tibiaClientPath, configPath } = getAppConfig();
  const execPath = path.join(tibiaClientPath, 'Tibia.exe');
  if (fs.existsSync(execPath)) {
    console.log('Tibia.exe found');
  } else {
    console.log('Tibia Client Path incorrect. Cannot find Tibia.exe.');
    const dirPath = dialog.showOpenDialogSync({
      properties: ['openDirectory'],
    });
    console.log('Updating Tibia Client path');
    const newAppConfig = {
      configPath,
      tibiaClientPath: dirPath ? dirPath[0] : '',
    };
    const configFilePath = path.join(
      app.getPath('appData'),
      APP_NAME,
      APP_CONFIG_FILE_NAME
    );
    fs.writeFileSync(configFilePath, JSON.stringify(newAppConfig));
  }
  return true;
}

ipcMain.on('init', async (event, arg) => {
  console.log('Initializing app');
  console.log('Looking for Tibia Widgets Config File');
  const appConfig = getAppConfig();
  // reply to context
  event.reply('init', appConfig);
});

ipcMain.on('getHuntSessions', async (event, arg) => {
  if (validateClientPath()) {
    const { tibiaClientPath } = getAppConfig();
    const logPath = path.join(tibiaClientPath, 'packages/Tibia/log');
    if (fs.existsSync(logPath)) {
      const files = fs.readdirSync(logPath);
      const jsonFiles = files.filter((file) => {
        return file.match('.json') !== null;
      });
      const hunts: HuntSession[] = [];
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
      event.reply('getHuntSessions', hunts);
    }
  } else {
    console.log('Invalid client path');
  }
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

  mainWindow = new BrowserWindow({
    show: false,
    width: 1180,
    height: 728,
    resizable: true,
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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

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

app
  .whenReady()
  .then(() => {
    // createWindow();
    addTray();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
