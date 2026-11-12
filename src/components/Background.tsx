import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { theme } from "@/theme";
import { Container, Section } from "@/shared/ui";
import { EXPERIENCES, EDUCATION, CERTIFICATIONS } from "@/data/background";

type ExpCardProps = {
  title: string;
  company: string;
  dates: string;
  bullets: string[];
  className?: string;
};

function ExpCard({ title, company, dates, bullets, className }: ExpCardProps) {
  return (
    <motion.article
      layout
      className={[
        "group inline-block w-full align-top",
        "mb-5 break-inside-avoid", // masonry magic
        theme.radii.md,
        theme.colors.surface,
        "border", theme.colors.border,
        theme.shadow.soft, theme.shadow.hover,
        "transition-colors overflow-hidden",
        "p-6",
        className || ""
      ].join(" ")}
    >
      <header className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-brand-ink">{title}</h3>
          <p className="mt-0.5 text-brand-slate">{company}</p>
          <p className="mt-0.5 text-sm text-brand-slate">{dates}</p>
        </div>
      </header>

      {/* Always open bullets */}
      <ul className="mt-3 space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="text-brand-slate">{b}</li>
        ))}
      </ul>
    </motion.article>
  );
}

export function Background() {
  return (
    <Section id="background" className={theme.colors.softGrad}>
      <Container>
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-ink">Background</h2>
        </div>

        {/* Education FIRST */}
        <div
          className={[
            theme.radii.md,
            theme.colors.surface,
            "border", theme.colors.border,
            theme.shadow.soft,
            "p-6 mb-6"
          ].join(" ")}
        >
          <h3 className="text-xl font-semibold text-brand-ink">Education</h3>
          <p className="mt-1 text-brand-slate">
            {EDUCATION.degree} · {EDUCATION.org}
          </p>
          {EDUCATION.extra && (
            <span className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-brand-sage100 text-brand-sage600 text-sm font-medium">
              {EDUCATION.extra}
            </span>
          )}
        </div>

        {/* Certifications */}
        {CERTIFICATIONS.length > 0 && (
          <div
            className={[
              theme.radii.md,
              theme.colors.surface,
              "border", theme.colors.border,
              theme.shadow.soft,
              "p-6 mb-6"
            ].join(" ")}
          >
            <h3 className="text-xl font-semibold text-brand-ink">Certifications</h3>
            <ul className="mt-3 space-y-3">
              {CERTIFICATIONS.map((c) => (
                <li key={c.name} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-sage100 text-brand-sage600">
                    <Award className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-brand-ink">{c.name}</p>
                    <p className="text-sm text-brand-slate">
                      {c.issuer}{c.date ? ` · ${c.date}` : ""}
                    </p>
                    {c.link && (
                      <a
                        href={c.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-sm text-brand-sage600 hover:text-brand-sage500 underline underline-offset-2"
                      >
                        View credential <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Experiences — true masonry */}
        <div className="columns-1 sm:columns-2 gap-5">
          {EXPERIENCES.map((exp) => (
            <ExpCard
              key={`${exp.title}-${exp.company}-${exp.dates}`}
              {...exp}
              className="mb-5 break-inside-avoid"
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
