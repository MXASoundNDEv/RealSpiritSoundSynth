// src/components/Oscilloscope.js

import React, { useEffect, useRef } from "react";
import { makeDraggable } from "../utils/menuUtils";
import { drawOscilloscope } from "../utils/audioUtils";

const Oscilloscope = () => {
	const oscilloscopeRef = useRef(null);
	const canvasRef = useRef(null);

	useEffect(() => {
		if (oscilloscopeRef.current) {
			makeDraggable(oscilloscopeRef.current);
		}

		if (canvasRef.current) {
			drawOscilloscope(canvasRef.current);
		}
	}, []);

	return (
		<div
			className="frame oscilloscope-frame Drag"
			id="frame-Oscilloscope"
			ref={oscilloscopeRef}
		>
			<button className="close-btn">X</button>
			<h2>Oscilloscope</h2>
			<canvas
				id="oscilloscope"
				width="800"
				height="200"
				ref={canvasRef}
			></canvas>
		</div>
	);
};

export default Oscilloscope;

