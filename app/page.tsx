import Image from "next/image";
import Link from "next/link";
import Birds from "./components/visualisations/birds-visual";

export default function Home() {

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Hero / Header Section */}
      <section className="bg-white py-20 px-6 md:py-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-5xl md:text-6xl text-[#1B2A49] mb-6 leading-tight">
              Making sense of a complex world
            </h1>
            <p className="font-[family-name:var(--font-roboto)] text-lg text-[#333333] mb-8">
              Welcome to my studio, where I design and build data visualisations, and sense-making experiences supported by interactive tools — called TEBOs. For work and education.
            </p>
            <Link
              href="/projects"
              className="inline-block bg-[#FFB84D] hover:bg-[#f5ab3d] text-[#1B2A49] font-[family-name:var(--font-montserrat)] font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
            >
              Explore my work
            </Link>
            <p className="font-[family-name:var(--font-roboto)] text-sm text-[#333333] mt-4">
              Discover how to bring complex ideas and data to life across a variety of fields.
            </p>
          </div>
          <div className="rounded-2xl aspect-video overflow-visible">
            <Birds />
          </div>
        </div>
      </section>

      {/* Portfolio / Case Studies Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-4xl text-[#1B2A49] mb-12 text-center">
            Featured Projects
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Project Card 1 */}
            <Link 
              href="/projects/perfectsquare"
              className="bg-[#F9F9F9] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
            >
              <div className="bg-gradient-to-br from-[#1B2A49] to-[#39A6A3] aspect-video flex items-center justify-center">
              </div>
              <div className="p-6 border-l-4 border-[#39A6A3]">
                <h3 className="font-[family-name:var(--font-montserrat)] font-semibold text-xl text-[#1B2A49] mb-2">
                  Perfect Square
                </h3>
                <p className="font-[family-name:var(--font-roboto)] text-sm text-[#333333]">
                  Novel multivariate dataviz tool for comparing thousands of n-dimensional vectors against an "ideal" state
                </p>
              </div>
            </Link>

            {/* Project Card 2 */}
            <Link 
              href="/projects/strategysim"
              className="bg-[#F9F9F9] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
            >
              <div className="bg-gradient-to-br from-[#39A6A3] to-[#1B2A49] aspect-video flex items-center justify-center">
              </div>
              <div className="p-6 border-l-4 border-[#39A6A3]">
                <h3 className="font-[family-name:var(--font-montserrat)] font-semibold text-xl text-[#1B2A49] mb-2">
                  Strategy Sim
                </h3>
                <p className="font-[family-name:var(--font-roboto)] text-sm text-[#333333]">
                  Learning tool combining a classroom football game with personalised strategy simulation and clustering of results
                </p>
              </div>
            </Link>

            {/* Project Card 3 */}
            <Link 
              href="/projects/therace"
              className="bg-[#F9F9F9] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
            >
              <div className="bg-gradient-to-br from-[#FFB84D] to-[#FF6F61] aspect-video flex items-center justify-center">
              </div>
              <div className="p-6 border-l-4 border-[#FFB84D]">
                <h3 className="font-[family-name:var(--font-montserrat)] font-semibold text-xl text-[#1B2A49] mb-2">
                  The Race
                </h3>
                <p className="font-[family-name:var(--font-roboto)] text-sm text-[#333333]">
                  Engaging and insightful way to depict cumulative time-series data for comparative purposes
                </p>
              </div>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {/* <Link
              href="/projects"
              className="inline-block bg-[#FFB84D] hover:bg-[#f5ab3d] text-[#1B2A49] font-[family-name:var(--font-montserrat)] font-semibold px-8 py-4 rounded-lg transition-colors text-center"
            >
              View all projects →
            </Link> */}
            <Link
              href="/contact"
              className="inline-block bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-semibold px-8 py-4 rounded-lg transition-colors text-center"
            >
              Get in touch →
            </Link>
          </div>
          {/* <p className="font-[family-name:var(--font-roboto)] text-sm text-[#333333] mt-6 text-center max-w-2xl mx-auto">
            Browse data visualisations, TEBOs, and sense-making experiences across a variety of fields. Start a conversation about a program, custom tool, or data project — I'd love to collaborate.
          </p> */}
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="relative w-full h-[600px] overflow-hidden">
        <Image
          src="/me_hero_desktop.jpg"
          alt="Peter Meehan-Domokos"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay on left side */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B2A49]/75 via-[#1B2A49]/40 to-transparent md:via-[#1B2A49]/30 md:to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-xl">
              <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-4xl md:text-5xl text-white mb-4 drop-shadow-lg">
                Hi, I'm Peter
              </h2>
              <p className="font-[family-name:var(--font-roboto)] text-lg md:text-xl text-white/95 mb-6 leading-relaxed drop-shadow-md">
                I work with software teams across multiple sectors to turn complex data into clear, explorable interfaces — from high-quality core charts to bespoke visual systems. My work bridges analytics, technology and learning, grounded in strong information design, interaction design, and data literacy.
              </p>
              <Link
                href="/about"
                className="inline-block bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
              >
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two Pillars Section */}
      <section className="py-20 px-6" style={{ display: 'none' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Left Column - Data Visualisation */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-3xl text-[#1B2A49] mb-4">
              Data Visualisation & Applied Tools
            </h2>
            <p className="font-[family-name:var(--font-roboto)] text-[#333333] mb-8 leading-relaxed">
              I design and build bespoke data visualisations and interactive tools for organisations and software teams, and advise on data visualisation, including frontend design, interactivity, and reusable tools. I have particular experience in football, data platforms, and other domains.
            </p>
            
            <div className="space-y-6">
              <div>
                <Link
                  href="/data-visualisation/services"
                  className="inline-block bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 rounded-lg transition-colors w-full text-center md:w-auto"
                >
                  See Data Visualisation Services →
                </Link>
                <p className="font-[family-name:var(--font-roboto)] text-sm text-[#333333] mt-3">
                  Bespoke visualisations and interactive tools, plus guidance on frontend design, dataviz patterns, and reusable components.
                </p>
              </div>

              <div>
                <Link
                  href="/data-visualisation/football"
                  className="inline-block bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 rounded-lg transition-colors w-full text-center md:w-auto"
                >
                  Explore Data Tools →
                </Link>
                <p className="font-[family-name:var(--font-roboto)] text-sm text-[#333333] mt-3">
                  Examples of my work in football analytics and data platforms, showing how data insights can drive real-world outcomes.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Educational Tools */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">🧠</div>
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-3xl text-[#1B2A49] mb-4">
              Educational Tools & Programmes
            </h2>
            <p className="font-[family-name:var(--font-roboto)] text-[#333333] mb-8 leading-relaxed">
              I design practical sense-making experiences using visual and interactive tools that help people build understanding, confidence, and agency. This includes programmes like Make Sense and Switchplay, and technology-enhanced boundary objects (TEBOs) that make complex ideas tangible and explorable.
            </p>
            
            <div className="space-y-6">
              <div>
                <Link
                  href="/learning/make-sense"
                  className="inline-block bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 rounded-lg transition-colors w-full text-center md:w-auto"
                >
                  Discover Make Sense →
                </Link>
                <p className="font-[family-name:var(--font-roboto)] text-sm text-[#333333] mt-3">
                  Interactive programmes that help young people explore complex ideas and build confidence in learning.
                </p>
              </div>

              <div>
                <Link
                  href="/learning/switchplay"
                  className="inline-block bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 rounded-lg transition-colors w-full text-center md:w-auto"
                >
                  Explore Switchplay →
                </Link>
                <p className="font-[family-name:var(--font-roboto)] text-sm text-[#333333] mt-3">
                  Football-focused TEBO programs that combine practical skills with conceptual understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What People Say Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-4xl text-[#1B2A49] mb-12 text-center">
            What People Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#F9F9F9] rounded-xl p-8 shadow-sm border border-gray-100">
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
            <div className="bg-[#F9F9F9] rounded-xl p-8 shadow-sm border border-gray-100">
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
            <div className="bg-[#F9F9F9] rounded-xl p-8 shadow-sm border border-gray-100">
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
        </div>
      </section>

      {/* Footer / Contact Section */}
      <footer className="bg-[#1B2A49] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-8">
            <div>
              <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-3xl mb-4">
                Let's collaborate
              </h2>
              <p className="font-[family-name:var(--font-roboto)] text-lg opacity-90">
                Want to collaborate, book a program, or explore a data project? Get in touch.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-block bg-[#FFB84D] hover:bg-[#f5ab3d] text-[#1B2A49] font-[family-name:var(--font-montserrat)] font-semibold px-8 py-4 rounded-lg transition-colors text-center"
              >
                Contact Me
              </Link>
              <a
                href="https://github.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-semibold px-8 py-4 rounded-lg transition-colors text-center"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Visit My GitHub
              </a>
              <Link
                href="/newsletter"
                className="inline-block bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-semibold px-8 py-4 rounded-lg transition-colors text-center"
                style={{ display: 'none' }}
              >
                Subscribe to Newsletter
              </Link>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8">
            <p className="font-[family-name:var(--font-roboto)] text-sm opacity-80 text-center">
              Questions, collaboration ideas, or inquiries about programs and visualisations? Let's connect.
            </p>
            <p className="font-[family-name:var(--font-roboto)] text-sm opacity-60 text-center mt-4">
              © {new Date().getFullYear()} TEBO Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
