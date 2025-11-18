import { StatsItemProps } from "@/types/app/(components)/home/home.type";

function StatsItem({ value, label }: StatsItemProps) {
  return (
    <article className="text-center">
      <div className="text-5xl font-bold text-purple-600 mb-2">{value}</div>
      <div className="text-gray-700 font-medium">{label}</div>
    </article>
  );
}

export default function Stats() {
  const stats = [
    { value: "10x", label: "Faster Hiring" },
    { value: "95%", label: "Match Accuracy" },
    { value: "500+", label: "Companies Trust Us" },
    { value: "50K+", label: "Candidates Hired" },
  ];

  return (
    <section
      className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-20 px-6 shadow-2xl"
      aria-label="Platform statistics and achievements"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center transform hover:scale-110 transition-transform duration-300"
            >
              <div className="text-6xl font-extrabold text-white mb-3">{stat.value}</div>
              <div className="text-indigo-100 font-bold text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
