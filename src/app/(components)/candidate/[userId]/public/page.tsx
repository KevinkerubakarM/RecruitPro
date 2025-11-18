import { Metadata } from "next";
import CandidatePublicProfileClient from "./CandidatePublicProfile";

type Props = {
  params: { userId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = params;

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/candidate/${userId}/profile`,
      { cache: "no-store" }
    );
    const result = await response.json();

    if (result.success && result.data) {
      const profile = result.data;
      const title = `${profile.name} - ${
        profile.isNewToExperience ? "Fresher" : `${profile.yearsOfExperience}+ Years Experience`
      } | Professional Profile`;
      const description = `${profile.name}'s professional profile. ${profile.skills
        ?.slice(0, 5)
        .join(", ")}${profile.location ? ` | Based in ${profile.location}` : ""}${
        profile.availableForWork ? " | Available for work" : ""
      }`;

      return {
        title,
        description,
        keywords: [
          profile.name,
          ...(profile.skills || []),
          ...(profile.lookingForRoles || []),
          "candidate profile",
          "hire talent",
          profile.location,
        ].filter(Boolean),
        openGraph: {
          title,
          description,
          type: "profile",
          url: `/candidate/${userId}/public`,
        },
        twitter: {
          card: "summary",
          title,
          description,
        },
        robots: {
          index: true,
          follow: true,
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    title: "Candidate Profile",
    description: "View candidate professional profile and experience",
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CandidatePublicProfile({ params }: Props) {
  return <CandidatePublicProfileClient userId={params.userId} />;
}
