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
            <ellipse cx="150" cy="246" rx="95" ry="12" fill="var(--border)" opacity="0.85" />

            {/* Secondary Gear (Smaller, NSBE Card Green #166a31) */}
            <g className="cs-gear cs-gear--secondary">
              <path
                d="M 239.0 82.0 L 255.6 93.9 L 251.6 105.1 L 230.7 104.2 L 225.6 109.1 L 222.0 111.4 L 220.0 131.8 L 208.3 133.9 L 198.6 115.4 L 191.8 113.3 L 188.0 111.4 L 169.4 119.9 L 161.7 110.8 L 172.9 93.2 L 171.3 86.3 L 171.0 82.0 L 154.4 70.1 L 158.4 58.9 L 179.3 59.8 L 184.4 54.9 L 188.0 52.6 L 190.0 32.2 L 201.7 30.1 L 211.4 48.6 L 218.2 50.7 L 222.0 52.6 L 240.6 44.1 L 248.3 53.2 L 237.1 70.8 L 238.7 77.7 Z"
                fill="var(--card-green)"
                stroke="var(--near-black)"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              {/* Inner Hole */}
              <circle
                cx="205"
                cy="82"
                r="16"
                fill="var(--white)"
                stroke="var(--near-black)"
                strokeWidth="5"
              />
            </g>

            {/* Primary Gear (Larger, NSBE Vibrant Green #2ab456) */}
            <g className="cs-gear cs-gear--primary">
              <path
                d="M 172.0 150.0 L 193.9 162.9 L 190.6 175.4 L 164.8 176.5 L 160.1 183.1 L 156.8 186.8 L 163.1 211.4 L 151.9 217.9 L 132.9 200.4 L 124.9 201.8 L 120.0 202.0 L 107.1 223.9 L 94.6 220.6 L 93.5 194.8 L 86.9 190.1 L 83.2 186.8 L 58.6 193.1 L 52.1 181.9 L 69.6 162.9 L 68.2 154.9 L 68.0 150.0 L 46.1 137.1 L 49.4 124.6 L 75.2 123.5 L 79.9 116.9 L 83.2 113.2 L 76.9 88.6 L 88.1 82.1 L 107.1 99.6 L 115.1 98.2 L 120.0 98.0 L 132.9 76.1 L 145.4 79.4 L 146.5 105.2 L 153.1 109.9 L 156.8 113.2 L 181.4 106.9 L 187.9 118.1 L 170.4 137.1 L 171.8 145.1 Z"
                fill="var(--green)"
                stroke="var(--near-black)"
                strokeWidth="5.5"
                strokeLinejoin="round"
              />
              {/* Inner Hole */}
              <circle
                cx="120"
                cy="150"
                r="24"
                fill="var(--white)"
                stroke="var(--near-black)"
                strokeWidth="5.5"
              />
              {/* Crescent Highlight Reflection */}
              <path
                d="M 103 138 A 20 20 0 0 1 133 134"
                fill="none"
                stroke="var(--pale)"
                strokeWidth="4"
                strokeLinecap="round"
              />
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
