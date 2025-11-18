export default function TrustedBy() {
  const companies = [
    "TechCorp",
    "InnovateLabs",
    "DataSystems",
    "CloudVentures",
    "DevSolutions",
    "StartupHub",
    "EnterpriseAI",
    "FutureWorks",
  ];

  return (
    <section className="w-full bg-white py-16 px-6" aria-labelledby="trusted-by-heading">
      <div className="max-w-7xl mx-auto">
        <h2
          id="trusted-by-heading"
          className="text-center text-2xl font-semibold text-gray-800 mb-12"
        >
          Trusted by 500+ Companies Worldwide
        </h2>
        <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center list-none">
          {companies.map((company, index) => (
            <li
              key={index}
              className="flex items-center justify-center text-gray-600 font-medium text-sm hover:text-purple-600 transition-colors"
            >
              {company}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
