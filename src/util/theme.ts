import { getPreferences } from "./preferences.js";
import { Types } from "./types.js";

export function setTheme() {
    document.body.dataset["bsTheme"] = getTheme(getPreferences().theme);
}

function getTheme(theme: Types.Preferences["theme"]): "light" | "dark" {
    if (theme === "auto") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
        return theme;
    }
}
