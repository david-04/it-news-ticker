import { Component, h } from "preact";

import "./Marquee.css";

//----------------------------------------------------------------------------------------------------------------------
// Component
//----------------------------------------------------------------------------------------------------------------------

export class Marquee extends Component {
    //------------------------------------------------------------------------------------------------------------------
    // Render the component
    //------------------------------------------------------------------------------------------------------------------

    render() {
        return (
            <div class="Marquee">
                <p>
                    IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER
                    - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS
                    TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT
                    NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER -
                    IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER
                    - IT NEWS TICKER - IT NEWS TICKER - IT NEWS TICKER -
                </p>
            </div>
        );
    }
}
