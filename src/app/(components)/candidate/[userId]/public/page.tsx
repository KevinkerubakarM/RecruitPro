import { Metadata } from "next";
import CandidatePublicProfileClient from "./CandidatePublicProfile";
import { primsaService } from "@/services/prisma.service";

type Props = {
  params: Promise<{ userId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;

  try {
    await primsaService.initialize();
    const prisma = primsaService.getClient();

    const candidateProfile = await prisma.candidateProfile.findFirst({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            phone: true,
            createdAt: true,
          },
        },
      },
    });

    if (candidateProfile) {
      const profile = {
        name: candidateProfile.user.name,
        isNewToExperience: candidateProfile.isNewToExperience,
        yearsOfExperience: candidateProfile.yearsOfExperience,
        skills: candidateProfile.skills,
        location: candidateProfile.location,
        availableForWork: candidateProfile.availableForWork,
        lookingForRoles: candidateProfile.lookingForRoles,
      };
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

export default async function CandidatePublicProfile({ params }: Props) {
  const { userId } = await params;
  return <CandidatePublicProfileClient userId={userId} />;
}
