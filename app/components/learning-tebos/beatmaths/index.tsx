import BeatMathsHeader from "./components/BeatMathsHeader";
import BeatMathsMain from "./components/BeatMathsMain/BeatMathsMain";

export default function BeatMaths() {
  return (
    <div className="min-h-screen bg-[#00FFFF] flex flex-col">
      <BeatMathsHeader />
      <BeatMathsMain />
    </div>
  );
}
