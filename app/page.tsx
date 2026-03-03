// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  const demoHref = "/chat?hotel=demo";

  return (
    <main className="min-h-screen bg-[#060607] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-6 py-16">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="text-sm uppercase tracking-[0.22em] text-white/60">
            Concierge 24
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={demoHref}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              View Demo
            </Link>
            <a
              href="mailto:hello@concierge24.ie"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              24/7 AI Concierge for hotels.
              <span className="block text-white/70">
                Instant answers. Less front desk noise.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Guests ask the same questions every day — check-in, breakfast,
              parking, policies, what’s nearby. Concierge 24 answers in seconds
              via a QR code, so your team can focus on real service.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={demoHref}
                className="rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-white/90"
              >
                Try the Live Demo
              </Link>

              <a
                href="#how"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10"
              >
                How it works
              </a>
            </div>

            <div className="mt-6 text-sm text-white/55">
              Pilot-ready. No install headaches. Works on any phone.
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
            <div className="text-xs uppercase tracking-wider text-white/60">
              What guests actually ask
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/80">
                “What time is breakfast?”
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/80">
                “Is parking free?”
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/80">
                “Are pets allowed?”
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/80">
                “Can I check in early?”
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm font-semibold">Result</div>
              <div className="mt-1 text-sm text-white/70">
                Fewer repetitive calls. Faster guest answers. Cleaner operations.
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div id="how" className="mt-20">
          <div className="text-xs uppercase tracking-wider text-white/60">
            How it works
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-semibold">1) QR Code</div>
              <p className="mt-2 text-sm text-white/70">
                Place QR codes at reception, rooms, lifts, and signage.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-semibold">2) Guest scans</div>
              <p className="mt-2 text-sm text-white/70">
                Opens a branded chat page on their phone. No app install.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-semibold">3) Instant answers</div>
              <p className="mt-2 text-sm text-white/70">
                Answers come from your hotel knowledge base. No guessing.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="text-2xl font-semibold">
            Want a pilot for your hotel?
          </div>
          <div className="mt-2 max-w-2xl text-sm text-white/70">
            We’ll set up your hotel knowledge base + a QR code link. You test it
            with real guests. If it doesn’t reduce front desk repetition, you
            don’t keep it.
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:hello@concierge24.ie?subject=Concierge%2024%20Pilot"
              className="rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-white/90"
            >
              Request a pilot
            </a>
            <Link
              href={demoHref}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10"
            >
              Try the demo first
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-xs text-white/40">
          © {new Date().getFullYear()} Concierge 24
        </div>
      </div>
    </main>
  );
}