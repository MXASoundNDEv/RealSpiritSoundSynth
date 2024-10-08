// audioUtils.js

// Création du contexte audio
const AudioContext = window.AudioContext || window.webkitAudioContext;
export const audioCtx = new AudioContext();

// Variables pour gérer les oscillateurs, les gains, etc.
const oscillators = {};
const gains = {};

// Fonction pour jouer une note
export function playNote(frequency, noteId, type = "sine", volume = 0.5) {
	// Créer un oscillateur
	console.log("Note");
	
	const oscillator = audioCtx.createOscillator();
	oscillator.type = type;
	oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

	// Créer un gain pour contrôler le volume
	const gainNode = audioCtx.createGain();
	gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);

	// Connecter l'oscillateur au gain, puis au contexte audio
	oscillator.connect(gainNode);
	gainNode.connect(audioCtx.destination);

	// Démarrer l'oscillateur
	oscillator.start();

	// Stocker l'oscillateur et le gain pour pouvoir les arrêter plus tard
	oscillators[noteId] = oscillator;
	gains[noteId] = gainNode;
}

// Fonction pour arrêter une note
export function stopNote(noteId) {
	if (oscillators[noteId]) {
		// Arrêter l'oscillateur
		oscillators[noteId].stop();
		// Déconnecter les nœuds
		oscillators[noteId].disconnect();
		gains[noteId].disconnect();
		// Supprimer les références
		delete oscillators[noteId];
		delete gains[noteId];
	}
}

// Fonction pour charger un échantillon audio
export function loadSample(url) {
	return fetch(url)
		.then((response) => response.arrayBuffer())
		.then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer));
}

// Fonction pour jouer un échantillon audio
export function playSample(audioBuffer) {
	const sampleSource = audioCtx.createBufferSource();
	sampleSource.buffer = audioBuffer;
	sampleSource.connect(audioCtx.destination);
	sampleSource.start();
}

// Fonction pour créer un filtre
export function createFilter(type = "lowpass", frequency = 440) {
	const filter = audioCtx.createBiquadFilter();
	filter.type = type;
	filter.frequency.setValueAtTime(frequency, audioCtx.currentTime);
	return filter;
}

// Fonction pour appliquer un filtre à un nœud audio
export function applyFilter(sourceNode, filterNode) {
	sourceNode.disconnect();
	sourceNode.connect(filterNode);
	filterNode.connect(audioCtx.destination);
}

// Fonction pour régler le volume global
export function setMasterVolume(value) {
	if (!audioCtx.masterGain) {
		// Créer un gain master s'il n'existe pas
		audioCtx.masterGain = audioCtx.createGain();
		audioCtx.masterGain.gain.setValueAtTime(1, audioCtx.currentTime);
		audioCtx.masterGain.connect(audioCtx.destination);
	}
	audioCtx.masterGain.gain.setValueAtTime(value, audioCtx.currentTime);
}

// Fonction pour créer un oscillateur personnalisé avec enveloppe ADSR
export function createADSRNode(frequency, options) {
	const {
		attack = 0.1,
		decay = 0.1,
		sustain = 0.7,
		release = 0.5,
		type = "sine",
		volume = 0.5,
	} = options;
	const oscillator = audioCtx.createOscillator();
	const gainNode = audioCtx.createGain();

	oscillator.type = type;
	oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

	// Enveloppe ADSR
	const now = audioCtx.currentTime;
	gainNode.gain.setValueAtTime(0, now);
	gainNode.gain.linearRampToValueAtTime(volume, now + attack);
	gainNode.gain.linearRampToValueAtTime(volume * sustain, now + attack + decay);

	oscillator.connect(gainNode);
	gainNode.connect(audioCtx.destination);

	oscillator.start();

	return { oscillator, gainNode, releaseTime: now + attack + decay + release };
}

// Fonction pour arrêter un oscillateur avec enveloppe ADSR
export function stopADSRNode(oscillator, gainNode, releaseTime) {
	const now = audioCtx.currentTime;
	gainNode.gain.cancelScheduledValues(now);
	gainNode.gain.setValueAtTime(gainNode.gain.value, now);
	gainNode.gain.linearRampToValueAtTime(0, now + (releaseTime - now));

	oscillator.stop(now + (releaseTime - now));
	oscillator.disconnect();
	gainNode.disconnect();
}

// Fonction pour activer le contexte audio (nécessaire sur certains navigateurs)
export function resumeAudioContext() {
	if (audioCtx.state === "suspended") {
		audioCtx.resume();
	}
}

export function initAudio() {
	// Activer le contexte audio si nécessaire
	resumeAudioContext();

	// Vous pouvez ici initialiser d'autres éléments audio si nécessaire
	// Par exemple : Créer un filtre audio ou préparer des oscillateurs

	console.log("Contexte Audio initialisé avec succès.");

	// Test de démarrage : créer un oscillateur de test
	const oscillator = audioCtx.createOscillator();
	oscillator.type = "sine"; // Type d'onde, par exemple sinusoïdale
	oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // La4 (440 Hz)

	const gainNode = audioCtx.createGain();
	gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); // Régle le volume à 50%

	// Connecter l'oscillateur au gain, puis au contexte audio
	oscillator.connect(gainNode);
	gainNode.connect(audioCtx.destination);

	// Démarrer l'oscillateur (Note : ne pas oublier de l'arrêter plus tard)
	oscillator.start();

	// Arrêter l'oscillateur après un certain temps pour le test
	setTimeout(() => {
		oscillator.stop();
		console.log("Oscillateur arrêté.");
	}, 1000); // L'oscillateur s'arrête après 1 seconde
}

export function drawOscilloscope(analyserNode, canvas) {
	if (!canvas) {
		console.error("Canvas non trouvé pour l'oscilloscope.");
		return;
	}

	const canvasCtx = canvas.getContext("2d");
	if (!canvasCtx) {
		console.error("Impossible d'obtenir le contexte 2D du canvas.");
		return;
	}

	const bufferLength = analyserNode.fftSize;
	const dataArray = new Uint8Array(bufferLength);

	function draw() {
		requestAnimationFrame(draw);

		analyserNode.getByteTimeDomainData(dataArray);

		canvasCtx.fillStyle = "rgb(0, 0, 0)";
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		canvasCtx.lineWidth = 2;
		canvasCtx.strokeStyle = "rgb(0, 255, 0)";

		canvasCtx.beginPath();

		const sliceWidth = (canvas.width * 1.0) / bufferLength;
		let x = 0;

		for (let i = 0; i < bufferLength; i++) {
			const v = dataArray[i] / 128.0;
			const y = (v * canvas.height) / 2;

			if (i === 0) {
				canvasCtx.moveTo(x, y);
			} else {
				canvasCtx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		canvasCtx.lineTo(canvas.width, canvas.height / 2);
		canvasCtx.stroke();
	}

	draw(); // Commence à dessiner l'oscilloscope
}
