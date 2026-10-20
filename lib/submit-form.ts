export type SubmitResult =
  | { ok: true }
  | { ok: false; kind: "validation"; errors: Record<string, string> }
  | { ok: false; kind: "failed" };

/** Posts JSON and sorts every outcome into success, field errors, or a general failure. */
export async function submitForm(endpoint: string, payload: unknown): Promise<SubmitResult> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.ok) return { ok: true };
    if (res.status === 422 && data?.errors) return { ok: false, kind: "validation", errors: data.errors };
    return { ok: false, kind: "failed" };
  } catch {
    return { ok: false, kind: "failed" };
  }
}
