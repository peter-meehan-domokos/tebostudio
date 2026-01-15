"use client";

import Link from "next/link";
import { useState } from "react";

export default function About() {
  const [activeTab, setActiveTab] = useState<"me" | "studio">("me");

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <main className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-5xl text-[#1B2A49] mb-12 text-center">
          About
        </h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("me")}
            className={`font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 transition-all ${
              activeTab === "me"
                ? "text-[#39A6A3] border-b-2 border-[#39A6A3]"
                : "text-[#333333] hover:text-[#39A6A3]"
            }`}
          >
            Me
          </button>
          <button
            onClick={() => setActiveTab("studio")}
            className={`font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 transition-all ${
              activeTab === "studio"
                ? "text-[#39A6A3] border-b-2 border-[#39A6A3]"
                : "text-[#333333] hover:text-[#39A6A3]"
            }`}
          >
            TEBO Studio
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
          {activeTab === "me" ? (
            <div>
              <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-3xl text-[#1B2A49] mb-6">
                About Me
              </h2>
              <div className="space-y-4 font-[family-name:var(--font-roboto)] text-[#333333] leading-relaxed">
                <p>
                  Content about your background, expertise, and approach goes here...
                </p>
                <p>
                  Your story as an educator, data visualisation specialist, and musician...
                </p>
                <p>
                  How your unique perspective shapes your work with TEBOs, learning programmes, 
                  and data visualisation projects...
                </p>
                <p className="italic text-sm mt-8">
                  [Placeholder content - to be updated with your personal story and professional journey]
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-3xl text-[#1B2A49] mb-6">
                About TEBO Studio
              </h2>
              <div className="space-y-4 font-[family-name:var(--font-roboto)] text-[#333333] leading-relaxed">
                <p>
                  TEBO Studio is dedicated to making sense of a complex world through innovative 
                  educational tools and data visualisation...
                </p>
                <p>
                  Our mission: to transform complex ideas into clear, accessible learning experiences 
                  and actionable insights...
                </p>
                <p>
                  What makes TEBO Studio unique: our approach to combining practical learning with 
                  conceptual understanding, powered by interactive tools and bespoke visualisations...
                </p>
                <p>
                  We work across education, sport, and technology sectors, bringing clarity to 
                  complexity and helping people understand systems in learning, work, and the world...
                </p>
                <p className="italic text-sm mt-8">
                  [Placeholder content - to be updated with TEBO Studio's philosophy, approach, and impact]
                </p>
              </div>
            </div>
          )}
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
