import { guard } from "@/lib/admin/auth";
import NoAccess from "@/components/admin/NoAccess";
import EventEditor from "@/components/admin/EventEditor";
import { getAdminEventById } from "@/lib/admin/actions";

export const metadata = { title: "Edit event" };
export const instant = false;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { allowed } = await guard("events");
  if (!allowed) return <NoAccess area="Events" />;
  const { id } = await params;
  const initialEvent = id !== "new" ? await getAdminEventById(id) : null;
  return <EventEditor initialEvent={initialEvent} idParam={id} />;
}
