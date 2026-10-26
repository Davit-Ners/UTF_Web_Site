"use client";

import { createElement, type HTMLAttributes, type ReactNode } from "react";

/*
 * Editorial reveal trigger for the R1 Plate and R3 Rule cut primitives
 * (globals.css). Progressive by construction: the server markup carries no
 * hidden state. On mount, only a target that is still out of view becomes
 * data-reveal="pending"; it switches to "done" once when it enters view.
 * Without JS, without IntersectionObserver, with reduced motion, or when the
 * target is already on screen, nothing is ever hidden.
 */

const THRESHOLD = 0.25;

let observer: IntersectionObserver | null = null;
/* One editorial animation at a time: later reveals wait for the running one */
let busyUntil = 0;

function revealDuration() {
  return window.matchMedia("(max-width: 720px)").matches ? 360 : 480;
}

function reveal(element: HTMLElement) {
  const now = performance.now();
  const start = Math.max(now, busyUntil);
  busyUntil = start + revealDuration();
  const run = () => {
    element.dataset.reveal = "done";
  };
  if (start > now) window.setTimeout(run, start - now);
  else run();
}

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer?.unobserve(entry.target);
        reveal(entry.target as HTMLElement);
      }
    },
    { threshold: THRESHOLD }
  );
  return observer;
}

function inView(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

function watch(element: HTMLElement) {
  if (element.dataset.reveal === "done") return undefined;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (element.dataset.reveal !== "pending") {
    const capable =
      typeof IntersectionObserver !== "undefined" &&
      !reducedMotion.matches;
    if (!capable || inView(element)) return undefined;
    element.dataset.reveal = "pending";
  }
  const io = getObserver();
  io.observe(element);
  // A preference changed while scrolling must also settle already pending targets.
  const onReducedMotion = () => {
    if (!reducedMotion.matches) return;
    io.unobserve(element);
    element.dataset.reveal = "done";
  };
  reducedMotion.addEventListener("change", onReducedMotion);
  return () => {
    io.unobserve(element);
    reducedMotion.removeEventListener("change", onReducedMotion);
  };
}

type Props = HTMLAttributes<HTMLElement> & {
  as?: "div" | "ol" | "ul" | "figure" | "p" | "span";
  children?: ReactNode;
};

/* Callback ref: runs at commit, before paint, and returns the observer cleanup */
function attach(element: HTMLElement | null) {
  return element ? watch(element) : undefined;
}

export default function Reveal({ as = "div", children, ...props }: Props) {
  return createElement(as, { ...props, ref: attach }, children);
}
