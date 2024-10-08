// src/components/ADSR.js

import React, { useEffect, useRef } from "react";
import { makeDraggable, makeResizable } from "../utils/menuUtils";

const ADSR = () => {
	const adsrRef = useRef(null);

	useEffect(() => {
		if (adsrRef.current) {
			makeDraggable(adsrRef.current);
			makeResizable(adsrRef.current);
		}
	}, []);

	return (
		<div className="frame resizable-module Drag" id="frame-ADSRs" ref={adsrRef}>
			<button className="close-btn">X</button>
			<h2>ADSR Control</h2>
			<div className="adsr-controls">
				<label htmlFor="attack-range">Attack</label>
				<input
					type="range"
					id="attack-range"
					min="0"
					max="2"
					step="0.01"
					defaultValue="0.1"
				/>

				<label htmlFor="decay-range">Decay</label>
				<input
					type="range"
					id="decay-range"
					min="0"
					max="2"
					step="0.01"
					defaultValue="0.2"
				/>

				<label htmlFor="sustain-range">Sustain</label>
				<input
					type="range"
					id="sustain-range"
					min="0"
					max="1"
					step="0.01"
					defaultValue="0.7"
				/>

				<label htmlFor="release-range">Release</label>
				<input
					type="range"
					id="release-range"
					min="0"
					max="2"
					step="0.01"
					defaultValue="0.5"
				/>
			</div>
		</div>
	);
};

export default ADSR;
