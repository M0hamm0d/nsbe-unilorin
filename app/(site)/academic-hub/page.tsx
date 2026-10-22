import type { Metadata } from "next";
import { connection } from "next/server";
import AcademicHub from "@/components/AcademicHub";
import { getPublicAcademicResources } from "@/lib/admin/actions";
import "./academic-hub.css";

export const metadata: Metadata = {
  title: "Academic Hub | NSBE Unilorin",
  description:
    "Browse approved past questions, lecture materials and final-year project work across Unilorin engineering departments.",
};

export const instant = false;

export default async function AcademicHubPage() {
  await connection();
  const initialResources = await getPublicAcademicResources();
  return <AcademicHub initialResources={initialResources} />;
}