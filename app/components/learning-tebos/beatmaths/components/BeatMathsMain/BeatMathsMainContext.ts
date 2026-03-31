import { createContext, useContext } from "react";

type BeatMathsMainSize = {
  width: number;
  height: number;
};

type BeatMathsMainContextValue = {
  size: BeatMathsMainSize;
};

const BeatMathsMainContext = createContext<BeatMathsMainContextValue | null>(null);

export const useBeatMathsMain = () => {
  const context = useContext(BeatMathsMainContext);
  if (!context) {
    throw new Error("useBeatMathsMain must be used within BeatMathsMainProvider");
  }
  return context;
};

export default BeatMathsMainContext;
