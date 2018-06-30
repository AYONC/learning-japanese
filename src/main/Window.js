import { BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

let mainWindow = null;

const windowMinWidth = 720;
const windowMinHeight = 1080;

const baseConfig = {
  x: undefined,
  y: undefined,
  width: windowMinWidth,
  minWidth: windowMinWidth,
  height: windowMinHeight,
  minHeight: windowMinHeight,
  minimizable: true,
  maximizable: true,
  fullscreenable: true,
  show: false,
  frame: true,
  backgroundColor: 'transparent',
};

export default class Window {
  static getDefaultConfig() {
    return baseConfig;
  }

  static create(filePath, config) {
    const window = new BrowserWindow({
      ...this.getDefaultConfig(),
      ...(config || {}),
    });
    window.loadURL(
      url.format({
        pathname: filePath,
        protocol: 'file:',
        slashes: true,
      }),
    );
    return window;
  }

  static getMainWindow() {
    return mainWindow;
  }

  static loadMainWindow() {
    const filePath = path.resolve(__dirname, 'dist', 'index.html');
    const window = this.create(filePath);
    window.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
    window.once('ready-to-show', () => {
      window.show();
    });

    mainWindow = window;
    return window;
  }
}
