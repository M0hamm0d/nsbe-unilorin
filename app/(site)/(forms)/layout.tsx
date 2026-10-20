import type { ReactNode } from "react";
import "./forms.css";

export default function FormsLayout({ children }: { children: ReactNode }) {
  return <div className="forms-page">{children}</div>;
}
