"use client";
import Link from "next/link";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full">
      {/* Project Navigation */}
      <div className="absolute top-6 left-6 z-50 flex gap-4">
        <Link
          href="/projects"
          className="font-[family-name:var(--font-roboto)] font-medium text-[#39A6A3] hover:text-[#329d9a] transition-colors"
        >
          All Projects
        </Link>
        <button
          onClick={() => {}}
          className="font-[family-name:var(--font-roboto)] font-medium text-[#666666] cursor-default"
        >
          Intro
        </button>
        <a
          href="https://github.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-roboto)] font-medium text-[#39A6A3] hover:text-[#329d9a] transition-colors"
        >
          Code
        </a>
      </div>
      
      {/* Project Content (Full Screen) */}
      {children}
    </div>
  );
}
