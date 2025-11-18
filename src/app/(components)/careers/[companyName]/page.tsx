import type { Metadata } from "next";
import CareerPageContainer from "./CareerPageContainer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ companyName: string }>;
}): Promise<Metadata> {
  const { companyName: companySlug } = await params;
  const companyName = decodeURIComponent(companySlug)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `Careers at ${companyName} - Join Our Team | RecrutPro`,
    description: `Explore exciting career opportunities at ${companyName}. View open positions, learn about our company culture, benefits, and apply to join our talented team.`,
    openGraph: {
      title: `Careers at ${companyName} - Join Our Team`,
      description: `Discover career opportunities and join the ${companyName} team. View open positions and company culture.`,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ViewCareerPage() {
  return <CareerPageContainer />;
}
