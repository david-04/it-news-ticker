import "./Application.css";

import { Component, h } from "preact";
import { getPreferences, savePreferences } from "../util/preferences.js";
import { releaseDates } from "../util/release-dates.js";
import { loadStories } from "../util/stories.js";
import { FailedTo, LoadingResult, Types } from "../util/types.js";
import { urlParameters } from "../util/url-parameters.js";
import { Editions } from "./Editions.js";
import { Loading } from "./Loading.js";
import { Marquee } from "./Marquee.js";
import { Preferences } from "./Preferences.js";

//----------------------------------------------------------------------------------------------------------------------
// Properties and state
//----------------------------------------------------------------------------------------------------------------------

export enum StatusError {
    MISSING_PASSWORD = "missing password",
    MISSING_RELEASE_INDEX = "missing release index",
}

export enum StatusOk {
    OK = "ok",
}

export interface ApplicationProps {}

export type ApplicationStateOk = {
    readonly status: StatusOk;
    readonly newestReleaseDate: string;
    readonly notification?: string | undefined;
    readonly editions: Types.Editions;
    readonly preferences: Types.Preferences;
};

export type ApplicationStateError = {
    readonly status: StatusError;
    readonly preferences: Types.Preferences;
};

type ApplicationState = ApplicationStateOk | ApplicationStateError;

//----------------------------------------------------------------------------------------------------------------------
// Component
//----------------------------------------------------------------------------------------------------------------------

export class Application extends Component<ApplicationProps, ApplicationState> {
    //
    //------------------------------------------------------------------------------------------------------------------
    // Initialization
    //------------------------------------------------------------------------------------------------------------------

    public constructor(props: ApplicationProps) {
        super(props);
        this.state = Application.getInitialState();
        window.addEventListener("scroll", () => this.onScroll());
    }

    private static getInitialState(): ApplicationState {
        const preferences = getPreferences();
        const newestReleaseDate = releaseDates.newest;
        if (!newestReleaseDate) {
            return { status: StatusError.MISSING_RELEASE_INDEX, preferences };
        }
        if (!urlParameters.getPassword()) {
            return { status: StatusError.MISSING_PASSWORD, preferences };
        }
        const selectedDate = urlParameters.getDate();
        if (selectedDate && releaseDates.get(selectedDate)) {
            return { status: StatusOk.OK, newestReleaseDate, editions: [{ date: selectedDate }], preferences };
        }
        return { status: StatusOk.OK, newestReleaseDate, editions: [{ date: newestReleaseDate }], preferences };
    }

    override componentDidMount() {
        if (this.state.status === StatusOk.OK) {
            this.state.editions.forEach(release => {
                const releaseDate = release?.date;
                if (releaseDate && !release.stories) {
                    loadStories(releaseDate, result => this.onLoadingResult(releaseDate, result));
                }
            });
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Load articles
    //------------------------------------------------------------------------------------------------------------------

    private loadStories(date: string) {
        this.setState(
            state => (state.status === StatusOk.OK ? { editions: [...state.editions, { date }] } : {}),
            () => loadStories(date, result => this.onLoadingResult(date, result))
        );
    }

    private onLoadingResult(date: string, result: LoadingResult) {
        this.setState(
            state => {
                if (state.status === StatusOk.OK) {
                    const editions = state.editions.map(release =>
                        release.date === date ? { ...release, stories: result } : release
                    );
                    return { ...state, editions };
                } else {
                    return state;
                }
            },
            () => this.onScroll()
        );
    }

    //------------------------------------------------------------------------------------------------------------------
    // Render the component
    //------------------------------------------------------------------------------------------------------------------

    render() {
        // style={{ maxWidth: "80rem" }}
        return (
            <div class="Application">
                <Marquee />
                <div class="container-xxl" style={{ maxWidth: "60rem" }}>
                    {this.renderPageContent()}
                </div>
                <div class="end-of-page-spacer" />
            </div>
        );
    }

    private renderPageContent() {
        if (this.state.status === StatusOk.OK) {
            const [firstRelease, ...otherReleases] = this.state.editions;
            if (!firstRelease) {
                // no load has been initiated yet
                return null;
            } else if (otherReleases.length) {
                // more than on release has been loaded, so the first one must have succeeded
                return this.renderEditions(this.state.editions);
            } else if (firstRelease.stories === FailedTo.LOAD) {
                // the first release failed to load
                return this.renderMessage("⚠️ Failed to load the stories. Please try reload the page.");
            } else if (firstRelease.stories === FailedTo.DECRYPT) {
                // the first release failed to decrypt
                return this.renderMessage(
                    "⚠️ Invalid password. Please acquire and up-to-date link with the current password."
                );
            } else if (firstRelease.stories === undefined) {
                // the first release is loading
                //return this.renderMessage("Loading stories...");
                return <Loading global={true} />;
            } else {
                firstRelease.stories satisfies Types.Stories;
                return this.renderEditions(this.state.editions);
            }
        } else if (this.state.status === StatusError.MISSING_RELEASE_INDEX) {
            return this.renderMessage("⚠️ Failed to load the stories. Please try reload the page.");
        } else if (this.state.status === StatusError.MISSING_PASSWORD) {
            return this.renderMessage(
                "⚠️ The password is missing. Please open this page only through the link provided."
            );
        } else {
            this.state.status satisfies never;
            return null;
        }
    }

    private renderMessage(message: string) {
        return <div class="message">{message}</div>;
    }

    private renderEditions(editions: Types.Editions) {
        return (
            <div>
                <Preferences
                    preferences={this.state.preferences}
                    setFontSize={fontSize => this.setFontSize(fontSize)}
                    setTheme={theme =>
                        this.setState(state => ({
                            preferences: savePreferences({ ...state.preferences, theme: theme }),
                        }))
                    }
                />
                <Editions editions={editions} preferences={this.state.preferences} />
            </div>
        );
    }

    //------------------------------------------------------------------------------------------------------------------
    // Callbacks
    //------------------------------------------------------------------------------------------------------------------

    private setFontSize(fontSize: number) {
        this.setState(state => ({ preferences: savePreferences({ ...state.preferences, fontSize }) }));
    }

    private onScroll() {
        const margin = 50;
        if (window.innerHeight + Math.round(window.scrollY) < document.body.scrollHeight - margin) {
            return;
        }
        if (this.state.status !== StatusOk.OK) {
            return;
        }
        const lastEdition = this.state.editions[this.state.editions.length - 1];
        if (!lastEdition?.stories) {
            return;
        }
        const previousReleaseDate = releaseDates.get(lastEdition?.date ?? "")?.previous?.date;
        if (previousReleaseDate) {
            this.loadStories(previousReleaseDate);
        }
    }
}
