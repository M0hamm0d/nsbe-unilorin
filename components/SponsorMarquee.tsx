"use client";

import { useEffect, useRef, type ReactNode } from "react";

const SPEED = 42; // px per second
const DRAG_THRESHOLD = 4; // px before a press counts as a drag
const RESUME_DELAY = 900; // ms after a drag ends

export default function SponsorMarquee({ children }: { children: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const hoveredRef = useRef(false);
  const dragRef = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);
  const resumeTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let position = el.scrollLeft;
    let last = performance.now();

    const step = (now: number) => {
      frame = requestAnimationFrame(step);
      const dt = Math.min(now - last, 64) / 1000;
      last = now;

      if (reduceMotion.matches || pausedRef.current || dragRef.current) {
        position = el.scrollLeft;
        return;
      }

      const half = el.scrollWidth / 2;
      if (half <= 0) return;

      position += SPEED * dt;
      if (position >= half) position -= half;
      el.scrollLeft = position;
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => () => window.clearTimeout(resumeTimerRef.current), []);

  function pause() {
    window.clearTimeout(resumeTimerRef.current);
    pausedRef.current = true;
  }

  function resume() {
    window.clearTimeout(resumeTimerRef.current);
    if (!dragRef.current && !hoveredRef.current) pausedRef.current = false;
  }

  function resumeAfterDelay() {
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      if (!dragRef.current && !hoveredRef.current) pausedRef.current = false;
    }, RESUME_DELAY);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;

    pause();
    suppressClickRef.current = false;
    dragRef.current = { x: e.clientX, left: el.scrollLeft, moved: false };
    el.classList.add("is-dragging");
    el.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    const drag = dragRef.current;
    if (!el || !drag) return;

    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < DRAG_THRESHOLD) return;
    drag.moved = true;

    const half = el.scrollWidth / 2;
    let left = drag.left - dx;

    // Wrap around the cloned half so dragging keeps looping.
    if (half > 0) {
      if (left < 0) {
        left += half;
        drag.left += half;
      } else if (left >= half) {
        left -= half;
        drag.left -= half;
      }
    }

    el.scrollLeft = left;
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el || !dragRef.current) return;

    suppressClickRef.current = dragRef.current.moved;
    dragRef.current = null;
    el.classList.remove("is-dragging");
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    resumeAfterDelay();
  }

  function handleClickCapture(e: React.MouseEvent<HTMLDivElement>) {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className="home-sponsors__marquee">
      <div
        ref={scrollerRef}
        className="home-sponsors__scroller"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          hoveredRef.current = true;
          pause();
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "mouse") return;
          hoveredRef.current = false;
          if (!dragRef.current) resume();
        }}
        onFocus={pause}
        onBlur={resume}
        onClickCapture={handleClickCapture}
        onDragStart={(e) => e.preventDefault()}
      >
        <ul className="home-sponsors__track">{children}</ul>
        <ul className="home-sponsors__track" aria-hidden="true">
          {children}
        </ul>
      </div>
    </div>
  );
}
