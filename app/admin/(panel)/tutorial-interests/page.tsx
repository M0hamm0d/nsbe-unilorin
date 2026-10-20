import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import TutorialsInbox from "@/components/admin/TutorialsInbox";

export const metadata = { title: "Tutorial interests" };

export default async function Page() {
  const { allowed } = await guard("tutorials");
  if (!allowed) return <NoAccess area="Tutorial interests" />;
  return <TutorialsInbox />;
}
