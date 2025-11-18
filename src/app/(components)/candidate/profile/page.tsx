import { Metadata } from "next";
import ProfilePageClient from "./ProfilePageClient";

export const metadata: Metadata = {
  title: "My Profile - Update Your Professional Information",
  description:
    "Manage your professional profile, update your skills, experience, and job preferences to get better job matches. Keep your information current to attract top employers.",
  keywords: [
    "candidate profile",
    "job seeker profile",
    "update resume",
    "professional profile",
    "career profile",
    "job preferences",
    "skills management",
  ],
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "My Profile - Update Your Professional Information",
    description: "Manage your professional profile and job preferences",
    type: "profile",
  },
};

export default function CandidateProfilePage() {
  return <ProfilePageClient />;
}
