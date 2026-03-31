import Link from "next/link";

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-5xl text-[#1B2A49] mb-6 text-center">
          What People Say
        </h1>
        
        <p className="font-[family-name:var(--font-roboto)] text-xl text-[#333333] max-w-3xl mx-auto mb-16 text-center">
          Hear from clients and collaborators about their experience working with me.
        </p>
        
        <div className="space-y-8 mb-16">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-2xl p-10 md:p-12 shadow-sm border border-gray-100">
            <div className="flex items-start gap-6">
              <div className="text-[#39A6A3] text-6xl leading-none mt-2">"</div>
              <div className="flex-1">
                <p className="font-[family-name:var(--font-roboto)] text-lg text-[#333333] mb-8 leading-relaxed">
                  Peter is an experienced and skilled data visualiser and developer, with a strong understanding of data science, data visualisation, sport science and football product development. He worked effectively with Premier League performance professionals, soliciting feedback and shaping feature priorities.
                </p>
                <div className="border-t border-gray-200 pt-6">
                  <p className="font-[family-name:var(--font-montserrat)] font-semibold text-lg text-[#1B2A49]">
                    Raf Keustermans
                  </p>
                  <p className="font-[family-name:var(--font-roboto)] text-[#666666] mt-1">
                    CEO, Sportlight Technology Ltd
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white rounded-2xl p-10 md:p-12 shadow-sm border border-gray-100">
            <div className="flex items-start gap-6">
              <div className="text-[#39A6A3] text-6xl leading-none mt-2">"</div>
              <div className="flex-1">
                <p className="font-[family-name:var(--font-roboto)] text-lg text-[#333333] mb-8 leading-relaxed">
              Peter’s session was exceptional — one of the most impactful elements of the programme. He designed an AI-driven simulation on statistical decision-making that let students see the immediate effects of tactical choices and data inputs.
            </p>
                <div className="border-t border-gray-200 pt-6">
                  <p className="font-[family-name:var(--font-montserrat)] font-semibold text-lg text-[#1B2A49]">
                    Yvonne Comer
                  </p>
                  <p className="font-[family-name:var(--font-roboto)] text-[#666666] mt-1">
                    Senior Innovation Catalyst, PorterShed
                  </p>
                  <p className="font-[family-name:var(--font-roboto)] text-[#666666]">
                    Board member, Irish Rugby Football Union
                  </p>
                  <p className="font-[family-name:var(--font-roboto)] text-[#666666]">
                    Board member, Changing Ireland
                  </p>
                  <p className="font-[family-name:var(--font-roboto)] text-[#666666]">
                    Board member, Vision Sports Ireland
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white rounded-2xl p-10 md:p-12 shadow-sm border border-gray-100">
            <div className="flex items-start gap-6">
              <div className="text-[#39A6A3] text-6xl leading-none mt-2">"</div>
              <div className="flex-1">
                <p className="font-[family-name:var(--font-roboto)] text-lg text-[#333333] mb-8 leading-relaxed">
                  Peter significantly raised standards in Mathematics, engaging students who were previously making low levels of progress through his 'Switch Play' project. He had a positive impact on students' self-esteem and confidence."
                </p>
                <div className="border-t border-gray-200 pt-6">
                  <p className="font-[family-name:var(--font-montserrat)] font-semibold text-lg text-[#1B2A49]">
                    Clare Verga
                  </p>
                  <p className="font-[family-name:var(--font-roboto)] text-[#666666] mt-1">
                    Executive Principal, City of London Academy Islington
                  </p>
                </div>
              </div>
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
