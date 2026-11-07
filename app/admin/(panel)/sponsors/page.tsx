import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import SponsorsManager from "@/components/admin/SponsorsManager";
import { getAdminSponsors } from "@/lib/admin/actions";

export const metadata = { title: "Sponsors & partners" };
export const instant = false;

export default async function Page() {
  const { allowed } = await guard("sponsors");
  if (!allowed) return <NoAccess area="Sponsors & partners" />;
  const items = await getAdminSponsors();
  return <SponsorsManager initialItems={items} />;
}
