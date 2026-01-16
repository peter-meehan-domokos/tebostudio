"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TheRace from "./components/visualisations/the-race";
import PerfectSquare from "./components/visualisations/perfect-square";
import StrategySim from "./components/learning-tebos/strategysim/page";
import Birds from "./components/visualisations/birds";

export default function Home() {
  const [isRaceModalOpen, setIsRaceModalOpen] = useState(false);
  const [isPerfectSquareModalOpen, setIsPerfectSquareModalOpen] = useState(false);
  const [isStrategySimModalOpen, setIsStrategySimModalOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isRaceModalOpen || isPerfectSquareModalOpen || isStrategySimModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isRaceModalOpen, isPerfectSquareModalOpen, isStrategySimModalOpen]);

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
              Welcome to my studio, where I build educational tools, learning programmes, and data visualisations that help people make sense of systems in learning, work, and the world.
            </p>
            <Link
              href="/explore"
              className="inline-block bg-[#FFB84D] hover:bg-[#f5ab3d] text-[#1B2A49] font-[family-name:var(--font-montserrat)] font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
            >
              Explore my work
            </Link>
            <p className="font-[family-name:var(--font-roboto)] text-sm text-[#333333] mt-4">
              Discover how TEBOs, learning programs, and data visualisations bring complex ideas to life
            </p>
          </div>
          <div className="rounded-2xl aspect-video border border-gray-200 overflow-hidden">
            <Birds />
          </div>
        </div>
      </section>

      {/* Two Pillars Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Left Column - Educational Tools */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">🧠</div>
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-3xl text-[#1B2A49] mb-4">
              Educational Tools & Programmes
            </h2>
            <p className="font-[family-name:var(--font-roboto)] text-[#333333] mb-8 leading-relaxed">
              I design practical learning experiences using visual and interactive tools that help people build understanding, confidence, and agency. This includes programmes like Make Sense and Switchplay, and technology-enhanced boundary objects (TEBOs) that make complex ideas tangible and explorable.
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

          {/* Right Column - Data Visualisation */}
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
                  Explore Football & Data Tools →
                </Link>
                <p className="font-[family-name:var(--font-roboto)] text-sm text-[#333333] mt-3">
                  Examples of my work in football analytics and data platforms, showing how data insights can drive real-world outcomes.
                </p>
              </div>
            </div>
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
            <div 
              onClick={() => setIsPerfectSquareModalOpen(true)}
              className="bg-[#F9F9F9] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
            </div>

            {/* Project Card 2 */}
            <div 
              onClick={() => setIsStrategySimModalOpen(true)}
              className="bg-[#F9F9F9] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
            </div>

            {/* Project Card 3 */}
            <div 
              onClick={() => setIsRaceModalOpen(true)}
              className="bg-[#F9F9F9] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="inline-block bg-[#FFB84D] hover:bg-[#f5ab3d] text-[#1B2A49] font-[family-name:var(--font-montserrat)] font-semibold px-8 py-4 rounded-lg transition-colors text-center"
            >
              View all projects →
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-semibold px-8 py-4 rounded-lg transition-colors text-center"
            >
              Get in touch →
            </Link>
          </div>
          <p className="font-[family-name:var(--font-roboto)] text-sm text-[#333333] mt-6 text-center max-w-2xl mx-auto">
            Browse completed TEBOs, learning programs, and data visualisation projects across education, sport, and tech. Start a conversation about a program, custom tool, or data project — I'd love to collaborate.
          </p>
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
              <Link
                href="/newsletter"
                className="inline-block bg-[#39A6A3] hover:bg-[#329d9a] text-white font-[family-name:var(--font-montserrat)] font-semibold px-8 py-4 rounded-lg transition-colors text-center"
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

      {/* Perfect Square Modal */}
      <AnimatePresence>
        {isPerfectSquareModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-8"
            onClick={() => setIsPerfectSquareModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-7xl"
              style={{ height: '85vh' }}
            >
              <button
                onClick={() => setIsPerfectSquareModalOpen(false)}
                className="absolute -top-4 -right-4 bg-white hover:bg-gray-100 text-[#333333] hover:text-[#1B2A49] w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold z-10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ×
              </button>
              <div
                className="bg-white rounded-2xl w-full h-full shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <PerfectSquare />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Race Modal */}
      <AnimatePresence>
        {isRaceModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-8"
            onClick={() => setIsRaceModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-7xl"
              style={{ height: '85vh' }}
            >
              <button
                onClick={() => setIsRaceModalOpen(false)}
                className="absolute -top-4 -right-4 bg-white hover:bg-gray-100 text-[#333333] hover:text-[#1B2A49] w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold z-10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ×
              </button>
              <div
                className="bg-white rounded-2xl w-full h-full shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <TheRace />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Strategy Sim Modal */}
      <AnimatePresence>
        {isStrategySimModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-8"
            onClick={() => setIsStrategySimModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-7xl"
              style={{ height: '85vh' }}
            >
              <button
                onClick={() => setIsStrategySimModalOpen(false)}
                className="absolute -top-4 -right-4 bg-white hover:bg-gray-100 text-[#333333] hover:text-[#1B2A49] w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold z-10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ×
              </button>
              <div
                className="bg-white rounded-2xl w-full h-full shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <StrategySim />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
