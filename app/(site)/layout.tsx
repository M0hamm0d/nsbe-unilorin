import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// The public site chrome. The admin area has its own layout and never shows this.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
