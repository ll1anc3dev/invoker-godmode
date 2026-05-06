# Invoker Godmode

Tampermonkey userscript for auto-invoking spells in Invoker Game.

## Features

- Detects current spell on screen
- Automatically presses the correct Q/W/E + R combo
- Toggle button on page: AUTO ON/OFF
- Adjustable speed settings

## Installation

1. Install Tampermonkey.
2. Create a new userscript.
3. Paste the code from `invoker-godmode.user.js`.
4. Save it.
5. Open https://invoker-game.com/
6. Start the game.
7. Click `AUTO: OFF`.

## Speed settings

```js
const KEY_DELAY = 45;
const SPELL_DELAY = 95;
const SCAN_DELAY = 30;
