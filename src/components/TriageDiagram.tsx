/**
 * Animated flow diagram of the AI ticket-triage system.
 * Pure SVG: colors come from the brand tokens, so it follows light/dark mode,
 * and the moving dots are hidden for visitors who prefer reduced motion.
 */

type Box = { x: number; y: number; w: number; h: number }

const W = 360
const ticket: Box = { x: 90, y: 12, w: 180, h: 52 }
const rules: Box = { x: 8, y: 116, w: 158, h: 70 }
const claude: Box = { x: 194, y: 116, w: 158, h: 70 }
const draft: Box = { x: 60, y: 240, w: 240, h: 62 }
const review: Box = { x: 60, y: 356, w: 240, h: 56 }
const sent: Box = { x: 90, y: 466, w: 180, h: 46 }

const cx = (b: Box) => b.x + b.w / 2
const bottom = (b: Box) => b.y + b.h

// Connector paths (also used as motion paths for the dots)
const P = {
  toRules: `M ${cx(ticket)} ${bottom(ticket)} C ${cx(ticket)} 92, ${cx(rules)} 92, ${cx(rules)} ${rules.y}`,
  toClaude: `M ${cx(ticket)} ${bottom(ticket)} C ${cx(ticket)} 92, ${cx(claude)} 92, ${cx(claude)} ${claude.y}`,
  rulesToDraft: `M ${cx(rules)} ${bottom(rules)} C ${cx(rules)} 216, 150 216, 150 ${draft.y}`,
  claudeToDraft: `M ${cx(claude)} ${bottom(claude)} C ${cx(claude)} 216, 210 216, 210 ${draft.y}`,
  draftToReview: `M ${cx(draft)} ${bottom(draft)} L ${cx(review)} ${review.y}`,
  reviewToSent: `M ${cx(review)} ${bottom(review)} L ${cx(sent)} ${sent.y}`,
  feedback: `M ${review.x + review.w} ${review.y + 28} C 352 ${review.y + 28}, 352 ${draft.y + 31}, ${draft.x + draft.w} ${draft.y + 31}`,
}

function Node({
  box,
  title,
  sub,
  accent = false,
}: {
  box: Box
  title: string
  sub?: string[]
  accent?: boolean
}) {
  const lines = sub ?? []
  const titleY = box.y + (lines.length ? 22 : box.h / 2 + 5)
  return (
    <g>
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={14}
        className={accent ? "fill-brand-sage100 stroke-brand-sage500" : "fill-brand-surface stroke-brand-line"}
        strokeWidth={1.5}
      />
      <text x={cx(box)} y={titleY} textAnchor="middle" className="fill-brand-ink" fontSize={14} fontWeight={600}>
        {title}
      </text>
      {lines.map((l, i) => (
        <text
          key={l}
          x={cx(box)}
          y={titleY + 18 + i * 15}
          textAnchor="middle"
          className="fill-brand-slate"
          fontSize={11.5}
        >
          {l}
        </text>
      ))}
    </g>
  )
}

function Dot({ path, dur, begin, big = false }: { path: string; dur: number; begin: number; big?: boolean }) {
  return (
    <circle r={big ? 4.5 : 3.5} className="triage-dot fill-brand-sage600" opacity={0}>
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} />
      <animate
        attributeName="opacity"
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        values="0;1;1;0"
        keyTimes="0;0.1;0.85;1"
      />
    </circle>
  )
}

export function TriageDiagram() {
  return (
    <figure className="mt-4">
      <style>{`@media (prefers-reduced-motion: reduce){.triage-dot{display:none}}`}</style>
      <svg
        viewBox={`0 0 ${W} 524`}
        className="w-full h-auto"
        role="img"
        aria-labelledby="triage-title triage-desc"
      >
        <title id="triage-title">How the AI ticket-triage system works</title>
        <desc id="triage-desc">
          A new HubSpot ticket is routed either by simple rules, which handle 49% of tickets with 97% agreement,
          or by Claude for the 22% that need judgment. Claude skills then draft a reply, a teammate reviews it in
          Slack before it is sent to the customer, and the teammate's corrections feed back into better drafts.
        </desc>

        <defs>
          <marker id="triage-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-brand-sage400" />
          </marker>
        </defs>

        {/* Connectors */}
        <g fill="none" strokeWidth={1.75} className="stroke-brand-sage400">
          <path d={P.toRules} markerEnd="url(#triage-arrow)" />
          <path d={P.toClaude} markerEnd="url(#triage-arrow)" />
          <path d={P.rulesToDraft} markerEnd="url(#triage-arrow)" />
          <path d={P.claudeToDraft} markerEnd="url(#triage-arrow)" />
          <path d={P.draftToReview} markerEnd="url(#triage-arrow)" />
          <path d={P.reviewToSent} markerEnd="url(#triage-arrow)" />
          <path d={P.feedback} strokeDasharray="5 5" markerEnd="url(#triage-arrow)" />
        </g>

        {/* Edge label */}
        <text
          x={328}
          y={(bottom(draft) + review.y) / 2 + 4}
          textAnchor="end"
          className="fill-brand-slate"
          fontSize={10.5}
          fontStyle="italic"
        >
          corrections improve drafts
        </text>

        {/* Nodes */}
        <Node box={ticket} title="New support ticket" sub={["from HubSpot"]} />
        <Node box={rules} title="Simple rules" sub={["route 49% of tickets", "97% agreement"]} />
        <Node box={claude} title="Claude" sub={["22% need judgment", "about $0.45 per run"]} accent />
        <Node box={draft} title="Draft reply" sub={["13 Claude skills apply team policy"]} accent />
        <Node box={review} title="Teammate reviews in Slack" sub={["people stay in control"]} />
        <Node box={sent} title="Reply sent ✓" />

        {/* Moving tickets */}
        <Dot path={P.toRules} dur={1.6} begin={0} />
        <Dot path={P.rulesToDraft} dur={1.6} begin={1.6} />
        <Dot path={P.toClaude} dur={1.6} begin={0.8} />
        <Dot path={P.claudeToDraft} dur={1.6} begin={2.4} />
        <Dot path={P.draftToReview} dur={1.2} begin={1.2} big />
        <Dot path={P.reviewToSent} dur={1.2} begin={2.0} big />
        <Dot path={P.feedback} dur={2.4} begin={0.4} />
      </svg>
      <figcaption className="mt-2 flex flex-wrap justify-center gap-2 text-xs">
        {["Read-only live data", "Test environment", "Human review on every reply"].map((t) => (
          <span key={t} className="px-2.5 py-1 rounded-full bg-brand-sage100 text-brand-sage600">
            {t}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
