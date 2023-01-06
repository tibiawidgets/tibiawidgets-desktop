/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  nativeImage,
  Tray,
  Menu,
  MenuItem,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import toDataURL from '../tools/url2DataUrl';
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

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
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
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      devTools: false,
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
  console.log('click on PArty loot share, show textarea', menuItem);
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
    const data = await toDataURL(boostedCreature.image_url);
    const image = nativeImage.createFromBuffer(data);
    console.log(image.getSize());
    const bossIcon = nativeImage
      .createFromDataURL(
        'https://static.tibia.com/images/global/header/monsters/cyclopssmith.gif'
      )
      .resize({ width: 80, height: 100 });
    const creatureIcon = nativeImage
      .createFromDataURL(boostedCreature.image_url)
      .resize({ width: 16 });
    const rashidIcon = nativeImage
      .createFromPath(getAssetPath('Rashid.png'))
      .resize({ width: 80, height: 100 });
    // Nota: su código contextMenu, Tooltip y Title ¡irá aquí!
    const contextMenu = Menu.buildFromTemplate([
      {
        icon: bossIcon,
        label: `Boosted Boss: ${boostedBoss.name}`,
        type: 'normal',
      },
      { label: `Boosted Creature: ${boostedCreature.name}`, type: 'normal' },
      {
        icon: rashidIcon,
        label: `Rashid is at ${rashidLocation}`,
        type: 'normal',
      },
      { type: 'separator' },
      {
        label: 'Party Loot Share',
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
