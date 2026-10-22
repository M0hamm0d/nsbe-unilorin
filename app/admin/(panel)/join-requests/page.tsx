import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import JoinInbox from "@/components/admin/JoinInbox";
import { getJoinRequests } from "@/lib/admin/actions";

export const metadata = { title: "Join requests" };

export default async function Page() {
  const { allowed } = await guard("joins");
  if (!allowed) return <NoAccess area="Join requests" />;
  const items = await getJoinRequests();
  return <JoinInbox initialItems={items} />;
}
