import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import AccessManager from "@/components/admin/AccessManager";
import { getAdminUsers } from "@/lib/admin/actions";

export const metadata = { title: "Access & roles" };
export const instant = false;

export default async function Page() {
  const { allowed } = await guard("access");
  if (!allowed) return <NoAccess area="Access & roles" />;
  const users = await getAdminUsers();
  return <AccessManager initialUsers={users} />;
}
