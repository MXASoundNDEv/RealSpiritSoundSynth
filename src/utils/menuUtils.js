// src/utils/dragUtils.js

export const makeDraggable = (element) => {
	let offsetX = 0,
		offsetY = 0;
	let isDragging = false;

	const onMouseDown = (e) => {
		e.preventDefault();
		isDragging = true;
		offsetX = e.clientX - element.getBoundingClientRect().left;
		offsetY = e.clientY - element.getBoundingClientRect().top;

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	};

	const onMouseMove = (e) => {
		if (!isDragging) return;
		element.style.left = `${e.clientX - offsetX}px`;
		element.style.top = `${e.clientY - offsetY}px`;
	};

	const onMouseUp = () => {
		isDragging = false;
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	};

	element.addEventListener("mousedown", onMouseDown);
};

export const makeResizable = (element) => {
	const resizer = document.createElement("div");
	resizer.style.width = "15px";
	resizer.style.height = "15px";
	resizer.style.backgroundColor = "#ccc";
	resizer.style.position = "absolute";
	resizer.style.right = "0";
	resizer.style.bottom = "0";
	resizer.style.cursor = "se-resize";
	resizer.style.zIndex = "10";
	element.appendChild(resizer);

	let originalWidth = 0,
		originalHeight = 0,
		originalMouseX = 0,
		originalMouseY = 0;

	const onMouseDown = (e) => {
		e.preventDefault();
		originalWidth = parseFloat(
			getComputedStyle(element, null)
				.getPropertyValue("width")
				.replace("px", "")
		);
		originalHeight = parseFloat(
			getComputedStyle(element, null)
				.getPropertyValue("height")
				.replace("px", "")
		);
		originalMouseX = e.clientX;
		originalMouseY = e.clientY;

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	};

	const onMouseMove = (e) => {
		const width = originalWidth + (e.clientX - originalMouseX);
		const height = originalHeight + (e.clientY - originalMouseY);
		element.style.width = `${width}px`;
		element.style.height = `${height}px`;
	};

	const onMouseUp = () => {
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	};

	resizer.addEventListener("mousedown", onMouseDown);
};

// Fonction InitMenu adaptée à React
export const InitMenu = () => {
	InitCloseButton();
	const frames = document.querySelectorAll(".frame"); // Récupère les frames après le rendu

	if (!frames || frames.length === 0) return;

	const modules = Array.from(frames).map((module) => {
		return {
			id: module.id,
			name: module.querySelector("h2").innerText,
		};
	});

	// Envoyer la liste des modules au processus principal via IPC
	window.electronAPI.generateMenu(modules);

	// Écouter les événements de bascule des modules depuis le processus principal
	window.electronAPI.toggleModule((event, moduleId) => {
		toggleModuleById(moduleId);
	});
};

// Fonction InitFrame adaptée à React
export const InitFrame = () => {
	const frames = document.querySelectorAll(".frame");
	const resizableModules = document.querySelectorAll(".resizable-module");

	if (frames.length > 0) {
		frames.forEach((frame) => {
			makeDraggable(frame);
		});
	}

	if (resizableModules.length > 0) {
		resizableModules.forEach((module) => {
			makeResizable(module);
		});
	}
};

const toggleModuleById = (moduleId) => {
	const module = document.getElementById(moduleId);
	if (module) {
		module.style.display = module.style.display === "none" ? "block" : "none";
	}
};

const InitCloseButton = () => {
	console.log("close");
	// evenet vennant de react
	const closeButtons = document.querySelectorAll(".close-btn");
	closeButtons.forEach((button) => {
		button.onclick = function () {
			console.log("close");
			const frame = button.parentElement;
			frame.style.display = "none"; // Masquer le frame
			window.electronAPI.updateMenu(frame.id, false); // Envoyer un message au processus principal pour mettre à jour le menu
		};
	});

	//event venant de electron
	window.electronAPI.toggleModule(({ moduleId, isVisible }) => {
		toggleModuleById(moduleId)
	});
};
