"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-[family-name:var(--font-montserrat)] font-bold text-3xl text-[#1B2A49]">
              TEBO
            </span>
            <span className="font-[family-name:var(--font-roboto)] text-sm text-[#333333] tracking-wide">
              studio
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {/* Data Visualisation Dropdown */}
            <div className="relative group" style={{ display: 'none' }}>
              <Link
                href="/data-visualisation"
                className="font-[family-name:var(--font-roboto)] font-medium text-[#333333] hover:text-[#39A6A3] transition-colors py-2"
                onMouseEnter={() => setOpenDropdown("data")}
              >
                Data Visualisation
              </Link>
              <div
                className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href="/data-visualisation/services"
                  className="block px-4 py-3 font-[family-name:var(--font-roboto)] text-[#333333] hover:bg-[#F9F9F9] hover:text-[#39A6A3] transition-colors first:rounded-t-lg"
                >
                  Services
                </Link>
                <Link
                  href="/data-visualisation/football"
                  className="block px-4 py-3 font-[family-name:var(--font-roboto)] text-[#333333] hover:bg-[#F9F9F9] hover:text-[#39A6A3] transition-colors last:rounded-b-lg"
                >
                  Football & Data
                </Link>
              </div>
            </div>

            {/* Learning Dropdown */}
            <div className="relative group" style={{ display: 'none' }}>
              <Link
                href="/learning"
                className="font-[family-name:var(--font-roboto)] font-medium text-[#333333] hover:text-[#39A6A3] transition-colors py-2"
                onMouseEnter={() => setOpenDropdown("learning")}
              >
                Learning
              </Link>
              <div
                className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href="/learning/make-sense"
                  className="block px-4 py-3 font-[family-name:var(--font-roboto)] text-[#333333] hover:bg-[#F9F9F9] hover:text-[#39A6A3] transition-colors first:rounded-t-lg"
                >
                  Make Sense
                </Link>
                <Link
                  href="/learning/switchplay"
                  className="block px-4 py-3 font-[family-name:var(--font-roboto)] text-[#333333] hover:bg-[#F9F9F9] hover:text-[#39A6A3] transition-colors last:rounded-b-lg"
                >
                  Switchplay
                </Link>
              </div>
            </div>

            <Link
              href="/about"
              className="font-[family-name:var(--font-roboto)] font-medium text-[#333333] hover:text-[#39A6A3] transition-colors"
            >
              About
            </Link>

            <Link
              href="/projects"
              className="font-[family-name:var(--font-roboto)] font-medium text-[#333333] hover:text-[#39A6A3] transition-colors"
            >
              Projects
            </Link>

            <Link
              href="/testimonials"
              className="font-[family-name:var(--font-roboto)] font-medium text-[#333333] hover:text-[#39A6A3] transition-colors"
            >
              Testimonials
            </Link>

            <Link
              href="/contact"
              className="bg-[#FFB84D] hover:bg-[#f5ab3d] text-[#1B2A49] font-[family-name:var(--font-montserrat)] font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-[#1B2A49] transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-[#1B2A49] transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-[#1B2A49] transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-96 mt-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-2 pb-4">
            {/* Data Visualisation Section */}
            <div style={{ display: 'none' }}>
              <Link
                href="/data-visualisation"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("data");
                }}
                className="block w-full text-left font-[family-name:var(--font-roboto)] font-medium text-[#333333] hover:text-[#39A6A3] py-2 transition-colors"
              >
                Data Visualisation
              </Link>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openDropdown === "data" ? "max-h-32" : "max-h-0"
                }`}
              >
                <Link
                  href="/data-visualisation/services"
                  className="block pl-4 py-2 font-[family-name:var(--font-roboto)] text-sm text-[#333333] hover:text-[#39A6A3] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/data-visualisation/football"
                  className="block pl-4 py-2 font-[family-name:var(--font-roboto)] text-sm text-[#333333] hover:text-[#39A6A3] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Football & Data
                </Link>
              </div>
            </div>

            {/* Learning Section */}
            <div style={{ display: 'none' }}>
              <Link
                href="/learning"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("learning");
                }}
                className="block w-full text-left font-[family-name:var(--font-roboto)] font-medium text-[#333333] hover:text-[#39A6A3] py-2 transition-colors"
              >
                Learning
              </Link>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openDropdown === "learning" ? "max-h-32" : "max-h-0"
                }`}
              >
                <Link
                  href="/learning/make-sense"
                  className="block pl-4 py-2 font-[family-name:var(--font-roboto)] text-sm text-[#333333] hover:text-[#39A6A3] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Make Sense
                </Link>
                <Link
                  href="/learning/switchplay"
                  className="block pl-4 py-2 font-[family-name:var(--font-roboto)] text-sm text-[#333333] hover:text-[#39A6A3] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Switchplay
                </Link>
              </div>
            </div>

            <Link
              href="/about"
              className="font-[family-name:var(--font-roboto)] font-medium text-[#333333] hover:text-[#39A6A3] py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>

            <Link
              href="/projects"
              className="font-[family-name:var(--font-roboto)] font-medium text-[#333333] hover:text-[#39A6A3] py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>

            <Link
              href="/testimonials"
              className="font-[family-name:var(--font-roboto)] font-medium text-[#333333] hover:text-[#39A6A3] py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </Link>

            <Link
              href="/contact"
              className="bg-[#FFB84D] hover:bg-[#f5ab3d] text-[#1B2A49] font-[family-name:var(--font-montserrat)] font-semibold px-6 py-2 rounded-lg transition-colors text-center mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
