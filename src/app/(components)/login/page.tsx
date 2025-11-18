import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "../common/Header";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login - Access Your RecrutPro Account",
  description:
    "Sign in to your RecrutPro account to access AI-powered recruitment tools, manage job postings, connect with top talent, and track your hiring progress.",
  openGraph: {
    title: "Login to RecrutPro - AI-Powered Recruitment Platform",
    description:
      "Access your recruitment dashboard and start hiring top talent with AI-powered matching.",
    type: "website",
    url: "/login",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Suspense
          fallback={<div className="flex justify-center items-center min-h-[60vh]">Loading...</div>}
        >
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
