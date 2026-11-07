"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { Executive } from "./leadership-types";
import "./leadership.css";

const SPEED = 40; // drift speed, px per second
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Portrait (real image when approved, honest placeholder otherwise)   */
/* ------------------------------------------------------------------ */
function Portrait({ ex, sizes }: { ex: Executive; sizes: string }) {
  if (ex.photo) {
    return (
      <Image
        src={ex.photo}
        alt={ex.photoAlt ?? `Portrait of ${ex.name}`}
        fill
        sizes={sizes}
        className="exec-img"
      />
    );
  }
  return (
    <span className="exec-placeholder" role="img" aria-label={`Portrait of ${ex.name} (pending)`}>
      <span className="exec-placeholder__note">Approved portrait</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function Leadership({ items, session }: { items: Executive[]; session?: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [enterFrom, setEnterFrom] = useState<DOMRect | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const restoringFocus = useRef(false);

  // Drift needs enough cards to loop seamlessly; otherwise it is a plain row.
  const loopable = items.length >= 5;

  const flags = useRef({
    reduced: false, hover: false, focus: false,
    dragging: false, modal: false, visible: true, manualUntil: 0,
  });
  const pos = useRef(0);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  /* reduced motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => { flags.current.reduced = mq.matches; };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  useEffect(() => { flags.current.modal = activeIndex !== null; }, [activeIndex]);

  /* only drift while on screen */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { flags.current.visible = e.isIntersecting; });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* length of one full set of cards (distance to its duplicate) */
  const loopWidth = useCallback(() => {
    const el = viewportRef.current;
    if (!el || !loopable) return 0;
    const cards = el.querySelectorAll<HTMLElement>(".exec-card");
    return cards.length > items.length ? cards[items.length].offsetLeft - cards[0].offsetLeft : 0;
  }, [items.length, loopable]);

  /* drift loop: scrollLeft-based so swipe, wheel and drag all just work */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    pos.current = el.scrollLeft;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const f = flags.current;
      const loop = loopWidth();
      if (Math.abs(el.scrollLeft - pos.current) > 1.5) pos.current = el.scrollLeft; // user moved it
      const run =
        loopable && loop > 0 && !f.reduced && !f.hover && !f.focus &&
        !f.dragging && !f.modal && f.visible && now > f.manualUntil;
      if (run) {
        pos.current += SPEED * dt;
        if (pos.current >= loop) pos.current -= loop;
        el.scrollLeft = pos.current;
      } else if (loop > 0 && el.scrollLeft >= loop) {
        el.scrollLeft -= loop; // keep manual scrolling seamless too
        pos.current = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loopWidth, loopable]);

  /* mouse drag-to-browse (touch and trackpad scroll natively) */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { down: true, startX: e.clientX, startLeft: e.currentTarget.scrollLeft, moved: false };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      flags.current.dragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (d.moved) e.currentTarget.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    drag.current.down = false;
    flags.current.dragging = false;
    setTimeout(() => { drag.current.moved = false; }, 0);
  };

  /* open / close profile */
  const openAt = (index: number, trigger: HTMLElement | null) => {
    if (drag.current.moved) return;
    opener.current = trigger;
    const photo = trigger?.querySelector<HTMLElement>(".exec-photo");
    setEnterFrom(photo ? photo.getBoundingClientRect() : null);
    setActiveIndex(index);
  };

  const cardPhotoRect = useCallback(
    (slug: string): DOMRect | null => {
      const photo = viewportRef.current?.querySelector<HTMLElement>(`[data-exec-id="${slug}"] .exec-photo`);
      if (!photo) return null;
      const r = photo.getBoundingClientRect();
      return r.right > 0 && r.left < window.innerWidth ? r : null; // only if on screen
    },
    []
  );

  const closeProfile = useCallback(() => {
    const index = activeIndex;
    setActiveIndex(null);
    flags.current.focus = false;
    if (index === null) return;

    const slug = items[index].slug;
    requestAnimationFrame(() => {
      flags.current.focus = false;
      restoringFocus.current = true;
      const btn = viewportRef.current?.querySelector<HTMLElement>(`[data-exec-id="${slug}"] .exec-card__button`);
      (btn ?? opener.current)?.focus({ preventScroll: true });
      restoringFocus.current = false;
    });
  }, [activeIndex, items]);

  /* deep link: #president */
  useEffect(() => {
    const i = items.findIndex((e) => `#${e.slug}` === window.location.hash);
    if (i < 0) return;
    const frame = requestAnimationFrame(() => setActiveIndex(i));
    return () => cancelAnimationFrame(frame);
  }, [items]);
  useEffect(() => {
    if (activeIndex !== null) {
      history.replaceState(null, "", `#${items[activeIndex].slug}`);
    } else if (items.some((e) => `#${e.slug}` === window.location.hash)) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [activeIndex, items]);

  const renderCard = (ex: Executive, i: number, dup: boolean) => (
    <li
      key={(dup ? "dup-" : "") + ex.slug}
      className="exec-card"
      data-exec-id={dup ? undefined : ex.slug}
      aria-hidden={dup || undefined}
    >
      <button
        type="button"
        className="exec-card__button"
        tabIndex={dup ? -1 : 0}
        aria-haspopup="dialog"
        aria-label={`${ex.name}, ${ex.role}. View profile`}
        onClick={(e) => openAt(i, e.currentTarget)}
      >
        <span className="exec-photo">
          <span className="exec-photo__media">
            <Portrait ex={ex} sizes="(min-width: 48em) 300px, 76vw" />
          </span>
          <span className="exec-card__order" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <span className="exec-card__plus" aria-hidden="true">+</span>
          <span className="exec-card__view" aria-hidden="true">View profile <span>→</span></span>
        </span>
        <span className="exec-card__meta">
          <span className="exec-card__role">{ex.role}</span>
          <span className="exec-card__name">{ex.name}</span>
          {ex.term && <span className="exec-card__dept">Term {ex.term}</span>}
        </span>
      </button>
    </li>
  );

  if (items.length === 0) {
    return (
      <section className="section section--surface exec" id="leadership" aria-labelledby="exec-heading">
        <div className="container">
          <div className="exec-head">
            <p className="exec-breadcrumb"><Link href="/about">About</Link><span aria-hidden="true"> / </span>Leadership</p>
            <h2 className="section-heading" id="exec-heading">The Executives</h2>
            <p className="exec-session">Session {session ?? "to be confirmed"}</p>
            <p className="section__intro">Leadership details are currently being updated by the chapter executives.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section section--surface exec" id="leadership" aria-labelledby="exec-heading">
      <div className="container">
        <div className="exec-head">
          <p className="exec-breadcrumb"><Link href="/about">About</Link><span aria-hidden="true"> / </span>Leadership</p>
          <h2 className="section-heading" id="exec-heading">The Executives</h2>
          {/* <p className="exec-session">Session {session ?? "to be confirmed"}</p> */}
          <p className="section__intro">
            The team behind NSBE Unilorin, in order of office. Drag to browse, select a card to read more.
          </p>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="exec-viewport"
        role="region"
        aria-roledescription="carousel"
        aria-label="Chapter executives"
        onPointerEnter={(e) => { if (e.pointerType === "mouse") flags.current.hover = true; }}
        onPointerLeave={() => { flags.current.hover = false; }}
        onFocusCapture={() => {
          if (restoringFocus.current) {
            restoringFocus.current = false;
            return;
          }
          flags.current.focus = true;
        }}
        onBlurCapture={() => { flags.current.focus = false; }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <ul className="exec-track">
          {items.map((ex, i) => renderCard(ex, i, false))}
          {loopable && items.map((ex, i) => renderCard(ex, i, true))}
        </ul>
      </div>

      {activeIndex !== null && (
        <ProfileDialog
          items={items}
          index={activeIndex}
          onIndex={setActiveIndex}
          onClose={closeProfile}
          originFor={cardPhotoRect}
          enterFrom={enterFrom}
        />
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Expanded profile                                                    */
/* ------------------------------------------------------------------ */
function ProfileDialog({
  items, index, onIndex, onClose, originFor, enterFrom,
}: {
  items: Executive[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  originFor: (slug: string) => DOMRect | null;
  enterFrom: DOMRect | null;
}) {
  const ex = items[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ y: number } | null>(null);
  const [closing, setClosing] = useState(false);

  const flipKeyframes = (from: DOMRect, to: DOMRect) =>
    `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`;

  /* enter: photo lifts out of its card (FLIP) */
  useLayoutEffect(() => {
    const photo = photoRef.current;
    if (!photo || !enterFrom || prefersReduced()) return;
    const to = photo.getBoundingClientRect();
    photo.animate(
      [
        { transformOrigin: "top left", transform: flipKeyframes(enterFrom, to) },
        { transformOrigin: "top left", transform: "none" },
      ],
      { duration: 380, easing: EASE }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* scroll lock + initial focus */
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.documentElement.style.overflow = prev; };
  }, []);

  /* exit: photo flies back to its card */
  const close = () => {
    if (closing) return;
    setClosing(true);
    const photo = photoRef.current;
    const from = originFor(ex.slug);
    if (photo && from && !prefersReduced()) {
      const to = photo.getBoundingClientRect();
      const a = photo.animate(
        [
          { transformOrigin: "top left", transform: "none" },
          { transformOrigin: "top left", transform: flipKeyframes(from, to) },
        ],
        { duration: 280, easing: EASE, fill: "forwards" }
      );
      a.finished.then(onClose).catch(onClose);
    } else {
      setTimeout(onClose, prefersReduced() ? 0 : 180);
    }
  };

  const go = (dir: 1 | -1) => onIndex((index + dir + items.length) % items.length);

  /* keyboard: Esc, arrows, focus trap */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        const f = dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
        if (!f || !f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  return (
    <div className={`exec-modal${closing ? " is-closing" : ""}`}>
      <div className="exec-modal__scrim" onClick={close} />
      <div
        ref={dialogRef}
        className="exec-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exec-modal-name"
        onTouchStart={(e) => {
          const p = panelRef.current;
          touch.current = p && p.scrollTop <= 0 ? { y: e.touches[0].clientY } : null;
        }}
        onTouchEnd={(e) => {
          if (touch.current && e.changedTouches[0].clientY - touch.current.y > 90) close();
          touch.current = null;
        }}
      >
        <button ref={closeRef} type="button" className="exec-modal__close" onClick={close} aria-label="Close profile">×</button>

        <div ref={photoRef} className="exec-photo exec-modal__photo">
          <span className="exec-photo__media" key={ex.slug}>
            <Portrait ex={ex} sizes="(min-width: 64em) 520px, 70vw" />
          </span>
        </div>

        <div className="exec-modal__panel" ref={panelRef}>
          <div className="exec-modal__content" key={ex.slug}>
            <p className="exec-modal__role">{ex.role}</p>
            <h3 id="exec-modal-name" className="exec-modal__name">{ex.name}</h3>
            {ex.term && <p className="exec-modal__sub">Term {ex.term}</p>}

            {ex.bio.length > 0 && (
              <>
                <h4 className="exec-modal__label">About</h4>
                {ex.bio.map((p, i) => <p className="exec-modal__text" key={i}>{p}</p>)}
              </>
            )}

            <h4 className="exec-modal__label">Details</h4>
            <dl className="exec-modal__grid">
              <div><dt>Role</dt><dd>{ex.role}</dd></div>
              {ex.term && <div><dt>Term</dt><dd>{ex.term}</dd></div>}
            </dl>

          </div>

          <div className="exec-modal__nav">
            <button type="button" onClick={() => go(-1)}>← Prev</button>
            <span aria-live="polite">{index + 1} of {items.length}</span>
            <button type="button" onClick={() => go(1)}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
