import type { Metadata } from "next";
import CompanyEditContainer from "./CompanyEditContainer";

export const metadata: Metadata = {
  title: "Edit Company Career Page - Career Page Builder | RecrutPro",
  description:
    "Customize and build your company's career page with our intuitive page builder. Upload brand assets, customize themes, and create engaging content sections to attract top talent.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CompanyEditPage() {
  return <CompanyEditContainer />;
}
