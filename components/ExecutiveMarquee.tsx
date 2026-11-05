import Link from "next/link";
import Image from "next/image";
import { getPublicLeaders } from "@/lib/admin/actions";
import type { Leader } from "@/lib/admin/types";
import "./executive-marquee.css";

interface ExecutiveMarqueeProps {
  initialLeaders?: Leader[];
}

function normalizeImageSrc(src?: string | null): string | null {
  if (!src || typeof src !== "string") return null;
  const s = src.trim();
  if (!s) return null;
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/")) {
    return s;
  }
  return `/${s}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function MarqueeCard({ leader, isDuplicate = false }: { leader: Leader; isDuplicate?: boolean }) {
  const imageSrc = normalizeImageSrc(leader.portrait);

  return (
    <Link
      href="/leadership"
      className="exec-card"
      tabIndex={isDuplicate ? -1 : 0}
      aria-hidden={isDuplicate ? "true" : undefined}
      title={`${leader.name} — ${leader.role}`}
    >
      <div className="exec-card__avatar">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt=""
            width={44}
            height={44}
            className="exec-card__photo"
            unoptimized
          />
        ) : (
          <span className="exec-card__initials" aria-hidden="true">
            {getInitials(leader.name)}
          </span>
        )}
      </div>
      <div className="exec-card__info">
        <span className="exec-card__name">{leader.name}</span>
        <span className="exec-card__role">{leader.role}</span>
      </div>
      <span className="exec-card__arrow" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}

export default async function ExecutiveMarquee({ initialLeaders }: ExecutiveMarqueeProps = {}) {
  const leaders = initialLeaders ?? (await getPublicLeaders());
  if (!leaders || leaders.length === 0) return null;

  return (
    <section className="exec-marquee-section" aria-label="Chapter Executive Board">
      <div className="container exec-marquee-header">
        <div className="exec-marquee-header__title">
          <span className="eyebrow">Chapter Leadership</span>
          <p className="exec-marquee-header__sub">Meet the Unilorin Chapter Executives</p>
        </div>
        <Link href="/leadership" className="exec-marquee-header__link">
          View all executives <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="exec-marquee" role="region" aria-label="Executives marquee ticker">
        <div className="exec-marquee__fade exec-marquee__fade--left" aria-hidden="true" />
        <div className="exec-marquee__fade exec-marquee__fade--right" aria-hidden="true" />

        <div className="exec-marquee__inner">
          <div className="exec-marquee__track">
            {leaders.map((leader) => (
              <MarqueeCard key={leader.id} leader={leader} />
            ))}
          </div>
          <div className="exec-marquee__track exec-marquee__track--duplicate" aria-hidden="true">
            {leaders.map((leader) => (
              <MarqueeCard key={`dup-${leader.id}`} leader={leader} isDuplicate />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
