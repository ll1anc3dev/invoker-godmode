// ==UserScript==
// @name         Invoker Game Auto Combo Medium
// @namespace    invoker-game-auto-medium
// @version      1.7
// @description  Medium speed auto invoke current spell
// @match        *://invoker-game.com/*
// @match        *://www.invoker-game.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const SPELLS = {
        "cold snap": ["q", "q", "q", "r"],
        "ghost walk": ["q", "q", "w", "r"],
        "ice wall": ["q", "q", "e", "r"],

        "emp": ["w", "w", "w", "r"],
        "tornado": ["w", "w", "q", "r"],
        "alacrity": ["w", "w", "e", "r"],

        "sun strike": ["e", "e", "e", "r"],
        "forge spirit": ["e", "e", "q", "r"],
        "chaos meteor": ["e", "e", "w", "r"],

        "deafening blast": ["q", "w", "e", "r"],
    };

    let enabled = false;
    let busy = false;
    let lastSpell = "";

    const KEY_DELAY = 45;
    const SPELL_DELAY = 95;
    const SCAN_DELAY = 30;

    const delay = ms => new Promise(r => setTimeout(r, ms));

    function norm(text) {
        return (text || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");
    }

    function isVisible(el) {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
    }

    function getCurrentSpell() {
        const spellNames = Object.keys(SPELLS);
        const candidates = [...document.querySelectorAll("p, h1, h2, h3, span, div")];

        const centerX = window.innerWidth / 2;

        for (const el of candidates) {
            if (!isVisible(el)) continue;

            const text = norm(el.textContent);
            if (!spellNames.includes(text)) continue;

            const r = el.getBoundingClientRect();

            if (r.left < centerX - 350 || r.left > centerX + 250) continue;

            return text;
        }

        return null;
    }

    function sendKey(key) {
        const upper = key.toUpperCase();
        const keyCode = upper.charCodeAt(0);

        const options = {
            key,
            code: "Key" + upper,
            keyCode,
            which: keyCode,
            charCode: keyCode,
            bubbles: true,
            cancelable: true,
            composed: true
        };

        const targets = [
            window,
            document,
            document.documentElement,
            document.body,
            document.querySelector("#root")
        ].filter(Boolean);

        for (const target of targets) {
            target.dispatchEvent(new KeyboardEvent("keydown", options));
        }

        for (const target of targets) {
            target.dispatchEvent(new KeyboardEvent("keyup", options));
        }
    }

    async function castSpell(spell) {
        const combo = SPELLS[spell];
        if (!combo) return;

        busy = true;

        console.log("[Invoker Auto] spell:", spell);
        console.log("[Invoker Auto] combo:", combo.join(" "));

        for (const key of combo) {
            sendKey(key);
            await delay(KEY_DELAY);
        }

        await delay(SPELL_DELAY);
        busy = false;
    }

    function createButton() {
        const old = document.querySelector("#invoker-auto-btn");
        if (old) old.remove();

        const btn = document.createElement("button");
        btn.id = "invoker-auto-btn";
        btn.textContent = "AUTO: OFF";

        btn.style.position = "fixed";
        btn.style.top = "140px";
        btn.style.left = "20px";
        btn.style.zIndex = "999999";
        btn.style.padding = "12px 18px";
        btn.style.background = "#4b001f";
        btn.style.color = "white";
        btn.style.border = "2px solid #d7b56d";
        btn.style.borderRadius = "10px";
        btn.style.fontSize = "18px";
        btn.style.fontWeight = "bold";
        btn.style.cursor = "pointer";

        btn.onclick = () => {
            enabled = !enabled;
            lastSpell = "";

            btn.textContent = enabled ? "AUTO: ON" : "AUTO: OFF";
            btn.style.background = enabled ? "#006b2e" : "#4b001f";

            console.log("[Invoker Auto]", enabled ? "ON" : "OFF");
            console.log("[Invoker Auto] current spell:", getCurrentSpell());
        };

        document.body.appendChild(btn);
    }

    setInterval(() => {
        if (!enabled || busy) return;

        const spell = getCurrentSpell();

        if (!spell) return;
        if (spell === lastSpell) return;

        lastSpell = spell;
        castSpell(spell);
    }, SCAN_DELAY);

    createButton();

    console.log("[Invoker Auto] Loaded v1.7 medium");
})();