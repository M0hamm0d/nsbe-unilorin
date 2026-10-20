import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import ProjectsManager from "@/components/admin/ProjectsManager";

export const metadata = { title: "Final-year projects" };

export default async function Page() {
  const { allowed } = await guard("projects");
  if (!allowed) return <NoAccess area="Final-year projects" />;
  return <ProjectsManager />;
}
