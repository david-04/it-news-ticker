import "bootstrap/dist/css/bootstrap.min.css";

import { h, render } from "preact";
import { Application } from "./components/Application.js";
import { animateFavicon } from "./util/favicon.js";
import { setTheme } from "./util/theme.js";

setTheme();
animateFavicon();

const app = document.createElement("DIV");
document.body.prepend(app);
render(<Application />, app);
