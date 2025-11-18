import type { Metadata } from "next";
import PreviewContainer from "./PreviewContainer";

export const metadata: Metadata = {
  title: "Preview Career Page - Page Builder | RecrutPro",
  description:
    "Preview your company's career page before publishing. See how candidates will view your employer brand, culture video, and job opportunities.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewPage() {
  return <PreviewContainer />;
}
