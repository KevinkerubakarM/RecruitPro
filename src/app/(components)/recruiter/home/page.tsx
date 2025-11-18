import type { Metadata } from "next";
import Header from "../../common/Header";
import AuthWrapper from "../../common/AuthWrapper";
import CareerJobMenu from "./careerJobMenu";

export const metadata: Metadata = {
  title: "Recruiter Dashboard - Manage Jobs & Company Career Page | RecrutPro",
  description:
    "Access your recruiter dashboard to create and manage job postings, build custom career pages, track applications, and hire top talent with AI-powered recruitment tools.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterHomePage() {
  return (
    <AuthWrapper requiredRole="RECRUITER">
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <CareerJobMenu />
        </main>
      </div>
    </AuthWrapper>
  );
}
