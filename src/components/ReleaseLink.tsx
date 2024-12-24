import { Component, h } from "preact";

import "./ReleaseLink.css";

//----------------------------------------------------------------------------------------------------------------------
// Props
//----------------------------------------------------------------------------------------------------------------------

export interface ReleaseLinkProps {
    date?: string;
}

//----------------------------------------------------------------------------------------------------------------------
// Component
//----------------------------------------------------------------------------------------------------------------------

export class ReleaseLink extends Component<ReleaseLinkProps> {
    //------------------------------------------------------------------------------------------------------------------
    // Render the component
    //------------------------------------------------------------------------------------------------------------------

    render() {
        if (window.location.protocol !== "file:") {
            return null;
        }
        const releaseDateParameter = this.props.date ? `,date=${this.props.date}` : "";
        const url = `https://david-04.github.io/it-news-ticker/#password=D3wE82954JotYm7cdcFi${releaseDateParameter}`;
        return window.location.protocol !== "file:" ? null : (
            <div class="ReleaseLink">
                <a href={url}>{url}</a>
            </div>
        );
    }
}
