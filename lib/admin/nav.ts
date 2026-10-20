import type { Area } from "./types";

export type NavItem = { area: Area; href: string; label: string; icon: string };
export const NAV: { group: string; items: NavItem[] }[] = [
  { group: "Overview", items: [{ area: "dashboard", href: "/admin", label: "Dashboard", icon: "grid" }] },
  { group: "Content", items: [
    { area: "events", href: "/admin/events", label: "Events", icon: "cal" },
    { area: "programs", href: "/admin/programs", label: "Programs & initiatives", icon: "spark" },
    { area: "leadership", href: "/admin/leadership", label: "Leadership", icon: "users" },
    { area: "resources", href: "/admin/resources", label: "Academic resources", icon: "book" },
    { area: "projects", href: "/admin/projects", label: "Final-year projects", icon: "file" },
    { area: "sponsors", href: "/admin/sponsors", label: "Sponsors & partners", icon: "hand" },
  ] },
  { group: "Private submissions", items: [
    { area: "tutorials", href: "/admin/tutorial-interests", label: "Tutorial interests", icon: "chat" },
    { area: "joins", href: "/admin/join-requests", label: "Join requests", icon: "inbox" },
  ] },
  { group: "Administration", items: [
    { area: "access", href: "/admin/access", label: "Access & roles", icon: "shield" },
    { area: "settings", href: "/admin/settings", label: "Settings", icon: "gear" },
  ] },
];
