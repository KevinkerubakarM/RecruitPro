import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-24 px-6"
      aria-label="Hero section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <article className="space-y-8">
            <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-sm font-bold text-indigo-700 uppercase tracking-wide shadow-md">
              AI-Powered Recruitment
            </div>
            <h1 className="text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
              Hire Top Talent 10x Faster
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              Connect with pre-screened, verified candidates using AI-powered matching. Transform
              your hiring process and reduce time-to-hire from weeks to days.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 pt-6">
              <Link
                href="/recruiter/home"
                className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-center"
                aria-label="Sign up for recruiter account"
              >
                Start Hiring Now
              </Link>
              <Link
                href="/candidate/home"
                className="px-10 py-5 bg-white text-indigo-600 border-3 border-indigo-600 rounded-3xl font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
                aria-label="Search for job opportunities"
              >
                Find Your Dream Job
              </Link>
            </div>
          </article>
          <aside className="relative" aria-label="Key features">
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
              <ul className="space-y-5 list-none">
                <li className="flex items-center gap-4 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-md">
                  <div
                    className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-extrabold shadow-lg"
                    aria-hidden="true"
                  >
                    AI
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Smart Matching</h3>
                    <p className="text-sm text-gray-600 font-medium">10x faster hiring</p>
                  </div>
                </li>
                <li className="flex items-center gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-md">
                  <div
                    className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg"
                    aria-hidden="true"
                  >
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Verified Candidates</h3>
                    <p className="text-sm text-gray-600 font-medium">Pre-screened talent</p>
                  </div>
                </li>
                <li className="flex items-center gap-4 p-5 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl shadow-md">
                  <div
                    className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg"
                    aria-hidden="true"
                  >
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Instant Connect</h3>
                    <p className="text-sm text-gray-600 font-medium">Real-time communication</p>
                  </div>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
