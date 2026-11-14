/**
 * Animated flow diagram of the AI ticket-triage system.
 * Pure SVG: colors come from the brand tokens, so it follows light/dark mode,
 * and the moving dots are hidden for visitors who prefer reduced motion.
 *
 * Flow: ticket arrives from HubSpot → routing logic decides →
 *   (a) logic allows: AI posts to the ticket automatically, or
 *   (b) a person is needed: it goes to Slack, where the teammate and AI iterate.
 */

type Box = { x: number; y: number; w: number; h: number }

const W = 360
const H = 520
const ticket: Box = { x: 90, y: 12, w: 180, h: 52 }
const routing: Box = { x: 40, y: 108, w: 280, h: 70 }
const auto: Box = { x: 8, y: 250, w: 158, h: 70 }
const human: Box = { x: 194, y: 250, w: 158, h: 70 }
const iterate: Box = { x: 194, y: 358, w: 158, h: 62 }
const done: Box = { x: 90, y: 466, w: 180, h: 46 }

const cx = (b: Box) => b.x + b.w / 2
const bottom = (b: Box) => b.y + b.h

// Connector paths (also used as motion paths for the dots)
const P = {
  toRouting: `M ${cx(ticket)} ${bottom(ticket)} L ${cx(routing)} ${routing.y}`,
  toAuto: `M 150 ${bottom(routing)} C 150 214, ${cx(auto)} 214, ${cx(auto)} ${auto.y}`,
  toHuman: `M 210 ${bottom(routing)} C 210 214, ${cx(human)} 214, ${cx(human)} ${human.y}`,
  humanToIterate: `M ${cx(human)} ${bottom(human)} L ${cx(human)} ${iterate.y}`,
  iterateBack: `M ${iterate.x + iterate.w - 14} ${iterate.y} C ${iterate.x + iterate.w + 2} ${iterate.y - 14}, ${human.x + human.w + 2} ${bottom(human) + 14}, ${human.x + human.w - 14} ${bottom(human)}`,
  autoToDone: `M ${cx(auto)} ${bottom(auto)} C ${cx(auto)} 430, 150 430, 150 ${done.y}`,
  iterateToDone: `M ${cx(iterate)} ${bottom(iterate)} C ${cx(iterate)} 446, 210 446, 210 ${done.y}`,
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

function Label({ x, y, children, anchor = "middle" }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="fill-brand-sage600" fontSize={11} fontWeight={600}>
      {children}
    </text>
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
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-labelledby="triage-title triage-desc">
        <title id="triage-title">How the AI ticket-triage system works</title>
        <desc id="triage-desc">
          A new ticket arrives from HubSpot and routing logic decides how to handle it: simple rules route 49% of
          tickets with 97% agreement, and Claude handles the 22% that need judgment. When the logic allows, the AI
          posts to the ticket automatically. When a person is needed, the ticket goes to Slack, where the teammate
          and the AI iterate on the reply until the ticket is answered.
        </desc>

        <defs>
          <marker id="triage-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-brand-sage400" />
          </marker>
        </defs>

        {/* Connectors */}
        <g fill="none" strokeWidth={1.75} className="stroke-brand-sage400">
          <path d={P.toRouting} markerEnd="url(#triage-arrow)" />
          <path d={P.toAuto} markerEnd="url(#triage-arrow)" />
          <path d={P.toHuman} markerEnd="url(#triage-arrow)" />
          <path d={P.humanToIterate} markerEnd="url(#triage-arrow)" />
          <path d={P.iterateBack} strokeDasharray="4 4" markerEnd="url(#triage-arrow)" />
          <path d={P.autoToDone} markerEnd="url(#triage-arrow)" />
          <path d={P.iterateToDone} markerEnd="url(#triage-arrow)" />
        </g>

        {/* Branch labels */}
        <Label x={cx(auto) - 8} y={236} anchor="end">logic allows</Label>
        <Label x={cx(human) - 10} y={236} anchor="end">needs a person</Label>

        {/* Nodes */}
        <Node box={ticket} title="New ticket" sub={["arrives from HubSpot"]} />
        <Node
          box={routing}
          title="Routing logic"
          sub={["rules route 49% of tickets · 97% agreement", "Claude handles the 22% that need judgment"]}
          accent
        />
        <Node box={auto} title="AI posts to ticket" sub={["automatically,", "right in HubSpot"]} accent />
        <Node box={human} title="Teammate steps in" sub={["ticket goes to Slack", "with the AI's draft"]} />
        <Node box={iterate} title="Iterate in Slack" sub={["teammate + AI refine"]} />
        <Node box={done} title="Ticket answered ✓" />

        {/* Moving tickets */}
        <Dot path={P.toRouting} dur={1.2} begin={0} big />
        <Dot path={P.toAuto} dur={1.6} begin={1.2} />
        <Dot path={P.toHuman} dur={1.6} begin={2.0} />
        <Dot path={P.autoToDone} dur={1.8} begin={2.8} />
        <Dot path={P.humanToIterate} dur={1.0} begin={3.6} />
        <Dot path={P.iterateBack} dur={1.2} begin={0.6} />
        <Dot path={P.iterateToDone} dur={1.6} begin={1.8} />
      </svg>
      <figcaption className="mt-2 flex flex-wrap justify-center gap-2 text-xs">
        {["13 Claude skills apply team policy", "Read-only live data", "Test environment"].map((t) => (
          <span key={t} className="px-2.5 py-1 rounded-full bg-brand-sage100 text-brand-sage600">
            {t}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
