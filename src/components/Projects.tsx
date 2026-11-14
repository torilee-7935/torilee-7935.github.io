import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { projectsData } from "@/data/projects"
import { theme } from "@/theme"
import { TriageDiagram } from "@/components/TriageDiagram"
import { Container, Section } from "@/shared/ui"

function ProjectCard({
  title,
  description,
  link,
  stack,
  imageUrl,
  diagram,
}: {
  title: string
  description: string
  link?: string
  stack?: ReadonlyArray<string>
  imageUrl?: string
  diagram?: "triage"
}) {
  const [open, setOpen] = useState(false)
  const panelId = `proj-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
  const hasImage = Boolean(imageUrl)
  // Only cards with something to reveal (an image card's text or a link) expand.
  const expandable = hasImage || Boolean(link)

  return (
    <motion.div
      layout
      className={[
        "group inline-block w-full align-top",
        "mb-5 break-inside-avoid",
        theme.radii.xl,
        theme.colors.surface,
        "border", theme.colors.border,
        theme.shadow.soft, theme.shadow.hover,
        "transition-colors overflow-hidden",
      ].join(" ")}
    >
      {/* Header (click to toggle) */}
      <button
        onClick={() => expandable && setOpen(o => !o)}
        aria-expanded={expandable ? open : undefined}
        aria-controls={expandable ? panelId : undefined}
        disabled={!expandable}
        className={`w-full text-left transition-colors ${expandable ? "group-hover:bg-brand-sage50" : "cursor-default"} ${
          hasImage ? "px-6 pt-6 pb-3" : "p-6"
        }`}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h3 className="text-lg md:text-xl font-semibold text-brand-ink">
              {title}
            </h3>

           {/* No-image: tags first, then description */}
            {!hasImage && (
              <>
                {stack?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {stack.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-brand-sage100 text-brand-sage600 border border-transparent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <p className={`text-brand-slate leading-relaxed ${stack?.length ? "mt-2" : "mt-1"}`}>
                  {description}
                </p>
              </>
            )}
          </div>

          {expandable && (
            <div className="shrink-0 text-brand-sage600">
              {open ? <ChevronUp /> : <ChevronDown />}
            </div>
          )}
        </div>
      </button>

      {/* Animated diagram (always visible) */}
      {diagram === "triage" && (
        <div className="px-6 pb-6 -mt-2">
          <TriageDiagram />
        </div>
      )}

      {/* Tags band for image cards (always visible, sits under header) */}
      {hasImage && stack?.length ? (
        <div className="px-6 pt-0 pb-3 transition-colors group-hover:bg-brand-sage50">
          <div className="flex flex-wrap gap-2">
            {stack.map(tag => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-brand-sage100 text-brand-sage600 border border-transparent"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Image band */}
      {hasImage && (
        <div className="px-6 transition-colors group-hover:bg-brand-sage50">
          <div className={`aspect-[16/9] ${theme.radii.xl} overflow-hidden bg-brand-sage50 border ${theme.colors.border}`}>
            <img
              src={imageUrl}
              alt={`${title} screenshot`}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="pb-4" /> {/* space so the image doesn’t kiss the card border */}
        </div>
      )}


      {/* Dropdown */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="content"
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6 transition-colors group-hover:bg-brand-sage50"
          >
            {/* With image: description lives in the dropdown */}
            {hasImage && <p className="text-brand-slate">{description}</p>}

            {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-brand-sage600 hover:text-brand-sage500 underline underline-offset-2"
            >
              View Project <ExternalLink className="w-4 h-4" />
            </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}


export function Projects() {
  return (
    <Section id="projects" className={theme.colors.softGrad}>
      <Container>
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-ink">Projects</h2>
        </div>

        <div className="columns-1 sm:columns-2 gap-5 [column-fill:_balance]">
          {projectsData.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
