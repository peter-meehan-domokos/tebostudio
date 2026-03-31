import Image from "next/image";

const titleStyle = {
  margin: "2% 0",
};

const paragraphStyle = {
  margin: "2% 2.5%",
};

export default function Slide({ id = "", title = "", paragraphs = [], visual }: {
  id?: number | string;
  title?: string;
  paragraphs?: string[];
  visual?: { key: string; src: string };
}) {
  return (
    <div className="slide-main-contents">
      <div className="intro-slide-text-container">
        {title && (
          <h2
            className="slide-title font-[family-name:var(--font-roboto)]"
            style={titleStyle}
          >
            {title}
          </h2>
        )}
        {paragraphs.map((p, j) => (
          <p
            className="slide-textline font-[family-name:var(--font-roboto)]"
            key={`slide-${id}-para-${j}`}
            style={paragraphStyle}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}
      </div>
      {visual && (
        <div className="intro-slide-visual">
          <div className="intro-vis-container">
            <Image
              className="image"
              src={visual.src}
              alt="slide-visual"
              width={0}
              height={0}
            />
          </div>
        </div>
      )}
    </div>
  );
}
