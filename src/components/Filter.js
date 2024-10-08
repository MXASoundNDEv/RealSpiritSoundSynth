// src/components/Filter.js

import React, { useEffect, useRef } from "react";
import { makeDraggable, makeResizable } from "../utils/menuUtils";

const Filter = () => {
	const filterRef = useRef(null);

	useEffect(() => {
		if (filterRef.current) {
			makeDraggable(filterRef.current);
			makeResizable(filterRef.current);
		}
	}, []);

	return (
		<div
			className="frame resizable-module Drag"
			id="frame-Filters"
			ref={filterRef}
		>
			<button className="close-btn">X</button>
			<h2>Filter Controls</h2>
			<div className="filter-controls">
				<label htmlFor="filter-frequency">Filter Frequency</label>
				<input
					type="range"
					id="filter-frequency"
					min="100"
					max="10000"
					step="10"
					defaultValue="1000"
				/>

				<label htmlFor="filter-q">Filter Q</label>
				<input
					type="range"
					id="filter-q"
					min="0.1"
					max="20"
					step="0.1"
					defaultValue="1"
				/>
			</div>
		</div>
	);
};

export default Filter;
