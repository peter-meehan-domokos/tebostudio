import Link from "next/link";
import Image from "next/image";

export default function Projects() {
  const projects = [
    {
      id: "perfectsquare",
      title: "Perfect Square",
      subtitle: "Multivariate Data Comparison & Grouping Tool",
      description1: "The Perfect Square visualises high-dimensional data as a square that fills toward an ideal target state. Compare thousands of profiles at a glance, then zoom in for detailed KPIs. Useful for rehabilitation monitoring, recruitment profiling, and seeing vector similarity for LLM tokens.",
      description2: "Built with React, TypeScript, D3, and Next, with data fetched via GraphQL from a Node server (with Python analytics). Performance is optimised in SVG (no canvas) using semantic zoom, virtualised rendering, and D3’s enter–update–exit pattern for efficient updates at scale.",
      imagePlaceholder: "from-[#1B2A49] to-[#39A6A3]",      imageSrc: "/projects/perfect-square.png",    },
    {
      id: "strategysim",
      title: "Strategy Sim",
      subtitle: "AI Sports Strategy Learning Tool (Prototype)",
      description1: "StrategySim is a protoype for a simulation game for young people who play sport to explore strategy through intuition and AI. Players test tactics in a real-world target challenge, then simulate them repeatedly to see what performs best—making sports data science competitive, tangible, and easy to discuss.",
      description2: "The platform integrates real-time strategy simulation, results clustering, and comparative visualization to help learners understand the relationship between tactical decisions and outcomes. Designed for both individual exploration and classroom discussion.",
      imagePlaceholder: "from-[#39A6A3] to-[#1B2A49]",
      imageSrc: "/projects/strategy-sim.png",
    },
    {
      id: "therace",
      title: "The Race",
      subtitle: "Animated KPI Race Replay",
      description1: "The Race turns post-match KPIs into a fast animated 'race replay'. As match time advances, cumulative performance changes are felt through overtakes and leads—making improvements and drop-offs obvious. It's a fun, emotional format for reflection and post-match discussion.",
      description2: "Particularly effective for tracking progress over time across multiple entities, this visualization style combines clear visual hierarchy with interactive controls, allowing users to explore data at different temporal scales and compare key metrics dynamically.",
      imagePlaceholder: "from-[#FFB84D] to-[#FF6F61]",
      imageSrc: "/projects/the-race.png",
    },
    {
      id: "placeholder",
      title: "Project Name",
      subtitle: "Brief Project Category or Type",
      description1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      description2: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
      imagePlaceholder: "from-[#333333] to-[#666666]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Title */}
        <div className="mb-16">
          <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-5xl text-[#1B2A49] mb-4">
            Projects
          </h1>
          <p className="font-[family-name:var(--font-roboto)] text-xl text-[#333333] max-w-3xl mb-3">
            Browse data visualisations, TEBOs, and sense-making experiences.
          </p>
          <p className="font-[family-name:var(--font-roboto)] text-base text-[#333333] max-w-3xl">
            These are from my work in the football/education industries — I've also worked across other sectors, but those projects aren't currently accessible for public sharing. More examples will be available soon, or get in touch if you'd like to see more.
          </p>
        </div>
        
        {/* Vertical Gallery */}
        <div className="space-y-12">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              style={index === 3 ? { display: 'none' } : {}}
            >
              {/* Image Section - Laptop aspect ratio */}
              {project.id !== "placeholder" ? (
                <Link href={`/projects/${project.id}`}>
                  <div className="relative cursor-pointer" style={{ aspectRatio: '16/10' }}>
                    {project.imageSrc ? (
                      <Image
                        src={project.imageSrc}
                        alt={`${project.title} Project`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className={`bg-gradient-to-br ${project.imagePlaceholder} flex items-center justify-center w-full h-full`}>
                        <div className="text-white/20 font-[family-name:var(--font-montserrat)] text-2xl">
                          [Image Placeholder]
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ) : (
                <div className={`bg-gradient-to-br ${project.imagePlaceholder} flex items-center justify-center`} style={{ aspectRatio: '16/10' }}>
                  <div className="text-white/20 font-[family-name:var(--font-montserrat)] text-2xl">
                    [Image Placeholder]
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div className="p-12">
                <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-4xl text-[#1B2A49] mb-3">
                  {project.title}
                </h2>
                <p className="font-[family-name:var(--font-montserrat)] font-medium text-lg text-[#39A6A3] mb-6">
                  {project.subtitle}
                </p>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <p className="font-[family-name:var(--font-roboto)] text-base text-[#333333] leading-relaxed">
                    {project.description1}
                  </p>
                  <p className="font-[family-name:var(--font-roboto)] text-base text-[#333333] leading-relaxed">
                    {project.description2}
                  </p>
                </div>
                {project.id !== "placeholder" && (
                  <a
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-2 text-[#39A6A3] hover:text-[#329d9a] font-[family-name:var(--font-montserrat)] font-semibold transition-colors"
                  >
                    Open Project
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
