import Link from "next/link";

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <main className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-5xl text-[#1B2A49] mb-6 text-center">
          What People Say
        </h1>
        
        <p className="font-[family-name:var(--font-roboto)] text-xl text-[#333333] max-w-3xl mx-auto mb-12 text-center">
          Hear from clients and collaborators about their experience working with me.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="text-[#39A6A3] text-5xl mb-4">"</div>
            <p className="font-[family-name:var(--font-roboto)] text-[#333333] mb-6 leading-relaxed">
              Working with Peter transformed how our team approaches data visualization. His ability to turn complex datasets into clear, actionable insights has been invaluable to our decision-making process.
            </p>
            <div className="border-t border-gray-200 pt-4">
              <p className="font-[family-name:var(--font-montserrat)] font-semibold text-[#1B2A49]">
                Sarah Mitchell
              </p>
              <p className="font-[family-name:var(--font-roboto)] text-sm text-[#666666]">
                Head of Analytics, Tech Solutions Ltd
              </p>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="text-[#39A6A3] text-5xl mb-4">"</div>
            <p className="font-[family-name:var(--font-roboto)] text-[#333333] mb-6 leading-relaxed">
              The interactive tools Peter developed for our platform exceeded all expectations. Not only are they visually stunning, but they've dramatically improved how our users engage with and understand their data.
            </p>
            <div className="border-t border-gray-200 pt-4">
              <p className="font-[family-name:var(--font-montserrat)] font-semibold text-[#1B2A49]">
                James Chen
              </p>
              <p className="font-[family-name:var(--font-roboto)] text-sm text-[#666666]">
                Product Director, DataFlow Systems
              </p>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="text-[#39A6A3] text-5xl mb-4">"</div>
            <p className="font-[family-name:var(--font-roboto)] text-[#333333] mb-6 leading-relaxed">
              Peter's expertise in both technical implementation and educational design is unique. The learning tools he created have helped countless students build genuine confidence in working with complex concepts.
            </p>
            <div className="border-t border-gray-200 pt-4">
              <p className="font-[family-name:var(--font-montserrat)] font-semibold text-[#1B2A49]">
                Dr. Emily Roberts
              </p>
              <p className="font-[family-name:var(--font-roboto)] text-sm text-[#666666]">
                Director of Learning Innovation, EdTech Academy
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-block bg-[#FFB84D] hover:bg-[#f5ab3d] text-[#1B2A49] font-[family-name:var(--font-montserrat)] font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Get in Touch →
          </Link>
        </div>
      </main>
    </div>
  );
}
