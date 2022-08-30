/* eslint-disable promise/always-return */
const { app, Tray, Menu, nativeImage } = require('electron');

let tray;

// eslint-disable-next-line promise/catch-or-return
app.whenReady().then(() => {
  const icon = nativeImage.createFromPath('../../assets/icons/16x16.png');
  tray = new Tray(icon);
  // Nota: su código contextMenu, Tooltip y Title ¡irá aquí!
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('Tibia Widget Desktop');
});
