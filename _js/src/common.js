

// Import what we need.
import "core-js/fn/function/bind";

import { Observable } from "rxjs";

// Check the user agent for Safari and iOS Safari, to give them some special treatment...
const ua = navigator.userAgent.toLowerCase();
export const isSafari = ua.indexOf("safari") > 0 && ua.indexOf("chrome") < 0;
export const isMobile = ua.indexOf("mobile") > 0;
export const isMobileSafari = isSafari && isMobile;
export const isUCBrowser = ua.indexOf("ucbrowser") > 0;
export const isFirefox = ua.indexOf("firefox") > 0;
export const isFirefoxIOS = ua.indexOf("fxios") > 0 && ua.indexOf("safari") > 0;

export const hasCSSOM = "attributeStyleMap" in Element.prototype && "CSS" in window && CSS.number;

// Takes an array of Modernizr feature tests and makes sure they all pass.
export function hasFeatures(features) {
  let acc = true;

  features.forEach(feature => {
    const hasFeature = window.Modernizr[feature];
    if (!hasFeature && process.env.DEBUG) console.warn(`Feature '${feature}' missing!`);
    acc = acc && hasFeature;
  });

  return acc;
}

// Some functions to hide and show content.
export function show() {
  this.style.display = "block";
  this.style.visibility = "visible";
}

export function hide() {
  this.style.display = "none";
  this.style.visibility = "hidden";
}

export function unshow() {
  this.style.display = "";
  this.style.visibility = "";
}

export const unhide = unshow;

// Same as `el.innerHTML = ''`, but not quite so hacky.
export function empty() {
  while (this.firstChild) this.removeChild(this.firstChild);
}

// An observable wrapper for the WebAnimations API.
// Will return an observable that emits once when the animation finishes.
export function animate(el, keyframes, options) {
  return Observable.create(observer => {
    const anim = el.animate(keyframes, options);

    anim.addEventListener(
      "finish",
      e => (
        observer.next(e),
        requestAnimationFrame(() => requestAnimationFrame(observer.complete.bind(observer)))
      )
    );

    return () => {
      if (anim.playState !== "finished") anim.cancel();
    };
  });
}

export function importTemplate(templateId) {
  const template = document.getElementById(templateId);
  return template && document.importNode(template.content, true);
}
