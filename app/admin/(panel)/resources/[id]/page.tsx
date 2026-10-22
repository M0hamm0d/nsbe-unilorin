import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import ResourceEditor from "@/components/admin/ResourceEditor";

export const metadata = { title: "Resource" };
export const instant = false;

export default async function Page() {
  const { allowed } = await guard("resources");
  if (!allowed) return <NoAccess area="Academic resources" />;
  return <ResourceEditor />;
}
