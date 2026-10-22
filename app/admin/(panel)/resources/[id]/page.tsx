import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import ResourceEditor from "@/components/admin/ResourceEditor";
import { getAdminResourceById } from "@/lib/admin/actions";

export const metadata = { title: "Resource" };
export const instant = false;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { allowed } = await guard("resources");
  if (!allowed) return <NoAccess area="Academic resources" />;
  const { id } = await params;
  const initialResource = id !== "new" ? await getAdminResourceById(id) : null;
  return <ResourceEditor initialResource={initialResource} idParam={id} />;
}
