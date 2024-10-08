const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");

let win;

function createWindow() {
	win = new BrowserWindow({
		width: 1000,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: false,
			contextIsolation: true,
			enableWebMIDI: true,
		},
	});

	win.loadURL("http://localhost:3000");

	// Autres configurations si nécessaire
}

app.whenReady().then(createWindow);

// Gérer les événements IPC si nécessaire
