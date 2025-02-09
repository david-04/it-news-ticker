import "./Loading.css";

import { Component, h } from "preact";

//----------------------------------------------------------------------------------------------------------------------
// Properties and state
//----------------------------------------------------------------------------------------------------------------------

export interface LoadingProps {
    global: boolean;
}

type LoadingState = {};

//----------------------------------------------------------------------------------------------------------------------
// Issues
//----------------------------------------------------------------------------------------------------------------------

export class Loading extends Component<LoadingProps, LoadingState> {
    //
    //------------------------------------------------------------------------------------------------------------------
    // Render the component
    //------------------------------------------------------------------------------------------------------------------

    render() {
        return (
            <div class={`Loading ${this.props.global ? "global" : ""}`}>
                <div class="spinner-border">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
}
