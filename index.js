const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const { IPC_EVENTS, CUSTOM_IPC_EVENTS } = require("./ipcevents");

const chalk = require("chalk");

function onAppReady() {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
    allowRendererProcessReuse: true,
  });

  // Load main.html
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "main.html"),
      protocol: "file",
      slashes: true,
    })
  );

  // Once electron 'ready-to-show' is emitted, show mainWindow
  mainWindow.once(IPC_EVENTS.READY_TO_SHOW, function showMainWindow() {
    mainWindow.show();
  });

  // Upon receiving "PING" event, log and reply if pingPong is still > 0
  ipcMain.on(CUSTOM_IPC_EVENTS.PING, function (event, arg) {
    console.log(
      `${chalk.blue("MAIN PROCESS: ")} ${chalk.yellow(
        `${CUSTOM_IPC_EVENTS.PING} message received. Message ${5 - arg + 1}/5`
      )}`
    );

    if (arg > 0) {
      event.reply(CUSTOM_IPC_EVENTS.PONG);
    }
  });
}

app.on(IPC_EVENTS.READY, onAppReady);
