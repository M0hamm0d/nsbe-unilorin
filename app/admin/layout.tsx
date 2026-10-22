import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./admin.css";

// Keep the admin out of search engines
export const metadata: Metadata = {
  title: { default: "Admin | NSBE Unilorin", template: "%s | NSBE Unilorin Admin" },
  robots: { index: false, follow: false },
};

export const instant = false;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="adm-root">{children}</div>;
}
