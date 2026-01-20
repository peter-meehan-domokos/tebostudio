"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProjectProvider, useProject } from "./ProjectContext";
import { PROJECT_CONFIG } from "./project-config";

function ProjectNav() {
  const { showIntro, setShowIntro } = useProject();
  const params = useParams<{ slug?: string | string[] }>();
  const slugParam = Array.isArray(params?.slug) ? params?.slug[0] : params?.slug;
  const githubUrl = slugParam ? PROJECT_CONFIG[slugParam]?.githubUrl : undefined;
  const docsUrl = slugParam ? PROJECT_CONFIG[slugParam]?.docsUrl : undefined;
  console.log('ProjectNav - showIntro:', showIntro);
  
  return (
    <div className="absolute top-6 left-6 z-50 flex gap-4">
      <Link
        href="/projects"
        className="font-[family-name:var(--font-roboto)] font-medium text-[#1B2A49] hover:text-[#39A6A3] transition-colors"
      >
        All Projects
      </Link>
      <span className="h-5 w-px bg-[#1B2A49]/30 self-center" />
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
          View
        </button>
      )}
      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-roboto)] font-medium text-[#1B2A49] hover:text-[#39A6A3] transition-colors"
        >
          Github
        </a>
      )}
      {docsUrl && (
        <a
          href={docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-roboto)] font-medium text-[#1B2A49] hover:text-[#39A6A3] transition-colors"
        >
          Docs
        </a>
      )}
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
