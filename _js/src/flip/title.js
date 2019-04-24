

import "core-js/fn/function/bind";

import { of, zip } from "rxjs";
import { tap, finalize, filter, map, switchMap } from "rxjs/operators";

import { animate, empty } from "../common";

const TITLE_SELECTOR = ".page-title, .post-title";

export function setupFLIPTitle(start$, ready$, fadeIn$, { animationMain, settings }) {
  if (!animationMain) return start$;

  const flip$ = start$.pipe(
    filter(({ flipType }) => flipType === "title"),
    switchMap(({ anchor }) => {
      if (!anchor) return of({});

      const title = document.createElement("h1");

      title.classList.add("page-title");
      title.textContent = anchor.textContent;
      title.style.transformOrigin = "left top";

      const page = animationMain.querySelector(".page");
      if (!page) return of({});

      empty.call(page);
      page.appendChild(title);

      animationMain.style.position = "fixed";
      animationMain.style.opacity = 1;

      const first = anchor.getBoundingClientRect();
      const last = title.getBoundingClientRect();
      const firstFontSize = parseInt(getComputedStyle(anchor).fontSize, 10);
      const lastFontSize = parseInt(getComputedStyle(title).fontSize, 10);

      const invertX = first.left - last.left;
      const invertY = first.top - last.top;
      const invertScale = firstFontSize / lastFontSize;

      anchor.style.opacity = 0;

      const transform = [
        {
          transform: `translate3d(${invertX}px, ${invertY}px, 0) scale(${invertScale})`,
        },
        { transform: "translate3d(0, 0, 0) scale(1)" },
      ];

      return animate(title, transform, settings).pipe(
        tap({
          complete() {
            animationMain.style.position = "absolute";
          },
        })
      );
    })
  );

  start$
    .pipe(
      switchMap(({ flipType }) =>
        zip(
          ready$.pipe(
            filter(() => flipType === "title"),
            map(({ replaceEls: [main] }) => {
              const title = main.querySelector(TITLE_SELECTOR);
              if (title) title.style.opacity = 0;
              return title;
            })
          ),
          fadeIn$,
          x => x
        ).pipe(
          tap(title => {
            if (title) title.style.opacity = 1;
            animationMain.style.opacity = 0;
          }),
          finalize(() => {
            animationMain.style.opacity = 0;
          })
        )
      )
    )
    .subscribe();

  return flip$;
}
