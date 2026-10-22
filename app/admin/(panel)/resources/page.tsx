import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import ResourcesManager from "@/components/admin/ResourcesManager";
import { getAdminResources } from "@/lib/admin/actions";

export const metadata = { title: "Academic resources" };
export const instant = false;

export default async function Page() {
  const { allowed } = await guard("resources");
  if (!allowed) return <NoAccess area="Academic resources" />;
  const items = await getAdminResources();
  return <ResourcesManager initialItems={items} />;
}
