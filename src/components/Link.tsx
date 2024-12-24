import "./Link.css";

import { Component, h } from "preact";

//----------------------------------------------------------------------------------------------------------------------
// Properties and state
//----------------------------------------------------------------------------------------------------------------------

export interface LinkProps {
    readonly isTranslated: boolean;
    readonly url: string | undefined;
}

//----------------------------------------------------------------------------------------------------------------------
// Issues
//----------------------------------------------------------------------------------------------------------------------

export class Link extends Component<LinkProps> {
    //------------------------------------------------------------------------------------------------------------------
    // Render the component
    //------------------------------------------------------------------------------------------------------------------

    render() {
        const { url, isTranslated } = this.props;
        return (
            url && (
                <div class="Link">
                    <a href={isTranslated ? Link.getUrl(url) : url} target="_blank" rel="noopener noreferrer">
                        {this.props.url}
                    </a>
                </div>
            )
        );
    }

    private static getUrl(url: string) {
        const { hostname, pathname } = new URL(url);
        return [
            "https://",
            hostname.replace(/\./g, "-"),
            ".translate.goog",
            pathname,
            "?_x_tr_sl=de&_x_tr_tl=en&_x_tr_hl=en-US&_x_tr_pto=wapp",
        ].join("");
    }
}
