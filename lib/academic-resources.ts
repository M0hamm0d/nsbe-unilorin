export type ResourceType = "past-question" | "lecture-material" | "final-year-project";

export const RESOURCE_TYPES: { value: ResourceType; label: string; tab: string }[] = [
  { value: "past-question", label: "Past question", tab: "Past questions" },
  { value: "lecture-material", label: "Lecture material", tab: "Lecture materials" },
  { value: "final-year-project", label: "Final-year project", tab: "Final-year projects" },
];

// Placeholder names: replace with the official list once the chapter confirms it.
export const DEPARTMENTS = [
  { slug: "agricultural-biosystems", name: "Agricultural & Biosystems" },
  { slug: "biomedical", name: "Biomedical" },
  { slug: "chemical", name: "Chemical" },
  { slug: "civil", name: "Civil" },
  { slug: "computer", name: "Computer" },
  { slug: "electrical-electronics", name: "Electrical & Electronics" },
  { slug: "food", name: "Food" },
  { slug: "materials-metallurgical", name: "Materials & Metallurgical" },
  { slug: "mechanical", name: "Mechanical" },
  { slug: "water-resources", name: "Water Resources" },
] as const;

export const LEVELS = ["100L", "200L", "300L", "400L", "500L"] as const;

export type Resource = {
  id: string;
  code: string;
  title: string;
  dept: string; // department slug
  level: (typeof LEVELS)[number];
  type: ResourceType;
  detail: string; // session, "Lecture notes", "Slides"...
  year: number; // used for sorting (newest first)
  format: string;
  size: string;
  available: boolean;
  href: string;
};

// [code, title, dept, level, type, detail, year, size, available]
type Row = [string, string, string, Resource["level"], ResourceType, string, number, string, boolean?];
const PQ: ResourceType = "past-question";
const LM: ResourceType = "lecture-material";
const FYP: ResourceType = "final-year-project";

const rows: Row[] = [
  ["CPE 311", "Data Structures & Algorithms", "computer", "300L", PQ, "2023/2024 session", 2024, "2.4 MB"],
  ["CPE 307", "Operating Systems", "computer", "300L", PQ, "2022/2023 session", 2023, "1.8 MB"],
  ["CPE 321", "Computer Architecture II", "computer", "300L", LM, "Lecture notes", 2024, "5.1 MB"],
  ["CPE 305", "Digital Logic Design", "computer", "300L", PQ, "2021/2022 session", 2022, "3.0 MB", false],
  ["CPE 313", "Engineering Statistics", "computer", "300L", LM, "Slides", 2023, "6.7 MB"],
  ["CPE 211", "Introduction to Programming", "computer", "200L", PQ, "2023/2024 session", 2024, "1.2 MB"],
  ["CPE 501", "Design of a Campus Attendance System", "computer", "500L", FYP, "2024 project", 2024, "4.6 MB"],
  ["EEE 281", "Circuit Theory I", "electrical-electronics", "200L", PQ, "2023/2024 session", 2024, "2.1 MB"],
  ["EEE 381", "Electromagnetic Fields", "electrical-electronics", "300L", LM, "Lecture notes", 2023, "4.4 MB"],
  ["EEE 481", "Power Systems Analysis", "electrical-electronics", "400L", PQ, "2022/2023 session", 2023, "2.9 MB"],
  ["EEE 501", "Solar Charge Controller with MPPT", "electrical-electronics", "500L", FYP, "2023 project", 2023, "7.2 MB"],
  ["EEE 183", "Basic Electrical Engineering", "electrical-electronics", "100L", LM, "Slides", 2024, "3.3 MB"],
  ["CVE 401", "Structural Analysis", "civil", "400L", LM, "Lecture notes", 2024, "5.5 MB"],
  ["CVE 301", "Soil Mechanics", "civil", "300L", PQ, "2022/2023 session", 2023, "2.0 MB"],
  ["CVE 201", "Engineering Surveying", "civil", "200L", PQ, "2023/2024 session", 2024, "1.7 MB"],
  ["CVE 501", "Design of a Low-Cost Housing Estate", "civil", "500L", FYP, "2024 project", 2024, "9.8 MB"],
  ["MEE 301", "Fluid Mechanics II", "mechanical", "300L", PQ, "2022/2023 session", 2023, "2.3 MB"],
  ["MEE 401", "Heat Transfer", "mechanical", "400L", LM, "Slides", 2024, "4.9 MB"],
  ["MEE 201", "Engineering Thermodynamics", "mechanical", "200L", PQ, "2021/2022 session", 2022, "1.9 MB"],
  ["MEE 501", "Biomass Briquette Press Design", "mechanical", "500L", FYP, "2023 project", 2023, "6.1 MB"],
  ["CHE 201", "Material & Energy Balances", "chemical", "200L", PQ, "2022/2023 session", 2023, "2.2 MB"],
  ["CHE 301", "Chemical Reaction Engineering", "chemical", "300L", LM, "Lecture notes", 2024, "4.0 MB"],
  ["CHE 401", "Process Control", "chemical", "400L", PQ, "2023/2024 session", 2024, "2.6 MB", false],
  ["FDE 502", "Design of a Cassava Flour Processing Plant", "food", "500L", FYP, "2024 project", 2024, "8.3 MB"],
  ["FDE 301", "Food Process Engineering I", "food", "300L", PQ, "2023/2024 session", 2024, "2.0 MB"],
  ["FDE 201", "Food Chemistry", "food", "200L", LM, "Lecture notes", 2023, "3.6 MB"],
  ["ABE 301", "Farm Power & Machinery", "agricultural-biosystems", "300L", PQ, "2022/2023 session", 2023, "1.6 MB"],
  ["ABE 401", "Irrigation & Drainage Engineering", "agricultural-biosystems", "400L", LM, "Slides", 2024, "5.0 MB"],
  ["BME 301", "Biomedical Instrumentation", "biomedical", "300L", PQ, "2023/2024 session", 2024, "2.5 MB"],
  ["BME 201", "Human Anatomy for Engineers", "biomedical", "200L", LM, "Lecture notes", 2023, "4.2 MB"],
  ["MME 301", "Physical Metallurgy", "materials-metallurgical", "300L", PQ, "2022/2023 session", 2023, "2.1 MB"],
  ["MME 401", "Corrosion Engineering", "materials-metallurgical", "400L", LM, "Slides", 2024, "3.9 MB"],
  ["WRE 301", "Hydrology", "water-resources", "300L", PQ, "2023/2024 session", 2024, "2.7 MB"],
  ["WRE 501", "Rainwater Harvesting System for a Hostel", "water-resources", "500L", FYP, "2024 project", 2024, "5.4 MB"],
  ["GST 111", "Communication in English", "computer", "100L", PQ, "2023/2024 session", 2024, "1.1 MB"],
  ["MTH 101", "Elementary Mathematics I", "civil", "100L", PQ, "2023/2024 session", 2024, "1.3 MB"],
  ["PHY 101", "General Physics I", "mechanical", "100L", LM, "Lecture notes", 2023, "3.1 MB"],
  ["ENG 201", "Engineering Mathematics I", "electrical-electronics", "200L", LM, "Slides", 2024, "4.7 MB"],
];

export const RESOURCES: Resource[] = rows.map(([code, title, dept, level, type, detail, year, size, available], i) => ({
  id: `res-${i + 1}`,
  code,
  title,
  dept,
  level,
  type,
  detail,
  year,
  format: "PDF",
  size,
  available: available !== false,
  href: "#", // replace with the Supabase Storage URL
}));
