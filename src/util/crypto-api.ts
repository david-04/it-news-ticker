import { urlParameters } from "./url-parameters.js";

//----------------------------------------------------------------------------------------------------------------------
// Data types
//----------------------------------------------------------------------------------------------------------------------

export type EncryptionParameters = {
    readonly encryptionAlgorithm: string;
    readonly hash: string;
    readonly iterations: number;
    readonly iv: string;
    readonly keyDerivationAlgorithm: string;
    readonly length: number;
    readonly salt: string;
};

declare const ENCRYPTION_PARAMETERS: EncryptionParameters;

//----------------------------------------------------------------------------------------------------------------------
// Decrypt
//----------------------------------------------------------------------------------------------------------------------

export async function decrypt(encryptedContent: string) {
    const decrypted = await crypto.subtle.decrypt(
        { name: ENCRYPTION_PARAMETERS.encryptionAlgorithm, iv: base64ToUint8Array(ENCRYPTION_PARAMETERS.iv) },
        await deriveKey(),
        base64ToUint8Array(encryptedContent)
    );
    return new TextDecoder().decode(decrypted);
}

//----------------------------------------------------------------------------------------------------------------------
// Derive the key
//----------------------------------------------------------------------------------------------------------------------

async function deriveKey() {
    return crypto.subtle.deriveKey(
        {
            name: ENCRYPTION_PARAMETERS.keyDerivationAlgorithm,
            salt: base64ToUint8Array(ENCRYPTION_PARAMETERS.salt),
            iterations: ENCRYPTION_PARAMETERS.iterations,
            hash: ENCRYPTION_PARAMETERS.hash,
        },
        await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(urlParameters.getPassword()),
            ENCRYPTION_PARAMETERS.keyDerivationAlgorithm,
            false,
            ["deriveKey"]
        ),
        { name: ENCRYPTION_PARAMETERS.encryptionAlgorithm, length: ENCRYPTION_PARAMETERS.length },
        false,
        ["encrypt", "decrypt"]
    );
}

//----------------------------------------------------------------------------------------------------------------------
// Utility functions
//----------------------------------------------------------------------------------------------------------------------

export function toBase64(uInt8Array: Uint8Array) {
    const result = new Array<string>();
    for (const uInt8 of uInt8Array) {
        result.push(String.fromCharCode(uInt8));
    }
    return btoa(result.join(""));
}

function base64ToUint8Array(base64: string) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}
