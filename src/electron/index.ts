import { app, BrowserWindow} from "electron";
import * as remoteMain from "@electron/remote/main";

remoteMain.initialize();
const createWindow = () => {
    const win = new BrowserWindow({
        icon: `./icon.png`,
        autoHideMenuBar: true,
        frame: false,
        width: 800,
        height: 600,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
        }
    });

    remoteMain.enable(win.webContents);
    win.loadFile("./src/electron/template.html");
    win.webContents.on("dom-ready", () =>{
        win.webContents.executeJavaScript("require('../../dist/frontend/index')");
    });
};


app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit(); // apple duh
});
