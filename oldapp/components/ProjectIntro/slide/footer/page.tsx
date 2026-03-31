import Image from "next/image";

export default function Footer({ image, items = [] }: {
  image?: { src: string; key: string };
  items?: Array<{ key: string; label: string; url?: string }>;
}) {
  return (
    <div className="slide-footer-container">
      <div className="slide-footer">
        {image && (
          <div className="slide-footer-visual">
            <Image
              className="image"
              src={image.src}
              alt="profile-photo"
              width={100}
              height={100}
              style={{
                width: "85%",
                height: "auto",
              }}
            />
          </div>
        )}
        <ul className="slide-footer-items-list">
          {items.map((item) => (
            <li key={item.key}>
              {item.url ? (
                <a
                  className="slide-footer-item url-item font-[family-name:var(--font-roboto-mono)]"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              ) : (
                <h5 className="slide-footer-item font-[family-name:var(--font-roboto-mono)]">
                  {item.label}
                </h5>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
