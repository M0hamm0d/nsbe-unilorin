import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import SponsorsManager from "@/components/admin/SponsorsManager";

export const metadata = { title: "Sponsors & partners" };
export const instant = false;

export default async function Page() {
  const { allowed } = await guard("sponsors");
  if (!allowed) return <NoAccess area="Sponsors & partners" />;
  return <SponsorsManager />;
}
