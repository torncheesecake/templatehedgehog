import Link from "next/link";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(165deg, var(--hedgehog-core-navy) 0%, var(--hedgehog-core-navy) 40%, var(--hedgehog-core-navy) 70%, var(--hedgehog-core-navy) 100%)" }}
    >
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 py-32 sm:py-40 lg:px-8 lg:py-48">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow */}
          <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            React 18 &middot; Next.js 14 &middot; TypeScript &middot; Tailwind CSS
          </p>

          {/* Heading — big and bold */}
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            The NetSuite
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(to right, var(--accent-primary), var(--accent-primary), var(--accent-primary))",
              }}
            >
              Executive Dashboard
            </span>
          </h1>

          {/* Subheading — generous size */}
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-indigo-100/60 sm:text-xl">
            A complete React dashboard built for NetSuite data.
            Runs instantly with mock data — connect your NetSuite
            instance when you&apos;re ready.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/templates/netsuite-executive-dashboard"
              className="inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-base font-medium shadow-lg shadow-indigo-500/20 transition-all duration-150 hover:opacity-90"
              style={{ backgroundColor: "#ffffff", color: "var(--hedgehog-core-navy)" }}
            >
              View Template — £299
            </Link>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-base font-medium transition-all duration-150 border border-white/15 text-white/80 hover:bg-white/5 hover:text-white"
            >
              Live Demo
            </a>
          </div>

          {/* Trust signals */}
          <div className="mt-16 flex items-center justify-center gap-6 text-sm text-indigo-200/40">
            <span>4.7/5 rating</span>
            <span className="h-1 w-1 rounded-full bg-indigo-200/20" />
            <span>6 months of updates</span>
            <span className="h-1 w-1 rounded-full bg-indigo-200/20" />
            <span>30-day guarantee</span>
          </div>
        </div>

        {/* Dashboard Preview — pure wireframe */}
        <div className="mt-20 sm:mt-24">
          <div className="relative mx-auto max-w-6xl">
            <div
              className="relative rounded-2xl p-1.5"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div
                className="rounded-xl p-6 sm:p-8"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                {/* Wireframe Dashboard */}
                <div className="grid grid-cols-4 gap-4">
                  {/* Sidebar */}
                  <div className="hidden lg:block col-span-1 space-y-3 pr-4 border-r border-white/5">
                    <div className="h-8 w-20 rounded-md bg-white/8" />
                    <div className="mt-4 space-y-2">
                      {[85, 72, 90, 65, 78, 70].map((w, i) => (
                        <div
                          key={i}
                          className="h-7 rounded-md"
                          style={{
                            width: `${w}%`,
                            background: i === 2 ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Main area */}
                  <div className="col-span-4 lg:col-span-3 space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["Revenue", "Orders", "Customers", "Growth"].map((label) => (
                        <div
                          key={label}
                          className="rounded-lg p-3"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <div className="h-2.5 w-12 rounded bg-white/10" />
                          <div className="mt-2 h-5 w-16 rounded bg-white/15" />
                        </div>
                      ))}
                    </div>
                    {/* Chart */}
                    <div
                      className="rounded-lg p-4"
                      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-3 w-28 rounded bg-white/10" />
                        <div className="flex gap-2">
                          <div className="h-5 w-14 rounded bg-white/5" />
                          <div className="h-5 w-14 rounded bg-white/5" />
                        </div>
                      </div>
                      <div className="flex items-end gap-1.5 h-36">
                        {[40, 65, 45, 80, 55, 70, 90, 60, 85, 75, 95, 70].map(
                          (h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-t bg-white/10"
                              style={{ height: `${h}%` }}
                            />
                          )
                        )}
                      </div>
                    </div>
                    {/* Table */}
                    <div
                      className="rounded-lg p-4"
                      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="h-3 w-24 rounded bg-white/10 mb-4" />
                      <div className="space-y-2.5">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="h-3.5 w-20 rounded bg-white/6" />
                            <div className="h-3.5 flex-1 rounded bg-white/3" />
                            <div className="h-3.5 w-16 rounded bg-white/6" />
                            <div className="h-4 w-14 rounded-full bg-white/8" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
