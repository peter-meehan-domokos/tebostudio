"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

export default function ConditionalNav() {
  const pathname = usePathname();
  // Hide nav only on individual project pages like /projects/xyz or /tebostudio/projects/xyz
  // Show nav on /projects or /tebostudio/projects (the list page)
  const isProjectDetailPage = pathname?.includes('/projects/') &&
    !pathname?.endsWith('/projects') &&
    !pathname?.endsWith('/projects/');

  if (isProjectDetailPage) {
    return null;
  }

  return <Navigation />;
}
