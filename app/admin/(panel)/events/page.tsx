import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import EventsManager from "@/components/admin/EventsManager";
import { getAdminEvents } from "@/lib/admin/actions";

export const metadata = { title: "Events" };

export default async function Page() {
  const { allowed } = await guard("events");
  if (!allowed) return <NoAccess area="Events" />;
  const items = await getAdminEvents();
  return <EventsManager initialItems={items} />;
}
