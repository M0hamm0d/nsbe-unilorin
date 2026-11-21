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

export function dateParts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { day: String(d).padStart(2, "0"), month: MONTHS[m - 1], year: String(y) };
}

// Compare as ISO strings so server time zones can't shift the day
export function splitEvents(events: ChapterEvent[], today = new Date().toISOString().slice(0, 10)) {
  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}
