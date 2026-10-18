// Mock content. Replace with confirmed chapter information before launch.

export const PROGRAMS = [
  { id: "pg1", tone: "card", image: "/group-study.jpg", category: "Academic", name: "Peer Tutorial Series", text: "Weekly tutorials led by senior students to help 100L–300L students master core courses.", href: "/programs/peer-tutorials" },
  { id: "pg2", tone: "brand", image: "/mentorship.jpg", category: "Career", name: "Industry Mentorship", text: "Get paired with a practising engineer for guidance on internships, skills and career paths.", href: "/programs/mentorship" },
  { id: "pg3", tone: "dark", image: "/lab-nsbe.jpg", category: "Technical", name: "Build Lab", text: "Hands-on workshops where members design and build real engineering projects together.", href: "/programs/build-lab" },
] as const;

export type Scholarship = {
  id: string;
  name: string;
  funder: string;
  description: string;
  amount: string;
  deadline: string; // ISO "YYYY-MM-DD"
  eligibility: string;
  href: string;
};

export const SCHOLARSHIPS: Scholarship[] = [
  { id: "s1", name: "Engineering Merit Scholarship", funder: "Chapter alumni network", description: "Supports high-performing Unilorin engineering students with tuition-related costs.", amount: "₦150,000", deadline: "2026-12-15", eligibility: "200L–400L engineering students", href: "/scholarships/engineering-merit" },
  { id: "s2", name: "Need-Based Support Award", funder: "[Sponsor]", description: "Helps students facing financial difficulty stay on track with their studies.", amount: "₦100,000", deadline: "2026-09-30", eligibility: "All engineering levels", href: "/scholarships/need-based-support" },
];

export const APPLY_STEPS = [
  { title: "Check eligibility", text: "Confirm your level, department and any other requirements for the scholarship." },
  { title: "Prepare your documents", text: "Gather what the guidelines ask for, such as proof of enrolment." },
  { title: "Submit your application", text: "Apply before the deadline. Results are shared with applicants once reviewed." },
];

export const PARTNER_STEPS = [
  { title: "Read the sponsorship packet", text: "See the ways to support the chapter and what each one funds." },
  { title: "Contact the chapter", text: "Tell us who you are and how your organisation would like to take part." },
  { title: "Agree the details together", text: "We confirm the partnership with you before your name or logo appears anywhere." },
];

export const PACKET = {
  href: "/downloads/nsbe-unilorin-sponsorship-packet.pdf", // put the real PDF in /public/downloads
  meta: "PDF · 2.1 MB · 2026",
};

// Stand-in logos. Use only confirmed partners once permissions are approved.
export const PARTNERS = [
  { name: "Siemens", src: "/partners/siemens.svg" },
  { name: "Bosch", src: "/partners/bosch.svg" },
  { name: "Schneider Electric", src: "/partners/schneider-electric.svg" },
  { name: "Intel", src: "/partners/intel.svg" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
export const isOpen = (deadline: string, today = new Date().toISOString().slice(0, 10)) => deadline >= today;
