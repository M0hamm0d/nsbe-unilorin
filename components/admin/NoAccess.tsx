import Link from "next/link";

export default function NoAccess({ area }: { area: string }) {
  return (
    <div className="adm-empty" role="alert">
      <h3>You don’t have access to {area}</h3>
      <p>Your role doesn’t include this section. Ask an admin if you need it.</p>
      <Link href="/admin" className="adm-btn">Back to the dashboard</Link>
    </div>
  );
}
