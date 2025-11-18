export default function CTASection() {
  const testimonials = [
    {
      quote:
        "RecrutPro reduced our time-to-hire from 45 days to just 4 days. The AI matching is incredibly accurate.",
      author: "Sarah Chen",
      role: "Head of Talent Acquisition",
      company: "TechCorp",
      avatar: "SC",
    },
    {
      quote:
        "We've hired 50+ engineers in 6 months. The pre-screening feature saves us countless hours.",
      author: "Michael Rodriguez",
      role: "VP of Engineering",
      company: "InnovateLabs",
      avatar: "MR",
    },
    {
      quote:
        "Best recruitment platform we've used. The candidate quality is exceptional and the process is seamless.",
      author: "Emily Watson",
      role: "Talent Director",
      company: "CloudVentures",
      avatar: "EW",
    },
  ];

  return (
    <section
      className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-24 px-6 shadow-2xl"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h2
            id="testimonials-heading"
            className="text-5xl lg:text-6xl font-extrabold text-white mb-6"
          >
            Loved by Recruiters Worldwide
          </h2>
          <p className="text-2xl text-indigo-100 font-medium max-w-3xl mx-auto">
            See what industry leaders say about transforming their hiring process with RecrutPro
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <article
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 bg-gradient-to-br from-white to-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-extrabold text-lg shadow-lg"
                  aria-hidden="true"
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{testimonial.author}</h3>
                  <p className="text-indigo-100 text-sm font-medium">{testimonial.role}</p>
                  <p className="text-indigo-200 text-xs">{testimonial.company}</p>
                </div>
              </div>
              <blockquote className="text-white text-base leading-relaxed font-medium">
                "{testimonial.quote}"
              </blockquote>
              <div className="mt-6 flex gap-1" aria-label="5 star rating">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-white text-lg font-semibold mb-2">
            Join 500+ companies hiring smarter
          </p>
          <p className="text-indigo-100 text-sm">
            Trusted by leading organizations across technology, finance, healthcare, and more
          </p>
        </div>
      </div>
    </section>
  );
}
