import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import Dashboard from "@/components/admin/Dashboard";
import { getAdminEvents } from "@/lib/admin/actions";
import { can } from "@/lib/admin/permissions";

export const metadata = { title: "Dashboard" };
export const instant = false;

export default async function Page() {
  const { allowed, session } = await guard("dashboard");
  if (!allowed) return <NoAccess area="the dashboard" />;
  const events = can(session.role, "events") ? await getAdminEvents() : [];
  return <Dashboard initialEvents={events} />;
}
