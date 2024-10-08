// src/components/Chart.js

import React, { useEffect, useRef } from "react";
import { makeDraggable } from "../utils/menuUtils";

const Chart = () => {
	const chartRef = useRef(null);
	const canvasRef = useRef(null);

	useEffect(() => {
		if (chartRef.current) {
			makeDraggable(chartRef.current);
		}

		// Initialiser le graphique ici si nécessaire
		// Par exemple, en utilisant Chart.js ou SmoothieCharts
	}, []);

	return (
		<div className="frame chart-frame Drag" id="frame-Charts" ref={chartRef}>
			<button className="close-btn">X</button>
			<h2>Graphique des Notes</h2>
			<canvas
				id="notes-chart"
				width="800"
				height="200"
				ref={canvasRef}
			></canvas>
		</div>
	);
};

export default Chart;
