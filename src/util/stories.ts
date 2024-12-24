import { LOAD_TIMEOUT_MS } from "./constants.js";
import { decrypt } from "./crypto-api.js";
import { FailedTo, LoadingResult } from "./types.js";

//----------------------------------------------------------------------------------------------------------------------
// Data types
//----------------------------------------------------------------------------------------------------------------------

export type OnStatusChanged = (loadingResult: LoadingResult) => void;

export type LoadingStatus = {
    result?: LoadingResult | undefined;
    onStatusChanged: Array<OnStatusChanged>;
};

//----------------------------------------------------------------------------------------------------------------------
// Cache
//----------------------------------------------------------------------------------------------------------------------

const storyCache = new Map<string, LoadingStatus>();

//----------------------------------------------------------------------------------------------------------------------
// Initiate the load
//----------------------------------------------------------------------------------------------------------------------

export function loadStories(date: string, onStatusChanged: OnStatusChanged) {
    const loadingStatus = storyCache.get(date);
    loadingStatus ? addListener(loadingStatus, onStatusChanged) : initiateLoad(date, onStatusChanged);
}

function addListener(loadingStatus: LoadingStatus, onStatusChanged: OnStatusChanged) {
    loadingStatus.onStatusChanged.push(onStatusChanged);
    if (loadingStatus.result) {
        onStatusChanged(loadingStatus.result);
    }
}

function initiateLoad(date: string, onStatusChanged: OnStatusChanged) {
    storyCache.set(date, { onStatusChanged: [onStatusChanged] });
    setTimeout(() => updateLoadingResult(date, storyCache.get(date)?.result ?? FailedTo.LOAD), LOAD_TIMEOUT_MS);
    const url = `./assets/stories/${date}.js`;
    (document.location.protocol === "file:" ? initiateLoadViaScript : initiateLoadViaFetch)(url, date);
}

function initiateLoadViaScript(url: string) {
    const script = document.createElement("script");
    script.src = url;
    document.getElementsByTagName("head")[0]?.appendChild(script);
}

async function initiateLoadViaFetch(url: string, date: string) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            await addStories(date, extractEncryptedContentFromJs(await response.text()));
        } else {
            updateLoadingResult(date, FailedTo.LOAD);
            console.error(response);
        }
    } catch (error) {
        updateLoadingResult(date, FailedTo.LOAD);
        console.error(error);
    }
}

function extractEncryptedContentFromJs(js: string) {
    return js
        .replace(/[\r\n]/g, " ")
        .replace(/"[^"]*$/, "")
        .replace(/.*"/, "")
        .trim();
}

//----------------------------------------------------------------------------------------------------------------------
// Receive and decrypt stories
//----------------------------------------------------------------------------------------------------------------------

(window as unknown as Record<string, unknown>)["addStories"] = addStories;

async function addStories(date: string, encrypted: string) {
    try {
        updateLoadingResult(date, JSON.parse(await decrypt(encrypted)));
    } catch (error) {
        updateLoadingResult(date, FailedTo.DECRYPT);
        console.error(error);
    }
}

function updateLoadingResult(date: string, loadingResult: LoadingResult) {
    const loadingStatus = storyCache.get(date);
    if (loadingStatus && loadingStatus.result !== loadingResult) {
        loadingStatus.result = loadingResult;
        loadingStatus.onStatusChanged.forEach(onStatusChanged => onStatusChanged(loadingResult));
    }
}
