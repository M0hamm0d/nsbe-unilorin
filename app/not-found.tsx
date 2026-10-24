import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Coming Soon | NSBE Unilorin",
  description: "This page is currently under construction. Check back soon for updates.",
};

export default function NotFound() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <Header />
      <main>
        <ComingSoon
          title="COMING SOON!"
          subtitle="THIS PAGE IS UNDER CONSTRUCTION."
          description="We're currently building out this section and fine-tuning details for chapter members. Check back soon or return home."
          backHref="/programs"
          backLabel="Back to Programs"
        />
      </main>
      <Footer />
    </Suspense>
  );
}
