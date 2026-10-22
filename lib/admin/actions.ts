"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase-admin";
import { guard } from "@/lib/admin/auth";
import type {
  AdminEvent,
  JoinRequest,
  JoinStatus,
  Resource,
  TutorialInterest,
  TutorialStatus,
} from "./types";
import { EVENTS, JOINS, RESOURCES, TUTORIALS } from "./mock-data";
import { type Resource as PublicResource } from "@/lib/academic-resources";
import { type ChapterEvent } from "@/lib/events";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ==============================================================================
// 1. PUBLIC FORMS & SUBMISSIONS
// ==============================================================================

/** Fetch all join requests from Supabase (or fallback to mock data). */
export async function getJoinRequests(): Promise<JoinRequest[]> {
  if (!isSupabaseConfigured()) return JOINS;

  try {
    const { data, error } = await supabaseAdmin()
      .from("join_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Failed to fetch join_requests from Supabase:", error);
      return JOINS;
    }

    return data.map((row) => ({
      id: row.id,
      name: row.full_name,
      email: row.email,
      dept: row.department,
      level: row.level,
      phone: row.phone ?? undefined,
      interests: Array.isArray(row.interests) ? row.interests : [],
      submittedAt: row.created_at,
      status: (row.status as JoinStatus) || "new",
    }));
  } catch (err) {
    console.error("getJoinRequests error:", err);
    return JOINS;
  }
}

/** Update the status of a join request in Supabase. */
export async function updateJoinStatus(id: string, status: JoinStatus): Promise<{ ok: boolean }> {
  await guard("joins");

  if (!isSupabaseConfigured()) return { ok: true };

  try {
    const { error } = await supabaseAdmin()
      .from("join_requests")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/admin/join-requests");
    return { ok: true };
  } catch (err) {
    console.error("updateJoinStatus error:", err);
    return { ok: false };
  }
}

/** Fetch all tutorial interests from Supabase (or fallback to mock data). */
export async function getTutorialInterests(): Promise<TutorialInterest[]> {
  if (!isSupabaseConfigured()) return TUTORIALS;

  try {
    const { data, error } = await supabaseAdmin()
      .from("tutorial_interest")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Failed to fetch tutorial_interest from Supabase:", error);
      return TUTORIALS;
    }

    return data.map((row) => ({
      id: row.id,
      name: row.full_name,
      email: row.email,
      dept: row.department,
      level: row.level,
      subjects: row.subjects,
      phone: row.phone ?? undefined,
      submittedAt: row.created_at,
      status: (row.status as TutorialStatus) || "new",
    }));
  } catch (err) {
    console.error("getTutorialInterests error:", err);
    return TUTORIALS;
  }
}

/** Update the status of a tutorial interest in Supabase. */
export async function updateTutorialStatus(id: string, status: TutorialStatus): Promise<{ ok: boolean }> {
  await guard("tutorials");

  if (!isSupabaseConfigured()) return { ok: true };

  try {
    const { error } = await supabaseAdmin()
      .from("tutorial_interest")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/admin/tutorial-interests");
    return { ok: true };
  } catch (err) {
    console.error("updateTutorialStatus error:", err);
    return { ok: false };
  }
}

// ==============================================================================
// 2. ACADEMIC RESOURCES (PAST QUESTIONS & LECTURE MATERIALS)
// ==============================================================================

/** Fetch academic resources for the admin panel. */
export async function getAdminResources(): Promise<Resource[]> {
  if (!isSupabaseConfigured()) return RESOURCES;

  try {
    const { data, error } = await supabaseAdmin()
      .from("academic_resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Failed to fetch academic_resources:", error);
      return RESOURCES;
    }

    return data.map((r) => ({
      id: r.id,
      code: r.code,
      title: r.title,
      dept: r.department,
      level: r.level,
      type: r.resource_type,
      session: r.session,
      notes: r.notes ?? undefined,
      fileName: r.file_url ? r.file_url.split("/").pop() : undefined,
      fileSize: r.file_size ?? "—",
      status: r.status,
      updatedAt: r.updated_at ? r.updated_at.slice(0, 10) : "",
    }));
  } catch (err) {
    console.error("getAdminResources error:", err);
    return RESOURCES;
  }
}

/** Save (insert or update) an academic resource in Supabase. */
export async function saveAdminResource(
  res: Resource,
  fileUrl?: string
): Promise<{ ok: boolean; id?: string }> {
  await guard("resources");

  if (!isSupabaseConfigured()) return { ok: true, id: res.id };

  try {
    const payload = {
      code: res.code.trim().toUpperCase(),
      title: res.title.trim(),
      department: res.dept.trim().toLowerCase(),
      level: res.level,
      resource_type: res.type,
      session: res.session,
      file_size: res.fileSize || "—",
      notes: res.notes || null,
      status: res.status,
      available: res.status === "published",
      updated_at: new Date().toISOString(),
      ...(fileUrl ? { file_url: fileUrl } : {}),
    };

    if (res.id && UUID_REGEX.test(res.id)) {
      const { error } = await supabaseAdmin()
        .from("academic_resources")
        .update(payload)
        .eq("id", res.id);
      if (error) throw error;
    } else {
      const { data, error } = await supabaseAdmin()
        .from("academic_resources")
        .insert({ ...payload, file_url: fileUrl || "#" })
        .select("id")
        .single();
      if (error) throw error;
      res.id = data.id;
    }

    revalidatePath("/admin/resources");
    revalidatePath("/academic-hub");
    return { ok: true, id: res.id };
  } catch (err) {
    console.error("saveAdminResource error:", err);
    return { ok: false };
  }
}

/** Delete an academic resource from Supabase. */
export async function deleteAdminResource(id: string): Promise<{ ok: boolean }> {
  await guard("resources");

  if (!isSupabaseConfigured()) return { ok: true };

  try {
    const { error } = await supabaseAdmin()
      .from("academic_resources")
      .delete()
      .eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/resources");
    revalidatePath("/academic-hub");
    return { ok: true };
  } catch (err) {
    console.error("deleteAdminResource error:", err);
    return { ok: false };
  }
}

/** Fetch published academic resources for the public Academic Hub. */
export async function getPublicAcademicResources(): Promise<PublicResource[]> {
  if (!isSupabaseConfigured()) {
    // Dynamic import to break any circular dependency
    const { RESOURCES: mockResources } = await import("@/lib/academic-resources");
    return mockResources;
  }

  try {
    const { data, error } = await supabaseAdmin()
      .from("academic_resources")
      .select("*")
      .eq("status", "published")
      .order("year", { ascending: false });

    if (error || !data || data.length === 0) {
      const { RESOURCES: mockResources } = await import("@/lib/academic-resources");
      return mockResources;
    }

    return data.map((r) => ({
      id: r.id,
      code: r.code,
      title: r.title,
      dept: r.department,
      level: r.level,
      type: r.resource_type,
      detail: r.session || `${r.year} session`,
      year: r.year,
      format: r.format || "PDF",
      size: r.file_size || "—",
      available: r.available,
      href: r.file_url || "#",
    }));
  } catch (err) {
    console.error("getPublicAcademicResources error:", err);
    const { RESOURCES: mockResources } = await import("@/lib/academic-resources");
    return mockResources;
  }
}

// ==============================================================================
// 3. CHAPTER EVENTS
// ==============================================================================

/** Fetch events for the admin panel. */
export async function getAdminEvents(): Promise<AdminEvent[]> {
  if (!isSupabaseConfigured()) return EVENTS;

  try {
    const { data, error } = await supabaseAdmin()
      .from("events")
      .select("*")
      .order("date", { ascending: false });

    if (error || !data) {
      console.error("Failed to fetch events:", error);
      return EVENTS;
    }

    return data.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description || "",
      date: e.date,
      startTime: e.start_time || "",
      endTime: e.end_time || undefined,
      venue: e.venue || "",
      organizer: e.organizer || "NSBE Unilorin",
      image: e.image_url || undefined,
      imageAlt: e.image_alt || undefined,
      registrationUrl: e.registration_url || undefined,
      registrationDeadline: e.registration_deadline || undefined,
      status: e.status,
      confirmed: e.confirmed,
      updatedAt: e.updated_at ? e.updated_at.slice(0, 10) : "",
    }));
  } catch (err) {
    console.error("getAdminEvents error:", err);
    return EVENTS;
  }
}

/** Save (insert or update) an event in Supabase. */
export async function saveAdminEvent(event: AdminEvent): Promise<{ ok: boolean; id?: string }> {
  await guard("events");

  if (!isSupabaseConfigured()) return { ok: true, id: event.id };

  try {
    const slug = event.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const payload = {
      slug: slug || `event-${Date.now()}`,
      title: event.title.trim(),
      description: event.description || null,
      date: event.date,
      start_time: event.startTime || null,
      end_time: event.endTime || null,
      venue: event.venue || null,
      organizer: event.organizer || "NSBE Unilorin",
      image_url: event.image || null,
      image_alt: event.imageAlt || null,
      registration_url: event.registrationUrl || null,
      registration_deadline: event.registrationDeadline || null,
      status: event.status,
      confirmed: event.confirmed,
      updated_at: new Date().toISOString(),
    };

    if (event.id && UUID_REGEX.test(event.id)) {
      const { error } = await supabaseAdmin()
        .from("events")
        .update(payload)
        .eq("id", event.id);
      if (error) throw error;
    } else {
      const { data, error } = await supabaseAdmin()
        .from("events")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      event.id = data.id;
    }

    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { ok: true, id: event.id };
  } catch (err) {
    console.error("saveAdminEvent error:", err);
    return { ok: false };
  }
}

/** Delete an event from Supabase. */
export async function deleteAdminEvent(id: string): Promise<{ ok: boolean }> {
  await guard("events");

  if (!isSupabaseConfigured()) return { ok: true };

  try {
    const { error } = await supabaseAdmin()
      .from("events")
      .delete()
      .eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { ok: true };
  } catch (err) {
    console.error("deleteAdminEvent error:", err);
    return { ok: false };
  }
}

/** Fetch published chapter events for public pages. */
export async function getPublicEvents(): Promise<ChapterEvent[]> {
  if (!isSupabaseConfigured()) {
    const { EVENTS: mockEvents } = await import("@/lib/events");
    return mockEvents;
  }

  try {
    const { data, error } = await supabaseAdmin()
      .from("events")
      .select("*")
      .eq("status", "published")
      .order("date", { ascending: true });

    if (error || !data || data.length === 0) {
      const { EVENTS: mockEvents } = await import("@/lib/events");
      return mockEvents;
    }

    return data.map((e) => ({
      id: e.id,
      slug: e.slug,
      name: e.title,
      date: e.date,
      time: e.start_time || undefined,
      venue: e.venue || undefined,
      organizer: e.organizer,
      registerUrl: e.registration_url || undefined,
      summary: e.description || undefined,
      image: e.image_url || undefined,
    }));
  } catch (err) {
    console.error("getPublicEvents error:", err);
    const { EVENTS: mockEvents } = await import("@/lib/events");
    return mockEvents;
  }
}

// ==============================================================================
// 4. CHAPTER LEADERSHIP & EXECUTIVES
// ==============================================================================

/** Fetch leadership team for the admin panel. */
export async function getAdminLeaders(): Promise<import("./types").Leader[]> {
  if (!isSupabaseConfigured()) {
    const { LEADERS } = await import("./mock-data");
    return LEADERS;
  }

  try {
    const { data, error } = await supabaseAdmin()
      .from("leaders")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      const { LEADERS } = await import("./mock-data");
      return LEADERS;
    }

    return data.map((l) => ({
      id: l.id,
      name: l.name,
      role: l.role,
      bio: l.bio || "",
      portrait: l.portrait_url || undefined,
      termStart: l.term_start || undefined,
      termEnd: l.term_end || undefined,
      visible: l.visible,
      order: l.order_index,
    }));
  } catch (err) {
    console.error("getAdminLeaders error:", err);
    const { LEADERS } = await import("./mock-data");
    return LEADERS;
  }
}

/** Save (insert or update) an executive leader in Supabase. */
export async function saveAdminLeader(
  leader: import("./types").Leader
): Promise<{ ok: boolean; id?: string }> {
  await guard("leadership");

  if (!isSupabaseConfigured()) return { ok: true, id: leader.id };

  try {
    const payload = {
      name: leader.name.trim(),
      role: leader.role.trim(),
      bio: leader.bio || null,
      portrait_url: leader.portrait || null,
      term_start: leader.termStart || null,
      term_end: leader.termEnd || null,
      visible: leader.visible,
      order_index: leader.order,
    };

    if (leader.id && UUID_REGEX.test(leader.id)) {
      const { error } = await supabaseAdmin()
        .from("leaders")
        .update(payload)
        .eq("id", leader.id);
      if (error) throw error;
    } else {
      const { data, error } = await supabaseAdmin()
        .from("leaders")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      leader.id = data.id;
    }

    revalidatePath("/admin/leadership");
    revalidatePath("/leadership");
    return { ok: true, id: leader.id };
  } catch (err) {
    console.error("saveAdminLeader error:", err);
    return { ok: false };
  }
}

/** Delete an executive leader from Supabase. */
export async function deleteAdminLeader(id: string): Promise<{ ok: boolean }> {
  await guard("leadership");

  if (!isSupabaseConfigured()) return { ok: true };

  try {
    const { error } = await supabaseAdmin()
      .from("leaders")
      .delete()
      .eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/leadership");
    revalidatePath("/leadership");
    return { ok: true };
  } catch (err) {
    console.error("deleteAdminLeader error:", err);
    return { ok: false };
  }
}

/** Fetch public visible executive leaders for the public Leadership page. */
export async function getPublicLeaders(): Promise<import("./types").Leader[]> {
  if (!isSupabaseConfigured()) {
    const { LEADERS } = await import("./mock-data");
    return LEADERS.filter((l) => l.visible);
  }

  try {
    const { data, error } = await supabaseAdmin()
      .from("leaders")
      .select("*")
      .eq("visible", true)
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      const { LEADERS } = await import("./mock-data");
      return LEADERS.filter((l) => l.visible);
    }

    return data.map((l) => ({
      id: l.id,
      name: l.name,
      role: l.role,
      bio: l.bio || "",
      portrait: l.portrait_url || undefined,
      termStart: l.term_start || undefined,
      termEnd: l.term_end || undefined,
      visible: l.visible,
      order: l.order_index,
    }));
  } catch (err) {
    console.error("getPublicLeaders error:", err);
    const { LEADERS } = await import("./mock-data");
    return LEADERS.filter((l) => l.visible);
  }
}

