'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface ProjectContextType {
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <ProjectContext.Provider value={{ showIntro, setShowIntro }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
