import Link from "next/link";
import "./coming-soon.css";

type ComingSoonProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
};

export default function ComingSoon({
  title = "COMING SOON!",
  subtitle = "THIS PAGE IS UNDER CONSTRUCTION.",
  description = "We're currently building out this section for chapter members. Check back soon or return home.",
  backHref = "/programs",
  backLabel = "Back to Programs",
}: ComingSoonProps) {
  // If title has a space or exclamation, format like the image
  const isDefaultTitle = title === "COMING SOON!";

  return (
    <div className="cs-container">
      <div className="cs-grid">
        {/* Left: Interlocking Animated Mechanical Gears (NSBE Brand Palette) */}
        <div className="cs-media">
          <svg
            viewBox="0 0 320 280"
            className="cs-gears-svg"
            aria-hidden="true"
            focusable="false"
          >
            {/* Ground Shadow */}
            <ellipse cx="150" cy="246" rx="90" ry="12" fill="var(--border)" opacity="0.85" />

            {/* Secondary Gear (Smaller, NSBE Card Green #166a31) */}
            <g transform="translate(198, 86)">
              <g className="cs-gear cs-gear--secondary">
                <path
                  d="M 40.4 9.9 L 49.8 21.8 L 44.9 30.8 L 29.7 29.1 L 24.3 33.8 L 21.6 35.6 L 19.8 50.7 L 10.0 53.5 L 0.5 41.6 L -6.7 41.1 L -9.9 40.4 L -21.8 49.8 L -30.8 44.9 L -29.1 29.7 L -33.8 24.3 L -35.6 21.6 L -50.7 19.8 L -53.5 10.0 L -41.6 0.5 L -41.1 -6.7 L -40.4 -9.9 L -49.8 -21.8 L -44.9 -30.8 L -29.7 -29.1 L -24.3 -33.8 L -21.6 -35.6 L -19.8 -50.7 L -10.0 -53.5 L -0.5 -41.6 L 6.7 -41.1 L 9.9 -40.4 L 21.8 -49.8 L 30.8 -44.9 L 29.1 -29.7 L 33.8 -24.3 L 35.6 -21.6 L 50.7 -19.8 L 53.5 -10.0 L 41.6 -0.5 L 41.1 6.7 Z"
                  fill="var(--card-green)"
                  stroke="var(--near-black)"
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
                {/* Inner Hole */}
                <circle
                  cx="0"
                  cy="0"
                  r="16"
                  fill="var(--white)"
                  stroke="var(--near-black)"
                  strokeWidth="5"
                />
              </g>
            </g>

            {/* Primary Gear (Larger, NSBE Vibrant Green #2ab456) */}
            <g transform="translate(115, 155)">
              <g className="cs-gear cs-gear--primary">
                <path
                  d="M 51.4 -7.8 L 68.0 -0.8 L 67.3 9.4 L 50.0 14.2 L 47.6 21.0 L 46.2 23.9 L 55.5 39.3 L 48.9 47.2 L 32.1 40.9 L 26.2 44.9 L 23.3 46.5 L 21.8 64.4 L 11.8 67.0 L 1.9 52.0 L -5.3 51.7 L -8.5 51.3 L -20.3 64.9 L -29.8 61.1 L -29.0 43.2 L -34.7 38.8 L -37.0 36.5 L -54.5 40.6 L -60.0 32.0 L -48.8 17.9 L -50.8 11.0 L -51.4 7.8 L -68.0 0.8 L -67.3 -9.4 L -50.0 -14.2 L -47.6 -21.0 L -46.2 -23.9 L -55.5 -39.3 L -48.9 -47.2 L -32.1 -40.9 L -26.2 -44.9 L -23.3 -46.5 L -21.8 -64.4 L -11.8 -67.0 L -1.9 -52.0 L 5.3 -51.7 L 8.5 -51.3 L 20.3 -64.9 L 29.8 -61.1 L 29.0 -43.2 L 34.7 -38.8 L 37.0 -36.5 L 54.5 -40.6 L 60.0 -32.0 L 48.8 -17.9 L 50.8 -11.0 Z"
                  fill="var(--green)"
                  stroke="var(--near-black)"
                  strokeWidth="5.5"
                  strokeLinejoin="round"
                />
                {/* Inner Hole */}
                <circle
                  cx="0"
                  cy="0"
                  r="24"
                  fill="var(--white)"
                  stroke="var(--near-black)"
                  strokeWidth="5.5"
                />
                {/* Crescent Highlight Reflection */}
                <path
                  d="M -16 -12 A 20 20 0 0 1 14 -16"
                  fill="none"
                  stroke="var(--pale)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>
            </g>
          </svg>
        </div>

        {/* Right: Message & Action Buttons */}
        <div className="cs-content">
          {isDefaultTitle ? (
            <h1 className="cs-title">
              <span>COMING</span>
              <br />
              <span>SOON!</span>
            </h1>
          ) : (
            <h1 className="cs-title">{title}</h1>
          )}

          <p className="cs-subtitle">{subtitle}</p>
          <p className="cs-desc">{description}</p>

          <div className="cs-actions">
            <Link href="/" className="cs-btn-home">
              Go Home
            </Link>
            {backHref && (
              <Link href={backHref} className="cs-btn-secondary">
                {backLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
