export type ChapterEvent = {
  id: string;
  slug: string;
  name: string;
  date: string; // ISO "YYYY-MM-DD"
  time?: string;
  venue?: string; // leave out until confirmed
  organizer: string;
  registerUrl?: string; // leave out until registration opens
  summary?: string;
  image?: string;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function dateParts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { day: String(d).padStart(2, "0"), month: MONTHS[m - 1], year: String(y) };
}

/** Full label for a card, e.g. "Saturday, March 14, 2026 • 4:00 PM" */
export function eventDateLabel(iso: string, time?: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const date = `${weekday}, ${MONTHS_LONG[m - 1]} ${d}, ${y}`;
  return time ? `${date} • ${time}` : date;
}

// Compare as ISO strings so server time zones can't shift the day
export function splitEvents(events: ChapterEvent[], today = new Date().toISOString().slice(0, 10)) {
  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}
