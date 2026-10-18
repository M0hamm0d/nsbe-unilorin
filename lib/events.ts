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

// Mock data. Replace with Supabase rows once the executives confirm real events.
export const EVENTS: ChapterEvent[] = [
  { id: "e1", slug: "engineering-career-night", name: "Engineering Career Night", date: "2026-11-07", time: "5:00 PM", venue: "Faculty of Engineering Auditorium", organizer: "NSBE Unilorin", registerUrl: "/events/engineering-career-night/register", image: "/images/events/next-event.jpg" },
  { id: "e2", slug: "intro-to-arduino", name: "Intro to Arduino & Embedded Systems", date: "2026-11-21", time: "10:00 AM", venue: "Computer Engineering Lab", organizer: "Technical Committee", registerUrl: "/events/intro-to-arduino/register" },
  { id: "e3", slug: "100l-maths-tutorial", name: "100L Tutorial: Engineering Mathematics", date: "2026-12-05", time: "3:00 PM", venue: "LT 2, Faculty of Engineering", organizer: "Academic Committee", registerUrl: "/events/100l-maths-tutorial/register" },
  { id: "e4", slug: "chapter-orientation-day", name: "New Members Orientation Day", date: "2027-01-16", time: "11:00 AM", organizer: "NSBE Unilorin" }, // details still to be confirmed

  { id: "p1", slug: "freshers-welcome", name: "Freshers’ Welcome & Chapter Tour", date: "2026-10-03", time: "2:00 PM", venue: "Faculty of Engineering Quadrangle", organizer: "NSBE Unilorin", summary: "Welcomed new engineering students and introduced the chapter’s programs." },
  { id: "p2", slug: "python-for-engineers", name: "Python for Engineers Workshop", date: "2026-07-18", time: "10:00 AM", venue: "Computer Engineering Lab", organizer: "Technical Committee" },
  { id: "p3", slug: "alumni-mentorship-panel", name: "Alumni Mentorship Panel", date: "2026-05-23", time: "4:00 PM", venue: "Faculty of Engineering Auditorium", organizer: "NSBE Unilorin" },
  { id: "p4", slug: "past-question-drive", name: "Past Question Collection Drive", date: "2026-03-14", venue: "Faculty of Engineering", organizer: "Academic Committee" },
  { id: "p5", slug: "cv-writing-clinic", name: "CV & LinkedIn Clinic", date: "2025-11-29", time: "1:00 PM", venue: "LT 1, Faculty of Engineering", organizer: "NSBE Unilorin" },
  { id: "p6", slug: "autocad-bootcamp", name: "AutoCAD Basics Bootcamp", date: "2025-10-11", time: "9:00 AM", venue: "Civil Engineering Studio", organizer: "Technical Committee" },
  { id: "p7", slug: "engineering-week-quiz", name: "Engineering Week Quiz", date: "2025-08-30", time: "3:00 PM", venue: "Faculty of Engineering Auditorium", organizer: "NSBE Unilorin" },
  { id: "p8", slug: "tutorial-kickoff", name: "Peer Tutorial Kick-off", date: "2025-06-07", time: "10:00 AM", venue: "LT 2, Faculty of Engineering", organizer: "Academic Committee" },
];

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
