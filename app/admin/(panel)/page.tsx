import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import Dashboard from "@/components/admin/Dashboard";

export const metadata = { title: "Dashboard" };

export default async function Page() {
  const { allowed } = await guard("dashboard");
  if (!allowed) return <NoAccess area="the dashboard" />;
  return <Dashboard />;
}
