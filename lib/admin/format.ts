const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(iso?: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
export function fmtTime(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}
export const todayISO = () => new Date().toISOString().slice(0, 10); // UTC on server and client, so they agree
export const isPast = (date: string) => date < todayISO();
export const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;
export const nowISO = () => new Date().toISOString();
