import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import EventEditor from "@/components/admin/EventEditor";

export const metadata = { title: "Edit event" };

export default async function Page() {
  const { allowed } = await guard("events");
  if (!allowed) return <NoAccess area="Events" />;
  return <EventEditor />;
}
