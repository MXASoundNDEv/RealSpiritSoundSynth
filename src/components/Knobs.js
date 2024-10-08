// src/components/Knobs.js

import React, { useEffect, useState, useRef } from "react";
import { handleKnobChange } from "../utils/midiUtils";
import { makeDraggable } from "../utils/menuUtils";

const Knobs = () => {
	const knobsRef = useRef(null);
	const [knobValues, setKnobValues] = useState(Array(8).fill(0));

	useEffect(() => {
		if (knobsRef.current) {
			makeDraggable(knobsRef.current);
		}
	}, []);

	const handleKnobInput = (index, value) => {
		const newValues = [...knobValues];
		newValues[index] = value;
		setKnobValues(newValues);
		handleKnobChange(index + 1, value);
	};

	return (
		<div className="frame Drag" id="frame-knobs" ref={knobsRef}>
			<button className="close-btn">X</button>
			<h2>Knob</h2>
			<div className="knobs">
				{Array.from({ length: 8 }, (_, i) => (
					<div key={i} id={`knob-${i + 1}`} className="knob">
						<div
							className="knob-indicator"
							style={{ transform: `rotate(${knobValues[i] * 270 - 135}deg)` }}
						></div>
						P{i + 1}
						{/* Vous pouvez ajouter des événements pour gérer les changements de valeur */}
					</div>
				))}
			</div>
		</div>
	);
};

export default Knobs;
