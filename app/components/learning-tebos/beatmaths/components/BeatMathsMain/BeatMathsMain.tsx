import BeatMathsMainContent from "./BeatMathsMainContent";
import BeatMathsMainProvider from "./BeatMathsMainProvider";

export default function BeatMathsMain() {
  return (
    <main className="flex-1 min-h-0 flex flex-col">
      <BeatMathsMainProvider>
        <BeatMathsMainContent />
      </BeatMathsMainProvider>
    </main>
  );
}
