import { toBase64 } from "./crypto-api.js";

const FAVICON_INTERVAL_MS = 200;

export async function animateFavicon() {
    if (window.location.protocol === "file:") {
        return;
    }
    const faviconLinkElement = document.getElementById("favicon") as HTMLLinkElement;
    if (faviconLinkElement) {
        const favicons = await loadFavicons();
        let lastUpdate = Date.now();
        let index = 0;
        setInterval(() => {
            const increment = 2 * FAVICON_INTERVAL_MS <= Date.now() - lastUpdate ? 2 : 1;
            index = (index + increment) % 16;
            lastUpdate = Date.now();
            faviconLinkElement.href = favicons[index] ?? getFaviconPath(index);
        }, FAVICON_INTERVAL_MS);
    }
}

async function loadFavicons() {
    const favicons = await Promise.all(new Array(16).fill(0).map((_, index) => loadFavicon(index)));
    return favicons.filter((favicon): favicon is string => "string" === typeof favicon);
}

async function loadFavicon(index: number) {
    try {
        const response = await fetch(getFaviconPath(index));
        if (response.ok) {
            const blob = await response.arrayBuffer();
            const base64 = toBase64(new Uint8Array(blob));
            return `data:image/png;base64,${base64}`;
        }
    } catch (error) {
        console.error(error);
    }
    return undefined;
}

function getFaviconPath(index: number) {
    return `./assets/favicon/favicon.${index}.png`;
}
