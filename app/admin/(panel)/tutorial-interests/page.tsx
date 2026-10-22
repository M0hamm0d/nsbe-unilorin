import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import TutorialsInbox from "@/components/admin/TutorialsInbox";
import { getTutorialInterests } from "@/lib/admin/actions";

export const metadata = { title: "Tutorial interests" };
export const instant = false;

export default async function Page() {
  const { allowed } = await guard("tutorials");
  if (!allowed) return <NoAccess area="Tutorial interests" />;
  const items = await getTutorialInterests();
  return <TutorialsInbox initialItems={items} />;
}
