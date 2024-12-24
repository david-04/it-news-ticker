import "./Editions.css";

import { Component, h } from "preact";
import { Types } from "../util/types.js";
import { Edition } from "./Edition.js";
import { Spacer } from "./Spacer.js";

//----------------------------------------------------------------------------------------------------------------------
// Properties and state
//----------------------------------------------------------------------------------------------------------------------

export interface EditionsProps {
    readonly editions: Types.Editions;
    readonly preferences: Types.Preferences;
}

type EditionsState = {};

//----------------------------------------------------------------------------------------------------------------------
// Issues
//----------------------------------------------------------------------------------------------------------------------

export class Editions extends Component<EditionsProps, EditionsState> {
    private static readonly SCALE_UP_FACTOR = 1.1;
    private static readonly SCALE_DOWN_FACTOR = 0.9;

    //------------------------------------------------------------------------------------------------------------------
    // Render the component
    //------------------------------------------------------------------------------------------------------------------

    render() {
        return (
            <div>
                <Spacer />
                <div class={`Editions`} style={{ fontSize: `${this.getFontSize()}em` }}>
                    {this.props.editions.map(edition => (
                        <Edition edition={edition} key={`edition-${edition.date}`} date={edition.date} />
                    ))}
                </div>
            </div>
        );
    }

    private getFontSize() {
        if (0 === this.props.preferences.fontSize) {
            return 1;
        } else {
            const factor = 0 < this.props.preferences.fontSize ? Editions.SCALE_UP_FACTOR : Editions.SCALE_DOWN_FACTOR;
            return Math.round(Math.pow(factor, Math.abs(this.props.preferences.fontSize)) * 100) / 100;
        }
    }
}
