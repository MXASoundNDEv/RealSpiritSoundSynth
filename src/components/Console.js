// src/components/ConsoleView.js

import React, { useEffect, useRef } from "react";
import { makeDraggable, makeResizable } from "../utils/menuUtils";

const ConsoleView = () => {
	const consoleRef = useRef(null);

	useEffect(() => {
		if (consoleRef.current) {
			makeDraggable(consoleRef.current);
			makeResizable(consoleRef.current);
		}
	}, []);

	useEffect(() => {
		// Redéfinir console.log pour afficher dans la console de visualisation
		const originalConsoleLog = console.log;
		console.log = function (...args) {
			const consoleOutput = document.getElementById("console-output");
			if (consoleOutput) {
				consoleOutput.value += args.join(" ") + "\n";
				consoleOutput.scrollTop = consoleOutput.scrollHeight;
			}
			originalConsoleLog.apply(console, args);
		};
	}, []);

	return (
		<div
			className="frame resizable-module Drag"
			id="frame-Console"
			ref={consoleRef}
		>
			<button className="close-btn">X</button>
			<h2>Console de Visualisation</h2>
			<textarea
				className="console-view"
				id="console-output"
				readOnly
			></textarea>
			<div className="resize-handle"></div>
		</div>
	);
};

export default ConsoleView;
