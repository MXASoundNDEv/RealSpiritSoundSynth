// src/components/Controls.js

import React from "react";

const Controls = () => {
	return (
		<div className="frame" id="frame-Controls">
			<button className="close-btn">X</button>
			<h2>Controls</h2>
			<div className="controls">
				<button id="Clear">Clear tab color</button>
				<button id="velocity-toggle">Activer Vélocité</button>
				<input
					type="range"
					name="Audio"
					id="Audio-Range"
					min="0"
					max="1"
					step="0.05"
					defaultValue="0.1"
				/>
				<label htmlFor="oscillator-type">Type d'oscillateur:</label>
				<select name="oscillator-type" id="oscillator-type">
					<option value="sine">Sinusoïdale</option>
					<option value="square">Carrée</option>
					<option value="triangle">Triangle</option>
					<option value="sawtooth">Dent de scie</option>
				</select>
				<input
					type="text"
					name="Title"
					id="Title"
					defaultValue="RealSpritSoundSystem"
				/>
				<button id="RainBow">RainBow</button>
			</div>
		</div>
	);
};

export default Controls;
