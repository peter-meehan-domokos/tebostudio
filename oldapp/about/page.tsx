"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

type SectionId = "overview" | "tebos" | "work" | "method" | "story";

const SCROLL_OFFSET = 100;
const SCROLL_THRESHOLD = 0.5;

function scrollToSection(sectionId: SectionId): void {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - SCROLL_OFFSET;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

function getActiveSection(sections: SectionId[]): SectionId {
  const scrollPosition = window.scrollY + window.innerHeight * SCROLL_THRESHOLD;

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = document.getElementById(sections[i]);
    if (section && section.offsetTop <= scrollPosition) {
      return sections[i];
    }
  }

  return sections[0];
}

export default function About() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const sections: SectionId[] = ["overview", "tebos", "work", "method", "story"];

  const handleScroll = useCallback(() => {
    const newActiveSection = getActiveSection(sections);
    setActiveSection(newActiveSection);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleTabClick = (sectionId: SectionId): void => {
    scrollToSection(sectionId);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <main className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-5xl text-[#1B2A49] mb-12 text-center">
          About
        </h1>

        {/* Tab Navigation */}
        <div className="md:sticky top-0 z-10 bg-[#F9F9F9] pb-4 -mx-6 px-6">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:border-b border-gray-200 md:justify-center">
            <button
              onClick={() => handleTabClick("overview")}
              className={`font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 transition-all rounded-lg md:rounded-none ${
                activeSection === "overview"
                  ? "text-[#39A6A3] bg-[#39A6A3]/10 md:bg-transparent md:border-b-2 border-[#39A6A3]"
                  : "text-[#333333] hover:text-[#39A6A3] hover:bg-gray-100 md:hover:bg-transparent"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleTabClick("tebos")}
              className={`font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 transition-all rounded-lg md:rounded-none ${
                activeSection === "tebos"
                  ? "text-[#39A6A3] bg-[#39A6A3]/10 md:bg-transparent md:border-b-2 border-[#39A6A3]"
                  : "text-[#333333] hover:text-[#39A6A3] hover:bg-gray-100 md:hover:bg-transparent"
              }`}
            >
              TEBOs
            </button>
            <button
              onClick={() => handleTabClick("work")}
              className={`font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 transition-all rounded-lg md:rounded-none ${
                activeSection === "work"
                  ? "text-[#39A6A3] bg-[#39A6A3]/10 md:bg-transparent md:border-b-2 border-[#39A6A3]"
                  : "text-[#333333] hover:text-[#39A6A3] hover:bg-gray-100 md:hover:bg-transparent"
              }`}
            >
              Work
            </button>
            <button
              onClick={() => handleTabClick("method")}
              className={`font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 transition-all rounded-lg md:rounded-none ${
                activeSection === "method"
                  ? "text-[#39A6A3] bg-[#39A6A3]/10 md:bg-transparent md:border-b-2 border-[#39A6A3]"
                  : "text-[#333333] hover:text-[#39A6A3] hover:bg-gray-100 md:hover:bg-transparent"
              }`}
              style={{ display: "none" }}
            >
              Method
            </button>
            <button
              onClick={() => handleTabClick("story")}
              className={`font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 transition-all rounded-lg md:rounded-none ${
                activeSection === "story"
                  ? "text-[#39A6A3] bg-[#39A6A3]/10 md:bg-transparent md:border-b-2 border-[#39A6A3]"
                  : "text-[#333333] hover:text-[#39A6A3] hover:bg-gray-100 md:hover:bg-transparent"
              }`}
            >
              Story
            </button>
          </div>
        </div>

        {/* Scrollable Content - All Sections Visible */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
          {/* Overview Section */}
          <section id="overview" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-3xl text-[#1B2A49] mb-6">
              What is TEBO Studio?
            </h2>
            <div className="space-y-4 font-[family-name:var(--font-roboto)] text-[#333333] leading-relaxed">
              <p>
                TEBO Studio is my design-and-build practice for data visualisation and interactive tools.
              </p>
              <p>
                I turn complex data into clear, explorable interfaces — from high-quality core charts to bespoke visual systems and interactions when off-the-shelf approaches aren't enough.
              </p>
              <p>
                My background combines frontend engineering (D3/TypeScript/React) with deep strengths in the foundations of data visualisation: information design, UX, visual science, data flow, data literacy & maths education — all focused on helping people understand what the data is really saying.
              </p>
              <p>
                Alongside product work, TEBO Studio also includes learning-focused tools and experiences, where interactivity becomes a way to develop insight, confidence, and agency.
              </p>

              {/* Jump Links */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="font-[family-name:var(--font-montserrat)] font-semibold text-[#1B2A49] mb-4">
                  Jump to what matters most:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleTabClick("work")}
                    className="inline-flex items-center justify-center bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    For tech teams → Work
                  </button>
                  <button
                    onClick={() => handleTabClick("tebos")}
                    className="inline-flex items-center justify-center bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    For EdTech / learning tools → TEBOs
                  </button>
                  <button
                    onClick={() => handleTabClick("story")}
                    className="inline-flex items-center justify-center bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    My background → Story
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* TEBOs Section */}
          <section id="tebos" className="scroll-mt-24 mt-16">
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-3xl text-[#1B2A49] mb-6">
              What are TEBOs?
            </h2>
            <div className="space-y-4 font-[family-name:var(--font-roboto)] text-[#333333] leading-relaxed">
              <p>
                TEBO stands for <strong>Technology-Enhanced Boundary Object</strong> — a term introduced by Celia Hoyles, Richard Noss, and colleagues at the UCL Institute of Education.
              </p>
              <p>
                A boundary object is something that helps people coordinate understanding across different perspectives — especially when they don't share the same background or language. In practice, this means a boundary object can help someone move between fields: for example, helping a non-specialist engage meaningfully with data, models, or technical reasoning without needing to become an expert in data science.
              </p>
              <p>
                A TEBO is a boundary object with interactivity: a tool you can explore, manipulate, and learn from. It supports interdisciplinary collaboration by making ideas relatable across roles — so people can question, test, and reason, rather than simply accept what a chart or an expert tells them.
              </p>
              <p>
                In TEBO Studio, TEBOs bridge the gap between:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>data and meaning</li>
                <li>intuition and analysis</li>
                <li>domain knowledge and technical modelling</li>
              </ul>
              <p>
                Some TEBOs look like visualisations. Some look like simulations. Some look like learning tools. What they share is this: they turn abstract or hidden structure into something people can interact with — and therefore reason about.
              </p>
              <p>
                The idea connects to sociocultural theories of learning and development: understanding is built through tools, structures, and shared activity.
              </p>

              {/* Subsection */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="font-[family-name:var(--font-montserrat)] font-semibold text-2xl text-[#1B2A49] mb-4">
                  Why This Matters in Tech Teams
                </h3>
                <div className="space-y-4">
                  <p>
                    Modern products are increasingly data-driven — but most teams still rely on a small number of specialists to interpret complex data. In reality, most data interfaces already function as boundary objects: they're the place where domain knowledge, technical modelling, and decision-making meet.
                  </p>
                  <p>
                    Treating these interfaces as TEBOs focuses design on helping non-specialists reason with, challenge, and use data with confidence.
                  </p>
                  <p>
                    Just as importantly, data visualisation is a specialist craft. Teams often iterate and gather feedback — but dataviz requires a particular lens: knowing what questions to ask, what misconceptions to watch for, and how to tell whether a chart is supporting clear reasoning (or quietly misleading people). Without that specialist focus, issues like unclear encodings, hidden assumptions, or misleading scales can go unchallenged and reduce trust and insight.
                  </p>
                  <p>
                    Thinking in TEBO terms — and designing with strong visual science, interaction design, and data literacy — elevates data features from "graphs on a page" into tools that help people think. The result is clearer decision-making, fewer "black boxes", and stronger collaboration.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Work Section */}
          <section id="work" className="scroll-mt-24 mt-16">
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-3xl text-[#1B2A49] mb-6">
              What I Make
            </h2>
            <div className="space-y-4 font-[family-name:var(--font-roboto)] text-[#333333] leading-relaxed">
              <h3 className="font-[family-name:var(--font-montserrat)] font-semibold text-2xl text-[#1B2A49] mt-8 mb-4">
                Data visualisation & applied tools
              </h3>
              <p>
                I design and build bespoke data visualisations and interactive UI components for organisations and software teams — especially where data is complex, high-dimensional, or difficult to interpret with off-the-shelf charts.
              </p>
              <p>This includes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>core charting done properly (clarity, trust, interpretability — not just "charts on a page")</li>
                <li>custom interaction patterns for exploration and "what-if" reasoning</li>
                <li>frontend dataviz architecture: reusable components, clean data-flow, performance</li>
                <li>consultancy on information design and visual decision-making (what to show, how to show it, and why)</li>
              </ul>
              <p>
                I'm comfortable working end-to-end on data-driven features — including the underlying analysis — and collaborating closely with data/backend teams when a visualisation depends on definitions, transformations, or pipeline behaviour. I also work upstream of implementation: clarifying goals with domain experts, surfacing assumptions, and shaping the right visual + interaction model iteratively. Dataviz often succeeds or fails at this stage, and I bring a specialist lens to requirements discovery — ensuring the user's purpose is supported.
              </p>
              <p>
                Typical stack: TypeScript, React, D3.js, SVG/Canvas/WebGL, Python/SQL (as needed), with close attention to maintainable code and scalable patterns. I'm comfortable with most chart, geoviz, and data libraries.
              </p>

              <h3 className="font-[family-name:var(--font-montserrat)] font-semibold text-2xl text-[#1B2A49] mt-10 mb-4">
                Learning tools & programmes
              </h3>
              <p>
                Alongside product work, I also design learning tools and programmes that build understanding, confidence, and agency.
              </p>
              <p>Current programmes include:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Make Sense</strong> — practical, technology-supported sense-making for young people in alternative and non-traditional learning settings</li>
                <li><strong>Switchplay</strong> — football-based data + maths programme combining real activity with simulation and analysis</li>
              </ul>
              <p>
                These tools and experiences are designed to work in real settings: not just "edtech content", but robust interactive tools and activities that support facilitators and learners.
              </p>
            </div>
          </section>

          {/* Method Section */}
          <section id="method" className="scroll-mt-24 mt-16" style={{ display: "none" }}>
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-3xl text-[#1B2A49] mb-6">
              Why it Works
            </h2>
            <div className="space-y-4 font-[family-name:var(--font-roboto)] text-[#333333] leading-relaxed">
              <h3 className="font-[family-name:var(--font-montserrat)] font-semibold text-2xl text-[#1B2A49] mb-4">
                How I approach design + build
              </h3>
              <p>
                My work sits at the boundary between engineering, design, and sense-making. That means I'm not just implementing charts — I'm shaping how a system becomes understandable through interaction.
              </p>
              <p>A few principles I work by:</p>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-[family-name:var(--font-montserrat)] font-semibold text-lg text-[#1B2A49] mb-2">
                    1) Clarity is engineered
                  </h4>
                  <p>
                    Good dataviz isn't just a graphic choice — it's a system of decisions: visual encoding, interaction design, defaults, hierarchy, and progressive disclosure.
                  </p>
                </div>

                <div>
                  <h4 className="font-[family-name:var(--font-montserrat)] font-semibold text-lg text-[#1B2A49] mb-2">
                    2) Data visualisation is a user interface problem
                  </h4>
                  <p>
                    Most failures in dataviz aren't "wrong maths" — they're UX failures: misleading comparisons, unclear intent, hidden assumptions, and interaction that doesn't support reasoning.
                  </p>
                </div>

                <div>
                  <h4 className="font-[family-name:var(--font-montserrat)] font-semibold text-lg text-[#1B2A49] mb-2">
                    3) Separate data preparation from visual rendering
                  </h4>
                  <p>
                    I design frontend data flows so the same underlying patterns can power multiple views — which improves maintainability and makes teams faster over time.
                  </p>
                </div>

                <div>
                  <h4 className="font-[family-name:var(--font-montserrat)] font-semibold text-lg text-[#1B2A49] mb-2">
                    4) Tools should support agency
                  </h4>
                  <p>
                    The goal isn't to impress users — it's to help them ask better questions, test assumptions, and understand what's really going on.
                  </p>
                </div>

                <div>
                  <h4 className="font-[family-name:var(--font-montserrat)] font-semibold text-lg text-[#1B2A49] mb-2">
                    5) Build with feedback, but with the right lens
                  </h4>
                  <p>
                    Teams iterate, but dataviz requires specialist attention: observing how people interpret visuals, where misconceptions appear, and what users don't realise they're misunderstanding.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section id="story" className="scroll-mt-24 mt-16">
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-3xl text-[#1B2A49] mb-6">
              My Story
            </h2>
            <div className="space-y-4 font-[family-name:var(--font-roboto)] text-[#333333] leading-relaxed">
              <h3 className="font-[family-name:var(--font-montserrat)] font-semibold text-2xl text-[#1B2A49] mb-4">
                Why TEBO Studio exists
              </h3>
              <p>
                I didn't come into software through a typical path.
              </p>
              <p>
                I spent many years as a mathematics teacher, where I became obsessed with a practical question:
                why do some approaches empower people — and others shut them down?
              </p>
              <p>Teaching gave me a deep foundation in:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>communication and explanation</li>
                <li>misconceptions and mental models</li>
                <li>data literacy and statistical intuition</li>
                <li>how people actually interpret graphs and abstractions</li>
              </ul>
              <p>
                Later, I moved into software, completed an MSc in learning technologies and computer science, and retrained as a programmer. I began building interactive tools not just as "interfaces", but as ways of thinking.
              </p>
              <p>
                Since then, I've worked as a frontend and data visualisation engineer and also built founder-led work — notably Switchplay, a football data platform. Across domains (sport, public transport, analytics platforms), the common thread has stayed the same:
              </p>
              <p className="font-semibold">
                building interactive tools that help people make sense of complex systems — and act with agency.
              </p>
              <p>
                Over time, the tools have changed — from whiteboards to code, from lessons to interfaces — but the thread has stayed the same. In many ways, TEBO Studio is about the tension between change and constancy: how systems evolve over time, and the stable patterns that enable sense-making.
              </p>

              {/* Photo Card */}
              <div className="mt-10 p-6 border border-gray-200 rounded-xl bg-[#F9F9F9]">
                <p className="font-[family-name:var(--font-montserrat)] text-sm font-semibold text-[#1B2A49] mb-4">
                  Change & constancy
                </p>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-full md:w-auto flex-shrink-0">
                    <Image 
                      src="/tebostudio/fiddle-child.png" 
                      alt="Playing fiddle as a child in 1988" 
                      width={400}
                      height={320}
                      className="w-full md:h-80 object-contain rounded-lg"
                    />
                  </div>
                  <div className="w-full md:flex-1">
                    <Image 
                      src="/tebostudio/fiddle-adult.png" 
                      alt="Playing fiddle in 2025" 
                      width={600}
                      height={320}
                      className="w-full md:h-80 object-cover rounded-lg"
                    />
                  </div>
                </div>
                <p className="text-sm text-[#666666] mt-4 text-center">
                  1988 → 2025. Same instrument. Same curiosity. Different life.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
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
