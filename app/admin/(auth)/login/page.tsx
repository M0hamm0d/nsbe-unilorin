import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/admin/auth";
import LoginForm from "@/components/admin/LoginForm";
import Image from "next/image";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="adm-login" aria-busy="true" />}>
      <LoginContent />
    </Suspense>
  );
}

async function LoginContent() {
  if (await getSession()) redirect("/admin");
  return (
    <main className="adm-login">
      <div className="adm-login__card">
        <div className="adm-brand adm-brand--dark"><Image src="/nsbe-logo.png" width={34} height={34} alt="NSBE Unilorin" /><div>NSBE Unilorin<small>Admin</small></div></div>
        <h1>Sign in to the admin</h1>
        <p>For chapter executives. New officers can request access below.</p>
        <LoginForm showDemo={process.env.NODE_ENV !== "production"} />
      </div>
    </main>
  );
}
