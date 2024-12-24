import "./Story.css";

import { Component, h } from "preact";
import { markdownToHtml } from "../util/markdown.js";
import { Types } from "../util/types.js";
import { Link } from "./Link.js";

//----------------------------------------------------------------------------------------------------------------------
// Properties and state
//----------------------------------------------------------------------------------------------------------------------

export interface StoryProps {
    readonly story: Types.Story;
}

type StoryState = {
    isOpen: boolean;
    html?: string;
};

//----------------------------------------------------------------------------------------------------------------------
// Issues
//----------------------------------------------------------------------------------------------------------------------

export class Story extends Component<StoryProps, StoryState> {
    //
    //------------------------------------------------------------------------------------------------------------------
    // Initialization
    //------------------------------------------------------------------------------------------------------------------

    public constructor(props: StoryProps) {
        super(props);
        this.state = { isOpen: false };
    }

    //------------------------------------------------------------------------------------------------------------------
    // Render the component
    //------------------------------------------------------------------------------------------------------------------

    render() {
        // ▶️ &#x1F7E6;&nbsp; &#x25A0;
        return (
            <div class="Story">
                <li class="list-group-item bg-body-secondary">
                    <span class="text-primary me-2">&#x1F7E6;</span>
                    {this.props.story.headline}
                </li>
                <li class="list-group-item">
                    <div>{this.props.story.summary}</div>
                    <div class="full-article">
                        <div class="full-article-toggle">{this.renderArticleLink()}</div>
                        {this.renderArticleContent()}
                    </div>
                </li>
            </div>
        );
    }

    private renderArticleLink() {
        const toggle = () => this.setState(state => ({ isOpen: !state.isOpen }));
        const label = this.state.isOpen ? "Hide full story △" : "Show full story ▷";
        return (
            <button class="text-body-secondary" onClick={toggle}>
                {label}
            </button>
        );
    }

    private renderArticleContent() {
        return !this.state.isOpen ? null : (
            <div>
                <Link url={this.props.story.url} isTranslated={this.props.story.isTranslated} />
                <div
                    class="full-article-content"
                    dangerouslySetInnerHTML={{ __html: this.getArticleContentAsHtml() }}
                />
            </div>
        );
    }

    private getArticleContentAsHtml() {
        if (this.state.html) {
            return this.state.html;
        } else {
            const html = markdownToHtml(this.props.story.article);
            this.setState({ html });
            return html;
        }
    }
}
