'use client';
import { data } from './mockData';
import { Visual } from './visual/Visual';
import ProjectIntro from "../../ProjectIntro";
import { PROJECT_CONFIG } from "@/app/projects/[slug]/project-config";
import { useProject } from "@/app/projects/[slug]/ProjectContext";

export default function TheRace() {
  const { showIntro, setShowIntro } = useProject();
  
  if (showIntro) {
    return (
      <ProjectIntro 
        slides={PROJECT_CONFIG.therace.introSlides}
        onClose={() => setShowIntro(false)}
        mobileWarning={PROJECT_CONFIG.therace.mobileWarning}
      />
    );
  }
  
  return (
    <div className="w-full h-full p-8">
      <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-3xl text-[#1B2A49] mb-4">
        <Visual data={data} />
      </h1>
    </div>
  );
}
