"use client";

/** Lightweight session tracker — lives in sessionStorage, feeds the concierge context.
 *
 *  Tracks: which pages the visitor has been to, which concierge chips they clicked,
 *  and how many total interactions they've had. All data stays in the browser —
 *  nothing is sent anywhere except as context in concierge API calls.
 *
 *  ponytail: plain object in sessionStorage, one JSON key. No framework needed. */

const KEY = "pj_session";

export interface SessionData {
  pages: string[];       // paths visited, most recent last (max 20)
  chips: string[];       // chip labels clicked
  interactionCount: number;
  firstVisit: number;    // timestamp
}

function read(): SessionData {
  if (typeof window === "undefined") return empty();
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return empty();
    return JSON.parse(raw) as SessionData;
  } catch {
    return empty();
  }
}

function write(s: SessionData) {
  if (typeof window === "undefined") return;
  try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch { /* quota exceeded, ignore */ }
}

function empty(): SessionData {
  return { pages: [], chips: [], interactionCount: 0, firstVisit: Date.now() };
}

export function trackPage(path: string) {
  const s = read();
  if (s.pages.length === 0 || s.pages[s.pages.length - 1] !== path) {
    s.pages.push(path);
    if (s.pages.length > 20) s.pages.shift();
    write(s);
  }
}

export function trackChip(label: string) {
  const s = read();
  if (!s.chips.includes(label)) {
    s.chips.push(label);
    if (s.chips.length > 20) s.chips.shift();
  }
  write(s);
}

export function bumpInteraction() {
  const s = read();
  s.interactionCount++;
  write(s);
}

export function getSession(): SessionData {
  return read();
}

/** Human-readable context line for the concierge system prompt. */
export function sessionContext(): string {
  const s = read();
  const parts: string[] = [];

  if (s.pages.length > 1) {
    const visited = s.pages.filter((p) => p !== "/" && p !== "/es");
    if (visited.length > 0) {
      parts.push(`They have visited: ${visited.join(", ")}.`);
    }
  }

  if (s.chips.length > 0) {
    parts.push(`They clicked these prompt chips: ${s.chips.join("; ")}.`);
  }

  if (s.interactionCount > 0) {
    parts.push(`They've sent ${s.interactionCount} message${s.interactionCount === 1 ? "" : "s"} to you already.`);
  }

  return parts.length > 0
    ? `Session context (use this to personalize your replies):\n${parts.join("\n")}`
    : "";
}
