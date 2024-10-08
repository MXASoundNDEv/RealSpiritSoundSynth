// electron.js

const { app, BrowserWindow, ipcMain, Menu, dialog } = require("electron");
const { exec } = require("child_process"); // Pour exécuter des commandes système
const path = require("path");

// Déterminer si on est en mode développement ou production
const isDev = !app.isPackaged;

let mainWindow;
let moduleStates = {}; // Gérer les états des modules
let moduleList = []; // Liste des modules
let midiInputs = [];
let midiOutputs = [];
let selectedMidiInput = null;
let selectedMidiOutput = null;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: false, // Important pour la sécurité
			contextIsolation: true, // Important pour la sécurité
			enableWebMIDI: true, // Activer l'accès au MIDI
		},
	});

	// Charger React (en développement ou en production)
	if (isDev) {
		mainWindow.loadURL("http://localhost:3000");
		mainWindow.webContents.openDevTools(); // Ouvrir les DevTools en développement
	} else {
		mainWindow.loadFile(path.join(__dirname, "build", "index.html"));
	}

	// Configurer les écouteurs IPC
	setupIPCListeners();

	// Événement quand la fenêtre Electron est fermée
	mainWindow.on("closed", () => {
		mainWindow = null;
		stopReactDevServer(); // Arrêter React si en mode développement
	});
}

// Configuration des écouteurs IPC
function setupIPCListeners() {
	ipcMain.on("generate-menu", (event, receivedModuleList) => {
		moduleStates = {}; // Réinitialiser l'état des modules
		receivedModuleList.forEach((module) => {
			moduleStates[module.id] = true;
		});
		moduleList = receivedModuleList; // Mettre à jour moduleList avec les modules reçus
		generateMenu();
		console.log("generate-menu");
	});

	ipcMain.on("update-menu", (event, moduleId, isVisible) => {
		moduleStates[moduleId] = isVisible;
		generateMenu();
		console.log("update-menu");
	});

	ipcMain.on("update-midi-ports", (event, { inputs, outputs }) => {
		midiInputs = inputs;
		midiOutputs = outputs;
		generateMenu();
		console.log("update-midi-ports");
	});

	ipcMain.on("select-midi-port", (event, { type, id }) => {
		if (type === "input") {
			selectedMidiInput = id;
		} else {
			selectedMidiOutput = id;
		}
		mainWindow.webContents.send("midi-port-selected", { type, id });
		console.log("select-midi-port");
	});

	ipcMain.on("show-about", () => {
		dialog.showMessageBox(mainWindow, {
			type: "info",
			title: "À propos",
			message: "Votre application Electron - Version 1.0.0",
			detail: "Développé par Max",
		});
		console.log("show-about");
	});
}

// Générer le menu de l'application
function generateMenu() {
	console.log("Generating Module Menu ...");

	const fileMenu = {
		label: "Fichier",
		submenu: [
			{
				label: "Nouvelle fenêtre",
				click: () => {
					createWindow();
				},
			},
			{ type: "separator" },
			{ label: "Quitter", role: "quit" },
		],
	};

	const viewMenu = {
		label: "Affichage",
		submenu: [
			{ role: "reload" },
			{ role: "toggleDevTools" },
			{ type: "separator" },
			{ role: "resetZoom" },
			{ role: "zoomIn" },
			{ role: "zoomOut" },
			{ type: "separator" },
			{ role: "togglefullscreen" },
		],
	};

	const midiMenu = {
		label: "MIDI",
		submenu: [
			{
				label: "Entrées MIDI",
				submenu: midiInputs.map((input) => ({
					label: input.name,
					type: "radio",
					checked: input.id === selectedMidiInput,
					click: () => {
						selectedMidiInput = input.id;
						mainWindow.webContents.send("midi-port-selected", {
							type: "input",
							id: input.id,
						});
						generateMenu();
					},
				})),
			},
			{
				label: "Sorties MIDI",
				submenu: midiOutputs.map((output) => ({
					label: output.name,
					type: "radio",
					checked: output.id === selectedMidiOutput,
					click: () => {
						selectedMidiOutput = output.id;
						mainWindow.webContents.send("midi-port-selected", {
							type: "output",
							id: output.id,
						});
						generateMenu();
					},
				})),
			},
		],
	};

	const modulesMenu = {
		label: "Modules",
		submenu: moduleList.map((module) => {
			return {
				label: `Afficher ${module.name}`,
				type: "checkbox",
				checked: moduleStates[module.id] || false,
				click: () => {
					// Mettre à jour l'état du module
					moduleStates[module.id] = !moduleStates[module.id];
					console.log(
						`Module ${module.id} est ${
							moduleStates[module.id] ? "activé" : "désactivé"
						}`
					);
					// Envoyer un message au processus de rendu (React)
					mainWindow.webContents.send("toggle-module", {
						moduleId: module.id,
						isVisible: moduleStates[module.id],
					});

					// Régénérer le menu pour refléter les changements
					generateMenu();
				},
			};
		}),
	};

	const helpMenu = {
		label: "Aide",
		submenu: [
			{
				label: "Documentation",
				click: async () => {
					const { shell } = require("electron");
					await shell.openExternal("https://www.electronjs.org/docs");
				},
			},
			{
				label: "À propos",
				click: () => {
					dialog.showMessageBox(mainWindow, {
						type: "info",
						title: "À propos",
						message: "Votre application Electron - Version 1.0.0",
						detail: "Développé par Max",
					});
				},
			},
		],
	};

	const menuTemplate = [fileMenu, viewMenu, midiMenu, modulesMenu, helpMenu];

	const menu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

// Fonction pour arrêter le serveur de développement React
function stopReactDevServer() {
	if (isDev) {
		console.log("Arrêt du serveur React...");
		// Fermer le processus de dev server (remplacer par votre propre méthode si nécessaire)
		exec("npx kill-port 3000", (err) => {
			if (err) {
				console.error(`Erreur lors de l'arrêt du serveur React : ${err}`);
				return;
			}
			console.log("Serveur React arrêté.");
		});
	}
}

// Fermer l'application si toutes les fenêtres sont fermées (sauf sur macOS)
app.on("window-all-closed", () => {
	stopReactDevServer();
	if (process.platform !== "darwin") app.quit();
});

// Recréer la fenêtre sur macOS si l'application est relancée sans fenêtre
app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
