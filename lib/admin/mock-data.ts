import type {
  AdminEvent, AdminUser, AuditEntry, JoinRequest, Leader, Program, Project, Resource, Sponsor, SiteSettings, TutorialInterest,
} from "./types";
import { DEMO_USERS } from "./mock-users";

// Everything here is sample data. No real people, partners or events.
export const EVENTS: AdminEvent[] = [
  { id: "ev1", title: "Engineering Career Night", description: "An evening of conversations with practising engineers about internships, skills and careers.", date: "2026-11-07", startTime: "17:00", endTime: "19:30", venue: "Faculty of Engineering Auditorium", organizer: "NSBE Unilorin", registrationUrl: "https://forms.example.com/career-night", registrationDeadline: "2026-11-05", status: "published", confirmed: true, updatedAt: "2026-10-17" },
  { id: "ev2", title: "Intro to Arduino & Embedded Systems", description: "A hands-on introduction to microcontrollers.", date: "2026-11-21", startTime: "10:00", venue: "Computer Engineering Lab", organizer: "Technical Committee", registrationUrl: "https://forms.example.com/arduino", status: "published", confirmed: true, updatedAt: "2026-10-12" },
  { id: "ev3", title: "100L Tutorial: Engineering Mathematics", description: "A revision tutorial for first-year students.", date: "2026-12-05", startTime: "15:00", venue: "LT 2, Faculty of Engineering", organizer: "Academic Committee", status: "published", confirmed: true, updatedAt: "2026-09-28" },
  { id: "ev4", title: "Freshers’ Welcome & Chapter Tour", description: "Welcome session for new engineering students.", date: "2026-10-03", startTime: "14:00", venue: "Faculty of Engineering Quadrangle", organizer: "NSBE Unilorin", status: "published", confirmed: true, updatedAt: "2026-10-05" },
  { id: "ev5", title: "Python for Engineers Workshop", description: "Workshop on scripting for engineering problems.", date: "2026-07-18", startTime: "10:00", venue: "Computer Engineering Lab", organizer: "Technical Committee", status: "published", confirmed: true, updatedAt: "2026-07-19" },
  { id: "ev6", title: "New Members Orientation Day", description: "Orientation for new members.", date: "2027-01-16", startTime: "11:00", venue: "", organizer: "NSBE Unilorin", status: "draft", confirmed: false, updatedAt: "2026-10-19" },
  { id: "ev7", title: "Alumni Mentorship Panel", description: "", date: "", startTime: "", venue: "", organizer: "NSBE Unilorin", status: "draft", confirmed: false, updatedAt: "2026-10-18" },
  { id: "ev8", title: "Past Question Collection Drive", description: "Collected past questions from students.", date: "2026-03-14", startTime: "09:00", venue: "Faculty of Engineering", organizer: "Academic Committee", status: "archived", confirmed: true, updatedAt: "2026-03-20" },
];

export const PROGRAMS: Program[] = [
  { id: "pg1", title: "Peer Tutorial Series", description: "Weekly tutorials led by senior students to help 100L–300L students master core courses.", category: "Academic", image: "peer-tutorials.jpg", ctaLabel: "Learn more", ctaUrl: "/programs/peer-tutorials", status: "published", visible: true, updatedAt: "2026-10-17" },
  { id: "pg2", title: "Industry Mentorship", description: "Get paired with a practising engineer for guidance on internships, skills and careers.", category: "Career", image: "mentorship.jpg", ctaLabel: "Apply", ctaUrl: "/programs/mentorship", status: "published", visible: true, updatedAt: "2026-10-10" },
  { id: "pg3", title: "Build Lab", description: "Hands-on workshops where members design and build real engineering projects together.", category: "Technical", ctaLabel: "Join", status: "draft", visible: false, updatedAt: "2026-10-18" },
  { id: "pg4", title: "Engineering Week", description: "", status: "archived", visible: false, updatedAt: "2026-05-02" },
];

export const LEADERS: Leader[] = [1, 2, 3, 4, 5, 6].map((n) => ({
  id: `ld${n}`, name: `[Full name ${n}]`, role: "[Approved role]", bio: "[Short biography, confirmed with the person]",
  termStart: "", termEnd: "", visible: n !== 5, order: n,
}));

export const RESOURCES: Resource[] = [
  { id: "rs1", code: "CPE 311", title: "Data Structures & Algorithms", dept: "Computer", level: "300L", type: "past-question", session: "2023/2024", fileName: "CPE311_2023-24.pdf", fileSize: "2.4 MB", status: "published", updatedAt: "2026-10-19" },
  { id: "rs2", code: "CPE 311", title: "Data Structures & Algorithms", dept: "Computer", level: "300L", type: "past-question", session: "2023/2024", fileName: "CPE311_copy.pdf", fileSize: "2.5 MB", status: "draft", updatedAt: "2026-10-19" },
  { id: "rs3", code: "EEE 281", title: "Circuit Theory I", dept: "Electrical & Electronics", level: "200L", type: "past-question", session: "2023/2024", fileName: "EEE281.pdf", fileSize: "2.1 MB", status: "published", updatedAt: "2026-10-12" },
  { id: "rs4", code: "CVE 401", title: "Structural Analysis", dept: "Civil", level: "400L", type: "lecture-material", session: "", fileName: "CVE401_notes.pdf", fileSize: "5.5 MB", status: "published", updatedAt: "2026-09-30" },
  { id: "rs5", code: "MEE 301", title: "Fluid Mechanics II", dept: "Mechanical", level: "300L", type: "past-question", session: "2022/2023", status: "draft", updatedAt: "2026-10-18" },
  { id: "rs6", code: "CHE 401", title: "Process Control", dept: "Chemical", level: "400L", type: "past-question", session: "2023/2024", fileName: "CHE401.pdf", fileSize: "2.6 MB", status: "archived", updatedAt: "2026-08-02" },
];

export const PROJECTS: Project[] = [
  { id: "pj1", title: "Design of a Campus Attendance System", dept: "Computer", abstract: "A web-based attendance system using RFID cards.", keywords: "attendance, RFID, web", docLink: "project1.pdf", year: "2024", reviewed: { suitable: true, attribution: true, reuse: true }, status: "published", updatedAt: "2026-09-12" },
  { id: "pj2", title: "Design of a Cassava Flour Processing Plant", dept: "Food", abstract: "Process design for a small-scale plant.", keywords: "cassava, process design", docLink: "project2.pdf", year: "2024", reviewed: { suitable: true, attribution: true, reuse: true }, status: "published", updatedAt: "2026-09-10" },
  { id: "pj3", title: "Solar Charge Controller with MPPT", dept: "Electrical & Electronics", abstract: "", keywords: "solar, MPPT, Arduino", repoLink: "https://example.com/repo", year: "2023", reviewed: { suitable: false, attribution: false, reuse: false }, status: "draft", updatedAt: "2026-10-14" },
  { id: "pj4", title: "Rainwater Harvesting System for a Hostel", dept: "Water Resources", abstract: "", keywords: "rainwater, hostel", year: "2024", reviewed: { suitable: false, attribution: false, reuse: false }, status: "draft", updatedAt: "2026-10-11" },
];

export const TUTORIALS: TutorialInterest[] = [
  { id: "ti1", name: "Amina Yusuf", email: "amina@example.com", dept: "Civil", level: "200L", subjects: "Engineering Mathematics", phone: "0803 000 0012", submittedAt: "2026-10-18", status: "new" },
  { id: "ti2", name: "Tunde Bello", email: "tunde@example.com", dept: "Computer", level: "300L", subjects: "Data Structures, Operating Systems", submittedAt: "2026-10-18", status: "new" },
  { id: "ti3", name: "Chiamaka Obi", email: "chiamaka@example.com", dept: "Electrical & Electronics", level: "100L", subjects: "Circuit Theory", phone: "0803 000 0034", submittedAt: "2026-10-17", status: "new" },
  { id: "ti4", name: "Ibrahim Musa", email: "ibrahim@example.com", dept: "Mechanical", level: "200L", subjects: "Thermodynamics", submittedAt: "2026-10-16", status: "contacted" },
  { id: "ti5", name: "Zainab Salami", email: "zainab@example.com", dept: "Chemical", level: "300L", subjects: "Reaction Engineering", phone: "0803 000 0056", submittedAt: "2026-10-14", status: "resolved" },
];

export const JOINS: JoinRequest[] = [
  { id: "jr1", name: "Kemi Adeyemi", email: "kemi@example.com", dept: "Civil", level: "100L", interests: ["Events", "Programs"], submittedAt: "2026-10-18", status: "new" },
  { id: "jr2", name: "Samuel Okoro", email: "samuel@example.com", dept: "Computer", level: "200L", phone: "0803 000 0078", interests: ["Academic Hub"], submittedAt: "2026-10-17", status: "new" },
  { id: "jr3", name: "Halima Bello", email: "halima@example.com", dept: "Mechanical", level: "300L", interests: ["Scholarships"], submittedAt: "2026-10-15", status: "in_progress" },
  { id: "jr4", name: "David Eze", email: "david@example.com", dept: "Food", level: "400L", interests: ["Events"], submittedAt: "2026-10-12", status: "resolved" },
];

export const SPONSORS: Sponsor[] = [
  { id: "sp1", name: "[Partner name 1]", description: "Short description of the partnership.", website: "https://partner1.example", order: 1, confirmed: true, visible: true },
  { id: "sp2", name: "[Partner name 2]", description: "Short description of the partnership.", website: "https://partner2.example", order: 2, confirmed: true, visible: true },
  { id: "sp3", name: "[Partner name 3]", description: "Awaiting written permission to show the logo.", website: "https://partner3.example", order: 3, confirmed: false, visible: false },
  { id: "sp4", name: "[Possible sponsor]", description: "Conversation only. Not confirmed.", order: 4, confirmed: false, visible: false },
];

export const USERS: AdminUser[] = DEMO_USERS;

export const AUDIT: AuditEntry[] = [
  { id: "au1", at: "2026-10-19 10:14", actor: "Demo Admin", text: "Changed Invited Executive’s role to Editor" },
  { id: "au2", at: "2026-10-19 10:12", actor: "Demo Admin", text: "Invited invited@nsbe.test" },
  { id: "au3", at: "2026-10-19 09:10", actor: "Demo Editor", text: "Published CPE 311 Data Structures & Algorithms" },
  { id: "au4", at: "2026-10-18 16:32", actor: "Demo Editor", text: "Updated Engineering Career Night" },
  { id: "au5", at: "2026-08-12 08:00", actor: "Demo Admin", text: "Revoked access for Former Executive" },
];

export const SETTINGS: SiteSettings[] = [{
  id: "site", email: "hello@nsbeunilorin.org", phone: "", office: "",
  footerText: "University of Ilorin chapter of the National Society of Black Engineers.",
  socials: [
    { platform: "Instagram", url: "https://instagram.com/official-handle", show: true },
    { platform: "X", url: "", show: false },
    { platform: "LinkedIn", url: "https://linkedin.com/company/official-page", show: true },
  ],
}];
