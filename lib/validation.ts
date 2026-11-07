import { DEPARTMENTS, LEVELS, RESOURCE_TYPES, type ResourceType } from "@/lib/academic-resources";

export const INTERESTS = ["Events", "Programs", "Scholarships", "Academic Hub"] as const;

export type JoinInput = {
  fullName: string; email: string; department: string; level: string;
  phone: string; interests: string[]; consent: boolean;
};
export type TutorialInput = {
  fullName: string; email: string; department: string; level: string;
  subjects: string; phone: string; consent: boolean;
};
export type ResourceRequestInput = {
  fullName: string; email: string; department: string; level: string; phone: string;
  resourceType: ResourceType | ""; courseCode: string; courseTitle: string;
  session: string; details: string; consent: boolean;
};
export type Errors<T> = Partial<Record<keyof T, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?\d{7,15}$/;

/* ---------- normalisation (used by the API routes) ---------- */
const line = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";
const block = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim().slice(0, max) : "";

export function normalizeJoin(raw: Record<string, unknown>): JoinInput {
  const interests = Array.isArray(raw.interests) ? raw.interests : [];
  return {
    fullName: line(raw.fullName, 100),
    email: line(raw.email, 254).toLowerCase(),
    department: line(raw.department, 100),
    level: line(raw.level, 10),
    phone: line(raw.phone, 20),
    interests: Array.from(new Set(interests.filter((i): i is string => (INTERESTS as readonly string[]).includes(i as string)))),
    consent: raw.consent === true,
  };
}

export function normalizeTutorial(raw: Record<string, unknown>): TutorialInput {
  return {
    fullName: line(raw.fullName, 100),
    email: line(raw.email, 254).toLowerCase(),
    department: line(raw.department, 100),
    level: line(raw.level, 10),
    subjects: block(raw.subjects, 500),
    phone: line(raw.phone, 20),
    consent: raw.consent === true,
  };
}

export function normalizeResourceRequest(raw: Record<string, unknown>): ResourceRequestInput {
  const resourceType = line(raw.resourceType, 30);
  return {
    fullName: line(raw.fullName, 100),
    email: line(raw.email, 254).toLowerCase(),
    department: line(raw.department, 100),
    level: line(raw.level, 10),
    phone: line(raw.phone, 20),
    resourceType: RESOURCE_TYPES.find((type) => type.value === resourceType)?.value ?? "",
    courseCode: line(raw.courseCode, 30),
    courseTitle: line(raw.courseTitle, 150),
    session: line(raw.session, 20),
    details: block(raw.details, 500),
    consent: raw.consent === true,
  };
}

/* ---------- validation (shared by the browser and the server) ---------- */
type Base = { fullName: string; email: string; department: string; level: string; phone: string; consent: boolean };

function validateBase(v: Base, consentMessage: string): Errors<Base> {
  const e: Errors<Base> = {};
  const name = v.fullName.trim();
  if (!name) e.fullName = "Enter your full name.";
  else if (name.length < 2) e.fullName = "Enter your full name, at least 2 characters.";

  const email = v.email.trim();
  if (!email) e.email = "Enter your email address.";
  else if (!EMAIL.test(email)) e.email = "Enter a valid email address, for example name@example.com.";

  if (!v.department) e.department = "Select your department.";
  else if (!DEPARTMENTS.some((d) => d.name === v.department)) e.department = "Select a department from the list.";

  if (!v.level) e.level = "Select your academic level.";
  else if (!(LEVELS as readonly string[]).includes(v.level)) e.level = "Select a level from 100L to 500L.";

  const phone = v.phone.replace(/[\s-]/g, "");
  if (phone && !PHONE.test(phone)) e.phone = "Enter a valid phone number, or leave this blank.";

  if (!v.consent) e.consent = consentMessage;
  return e;
}

export function validateJoin(v: JoinInput): Errors<JoinInput> {
  return validateBase(v, "Tick the box to agree before sending.");
}

export function validateTutorial(v: TutorialInput): Errors<TutorialInput> {
  const e: Errors<TutorialInput> = validateBase(v, "Tick the box to confirm you have read the privacy notice.");
  const s = v.subjects.trim();
  if (!s) e.subjects = "Tell us which subjects or topics you would like help with.";
  else if (s.length < 3) e.subjects = "Add a little more detail, for example a course name or topic.";
  return e;
}

export function validateResourceRequest(v: ResourceRequestInput): Errors<ResourceRequestInput> {
  const e: Errors<ResourceRequestInput> = validateBase(v, "Tick the box to confirm you have read the privacy notice.");
  if (!v.resourceType || !RESOURCE_TYPES.some((type) => type.value === v.resourceType)) {
    e.resourceType = "Choose the type of resource you need.";
  }
  if (!v.courseTitle.trim()) e.courseTitle = "Enter the course or project title.";
  else if (v.courseTitle.trim().length < 3) e.courseTitle = "Enter at least 3 characters.";
  if (v.session && !/^[\w /-]{1,20}$/.test(v.session)) e.session = "Enter a valid session or year, or leave this blank.";
  return e;
}
