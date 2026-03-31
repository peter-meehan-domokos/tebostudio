import StrategySim from "../../components/learning-tebos/strategysim";
import PerfectSquare from "../../components/visualisations/perfect-square";
import TheRace from "../../components/visualisations/the-race";

export async function generateStaticParams() {
  return [
    { slug: 'strategysim' },
    { slug: 'perfectsquare' },
    { slug: 'therace' }
  ];
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const renderProject = () => {
    switch (slug) {
      case 'strategysim':
        return <StrategySim />;
      case 'perfectsquare':
        return <PerfectSquare />;
      case 'therace':
        return <TheRace />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-4xl text-[#1B2A49] mb-4">
                Project Not Found
              </h1>
              <p className="font-[family-name:var(--font-roboto)] text-[#666666]">
                The project "{slug}" does not exist.
              </p>
            </div>
          </div>
        );
    }
  };

  return renderProject();
}
