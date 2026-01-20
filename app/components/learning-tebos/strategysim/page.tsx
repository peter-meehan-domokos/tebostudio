'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { PROJECT_CONFIG } from "@/app/projects/[slug]/project-config";

// Dynamically import components that use context
//const Game = dynamic(() => import("./components/Game"), { ssr: false });
const ProjectIntro = dynamic(() => import("../../ProjectIntro"), { ssr: false });

export default function StrategySim() {
  const [isClient, setIsClient] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // During static generation, show loading or basic content
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <ProjectIntro
        slides={PROJECT_CONFIG.strategysim.introSlides}
        onClose={() => setShowIntro(false)}
      />
    );
  }

}
