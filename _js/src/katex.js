
import "core-js/fn/array/for-each";

import { hasFeatures, hide } from "./common";

const REQUIREMENTS = ["classlist", "eventlistener", "queryselector"];

const featuresOk = hasFeatures(REQUIREMENTS);
let loaded;

function renderKatex(el) {
  try {
    let prev = el.previousElementSibling;
    while (prev && !prev.classList.contains("MathJax_Preview")) prev = prev.previousElementSibling;

    const tex = el.textContent.replace("% <![CDATA[", "").replace("%]]>", "");

    el.outerHTML = window.katex.renderToString(tex, {
      displayMode: el.type === "math/tex; mode=display",
    });

    if (prev) prev.parentNode.removeChild(prev);
  } catch (e) {
    if (process.env.DEBUG) console.error(e);
  }
}

const promisify = (f, href) => new Promise(resolve => f(href).addEventListener("load", resolve));

export const upgradeMathBlocks = !featuresOk
  ? () => {}
  : () => {
      const mathBlocks = document.querySelectorAll('script[type^="math/tex"]');
      if (mathBlocks.length) {
        if (!loaded) {
          loaded = Promise.all([
            promisify(loadJS, document.getElementById("_hrefKatexJS").href),
            promisify(loadCSS, document.getElementById("_hrefKatexCSS").href),
            promisify(loadJS, document.getElementById("_hrefKatexCopyJS").href),
            promisify(loadCSS, document.getElementById("_hrefKatexCopyCSS").href),
          ]);
        }
        loaded.then(() => {
          Array.from(mathBlocks).forEach(renderKatex);
        });
      }
    };

upgradeMathBlocks();
