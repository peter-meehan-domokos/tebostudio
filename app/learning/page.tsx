import Link from "next/link";

export default function Learning() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <main className="max-w-7xl mx-auto px-6 py-20">
        <Link 
          href="/"
          className="inline-block font-[family-name:var(--font-roboto)] text-[#39A6A3] hover:text-[#329d9a] mb-8"
        >
          ← Back to Home
        </Link>
        
        <div className="text-4xl mb-6">🧠</div>
        <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-5xl text-[#1B2A49] mb-6">
          Educational Tools & Programmes
        </h1>
        
        <p className="font-[family-name:var(--font-roboto)] text-xl text-[#333333] max-w-3xl mb-12">
          I design practical sense-making experiences that help young people explore complex ideas, build confidence, and develop genuine understanding through interactive TEBOs and structured programmes.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Make Sense Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-2xl text-[#1B2A49] mb-4">
              Make Sense
            </h2>
            <p className="font-[family-name:var(--font-roboto)] text-[#333333] mb-6 leading-relaxed">
              Interactive programmes that help young people explore complex ideas and build confidence in learning.
            </p>
            <Link
              href="/learning/make-sense"
              className="inline-block bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Discover Make Sense →
            </Link>
          </div>

          {/* Switchplay Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-2xl text-[#1B2A49] mb-4">
              Switchplay
            </h2>
            <p className="font-[family-name:var(--font-roboto)] text-[#333333] mb-6 leading-relaxed">
              Football-focused TEBO programs that combine practical skills with conceptual understanding.
            </p>
            <Link
              href="/learning/switchplay"
              className="inline-block bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Explore Switchplay →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
