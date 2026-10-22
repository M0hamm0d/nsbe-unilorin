import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import AccessManager from "@/components/admin/AccessManager";

export const metadata = { title: "Access & roles" };
export const instant = false;

export default async function Page() {
  const { allowed } = await guard("access");
  if (!allowed) return <NoAccess area="Access & roles" />;
  return <AccessManager />;
}
