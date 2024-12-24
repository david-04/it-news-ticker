import { setTheme } from "./theme.js";
import { Types } from "./types.js";

const PREFERENCES_KEY = "it-news-ticker.preferences";
export const MIN_FONT_SIZE = -3;
const DEFAULT_FONT_SIZE = 0;
export const MAX_FONT_SIZE = 10;

//----------------------------------------------------------------------------------------------------------------------
// Default preferences
//----------------------------------------------------------------------------------------------------------------------

export const DEFAULT_PREFERENCES = {
    fontSize: DEFAULT_FONT_SIZE as number,
    theme: "auto" as "auto" | "light" | "dark",
} as const;

//----------------------------------------------------------------------------------------------------------------------
// Save preferences
//----------------------------------------------------------------------------------------------------------------------

export function savePreferences(preferences: Types.Preferences) {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    setTheme();
    return preferences;
}

//----------------------------------------------------------------------------------------------------------------------
// Load preferences
//----------------------------------------------------------------------------------------------------------------------

export function getPreferences(): Types.Preferences {
    try {
        const stringified = localStorage.getItem(PREFERENCES_KEY);
        return stringified ? parsePreferences(stringified) : DEFAULT_PREFERENCES;
    } catch (error) {
        return DEFAULT_PREFERENCES;
    }
}

function parsePreferences(stringified: string) {
    const parsed = JSON.parse(stringified);
    let preferences = DEFAULT_PREFERENCES;
    if (parsed && "object" === typeof parsed) {
        if (parsed.fontSize && "number" === typeof parsed.fontSize) {
            const { fontSize } = parsed;
            preferences = { ...preferences, fontSize: Math.max(MIN_FONT_SIZE, Math.min(fontSize, MAX_FONT_SIZE)) };
        }
        if (parsed.theme && "string" === typeof parsed.theme && ["auto", "light", "dark"].includes(parsed.theme)) {
            preferences = { ...preferences, theme: parsed.theme };
        }
    }
    return preferences;
}
