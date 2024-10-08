// src/components/Pads.js

import React, { useEffect, useRef } from "react";
import { handlePadInteraction } from "../utils/midiUtils";
import { makeDraggable } from "../utils/menuUtils";

const Pads = () => {
	const padsRef = useRef(null);

	// Générer les pads
	const padIds = Array.from({ length: 40 }, (_, i) => i);

	useEffect(() => {
		if (padsRef.current) {
			makeDraggable(padsRef.current);
		}
	}, []);

	const handlePadMouseDown = (padId) => {
		handlePadInteraction(padId, true);
	};

	const handlePadMouseUp = (padId) => {
		handlePadInteraction(padId, false);
	};

	return (
		<div className="frame Drag" id="frame-Pads" ref={padsRef}>
			<button className="close-btn">X</button>
			<h2>Pads</h2>
			<div className="pads">
				{padIds.map((padId) => (
					<div
						key={padId}
						id={`pad-${padId}`}
						className="pad"
						onMouseDown={() => handlePadMouseDown(padId)}
						onMouseUp={() => handlePadMouseUp(padId)}
						onMouseLeave={() => handlePadMouseUp(padId)}
					></div>
				))}
			</div>
			{/* Ajouter les pads ronds si nécessaire */}
		</div>
	);
};

export default Pads;
