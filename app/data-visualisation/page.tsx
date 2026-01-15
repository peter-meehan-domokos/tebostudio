import Link from "next/link";

export default function DataVisualisation() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <main className="max-w-7xl mx-auto px-6 py-20">
        <Link 
          href="/"
          className="inline-block font-[family-name:var(--font-roboto)] text-[#39A6A3] hover:text-[#329d9a] mb-8"
        >
          ← Back to Home
        </Link>
        
        <div className="text-4xl mb-6">📊</div>
        <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-5xl text-[#1B2A49] mb-6">
          Data Visualisation & Applied Tools
        </h1>
        
        <p className="font-[family-name:var(--font-roboto)] text-xl text-[#333333] max-w-3xl mb-12">
          I design and build bespoke data visualisations and interactive tools that transform complex datasets into clear, actionable insights for education, sport, and technology sectors.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Services Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-2xl text-[#1B2A49] mb-4">
              Data Visualisation Services
            </h2>
            <p className="font-[family-name:var(--font-roboto)] text-[#333333] mb-6 leading-relaxed">
              Bespoke visualisations and interactive tools, plus guidance on frontend design, dataviz patterns, and reusable components.
            </p>
            <Link
              href="/data-visualisation/services"
              className="inline-block bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              See Services →
            </Link>
          </div>

          {/* Football & Data Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-2xl text-[#1B2A49] mb-4">
              Football & Data Tools
            </h2>
            <p className="font-[family-name:var(--font-roboto)] text-[#333333] mb-6 leading-relaxed">
              Examples of my work in football analytics and data platforms, showing how data insights can drive real-world outcomes.
            </p>
            <Link
              href="/data-visualisation/football"
              className="inline-block bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Explore Football Tools →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
