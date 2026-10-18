import type { Metadata } from "next";
import AcademicHub from "@/components/AcademicHub";
import "./academic-hub.css";

export const metadata: Metadata = {
  title: "Academic Hub | NSBE Unilorin",
  description:
    "Browse approved past questions, lecture materials and final-year project work across Unilorin engineering departments.",
};

export default function AcademicHubPage() {
  return <AcademicHub />;
}