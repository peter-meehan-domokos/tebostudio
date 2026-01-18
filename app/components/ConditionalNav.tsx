"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

export default function ConditionalNav() {
  const pathname = usePathname();
  const isProjectPage = pathname?.startsWith('/projects/') && pathname !== '/projects';
  
  if (isProjectPage) {
    return null;
  }
  
  return <Navigation />;
}
