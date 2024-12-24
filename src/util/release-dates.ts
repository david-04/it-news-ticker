//----------------------------------------------------------------------------------------------------------------------
// Release dates data
//----------------------------------------------------------------------------------------------------------------------

export declare const RELEASE_DATES: ReadonlyArray<string>;

export const RELEASE_DATES_ASC: ReadonlyArray<string> = RELEASE_DATES.slice(0).sort((a, b) => a.localeCompare(b));

export type ReleaseDate = {
    date: string;
    previous?: ReleaseDate | undefined;
    next?: ReleaseDate | undefined;
};

const RELEASE_DATE_MAP = new Map<string | undefined, ReleaseDate>();

RELEASE_DATES_ASC.forEach((currentDate, currentIndex) => {
    const previous = RELEASE_DATE_MAP.get(0 < currentIndex ? RELEASE_DATES_ASC[currentIndex - 1] : undefined);
    const current: ReleaseDate = { date: currentDate, previous };
    if (previous) {
        RELEASE_DATE_MAP.set(previous.date, { ...previous, next: current });
    }
    RELEASE_DATE_MAP.set(currentDate, current);
});

//----------------------------------------------------------------------------------------------------------------------
// Get release dates
//----------------------------------------------------------------------------------------------------------------------

export const releaseDates = {
    oldest: RELEASE_DATES_ASC[0],
    newest: RELEASE_DATES_ASC[RELEASE_DATES_ASC.length - 1],
    get: (date: string): Readonly<ReleaseDate> | undefined => RELEASE_DATE_MAP.get(date),
};
