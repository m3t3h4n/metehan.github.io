

import "core-js/fn/array/for-each";

import { HyImageElement, WEBCOMPONENT_FEATURE_TESTS } from "hy-img/src/webcomponent";

import { hasFeatures } from "./common";

if (hasFeatures(WEBCOMPONENT_FEATURE_TESTS)) {
  window.customElements.define("hy-img", HyImageElement);
} else {
  // If the necessary features aren't available, use the fact that we have `noscript` fallbacks
  // that are immediate children of the component, and add the fallback to the DOM
  // using minimal DOM and JavaScript APIs.
  Array.prototype.forEach.call(
    document.getElementsByTagName("hy-img"),
    el => (el.innerHTML = el.children[0].innerText)
  );
}
