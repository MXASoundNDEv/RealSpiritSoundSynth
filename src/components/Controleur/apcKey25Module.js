import { handleNoteOn, handleNoteOff, handleControlChange } from './midiController';

let activeNotes = {};

// Map des pads et contrôles spécifiques à l'APC Key 25
const PAD_MIDI_MAP = {
    // Layout for each line of pads
    ...{
        0x20: "Pad A1", 0x21: "Pad A2", 0x22: "Pad A3", 0x23: "Pad A4",
        0x24: "Pad A5", 0x25: "Pad A6", 0x26: "Pad A7", 0x27: "Pad A8"  // Line 1
    },
    ...{
        0x18: "Pad B1", 0x19: "Pad B2", 0x1A: "Pad B3", 0x1B: "Pad B4",
        0x1C: "Pad B5", 0x1D: "Pad B6", 0x1E: "Pad B7", 0x1F: "Pad B8"  // Line 2
    },
    ...{
        0x10: "Pad C1", 0x11: "Pad C2", 0x12: "Pad C3", 0x13: "Pad C4",
        0x14: "Pad C5", 0x15: "Pad C6", 0x16: "Pad C7", 0x17: "Pad C8"  // Line 3
    },
    ...{
        0x08: "Pad D1", 0x09: "Pad D2", 0x0A: "Pad D3", 0x0B: "Pad D4",
        0x0C: "Pad D5", 0x0D: "Pad D6", 0x0E: "Pad D7", 0x0F: "Pad D8"  // Line 4
    },
    ...{
        0x00: "Pad E1", 0x01: "Pad E2", 0x02: "Pad E3", 0x03: "Pad E4",
        0x04: "Pad E5", 0x05: "Pad E6", 0x06: "Pad E7", 0x07: "Pad E8"  // Line 5
    },
    ...{
        0x40: "Up", 0x41: "Down", 0x42: "Left", 0x43: "Right", // arrow
    },
    ...{
        0x44: "Volume", 0x45: "Pan", 0x46: "Send", 0x47: "Device", //Knob CTRL
    }
    // ToDo Scene Launch (tired...)
};

const KNOB_MIDI_MAP = {
    ...{
        0x30: "Knob 1", 0x31: "Knob 2", 0x32: "Knob 3", 0x33: "Knob 4" //ligne 1
    },
    ...{
        0x34: "Knob 5", 0x35: "Knob 6", 0x36: "Knob 7", 0x37: "Knob 8" //ligne 2
    }
    
};

// Surcharge les fonctions pour gérer les spécificités du contrôleur
export function handleNoteOn(note, velocity) {
    if (PAD_MIDI_MAP[note]) {
        console.log(`Pad activé : ${PAD_MIDI_MAP[note]} avec vélocité ${velocity}`);
        // Logique spécifique pour activer le pad
    } else {
        console.log(`Note activée : ${note}, vélocité : ${velocity}`);
    }
}

export function handleNoteOff(note) {
    if (PAD_MIDI_MAP[note]) {
        console.log(`Pad désactivé : ${PAD_MIDI_MAP[note]}`);
        // Logique spécifique pour désactiver le pad
    } else {
        console.log(`Note désactivée : ${note}`);
    }
}

export function handleControlChange(controller, value) {
    if (KNOB_MIDI_MAP[controller]) {
        console.log(`Contrôle changé : ${KNOB_MIDI_MAP[controller]} avec valeur ${value}`);
        // Logique spécifique pour ajuster le paramètre contrôlé par le potentiomètre
    } else {
        console.log(`Contrôle MIDI non géré : ${controller} avec valeur ${value}`);
    }
}

// Initialiser le module APC Key 25
export function initAPCKey25() {
    registerController("APCKey25", { handleMIDIMessage });
    console.log("APC Key 25 connecté.");
}

// Arrêter le module APC Key 25
export function stopAPCKey25() {
    unregisterController("APCKey25");
    console.log("APC Key 25 déconnecté.");
}

// Gérer les messages MIDI pour l'APC Key 25
function handleMIDIMessage(status, data1, data2) {
    const command = status & 0xf0;

    switch (command) {
        case 0x90: // Note On
            handlePadOn(data1, data2);
            break;
        case 0x80: // Note Off
            handlePadOff(data1);
            break;
        case 0xb0: // Control Change
            handleKnobChange(data1, data2);
            break;
        default:
            console.log("Commande MIDI non gérée pour APC Key 25.");
    }
}

// Gérer l'appui sur un pad
function handlePadOn(note, velocity) {
    if (APC_KEY25_PADS[note]) {
        console.log(`Pad activé : ${APC_KEY25_PADS[note]} avec vélocité ${velocity}`);
        activeNotes[note] = velocity;
    }
}

// Gérer le relâchement d'un pad
function handlePadOff(note) {
    if (APC_KEY25_PADS[note]) {
        console.log(`Pad relâché : ${APC_KEY25_PADS[note]}`);
        delete activeNotes[note];
    }
}

// Gérer les changements des knobs
function handleKnobChange(knob, value) {
    if (APC_KEY25_KNOBS[knob]) {
        console.log(`Knob changé : ${APC_KEY25_KNOBS[knob]} avec valeur ${value}`);
    }
}

