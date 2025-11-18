import type { Metadata } from "next";
import Header from "../common/Header";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign Up - Create Your RecrutPro Account",
  description:
    "Join RecrutPro today and start hiring top talent 10x faster. Create your free account as a recruiter or job seeker. Get access to AI-powered matching, verified candidates, and seamless recruitment tools.",
  openGraph: {
    title: "Sign Up for RecrutPro - Start Hiring Smarter Today",
    description:
      "Create your free account and transform your hiring process with AI-powered recruitment.",
    type: "website",
    url: "/signup",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/signup",
  },
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <SignupForm />
      </main>
    </div>
  );
}
