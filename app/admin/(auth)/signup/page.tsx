import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/admin/auth";
import SignupForm from "@/components/admin/SignupForm";
import Image from "next/image";

export const metadata: Metadata = { title: "Request Admin Access" };

export default function SignupPage() {
  return (
    <Suspense fallback={<main className="adm-login" aria-busy="true" />}>
      <SignupContent />
    </Suspense>
  );
}

async function SignupContent() {
  if (await getSession()) redirect("/admin");

  return (
    <main className="adm-login">
      <div className="adm-login__card" style={{ maxWidth: 480 }}>
        <div className="adm-brand adm-brand--dark">
          <Image src="/nsbe-logo.png" width={34} height={34} alt="NSBE Unilorin" />
          <div>
            NSBE Unilorin<small>Executive Onboarding</small>
          </div>
        </div>
        <h1>Request dashboard access</h1>
        <p>
          For new chapter executives and officers. Submissions are reviewed and approved by an administrator before access is granted.
        </p>
        <SignupForm />
      </div>
    </main>
  );
}
