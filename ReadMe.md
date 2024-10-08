# Real Spirit Sound Synth

**Real Spirit Sound Synth** est un logiciel de création musicale modulaire, développé avec **React** et **Electron**. Ce projet permet aux utilisateurs de contrôler différents modules MIDI, comme l'**APC Key 25**, en intégrant plusieurs contrôleurs MIDI pour des performances interactives et dynamiques. L'application est conçue pour permettre une gestion simple et flexible de n'importe quel contrôleur MIDI connecté, tout en offrant une interface visuelle intuitive pour mapper et contrôler divers paramètres musicaux.

## Fonctionnalités

- **Contrôle Modulaire MIDI** : Ajoutez et gérez plusieurs contrôleurs MIDI, tels que l'**APC Key 25**, et autres futurs contrôleurs.
- **Gestion des Messages MIDI** : Capturer et traiter les événements MIDI comme les **Note On**, **Note Off**, **Control Change**, etc.
- **Mappage Flexible des Paramètres** : Mappez les pads, potentiomètres, et boutons des contrôleurs MIDI à des actions personnalisées ou à des effets sonores.
- **Interface Visuelle Réactive** : Affichage des contrôleurs MIDI et de leurs actions en temps réel via une interface React intuitive.
- **Compatibilité Cross-Platform** : Le projet fonctionne sur Windows, macOS et Linux grâce à Electron.

## Structure du Projet

```bash
├── public
│   ├── preload.js       # Script de préchargement pour Electron
│   └── index.html       # Point d'entrée pour l'application Electron
├── src
│   ├── components       # Composants React pour l'interface utilisateur (e.g., Pads, Knobs)
│   ├── controllers      # Modules pour les contrôleurs MIDI (e.g., apcKey25Module.js)
│   ├── utils            # Fonctions utilitaires (e.g., midiUtils.js, audioUtils.js)
│   ├── App.js           # Composant principal React
│   └── index.js         # Point d'entrée de React
├── main.js              # Configuration du processus principal d'Electron
├── midiUtils.js         # Gestion centrale des contrôleurs MIDI
├── apcKey25Module.js    # Module spécifique pour l'APC Key 25
└── package.json         # Dépendances du projet et scripts
```

## Installation et Configuration

1. **Cloner le dépôt** :
    ```bash
    git clone https://github.com/your-username/RealSpiritSoundSynth.git
    cd RealSpiritSoundSynth
    ```

2. **Installer les dépendances** :
    ```bash
    npm install
    ```

3. **Lancer le serveur de développement** :
    ```bash
    npm start
    ```

4. **Construire et lancer l'application Electron** :
    ```bash
    npm run electron:build
    npm run electron:start
    ```

## Ajouter de Nouveaux Contrôleurs

Pour ajouter un nouveau contrôleur MIDI :

1. **Créer un module** dans le dossier `src/controllers/`.
2. **Mappez les événements MIDI** spécifiques à ce contrôleur à des actions ou paramètres souhaités.
3. **Enregistrez** le contrôleur via `registerController()` dans `midiUtils.js`.

### Exemple de Module pour un Nouveau Contrôleur (`launchpadModule.js`) :

```javascript
import { registerController, unregisterController } from '../utils/midiController';

export function initLaunchpad() {
    registerController("Launchpad", { handleMIDIMessage });
    console.log("Launchpad connecté.");
}

export function stopLaunchpad() {
    unregisterController("Launchpad");
    console.log("Launchpad déconnecté.");
}

function handleMIDIMessage(status, data1, data2) {
    // Gestion spécifique des événements MIDI pour le Launchpad
}
```

## Comment Utiliser

- **Sélectionner les Ports MIDI** : Sélectionnez les entrées et sorties MIDI directement depuis l'interface de l'application.
- **Mappage des Contrôles** : Assignez les actions (comme jouer un son ou changer de visualisation) aux différents éléments de contrôle des contrôleurs MIDI connectés (pads, knobs, faders, etc.).

## Contribuer

1. **Forkez** le dépôt et créez une nouvelle branche :
    ```bash
    git checkout -b feature/new-controller
    ```

2. **Commitez** vos modifications :
    ```bash
    git commit -m 'Ajout d’un nouveau module de contrôleur MIDI'
    ```

3. **Poussez** vers votre branche :
    ```bash
    git push origin feature/new-controller
    ```

4. **Soumettez** une pull request.

## Conditions d'utilisation
1. Ce projet est fourni gratuitement et ne peut pas être utilisé à des fins commerciales. Toute utilisation à but lucratif ou dans le cadre d'un produit ou service commercial est strictement interdite.

2. Si vous utilisez ce projet, que ce soit dans des projets personnels, éducatifs ou open-source, vous devez mentionner l'auteur en ajoutant une attribution dans le code source, la documentation ou tout autre support associé.

## Licence

Ce projet est distribué sous la licence [Creative Commons BY-NC](https://creativecommons.org/licenses/by-nc/4.0/).
---

### Ressources Utiles
- [Documentation Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess)
- [APC Key 25 - Akai Professional](https://www.akaipro.com/apc-key-25)

---

Ce projet est conçu pour permettre une expérience interactive avec des contrôleurs MIDI, où les utilisateurs peuvent mapper et interagir avec différents modules et périphériques MIDI de manière fluide et flexible. **Real Spirit Sound Synth** est une plateforme évolutive qui permet de centraliser les contrôles MIDI tout en offrant une interface intuitive pour les créateurs de musique et les artistes.