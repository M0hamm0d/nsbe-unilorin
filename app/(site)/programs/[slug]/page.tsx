import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import { PROGRAMS } from "@/lib/programs";

export const instant = false;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = PROGRAMS.find((p) => p.href.endsWith(slug));
  const name = program ? program.name : "Program";
  return {
    title: `${name} | Coming Soon | NSBE Unilorin`,
    description: `The ${name} page is currently under construction. Check back soon.`,
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = PROGRAMS.find((p) => p.href.endsWith(slug));

  const name = program ? program.name : "This Program";
  const desc = program
    ? `The official portal and registration details for the ${program.name} are currently being finalized by the chapter committee.`
    : "We're currently building out this program initiative. Check back soon for updates.";

  return (
    <main>
      <ComingSoon
        title="COMING SOON!"
        subtitle="THIS PAGE IS UNDER CONSTRUCTION."
        description={desc}
        backHref="/programs#programs"
        backLabel="Back to Programs"
      />
    </main>
  );
}
