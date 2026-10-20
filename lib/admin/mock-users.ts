import type { AdminUser } from "./types";

// Demo accounts. Everyone signs in with ADMIN_DEMO_PASSWORD (default "nsbe-demo").
// Replace all of this with Supabase Auth plus an executives table.
export const DEMO_USERS: AdminUser[] = [
  { id: "u1", name: "Demo Admin", email: "admin@nsbe.test", role: "admin", status: "active", lastActive: "19 Oct 2026" },
  { id: "u2", name: "Demo Editor", email: "editor@nsbe.test", role: "editor", status: "active", lastActive: "18 Oct 2026" },
  { id: "u3", name: "Demo Resource Manager", email: "resources@nsbe.test", role: "resource_manager", status: "active", lastActive: "16 Oct 2026" },
  { id: "u4", name: "Invited Executive", email: "invited@nsbe.test", role: "editor", status: "invited", lastActive: "—" },
  { id: "u5", name: "Former Executive", email: "former@nsbe.test", role: "editor", status: "revoked", lastActive: "12 Aug 2026" },
];
