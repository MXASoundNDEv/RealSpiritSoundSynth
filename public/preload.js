// preload.js

const { contextBridge, ipcRenderer } = require("electron");

// Exposer des méthodes sécurisées à l'application React
contextBridge.exposeInMainWorld("electronAPI", {
	// Gérer les modules et l'interface
	toggleModule: (callback) =>
		ipcRenderer.on("toggle-module", (event, data) =>
			callback(data)
		),
	generateMenu: (moduleList) => ipcRenderer.send("generate-menu", moduleList),
	updateMenu: (moduleId, isVisible) =>
		ipcRenderer.send("update-menu", moduleId, isVisible),

	// Mise à jour des ports MIDI disponibles
	updateMidiPorts: (inputs, outputs) =>
		ipcRenderer.send("update-midi-ports", { inputs, outputs }),

	// Sélectionner un port MIDI (si besoin)
	selectMidiPort: (type, id) =>
		ipcRenderer.send("select-midi-port", { type, id }),

	// Écouter les événements de sélection de port MIDI
	onMidiPortSelected: (callback) =>
		ipcRenderer.on("midi-port-selected", (event, data) => callback(data)),

	// Afficher la fenêtre "À propos"
	showAbout: (callback) => ipcRenderer.on("show-about", callback),
});
