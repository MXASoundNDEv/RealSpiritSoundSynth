// src/components/LFO.js

import React, { useEffect, useRef } from "react";
import { makeDraggable, makeResizable } from "../utils/menuUtils";

const LFO = () => {
	const lfoRef = useRef(null);

	useEffect(() => {
		if (lfoRef.current) {
			makeDraggable(lfoRef.current);
			makeResizable(lfoRef.current);
		}
	}, []);

	return (
		<div className="frame resizable-module Drag" id="frame-LFOs" ref={lfoRef}>
			<button className="close-btn">X</button>
			<h2>LFO Controls</h2>
			<div className="lfo-controls">
				<label htmlFor="vibrato-frequency">Vibrato Frequency</label>
				<input
					type="range"
					id="vibrato-frequency"
					min="0"
					max="20"
					step="0.1"
					defaultValue="5"
				/>

				<label htmlFor="vibrato-depth">Vibrato Depth</label>
				<input
					type="range"
					id="vibrato-depth"
					min="0"
					max="100"
					step="1"
					defaultValue="10"
				/>
			</div>
		</div>
	);
};

export default LFO;
