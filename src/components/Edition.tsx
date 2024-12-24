import "./Edition.css";

import { Component, h } from "preact";
import { FailedTo, Types } from "../util/types.js";
import { Loading } from "./Loading.js";
import { ReleaseLink } from "./ReleaseLink.js";
import { Story } from "./Story.js";

//----------------------------------------------------------------------------------------------------------------------
// Properties and state
//----------------------------------------------------------------------------------------------------------------------

export interface EditionProps {
    readonly date: string;
    readonly edition: Types.Edition;
}

type EditionState = {};

//----------------------------------------------------------------------------------------------------------------------
// Issues
//----------------------------------------------------------------------------------------------------------------------

export class Edition extends Component<EditionProps, EditionState> {
    //
    //------------------------------------------------------------------------------------------------------------------
    // Render the component
    //------------------------------------------------------------------------------------------------------------------

    render() {
        return (
            <div class="Edition">
                <ReleaseLink date={this.props.date} />
                <ul class="list-group">
                    <li class="list-group-item  bg-primary text-light">{this.props.edition.date}</li>
                    {this.renderStories()}
                </ul>
            </div>
        );
    }

    private renderStories() {
        if (this.props.edition.stories === FailedTo.LOAD) {
            return this.renderError("⚠️ Failed to load the stories. Please try reload the page.");
        } else if (this.props.edition.stories === FailedTo.DECRYPT) {
            return this.renderError("⚠️ Failed to decrypt the stories. Please try reload the page.");
        } else if (this.props.edition.stories === undefined) {
            return (
                <li class="list-group-item">
                    <Loading global={false} />
                </li>
            );
        } else {
            this.props.edition.stories satisfies Types.Stories;
            return this.props.edition.stories.map((story, index) => (
                <Story story={story} key={`story-${this.props.date}-${index}}`} />
            ));
        }
    }

    private renderError(message: string) {
        return <li class="list-group-item">{message}</li>;
    }
}
