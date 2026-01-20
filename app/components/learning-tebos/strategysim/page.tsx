'use client';
import Game from "./components/Game";
import ProjectIntro from "../../ProjectIntro";
import { PROJECT_CONFIG } from "@/app/projects/[slug]/project-config";
import { useProject } from "@/app/projects/[slug]/ProjectContext";

export default function StrategySim() {
  const { showIntro, setShowIntro } = useProject();
  
  if (showIntro) {
    return (
      <ProjectIntro 
        slides={PROJECT_CONFIG.strategysim.introSlides}
        onClose={() => setShowIntro(false)}
        mobileWarning={PROJECT_CONFIG.strategysim.mobileWarning}
      />
    );
  }
  
  return <Game />;
}
