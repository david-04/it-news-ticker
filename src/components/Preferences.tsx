import "./Preferences.css";

import { Component, h } from "preact";
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from "../util/preferences.js";
import { Types } from "../util/types.js";

//----------------------------------------------------------------------------------------------------------------------
// Properties and state
//----------------------------------------------------------------------------------------------------------------------

export interface PreferencesProps {
    readonly preferences: Types.Preferences;
    readonly setFontSize: (fontSize: number) => void;
    readonly setTheme: (theme: Types.Preferences["theme"]) => void;
}

type PreferencesState = {};

//----------------------------------------------------------------------------------------------------------------------
// Issues
//----------------------------------------------------------------------------------------------------------------------

export class Preferences extends Component<PreferencesProps, PreferencesState> {
    //
    //------------------------------------------------------------------------------------------------------------------
    // Render the component
    //------------------------------------------------------------------------------------------------------------------

    render() {
        return (
            <div class="Preferences">
                {this.renderThemePreference()}
                {this.renderFontSizePreferences()}
            </div>
        );
    }

    //------------------------------------------------------------------------------------------------------------------
    // Render the theme selector
    //------------------------------------------------------------------------------------------------------------------

    private renderThemePreference() {
        return (
            <div class="input-group font-size-preference">
                {this.renderThemeButton("auto", "Auto")}
                {this.renderThemeButton("light", "Light")}
                {this.renderThemeButton("dark", "Dark")}
            </div>
        );
    }

    private renderThemeButton(theme: Types.Preferences["theme"], label: string) {
        const isActiveTheme = this.props.preferences.theme === theme;
        const onClick = isActiveTheme ? undefined : () => this.props.setTheme(theme);
        return (
            <button
                type="button"
                class={onClick ? "btn btn-outline-primary text-body" : "btn btn-primary"}
                onClick={onClick}
            >
                {label}
            </button>
        );
    }

    //------------------------------------------------------------------------------------------------------------------
    // Render font size preferences
    //------------------------------------------------------------------------------------------------------------------

    private renderFontSizePreferences() {
        return (
            <div class="input-group font-size-preference">
                {this.renderFontSizeButton(-1)}
                <span class="input-group-text current-font-size border border-primary">{this.getFontSizeLabel()}</span>
                {this.renderFontSizeButton(1)}
            </div>
        );
    }

    private renderFontSizeButton(increment: 1 | -1) {
        const newFontSize = this.props.preferences.fontSize + increment;
        const setFontSize =
            MIN_FONT_SIZE < newFontSize && newFontSize < MAX_FONT_SIZE
                ? () => this.props.setFontSize(newFontSize)
                : undefined;
        const button = increment < 0 ? { label: "abc", class: "make-smaller" } : { label: "ABC", class: "make-larger" };
        return (
            <button type="button" class={`btn btn-primary ${setFontSize ? "" : "disabled"}`} onClick={setFontSize}>
                <div class={button.class}>{button.label}</div>
            </button>
        );
    }

    private getFontSizeLabel() {
        const { fontSize } = this.props.preferences;
        if (fontSize < 0) {
            return `${fontSize}`;
        } else if (0 === fontSize) {
            return " 0";
        } else {
            return `+${fontSize}`;
        }
    }
}
