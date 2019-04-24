
import "@webcomponents/webcomponentsjs";
import "intersection-observer";
import ResizeObserver from "resize-observer-polyfill";
import "web-animations-js";
import smoothscroll from "smoothscroll-polyfill";
import "../lib/request-idle-callback";

import "../lib/modernizr-custom";
import "../lib/version";

import "./images";
import "./drawer";
import "./push-state";
import "./katex";

window.ResizeObserver = window.ResizeObserver || ResizeObserver;
smoothscroll.polyfill();
