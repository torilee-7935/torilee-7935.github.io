import { Container } from "@/shared/ui"
import { PROFILE } from "@/data/profile"

export function Footer() {
  return (
    <footer className="pt-10 pb-24 text-center text-brand-slate">
      <Container>
        <p className="text-sm">© {new Date().getFullYear()} {PROFILE.name}</p>
        <p className="text-sm">Made with love and my favorite focus playlist</p>
      </Container>
    </footer>
  )
}
