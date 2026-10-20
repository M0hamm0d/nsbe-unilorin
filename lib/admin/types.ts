export type Role = "admin" | "editor" | "resource_manager";
export type Area =
  | "dashboard" | "events" | "programs" | "leadership" | "resources" | "projects"
  | "sponsors" | "tutorials" | "joins" | "access" | "settings";
export type PubStatus = "draft" | "published" | "archived";

export type AdminEvent = {
  id: string; title: string; description: string; date: string; startTime: string; endTime?: string;
  venue: string; organizer: string; image?: string; imageAlt?: string;
  registrationUrl?: string; registrationDeadline?: string;
  status: PubStatus; confirmed: boolean; updatedAt: string;
};
export type Program = {
  id: string; title: string; description: string; category?: string; image?: string;
  ctaLabel?: string; ctaUrl?: string; status: PubStatus; visible: boolean; updatedAt: string;
};
export type Leader = {
  id: string; name: string; role: string; bio: string; termStart?: string; termEnd?: string;
  portrait?: string; visible: boolean; order: number;
};
export type Resource = {
  id: string; code: string; title: string; dept: string; level: string; type: string; session: string;
  notes?: string; fileName?: string; fileSize?: string; status: PubStatus; updatedAt: string;
};
export type Project = {
  id: string; title: string; dept: string; abstract: string; keywords: string;
  docLink?: string; repoLink?: string; year?: string; supervisor?: string;
  reviewed: { suitable: boolean; attribution: boolean; reuse: boolean };
  status: PubStatus; updatedAt: string;
};
export type TutorialStatus = "new" | "contacted" | "resolved";
export type TutorialInterest = {
  id: string; name: string; email: string; dept: string; level: string; subjects: string;
  phone?: string; submittedAt: string; status: TutorialStatus;
};
export type JoinStatus = "new" | "in_progress" | "resolved";
export type JoinRequest = {
  id: string; name: string; email: string; dept: string; level: string; phone?: string;
  interests: string[]; submittedAt: string; status: JoinStatus;
};
export type Sponsor = {
  id: string; name: string; description: string; website?: string; logo?: string;
  order: number; confirmed: boolean; visible: boolean;
};
export type AdminUser = {
  id: string; name: string; email: string; role: Role; status: "active" | "invited" | "revoked"; lastActive: string;
};
export type AuditEntry = { id: string; at: string; actor: string; text: string };
export type SiteSettings = {
  id: "site"; email: string; phone: string; office: string; footerText: string;
  socials: { platform: string; url: string; show: boolean }[];
};
