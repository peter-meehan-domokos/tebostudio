'use client'
import React from "react";
import AppContextProvider from "./context";
import MainRouter from "./_components/main-router/page";
import ProjectIntro from "../../ProjectIntro";
import { PROJECT_CONFIG } from "@/app/projects/[slug]/project-config";
import { useProject } from "@/app/projects/[slug]/ProjectContext";
import "./perfect-square.css";

export default function PerfectSquare() {
  const { showIntro, setShowIntro } = useProject();
  console.log('PerfectSquare - showIntro:', showIntro);
  
  if (showIntro) {
    return (
      <ProjectIntro 
        slides={PROJECT_CONFIG.perfectsquare.introSlides}
        onClose={() => setShowIntro(false)}
        mobileWarning={PROJECT_CONFIG.perfectsquare.mobileWarning}
      />
    );
  }
  
  return (
    <div className="perfect-square-root" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <AppContextProvider>
        <MainRouter />
      </AppContextProvider>
    </div>
  );
}