"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Mock persistence: browser localStorage. Swap these hooks for Supabase queries later.
const PREFIX = "nsbe-admin-mock:v1:";
const EVT = "nsbe-admin-mock";

function read<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T[]) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, items: T[]) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(EVT, { detail: key }));
  } catch { /* storage full or blocked: the mock just won't persist */ }
}

export function useMockCollection<T extends { id: string }>(key: string, initial: T[]) {
  const [items, setItems] = useState<T[]>(initial);
  const [ready, setReady] = useState(false);
  const ref = useRef<T[]>(initial);
  const initialRef = useRef(initial);

  useEffect(() => {
    const load = () => {
      const next = read<T>(key, initialRef.current);
      ref.current = next;
      setItems(next);
    };
    load();
    setReady(true);
    const onChange = (e: Event) => {
      if (e.type === "storage" || (e as CustomEvent).detail === key) load();
    };
    window.addEventListener(EVT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [key]);

  const commit = useCallback((next: T[]) => {
    ref.current = next;
    setItems(next);
    write(key, next);
  }, [key]);

  return {
    items, ready,
    add: (item: T) => commit([item, ...ref.current]),
    update: (id: string, patch: Partial<T>) => commit(ref.current.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    remove: (id: string) => commit(ref.current.filter((x) => x.id !== id)),
    set: commit,
  };
}

/** Add an audit entry from anywhere in the admin. */
export function logAudit(actor: string, text: string, initial: { id: string; at: string; actor: string; text: string }[]) {
  const now = new Date();
  const at = `${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 16)}`;
  const entry = { id: `au-${now.getTime()}`, at, actor, text };
  write("audit", [entry, ...read("audit", initial)]);
}

export function resetMockData() {
  Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)).forEach((k) => localStorage.removeItem(k));
  window.location.reload();
}
