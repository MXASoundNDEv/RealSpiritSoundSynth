import React, { useEffect, useState } from "react";
import Controls from "./Controls";
import Keyboard from "./Keyboard";
import Pads from "./Pads";
import Knobs from "./Knobs";
import Console from "./Console";
import ADSR from "./ADSR";
import LFO from "./LFO";
import Filter from "./Filter";
import Chart from "./Chart";
import Oscilloscope from "./Oscilloscope";
import { initMIDI, sendNoteOn, sendNoteOff } from '../utils/midiUtils'; // Ajustez le chemin selon votre structure de fichiers
import { initAudio } from "../utils/audioUtils";
import { InitMenu, InitFrame } from "../utils/menuUtils";

const App = () => {
	const [visibleModules, setVisibleModules] = useState({
		"frame-Controls": true,
		"frame-Keyboard": true,
		"frame-Oscilloscope": true,
		"frame-Charts": true,
		"frame-Filters": true,
		"frame-LFOs": true,
		"frame-ADSRs": true,
		"frame-Console": true,
		"frame-knobs": true,
		"frame-Pads": true,
	});

	useEffect(() => {
		initMIDI();
		InitFrame();
		InitMenu();
		// initAudio();


	}, []);



	return (
		<div>
			<Controls />
			<Keyboard />
			<Pads />
			<Knobs />
			<Console />
			<ADSR />
			<LFO />
			<Filter />
			<Chart />
			{/* <Oscilloscope /> */}
		</div>
	);
};

export default App;
