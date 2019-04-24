

import "core-js/fn/array/includes";
import "core-js/fn/function/bind";

import { merge } from "rxjs";
import { filter } from "rxjs/operators";

import { setupFLIPTitle } from "./title";

const FLIP_TYPES = ["title"];

export function setupFLIP(start$, ready$, fadeIn$, options) {
  const other$ = start$.pipe(filter(({ flipType }) => !FLIP_TYPES.includes(flipType)));

  return merge(setupFLIPTitle(start$, ready$, fadeIn$, options), other$);
}
