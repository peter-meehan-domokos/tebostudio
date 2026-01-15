import Link from "next/link";

export default function Explore() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <main className="max-w-7xl mx-auto px-6 py-20">
        <Link 
          href="/"
          className="inline-block font-[family-name:var(--font-roboto)] text-[#39A6A3] hover:text-[#329d9a] mb-8"
        >
          ← Back to Home
        </Link>
        
        <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-5xl text-[#1B2A49] mb-6">
          Explore My Work
        </h1>
        
        <p className="font-[family-name:var(--font-roboto)] text-xl text-[#333333] max-w-3xl mb-12">
          Discover how TEBOs, learning programs, and data visualisations bring complex ideas to life.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/make-sense" className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🧠</div>
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-2xl text-[#1B2A49] mb-3">
              Educational Tools
            </h2>
            <p className="font-[family-name:var(--font-roboto)] text-[#333333]">
              Interactive learning experiences and TEBO programs
            </p>
          </Link>
          
          <Link href="/data-visualisation" className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-2xl text-[#1B2A49] mb-3">
              Data Visualisation
            </h2>
            <p className="font-[family-name:var(--font-roboto)] text-[#333333]">
              Bespoke visualisations and interactive tools
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
