import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./styles.css"; // Assurez-vous que les styles sont importés

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
