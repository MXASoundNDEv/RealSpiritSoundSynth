// src/components/Keyboard.js

import React, { useEffect, useState, useRef } from "react";
import { handleNoteOn, handleNoteOff, sendNoteOff } from "../utils/midiUtils";
import {playNote} from "../utils/audioUtils";
import { makeDraggable } from "../utils/menuUtils";

const Keyboard = () => {
	const keyboardRef = useRef(null);
	const [activeNotes, setActiveNotes] = useState([]);

	// Liste des touches blanches avec leurs identifiants MIDI et labels
	const whiteKeys = [
		{ note: 48, label: "C3" },
		{ note: 50, label: "D3" },
		{ note: 52, label: "E3" },
		{ note: 53, label: "F3" },
		{ note: 55, label: "G3" },
		{ note: 57, label: "A3" },
		{ note: 59, label: "B3" },
		{ note: 60, label: "C4" },
		{ note: 62, label: "D4" },
		{ note: 64, label: "E4" },
		{ note: 65, label: "F4" },
		{ note: 67, label: "G4" },
		{ note: 69, label: "A4" },
		{ note: 71, label: "B4" },
		{ note: 72, label: "C5" },
	];

	// Liste des touches noires avec leurs identifiants MIDI
	const blackKeys = [
		{ note: 49, position: 1 },
		{ note: 51, position: 2 },
		null, // Pas de touche noire entre E et F
		{ note: 54, position: 4 },
		{ note: 56, position: 5 },
		{ note: 58, position: 6 },
		null, // Pas de touche noire entre B et C
		{ note: 61, position: 8 },
		{ note: 63, position: 9 },
		null,
		{ note: 66, position: 11 },
		{ note: 68, position: 12 },
		{ note: 70, position: 13 },
	];

	useEffect(() => {
		if (keyboardRef.current) {
			makeDraggable(keyboardRef.current);
		}
	}, []);

	// Gestion des clics sur les touches
	const handleMouseDown = (note) => {
		if (!activeNotes.includes(note)) {
			setActiveNotes((prev) => [...prev, note]);
		}
		playNote(note, 127); // Vélocité maximale
	};

	const handleMouseUp = (note) => {
		setActiveNotes((prev) => prev.filter((n) => n !== note));
		sendNoteOff(note);
	};

	return (
		<div className="frame Drag" id="frame-Keyboard" ref={keyboardRef}>
			<button className="close-btn">X</button>
			<h2>Clavier</h2>
			<div className="keyboard">
				{/* Touches noires */}
				<div className="black-keys">
					{blackKeys.map((key, index) => {
						if (key) {
							return (
								<div
									key={key.note}
									id={`key-${key.note}`}
									className={`key black ${
										activeNotes.includes(key.note) ? "active" : ""
									}`}
									style={{ left: `${key.position * 40 - 15}px` }}
									onMouseDown={() => handleMouseDown(key.note)}
									onMouseUp={() => handleMouseUp(key.note)}
									onMouseLeave={() => handleMouseUp(key.note)}
								></div>
							);
						} else {
							return null; // Pas de touche noire à cet emplacement
						}
					})}
				</div>

				{/* Touches blanches */}
				<div className="white-keys">
					{whiteKeys.map((key, index) => (
						<div
							key={key.note}
							id={`key-${key.note}`}
							className={`key white ${
								activeNotes.includes(key.note) ? "active" : ""
							}`}
							onMouseDown={() => handleMouseDown(key.note)}
							onMouseUp={() => handleMouseUp(key.note)}
							onMouseLeave={() => handleMouseUp(key.note)}
						>
							{key.label}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Keyboard;
