// midiUtils.js
let midiAccess = null;
let currentInput = null;
let currentOutput = null;
let connectedControllers = {};

// Fonction pour initialiser l'accès MIDI
export function initMIDI() {
	if (navigator.requestMIDIAccess) {
		navigator
			.requestMIDIAccess({ sysex: false })
			.then(onMIDISuccess, onMIDIFailure)
			.catch((error) => {
				console.error("Accès MIDI refusé ou échec:", error);
				alert(
					"L'accès aux périphériques MIDI a été refusé. Veuillez vérifier les paramètres de permission du navigateur."
				);
			});
	} else {
		console.warn("L'API Web MIDI n'est pas prise en charge par ce navigateur.");
	}
}

// Callback lorsque l'accès MIDI est réussi
function onMIDISuccess(midi) {
	midiAccess = midi;

	const inputs = Array.from(midiAccess.inputs.values()).map((input) => ({
		id: input.id,
		name: input.name,
	}));

	const outputs = Array.from(midiAccess.outputs.values()).map((output) => ({
		id: output.id,
		name: output.name,
	}));

	if (inputs.length === 0) {
		console.log("Aucune entrée MIDI disponible.");
	} else {
		console.log("Entrées MIDI disponibles :", inputs);
	}

	if (outputs.length === 0) {
		console.log("Aucune sortie MIDI disponible.");
	} else {
		console.log("Sorties MIDI disponibles :", outputs);
	}

	// Envoyer les ports MIDI disponibles au processus principal via IPC
	window.electronAPI.updateMidiPorts(inputs, outputs);

	// Écouter les événements de sélection de port MIDI
	window.electronAPI.onMidiPortSelected(({ type, id }) => {
		if (type === "input") {
			selectMIDIInput(id);
		} else if (type === "output") {
			selectMIDIOutput(id);
		}
	});
}

// Callback lorsque l'accès MIDI échoue
function onMIDIFailure(error) {
	console.error("Échec de l'accès MIDI :", error);
}

// Sélectionner une entrée MIDI
function selectMIDIInput(id) {
	if (currentInput) {
		currentInput.onmidimessage = null; // Déconnecter l'ancien écouteur
	}

	const input = midiAccess.inputs.get(id);
	if (input) {
		currentInput = input;
		currentInput.onmidimessage = handleMIDIMessage;
		console.log("Entrée MIDI sélectionnée :", input.name);
	} else {
		console.log("Impossible de trouver l'entrée MIDI avec l'ID :", id);
	}
}

// Sélectionner une sortie MIDI
function selectMIDIOutput(id) {
	const output = midiAccess.outputs.get(id);
	if (output) {
		currentOutput = output;
		console.log("Sortie MIDI sélectionnée :", output.name);
	} else {
		console.log("Impossible de trouver la sortie MIDI avec l'ID :", id);
	}
}

// Gérer les messages MIDI entrants
function handleMIDIMessage(event) {
	console.log(event);

	const [status, data1, data2] = event.data;
	const command = status & 0xf0;
	const channel = status & 0x0f;

	switch (command) {
		case 0x80: // Note Off
			handleNoteOff(data1, data2);
			break;
		case 0x90: // Note On
			if (data2 === 0) {
				handleNoteOff(data1, data2);
			} else {
				handleNoteOn(data1, data2);
			}
			break;
		case 0xa0: // Polyphonic Key Pressure
			handlePolyphonicAftertouch(data1, data2);
			break;
		case 0xb0: // Control Change
			handleControlChange(data1, data2);
			break;
		case 0xc0: // Program Change
			handleProgramChange(data1);
			break;
		case 0xd0: // Channel Pressure (After-touch)
			handleChannelAftertouch(data1);
			break;
		case 0xe0: // Pitch Bend
			handlePitchBend(data1, data2);
			break;
		default:
			console.log(`Message MIDI non géré : ${status}, ${data1}, ${data2}`);
	}
}

// Fonctions pour gérer les messages MIDI spécifiques

function handleNoteOn(note, velocity) {
	console.log(`Note On - Note : ${note}, Vélocité : ${velocity}`);
	// Ici, vous pouvez déclencher la génération de son, la rétroaction visuelle, etc.

	// Par exemple, envoyer un événement à votre application React via un événement personnalisé
	const event = new CustomEvent("midiNoteOn", { detail: { note, velocity } });
	window.dispatchEvent(event);
}

export function handleKnobChange(knobNumber, value) {
	console.log(`Changement de knob - Knob : ${knobNumber}, Valeur : ${value}`);

	// Ici, vous pouvez gérer le changement du knob. Par exemple, mapper le knob à un paramètre audio
	switch (knobNumber) {
		case 1:
			// Contrôler quelque chose avec la valeur du knob 1
			break;
		case 2:
			// Contrôler un autre paramètre avec le knob 2
			break;
		default:
			console.warn(`Knob non géré : ${knobNumber}`);
	}
}

export function handlePadInteraction(padNumber, velocity) {
	console.log(
		`Interaction avec le pad - Pad : ${padNumber}, Vélocité : ${velocity}`
	);

	// Vous pouvez ici déclencher une action ou un effet sonore en fonction du pad et de la vélocité
	if (velocity > 0) {
		// Pad activé
		console.log(`Pad ${padNumber} activé avec vélocité ${velocity}`);
		// Par exemple : jouer un son
	} else {
		// Pad relâché
		console.log(`Pad ${padNumber} relâché`);
		// Par exemple : arrêter un son
	}
}

function handleNoteOff(note, velocity) {
	console.log(`Note Off - Note : ${note}, Vélocité : ${velocity}`);
	// Ici, vous pouvez arrêter la génération de son, la rétroaction visuelle, etc.

	// Envoyer un événement à votre application React
	const event = new CustomEvent("midiNoteOff", { detail: { note, velocity } });
	window.dispatchEvent(event);
}

function handleControlChange(controller, value) {
	console.log(`Control Change - Contrôleur : ${controller}, Valeur : ${value}`);
	// Gérer les messages de changement de contrôle, par exemple ajuster des paramètres

	const event = new CustomEvent("midiControlChange", {
		detail: { controller, value },
	});
	window.dispatchEvent(event);
}

function handlePitchBend(leastSignificantByte, mostSignificantByte) {
	const value = (mostSignificantByte << 7) | leastSignificantByte;
	console.log(`Pitch Bend - Valeur : ${value}`);
	// Gérer le pitch bend

	const event = new CustomEvent("midiPitchBend", { detail: { value } });
	window.dispatchEvent(event);
}

function handleProgramChange(programNumber) {
	console.log(`Program Change - Numéro de programme : ${programNumber}`);
	// Gérer le changement de programme
}

function handleChannelAftertouch(pressure) {
	console.log(`Channel Aftertouch - Pression : ${pressure}`);
	// Gérer l'aftertouch du canal
}

function handlePolyphonicAftertouch(note, pressure) {
	console.log(`Polyphonic Aftertouch - Note : ${note}, Pression : ${pressure}`);
	// Gérer l'aftertouch polyphonique
}

// Fonctions pour envoyer des messages MIDI

// Envoyer un message Note On
export function sendNoteOn(note, velocity = 0x7f) {
	if (currentOutput) {
		const noteOnMessage = [0x90, note, velocity];
		currentOutput.send(noteOnMessage);
		console.log(`Note On envoyée : Note=${note}, Vélocité=${velocity}`);
	} else {
		console.log(
			"Aucune sortie MIDI disponible pour envoyer un message Note On."
		);
	}
}

// Envoyer un message Note Off
export function sendNoteOff(note) {
	if (currentOutput) {
		const noteOffMessage = [0x80, note, 0x00];
		currentOutput.send(noteOffMessage);
		console.log(`Note Off envoyée : Note=${note}`);
	} else {
		console.log(
			"Aucune sortie MIDI disponible pour envoyer un message Note Off."
		);
	}
}

// Envoyer un message Control Change
export function sendControlChange(controller, value) {
	if (currentOutput) {
		const ccMessage = [0xb0, controller, value];
		currentOutput.send(ccMessage);
		console.log(
			`Control Change envoyé : Contrôleur=${controller}, Valeur=${value}`
		);
	} else {
		console.log(
			"Aucune sortie MIDI disponible pour envoyer un message Control Change."
		);
	}
}

// Enregistrement d'un contrôleur MIDI
export function registerController(controllerId, controllerHandler) {
    connectedControllers[controllerId] = controllerHandler;
}

// Retirer un contrôleur MIDI
export function unregisterController(controllerId) {
    delete connectedControllers[controllerId];
}