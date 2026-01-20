"use client";
import Link from "next/link";
import { ProjectProvider, useProject } from "./ProjectContext";

function ProjectNav() {
  const { showIntro, setShowIntro } = useProject();
  
  return (
    <div className="absolute top-6 left-6 z-50 flex gap-4">
      <Link
        href="/projects"
        className="font-[family-name:var(--font-roboto)] font-medium text-[#1B2A49] hover:text-[#39A6A3] transition-colors"
      >
        All Projects
      </Link>
      <button
        onClick={() => setShowIntro(true)}
        className={`font-[family-name:var(--font-roboto)] font-medium transition-colors cursor-pointer ${
          showIntro ? 'text-[#39A6A3]' : 'text-[#1B2A49] hover:text-[#39A6A3]'
        }`}
      >
        Intro
      </button>
      {showIntro && (
        <button
          onClick={() => setShowIntro(false)}
          className="font-[family-name:var(--font-roboto)] font-medium text-[#1B2A49] hover:text-[#39A6A3] transition-colors cursor-pointer"
        >
          Begin
        </button>
      )}
      <a
        href="https://github.com/yourprofile"
        target="_blank"
        rel="noopener noreferrer"
        className="font-[family-name:var(--font-roboto)] font-medium text-[#1B2A49] hover:text-[#39A6A3] transition-colors"
      >
        Github
      </a>
    </div>
  );
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProjectProvider>
      <div className="min-h-screen w-full">
        <ProjectNav />
        {children}
      </div>
    </ProjectProvider>
  );
}
