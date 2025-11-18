import { FeatureCardProps } from "@/types/app/(components)/home/home.type";

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
      <div
        className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-6 shadow-lg"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="text-2xl font-extrabold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-700 leading-relaxed font-medium">{description}</p>
    </article>
  );
}

export default function Features() {
  const features = [
    {
      icon: "🎯",
      title: "Smart Candidate Matching",
      description:
        "AI-powered algorithms match the right candidates to your job openings based on skills, experience, and culture fit.",
    },
    {
      icon: "⚡",
      title: "10x Faster Hiring",
      description:
        "Streamline your recruitment process and reduce time-to-hire from weeks to days with automated workflows.",
    },
    {
      icon: "✓",
      title: "Pre-Screened Talent",
      description:
        "Access a pool of verified candidates who have been thoroughly vetted and background-checked.",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description:
        "Track your hiring metrics, candidate pipeline, and team performance with real-time insights.",
    },
    {
      icon: "💬",
      title: "Seamless Communication",
      description:
        "Built-in messaging, video interviews, and collaboration tools to connect with candidates instantly.",
    },
    {
      icon: "🔒",
      title: "Enterprise Security",
      description:
        "Bank-level security and compliance to protect sensitive candidate and company information.",
    },
  ];

  return (
    <section
      className="w-full bg-gradient-to-br from-gray-50 to-indigo-50 py-24 px-6"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20">
          <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-sm font-bold text-indigo-700 mb-6 uppercase tracking-wide shadow-md">
            Features & Benefits
          </div>
          <h2
            id="features-heading"
            className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8"
          >
            Powerful Features That Transform Recruitment
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            Everything you need to streamline hiring, from AI-powered matching to enterprise
            security. Hire smarter, faster, and better.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
