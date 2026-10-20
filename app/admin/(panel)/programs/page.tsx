import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import ProgramsManager from "@/components/admin/ProgramsManager";

export const metadata = { title: "Programs" };

export default async function Page() {
  const { allowed } = await guard("programs");
  if (!allowed) return <NoAccess area="Programs" />;
  return <ProgramsManager />;
}
