"use client";

import { ReactNode } from "react";
import useResizeObserver from "@/app/common/hooks/useResizeObserver";
import BeatMathsMainContext from "./BeatMathsMainContext";

type BeatMathsMainProviderProps = {
  children: ReactNode;
};

export default function BeatMathsMainProvider({ children }: BeatMathsMainProviderProps) {
  const { ref, size } = useResizeObserver<HTMLDivElement>();

  return (
    <BeatMathsMainContext.Provider value={{ size }}>
      <div ref={ref} className="flex-1 min-h-0">
        {children}
      </div>
    </BeatMathsMainContext.Provider>
  );
}
