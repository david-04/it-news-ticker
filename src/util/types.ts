import { DEFAULT_PREFERENCES } from "../util/preferences.js";

export enum FailedTo {
    LOAD = "failed to load",
    DECRYPT = "failed to decrypt",
}

export namespace Types {
    export type Story = {
        readonly headline: string;
        readonly summary: string;
        readonly article: string;
        readonly isTranslated: boolean;
        readonly url?: string | undefined;
    };

    export type Stories = ReadonlyArray<Story>;
}

export type LoadingResult = FailedTo | Types.Stories;

export namespace Types {
    export type Edition = {
        date: string;
        stories?: LoadingResult;
    };

    export type Editions = ReadonlyArray<Edition>;

    export type Preferences = typeof DEFAULT_PREFERENCES;
}
