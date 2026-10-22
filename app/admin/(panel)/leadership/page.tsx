import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import LeadershipManager from "@/components/admin/LeadershipManager";
import { getAdminLeaders } from "@/lib/admin/actions";

export const metadata = { title: "Leadership" };

export default async function Page() {
  const { allowed } = await guard("leadership");
  if (!allowed) return <NoAccess area="Leadership" />;
  const items = await getAdminLeaders();
  return <LeadershipManager initialItems={items} />;
}
