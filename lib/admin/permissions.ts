import type { Area, Role } from "./types";

export const ROLE_LABEL: Record<Role, string> = { admin: "Admin", editor: "Editor", resource_manager: "Resource manager" };

// What each role may open. Enforced in the server pages now and by Supabase RLS later.
const ACCESS: Record<Role, Area[]> = {
  admin: ["dashboard", "events", "programs", "leadership", "resources", "projects", "sponsors", "tutorials", "joins", "access", "settings"],
  editor: ["dashboard", "events", "programs", "leadership", "resources", "projects", "tutorials", "joins"],
  resource_manager: ["dashboard", "resources", "projects"],
};

export const can = (role: Role, area: Area) => ACCESS[role].includes(area);
