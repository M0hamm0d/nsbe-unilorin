import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import { SCHOLARSHIPS } from "@/lib/programs";

export const instant = false;

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const baseSlug = slug?.[0];
  const scholarship = SCHOLARSHIPS.find((s) => s.href.endsWith(baseSlug || ""));
  const name = scholarship ? scholarship.name : baseSlug === "guidelines" ? "Scholarship Guidelines" : "Scholarship";
  return {
    title: `${name} | Coming Soon | NSBE Unilorin`,
    description: `The ${name} portal is currently under construction. Check back soon.`,
  };
}

export default async function ScholarshipDetailPage({ params }: Props) {
  const { slug } = await params;
  const baseSlug = slug?.[0];
  const isApply = slug?.includes("apply");
  const scholarship = SCHOLARSHIPS.find((s) => s.href.endsWith(baseSlug || ""));

  let name = "Scholarship";
  let desc = "We're currently building out this scholarship portal. Check back soon for updates.";

  if (baseSlug === "guidelines") {
    name = "Scholarship Guidelines";
    desc = "The official application criteria and submission guidelines are being prepared for publishing.";
  } else if (scholarship) {
    name = scholarship.name;
    desc = isApply
      ? `The application portal for the ${scholarship.name} is currently under construction. Online submissions will open shortly.`
      : `Complete award guidelines and funding details for the ${scholarship.name} are currently being finalized.`;
  }

  return (
    <main>
      <ComingSoon
        title="COMING SOON!"
        subtitle="THIS PAGE IS UNDER CONSTRUCTION."
        description={desc}
        backHref="/programs#scholarships"
        backLabel="Back to Scholarships"
      />
    </main>
  );
}
