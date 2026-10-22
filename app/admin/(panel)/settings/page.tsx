import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata = { title: "Settings" };
export const instant = false;

export default async function Page() {
  const { allowed } = await guard("settings");
  if (!allowed) return <NoAccess area="Settings" />;
  return <SettingsForm />;
}
