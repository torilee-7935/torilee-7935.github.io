import { useEffect, useState } from "react"
import { ChevronDown, Music } from "lucide-react"

// Spotify track shown in the player. Swap the ID to change the song.
const SPOTIFY_EMBED =
  "https://open.spotify.com/embed/track/2J91jC5v48Rbm5p6JzfqvW?utm_source=generator"

export function MusicPlayer() {
  // Whether the Spotify card is shown. The iframe always stays mounted,
  // so music keeps playing while the card is hidden.
  const [visible, setVisible] = useState(false)
  // Load the Spotify embed only after the first click, so it doesn't
  // slow down the first page load for people who never open it.
  const [loaded, setLoaded] = useState(false)

  // Tuck the card away when the visitor scrolls; audio keeps playing.
  useEffect(() => {
    if (!visible) return
    const onScroll = () => setVisible(false)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [visible])

  const toggle = () => {
    setLoaded(true)
    setVisible((v) => !v)
  }

  return (
    <>
      {/* Floating pill button */}
      <button
        type="button"
        onClick={toggle}
        aria-label={visible ? "Hide music player" : "Show music player"}
        aria-expanded={visible}
        className={[
          "fixed z-[60] left-1/2 -translate-x-1/2",
          "bottom-[calc(1rem+env(safe-area-inset-bottom))]",
          "inline-flex items-center gap-2 rounded-full px-4 py-2",
          "border border-brand-line bg-brand-surface/85 backdrop-blur",
          "text-sm font-medium text-brand-ink",
          "shadow-[0_10px_30px_-12px_rgba(15,23,42,0.25)]",
          "hover:bg-brand-sage50 transition",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky300",
        ].join(" ")}
      >
        {visible ? (
          <ChevronDown className="h-4 w-4 text-brand-sage600" aria-hidden />
        ) : (
          <Music className="h-4 w-4 text-brand-sage600" aria-hidden />
        )}
        <span>{visible ? "Hide player" : "Music while you scroll"}</span>
        {loaded && (
          <span className="h-2 w-2 rounded-full bg-brand-sage500 animate-pulse" aria-hidden />
        )}
      </button>

      {/* Spotify card: fades in above the pill */}
      <div
        className={[
          "fixed z-[59] left-1/2 -translate-x-1/2",
          "bottom-[calc(4.25rem+env(safe-area-inset-bottom))]",
          "w-[min(360px,calc(100vw-2rem))]",
          "transition-all duration-300",
          visible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-3 pointer-events-none",
        ].join(" ")}
        aria-hidden={!visible}
      >
        {loaded && (
          <iframe
            title="Spotify player"
            src={SPOTIFY_EMBED}
            className="block w-full rounded-xl shadow-[0_14px_40px_-12px_rgba(15,23,42,0.35)]"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        )}
      </div>
    </>
  )
}
