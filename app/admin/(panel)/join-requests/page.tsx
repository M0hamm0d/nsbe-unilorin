import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import JoinInbox from "@/components/admin/JoinInbox";

export const metadata = { title: "Join requests" };

export default async function Page() {
  const { allowed } = await guard("joins");
  if (!allowed) return <NoAccess area="Join requests" />;
  return <JoinInbox />;
}
