import { useState, useEffect, useRef } from "react";

// Inject Google Font + global styles
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    * { font-family: 'Plus Jakarta Sans', sans-serif; }

    @keyframes float-slow {
      0%, 100% { transform: translateY(0px) rotate(-1deg); }
      50% { transform: translateY(-10px) rotate(1deg); }
    }
    @keyframes float-med {
      0%, 100% { transform: translateY(0px) rotate(1deg); }
      50% { transform: translateY(-7px) rotate(-1deg); }
    }
    @keyframes tilt-float {
      0%   { transform: perspective(1400px) rotateY(-5deg) rotateX(4deg) translateY(0px) scale(1); }
      25%  { transform: perspective(1400px) rotateY(-3deg) rotateX(2deg) translateY(-8px) scale(1.01); }
      50%  { transform: perspective(1400px) rotateY(-7deg) rotateX(5deg) translateY(-4px) scale(1); }
      75%  { transform: perspective(1400px) rotateY(-4deg) rotateX(3deg) translateY(-10px) scale(1.005); }
      100% { transform: perspective(1400px) rotateY(-5deg) rotateX(4deg) translateY(0px) scale(1); }
    }
    .showcase-tilt {
      animation: tilt-float 8s ease-in-out infinite;
      transform-origin: center center;
      will-change: transform;
    }
    @media (max-width: 640px) {
      .showcase-tilt { animation: none; transform: none; }
      .showcase-sidebar { display: none; }
      .showcase-window { font-size: 11px; }
    }
    /* Glow pulse on the shadow layer */
    @keyframes glow-pulse {
      0%, 100% { opacity: 0.25; transform: translateY(8px) scale(1); }
      50%       { opacity: 0.45; transform: translateY(14px) scale(1.04); }
    }
    .shadow-glow { animation: glow-pulse 8s ease-in-out infinite; }

    /* Bar fill */
    @keyframes bar-fill {
      from { width: 0%; }
      to   { width: var(--bar-w); }
    }
    .bar-fill { animation: bar-fill 1.4s cubic-bezier(.4,0,.2,1) forwards; }

    /* Count up */
    @keyframes count-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .count-in { animation: count-in 0.5s ease forwards; }

    /* Stagger card slide-in */
    @keyframes card-in {
      from { opacity: 0; transform: translateX(-12px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .card-in-1 { animation: card-in 0.4s ease forwards 0.05s; opacity: 0; }
    .card-in-2 { animation: card-in 0.4s ease forwards 0.15s; opacity: 0; }
    .card-in-3 { animation: card-in 0.4s ease forwards 0.25s; opacity: 0; }
    .card-in-4 { animation: card-in 0.4s ease forwards 0.35s; opacity: 0; }
    .card-in-5 { animation: card-in 0.4s ease forwards 0.45s; opacity: 0; }
    .card-in-6 { animation: card-in 0.4s ease forwards 0.55s; opacity: 0; }
    .card-in-7 { animation: card-in 0.4s ease forwards 0.65s; opacity: 0; }
    .card-in-8 { animation: card-in 0.4s ease forwards 0.75s; opacity: 0; }

    /* Log entry ticker */
    @keyframes log-slide {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Scanning line for audit log */
    @keyframes scan-line {
      0%   { top: 0%; opacity: 0.6; }
      100% { top: 100%; opacity: 0; }
    }
    .scan-line {
      position: absolute; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent);
      animation: scan-line 3s linear infinite;
      pointer-events: none;
    }

    /* Deviation progress ring */
    @keyframes ring-draw {
      from { stroke-dashoffset: 100; }
      to   { stroke-dashoffset: var(--ring-offset); }
    }
    .ring-draw { animation: ring-draw 1.2s cubic-bezier(.4,0,.2,1) forwards; }

    /* Notification ping */
    @keyframes ping-once {
      0%   { transform: scale(1); opacity: 1; }
      70%  { transform: scale(2.2); opacity: 0; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    .ping-badge::before {
      content: '';
      position: absolute; inset: 0;
      border-radius: 9999px;
      background: currentColor;
      animation: ping-once 2s cubic-bezier(0,0,.2,1) infinite;
    }

    .float-badge-1 { animation: float-slow 4s ease-in-out infinite; }
    .float-badge-2 { animation: float-med 5s ease-in-out infinite 1s; }
    .float-badge-3 { animation: float-slow 4.5s ease-in-out infinite 2s; }
  `}</style>
);

// ─── Utility ────────────────────────────────────────────────────────────────
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ─── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 flex-shrink-0">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-lg" />
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="relative z-10">
              {/* Stylised "E" built from three precise horizontal bars — clean, geometric, confident */}
              <rect x="10" y="10" width="16" height="3" rx="1.5" fill="white"/>
              <rect x="10" y="16.5" width="11" height="3" rx="1.5" fill="white" opacity="0.8"/>
              <rect x="10" y="23" width="16" height="3" rx="1.5" fill="white"/>
              {/* Tiny accent dot — signals the "AI" precision angle */}
              <circle cx="27" cy="18" r="2" fill="#93c5fd"/>
            </svg>
          </div>
          <span className={cn("text-xl font-extrabold tracking-tight transition-colors", scrolled ? "text-slate-900" : "text-white")} style={{ letterSpacing: "-0.04em" }}>easi</span>
        </div>

        {/* CTA only */}
        <a
          href="https://calendly.com/harshita-easitrials/30min"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          Book a demo
        </a>
      </div>
    </nav>
  );
}

// ─── Dashboard Mockup ────────────────────────────────────────────────────────
function DashboardMockup() {
  return (
    <div className="relative w-full max-w-xl ml-auto">
      {/* Glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-indigo-500/10 rounded-3xl blur-2xl" />

      {/* Main window */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs font-medium text-slate-400">easi.app — Protocol Dashboard</span>
        </div>

        {/* Sidebar + Content */}
        <div className="flex h-80">
          {/* Sidebar */}
          <div className="w-44 border-r border-slate-100 bg-slate-50 p-3 flex flex-col gap-1">
            {[
              { icon: "▦", label: "Overview", active: true },
              { icon: "⊞", label: "Screening", active: false },
              { icon: "◷", label: "Visit Schedule", active: false },
              { icon: "⚠", label: "AE Tracker", active: false },
              { icon: "📋", label: "Deviations", active: false },
              { icon: "✓", label: "Audit Log", active: false },
            ].map(({ icon, label, active }) => (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium cursor-pointer",
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <span className="text-xs">{icon}</span>
                {label}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 space-y-3 overflow-hidden">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">BEACON-301 Protocol</div>
                <div className="text-xs text-slate-400">Phase III · 24 active participants</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-600 font-medium">Audit-ready</span>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Upcoming Visits", value: "7", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Open AEs", value: "2", color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Deviations", value: "0", color: "text-emerald-600", bg: "bg-emerald-50" },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={cn("rounded-lg p-2.5", bg)}>
                  <div className={cn("text-lg font-bold", color)}>{value}</div>
                  <div className="text-xs text-slate-500 leading-tight">{label}</div>
                </div>
              ))}
            </div>

            {/* Visit checklist */}
            <div className="bg-slate-50 rounded-lg p-3 space-y-2">
              <div className="text-xs font-semibold text-slate-700 mb-1">Today's Checklist · Visit 3 (Day 29)</div>
              {[
                { task: "Confirm eligibility re-check", done: true },
                { task: "CBC & metabolic panel drawn", done: true },
                { task: "ECOG status documented", done: false },
                { task: "Concomitant meds reviewed", done: false },
              ].map(({ task, done }) => (
                <div key={task} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 border",
                      done ? "bg-blue-600 border-blue-600" : "border-slate-300"
                    )}
                  >
                    {done && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className={cn("text-xs", done ? "text-slate-400 line-through" : "text-slate-700")}>
                    {task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating AE badge */}
      <div className="absolute -right-4 top-16 bg-white border border-amber-200 shadow-lg rounded-xl px-3 py-2 flex items-center gap-2 animate-bounce" style={{ animationDuration: "3s" }}>
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-xs font-semibold text-slate-700">AE auto-detected</span>
      </div>

      {/* Floating protocol badge */}
      <div className="absolute -left-6 bottom-12 bg-white border border-blue-100 shadow-lg rounded-xl px-3 py-2 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
            <rect x="1" y="1" width="8" height="10" rx="1" stroke="white" strokeWidth="1.2"/>
            <path d="M3 4h4M3 6h4M3 8h2" stroke="white" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-800">Protocol imported</div>
          <div className="text-xs text-slate-400">47 steps extracted</div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden" style={{ background: "linear-gradient(160deg, #0f1f3d 0%, #162548 40%, #1a2f5a 70%, #1e3a6e 100%)" }}>
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Radial glow center-left */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left copy */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            AI-powered clinical trial operations
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight" style={{ letterSpacing: "-0.03em" }}>
            Your protocol PDF,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
              turned into a workflow
            </span>{" "}
            your team can actually run.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-blue-100/70 leading-relaxed max-w-lg">
            Easi extracts inclusion/exclusion criteria, visit schedules, labs, and adverse event requirements — then turns them into structured checklists, reminders, and an audit-ready system your site can trust.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="https://calendly.com/harshita-easitrials/30min"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/40 hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              Book a demo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-white/80 font-semibold px-6 py-3.5 rounded-xl border border-white/20 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor"/>
              </svg>
              See how it works
            </a>
          </div>

        </div>

        {/* Right: Dashboard mockup — hidden on small screens */}
        <div className="hidden lg:block">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

// ─── Logos ───────────────────────────────────────────────────────────────────
function LogoBar() {
  const logos = ["Memorial Sloan Kettering", "UCSF Clinical Trials", "Duke Clinical Research", "Mayo Clinic Sites", "Johns Hopkins CTU"];
  return (
    <section className="py-12 border-y border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
          Trusted by research sites across the country
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 opacity-40">
          {logos.map((name) => (
            <span key={name} className="text-slate-600 font-semibold text-sm tracking-tight">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem Section ─────────────────────────────────────────────────────────
function ProblemSection() {
  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
        <div className="inline-block bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest">
          The problem
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
          Protocols are 200-page documents.<br />
          <span className="text-slate-400">Your team runs them from memory and spreadsheets.</span>
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Coordinators spend hours manually decoding protocols, building trackers from scratch, and hoping nothing falls through the cracks before the next monitoring visit.
        </p>

        <div className="grid md:grid-cols-3 gap-6 pt-8 text-left">
          {[
            {
              icon: "📄",
              title: "Hours lost to protocol review",
              desc: "Coordinators manually re-read protocols before every visit to find the right labs, exclusion criteria, or timing windows.",
            },
            {
              icon: "⚠️",
              title: "Missed steps = deviations",
              desc: "One overlooked eligibility criterion or delayed lab draw becomes a protocol deviation — and a sponsor finding.",
            },
            {
              icon: "📊",
              title: "Spreadsheets don't scale",
              desc: "Tracking AEs, deviations, and consent timelines across 10+ participants in Excel is a compliance risk waiting to happen.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-3">
              <div className="text-2xl">{icon}</div>
              <div className="font-semibold text-white">{title}</div>
              <div className="text-sm text-slate-400 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload your protocol PDF",
      desc: "Drop in your IRB-approved protocol. Easi parses the full document — eligibility criteria, visit windows, required assessments, lab panels, and timelines.",
      tag: "< 2 minutes",
    },
    {
      num: "02",
      title: "Easi builds your operational workflow",
      desc: "Every visit gets a structured checklist. Inclusion/exclusion criteria become a screening workflow. AE and deviation categories are pre-configured to match your protocol.",
      tag: "Automated",
    },
    {
      num: "03",
      title: "Run your trial with confidence",
      desc: "Coordinators follow step-by-step visit checklists, log events in real time, get reminders for upcoming windows, and maintain a complete audit trail automatically.",
      tag: "Audit-ready",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest">
            How it works
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">From protocol to execution in minutes</h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            No setup fees. No custom implementation. Upload your protocol and your team is operational the same day.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-blue-200 to-transparent" />

          <div className="space-y-12">
            {steps.map(({ num, title, desc, tag }, i) => (
              <div
                key={num}
                className={cn(
                  "flex flex-col lg:flex-row items-center gap-8",
                  i % 2 !== 0 && "lg:flex-row-reverse"
                )}
              >
                {/* Text */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{num}</span>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{tag}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
                  <p className="text-slate-500 leading-relaxed">{desc}</p>
                </div>

                {/* Visual */}
                <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-8 flex items-center justify-center min-h-48">
                  <div className="overflow-x-auto w-full">
                    {i === 0 && <UploadVisual />}
                    {i === 1 && <WorkflowVisual />}
                    {i === 2 && <AuditVisual />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Upload Protocol screen — matches real app
function UploadVisual() {
  const [progress, setProgress] = useState(0);
  const [pass, setPass] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(t); return 100; } return p + 2; });
      setPass(p => Math.min(4, Math.floor(progress / 20)));
    }, 60);
    return () => clearInterval(t);
  }, [progress]);

  const passes = [
    "Pass 1 — Document Intelligence",
    "Pass 2 — Objectives & Eligibility",
    "Pass 3 — Safety Architecture",
    "Pass 4 — Compliance Rules Engine",
    "Pass 5 — Independent Verification",
  ];

  return (
    <div className="w-full space-y-3" style={{ transform: "perspective(800px) rotateY(-4deg) rotateX(2deg)" }}>
      {/* Upload box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="text-sm font-bold text-slate-800">Upload Your Protocol</div>
          <div className="text-xs text-slate-400 mt-0.5">AI reads the full document across 5 passes</div>
        </div>
        <div className="p-4">
          <div className="border-2 border-dashed border-blue-200 rounded-xl p-5 text-center bg-blue-50/40">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V3m0 0L8 7m4-4 4 4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="text-xs font-semibold text-slate-700">Drop your protocol PDF here</div>
            <div className="text-xs text-blue-500 mt-0.5">or browse files</div>
            <div className="text-xs text-slate-400 mt-1">PDF only · max 50MB · all pages extracted</div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">AUR-101_Protocol_v3.2.pdf</span>
              <span className="text-blue-600 font-semibold">{progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
      {/* 5-pass pipeline */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-3 space-y-1.5">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">5-Pass Comprehension Pipeline</div>
        {passes.map((p, i) => (
          <div key={p} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all", i <= pass ? "bg-blue-50" : "")}>
            <div className={cn("w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border", i < pass ? "bg-emerald-500 border-emerald-500" : i === pass ? "border-blue-500" : "border-slate-200")}>
              {i < pass && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              {i === pass && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
            </div>
            <span className={cn("text-xs font-medium", i <= pass ? "text-slate-800" : "text-slate-400")}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Patient Board kanban — matches real app
function WorkflowVisual() {
  const cols = [
    { label: "Consent", count: 2, color: "bg-amber-400", patients: [
      { id: "PT-018", days: "2d", status: "Eligibility Review Required", due: "Due in 3d", dot: "bg-red-400" },
      { id: "PT-009", days: "5d", status: "ICF Signature Pending", due: "Due in 2d", dot: "bg-red-400" },
    ]},
    { label: "Active Treatment", count: 4, color: "bg-blue-500", patients: [
      { id: "PT-007", days: "18d", status: "Visit 4 — Day 84 Assessment", due: "Due in 5d", dot: "bg-red-400" },
      { id: "PT-003", days: "45d", status: "Visit 5 — Day 112 Assessment", due: "Due in 12d", dot: "bg-emerald-400" },
    ]},
    { label: "Follow-Up", count: 1, color: "bg-emerald-400", patients: [
      { id: "PT-015", days: "22d", status: "Follow-Up Call Scheduled", due: "", dot: "bg-emerald-400" },
    ]},
    { label: "Complete", count: 1, color: "bg-slate-300", patients: [
      { id: "PT-005", days: "0d", status: "Trial Complete", due: "", dot: "bg-emerald-400" },
    ]},
  ];

  return (
    <div className="w-full" style={{ transform: "perspective(900px) rotateY(-3deg) rotateX(2deg)" }}>
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="text-sm font-bold text-slate-800">Patient Board</div>
          <div className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg">+ Enroll Patient</div>
        </div>
        <div className="flex gap-0 overflow-hidden" style={{ height: "220px" }}>
          {cols.map(({ label, count, color, patients }) => (
            <div key={label} className="flex-1 border-r border-slate-100 last:border-r-0 flex flex-col">
              <div className="px-2 py-2 border-b border-slate-100 flex items-center gap-1.5">
                <div className={cn("w-2 h-2 rounded-full", color)} />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</span>
                <span className="text-xs text-slate-400 ml-auto">{count}</span>
              </div>
              <div className="flex-1 p-1.5 space-y-1.5 overflow-hidden">
                {patients.map(({ id, days, status, due, dot }) => (
                  <div key={id} className="bg-white border border-slate-200 rounded-lg p-2 shadow-sm">
                    <div className="flex items-center gap-1 mb-0.5">
                      <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} />
                      <span className="text-xs font-bold text-slate-800">{id}</span>
                      <span className="text-xs text-slate-400 ml-auto">{days}</span>
                    </div>
                    <div className="text-xs text-slate-500 leading-tight">{status}</div>
                    {due && <div className="text-xs text-red-500 font-medium mt-1">{due}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Trial Health home — matches real app
function AuditVisual() {
  return (
    <div className="w-full space-y-2" style={{ transform: "perspective(900px) rotateY(-3deg) rotateX(2deg)" }}>
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-lg px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-900">Good afternoon, CRC</div>
            <div className="text-xs text-slate-400">No pending reviews — all trials look good</div>
          </div>
          <div className="bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg">+ Add Trial</div>
        </div>
      </div>
      {/* Trial health cards */}
      {[
        { name: "AUR-101 Safety & Efficacy in Advanced NSCLC", id: "ONCO-2024-01", phase: "Phase II", status: "At risk", statusColor: "text-red-500", enrollment: 18, overdue: 2, deviations: 0, aes: 0, dot: "bg-red-500", border: "border-red-100" },
        { name: "CardioVex Dose-Ranging Study", id: "CARD-2023-08", phase: "Phase III", status: "Needs attention", statusColor: "text-amber-500", enrollment: 12, overdue: 0, deviations: 0, aes: 0, dot: "bg-amber-400", border: "border-slate-200" },
      ].map(({ name, id, phase, status, statusColor, enrollment, overdue, deviations, aes, dot, border }) => (
        <div key={id} className={cn("bg-white rounded-xl border shadow-md p-3", border)}>
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("w-2 h-2 rounded-full flex-shrink-0", dot)} />
            <span className="text-xs font-bold text-slate-800 truncate">{name}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-slate-400">{id}</span>
            <span className="text-xs text-slate-400">{phase}</span>
            <span className={cn("text-xs font-semibold", statusColor)}>{status}</span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center">
            {[["Enrollment", enrollment, "text-slate-700"], ["Overdue", overdue, overdue > 0 ? "text-red-600" : "text-slate-500"], ["Deviations", deviations, "text-slate-500"], ["SAEs", aes, "text-slate-500"]].map(([l, v, c]) => (
              <div key={l} className="bg-slate-50 rounded-lg py-1.5">
                <div className={cn("text-sm font-bold", c)}>{v}</div>
                <div className="text-xs text-slate-400">{l}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 11h14M11 4v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="11" cy="11" r="3" fill="currentColor" opacity=".3"/>
        </svg>
      ),
      title: "Protocol-driven screening",
      desc: "Inclusion and exclusion criteria are extracted directly from your protocol and turned into a guided screening workflow. No manual transcription.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="3" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M7 11l2.5 2.5 5.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Visit checklists",
      desc: "Each visit has a structured, protocol-aligned checklist. Coordinators complete steps in order, and nothing gets forgotten before a monitoring visit.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M11 7v4l2.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
      title: "Visit window reminders",
      desc: "Easi calculates allowable visit windows from your protocol and alerts the team when participants are approaching or outside their window.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 3l2 5h5l-4 3 1.5 5L11 13l-4.5 3 1.5-5-4-3h5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Adverse event tracking",
      desc: "Log AEs with the correct severity grading, causality, and reporting timelines pulled from your protocol. Get notified when SAE reporting windows are approaching.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M5 5h12M5 9h12M5 13h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="16" cy="16" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M14.8 16.8l.8.8 1.6-1.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Deviation management",
      desc: "Document protocol deviations with structured root cause analysis, corrective action plans, and sponsor notification records — all tied to your audit log.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 17l5-5 3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="3" y="3" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" opacity=".3"/>
        </svg>
      ),
      title: "Audit-ready logs",
      desc: "Every action in Easi is time-stamped, user-attributed, and exportable. Walk into any monitoring visit or audit with a complete, clean record.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest">
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Built for how clinical trials actually run</h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Every feature maps to a real operational task your coordinators do every day — just without the manual overhead.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                {icon}
              </div>
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── App Showcase ────────────────────────────────────────────────────────────
function AppShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const [animating, setAnimating] = useState(false);

  const tabs = [
    { id: 0, label: "Trial Health", icon: "🏥" },
    { id: 1, label: "Patient Board", icon: "👥" },
    { id: 2, label: "Deviations", icon: "⚠️" },
    { id: 3, label: "Activity Log", icon: "📋" },
  ];

  const switchTab = (id) => {
    if (id === activeTab) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveTab(id);
      setAnimating(false);
    }, 200);
  };

  return (
    <section className="py-28 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest">
            See it in action
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Every screen built for the CRC</h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Easi surfaces exactly what your coordinators need, when they need it — no digging through folders.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => switchTab(id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
                activeTab === id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Screen */}
        <div
          className="transition-all duration-200 overflow-x-auto pb-4"
          style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(8px)" : "translateY(0)" }}
        >
          {activeTab === 0 && <ShowcaseTrialHealth />}
          {activeTab === 1 && <ShowcasePatientBoard />}
          {activeTab === 2 && <ShowcaseDeviations />}
          {activeTab === 3 && <ShowcaseActivityLog />}
        </div>
      </div>
    </section>
  );
}

// ── shared sidebar used across all showcase screens ──────────────────────────
function ShowcaseSidebar({ active }) {
  const items = [
    { icon: "⊞", label: "Trial Health" },
    { icon: "👥", label: "Patient Board" },
    { icon: "📋", label: "Deviations" },
    { icon: "⚠", label: "Adverse Events" },
    { icon: "✓", label: "Audit Log" },
  ];
  return (
    <div className="showcase-sidebar w-44 bg-slate-900 p-3 flex-shrink-0 flex flex-col gap-1">
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="relative w-6 h-6 flex-shrink-0">
          <div className="absolute inset-0 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600" />
          <svg width="24" height="24" viewBox="0 0 36 36" fill="none" className="relative z-10">
            <rect x="10" y="10" width="16" height="3" rx="1.5" fill="white"/>
            <rect x="10" y="16.5" width="11" height="3" rx="1.5" fill="white" opacity="0.8"/>
            <rect x="10" y="23" width="16" height="3" rx="1.5" fill="white"/>
            <circle cx="27" cy="18" r="2" fill="#93c5fd"/>
          </svg>
        </div>
        <span className="text-white font-extrabold text-sm" style={{ letterSpacing: "-0.04em" }}>easi</span>
      </div>
      {items.map(({ icon, label }) => (
        <div key={label} className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all", label === active ? "bg-blue-600 text-white" : "text-slate-400")}>
          <span>{icon}</span>{label}
        </div>
      ))}
    </div>
  );
}

// ── chrome bar ────────────────────────────────────────────────────────────────
function WindowChrome({ title, right }) {
  return (
    <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50/90 flex-shrink-0">
      <div className="w-3 h-3 rounded-full bg-red-400" />
      <div className="w-3 h-3 rounded-full bg-amber-400" />
      <div className="w-3 h-3 rounded-full bg-emerald-400" />
      <span className="ml-3 text-xs font-medium text-slate-400">{title}</span>
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}

// Showcase: Trial Health overview
function ShowcaseTrialHealth() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2800);
    return () => clearInterval(id);
  }, []);

  // Enrollment bar widths animate on mount
  const bars = [
    { label: "AUR-101", pct: 72, color: "bg-red-400" },
    { label: "CardioVex", pct: 48, color: "bg-amber-400" },
    { label: "BEACON-301", pct: 32, color: "bg-blue-500" },
  ];

  const trials = [
    { name: "AUR-101 — Advanced NSCLC Safety Study", id: "ONCO-2024-01", phase: "Phase II", enrolled: 18, overdue: 2, dev: 0, status: "At risk", dot: "bg-red-400", badge: "bg-red-100 text-red-700", cls: "card-in-1 border-red-100 bg-red-50/30" },
    { name: "CardioVex Dose-Ranging Study", id: "CARD-2023-08", phase: "Phase III", enrolled: 12, overdue: 0, dev: 1, status: "Needs attention", dot: "bg-amber-400", badge: "bg-amber-100 text-amber-700", cls: "card-in-2 border-amber-100 bg-amber-50/20" },
    { name: "BEACON-301 Immunotherapy Trial", id: "IMMU-2024-04", phase: "Phase II", enrolled: 8, overdue: 0, dev: 0, status: "On track", dot: "bg-emerald-400", badge: "bg-emerald-100 text-emerald-700", cls: "card-in-3 border-slate-200 bg-white" },
  ];

  return (
    <div className="relative mx-auto showcase-tilt" style={{ maxWidth: 860 }}>
      <div className="shadow-glow absolute inset-0 translate-y-8 blur-3xl bg-blue-600/25 rounded-3xl" />
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <WindowChrome title="app.easi.com/dashboard" right={
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live
          </div>
        } />
        <div className="flex" style={{ minHeight: "min(430px, 60vw)" }}>
          <ShowcaseSidebar active="Trial Health" />
          <div className="flex-1 p-5 bg-white space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Good afternoon, Sarah 👋</h2>
                <p className="text-xs text-slate-400 mt-0.5">2 trials need your attention today</p>
              </div>
              <button className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl">+ Add Trial</button>
            </div>

            {/* Stat cards with count-in stagger */}
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { label: "Active Trials", value: "4", color: "text-slate-800", bg: "bg-slate-50", cls: "card-in-1" },
                { label: "Enrolled", value: "38", color: "text-blue-600", bg: "bg-blue-50", cls: "card-in-2" },
                { label: "Overdue", value: "3", color: "text-red-600", bg: "bg-red-50", cls: "card-in-3" },
                { label: "Deviations", value: "1", color: "text-amber-600", bg: "bg-amber-50", cls: "card-in-4" },
              ].map(({ label, value, color, bg, cls }) => (
                <div key={label} className={cn("rounded-xl p-3", bg, cls)}>
                  <div className={cn("text-2xl font-bold", color)}>{value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Enrollment progress bars */}
            <div className="bg-slate-50 rounded-xl p-3 space-y-2.5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Enrollment Progress</div>
              {bars.map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">{label}</span>
                    <span className="text-slate-400">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full bar-fill", color)}
                      style={{ "--bar-w": `${pct}%`, width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Trial cards */}
            <div className="space-y-2">
              {trials.map(({ name, id, phase, enrolled, overdue, dev, status, dot, badge, cls }) => (
                <div key={id} className={cn("rounded-xl border p-3 flex items-center gap-3", cls)}>
                  <div className={cn("relative w-2.5 h-2.5 rounded-full flex-shrink-0", dot)}>
                    {overdue > 0 && <span className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: "currentColor" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">{name}</div>
                    <div className="text-xs text-slate-400">{id} · {phase}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 text-center">
                    <div><div className="text-xs font-bold text-slate-700">{enrolled}</div><div className="text-xs text-slate-400">Enrolled</div></div>
                    <div><div className={cn("text-xs font-bold", overdue > 0 ? "text-red-600" : "text-slate-400")}>{overdue}</div><div className="text-xs text-slate-400">Overdue</div></div>
                    <div><div className={cn("text-xs font-bold", dev > 0 ? "text-amber-600" : "text-slate-400")}>{dev}</div><div className="text-xs text-slate-400">Devs</div></div>
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", badge)}>{status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Showcase: Patient Board kanban
function ShowcasePatientBoard() {
  const [highlightCol, setHighlightCol] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setHighlightCol(c => (c + 1) % 4), 3000);
    return () => clearInterval(id);
  }, []);

  const cols = [
    { label: "Screening", count: 2, color: "bg-purple-400", ring: "ring-purple-200", items: [
      { id: "PT-021", name: "J. Martinez", status: "Eligibility review", urgent: true, visit: "Screen Day", cls: "card-in-1" },
      { id: "PT-022", name: "A. Chen", status: "Lab results pending", urgent: false, visit: "Screen Day", cls: "card-in-2" },
    ]},
    { label: "Active Treatment", count: 4, color: "bg-blue-500", ring: "ring-blue-200", items: [
      { id: "PT-007", name: "R. Thompson", status: "Visit 4 — Day 84", urgent: true, visit: "Due in 2d", cls: "card-in-1" },
      { id: "PT-003", name: "L. Kim", status: "Visit 5 — Day 112", urgent: false, visit: "Due in 12d", cls: "card-in-2" },
      { id: "PT-011", name: "M. Davis", status: "Visit 3 — Day 56", urgent: false, visit: "Due in 8d", cls: "card-in-3" },
    ]},
    { label: "Follow-Up", count: 1, color: "bg-emerald-400", ring: "ring-emerald-200", items: [
      { id: "PT-015", name: "P. Nguyen", status: "Follow-up call", urgent: false, visit: "Scheduled", cls: "card-in-1" },
    ]},
    { label: "Complete", count: 1, color: "bg-slate-300", ring: "ring-slate-200", items: [
      { id: "PT-005", name: "D. Wilson", status: "All visits done", urgent: false, visit: "Completed", cls: "card-in-1" },
    ]},
  ];

  return (
    <div className="relative mx-auto showcase-tilt" style={{ maxWidth: 860 }}>
      <div className="shadow-glow absolute inset-0 translate-y-8 blur-3xl bg-indigo-600/20 rounded-3xl" />
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <WindowChrome title="Patient Board · AUR-101" right={
          <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-lg">+ Enroll Patient</div>
        } />
        <div className="flex" style={{ minHeight: "min(420px, 60vw)" }}>
          <ShowcaseSidebar active="Patient Board" />
          <div className="flex-1 p-4 overflow-hidden">
            <div className="grid grid-cols-4 gap-3 h-full">
              {cols.map(({ label, count, color, ring, items }, ci) => (
                <div key={label} className={cn("flex flex-col rounded-xl transition-all duration-500", highlightCol === ci ? cn("ring-2", ring, "bg-slate-50/60") : "")}>
                  <div className="flex items-center gap-2 mb-2.5 px-1 pt-1">
                    <div className={cn("w-2 h-2 rounded-full", color)} />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{label}</span>
                    <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-1.5 ml-auto">{count}</span>
                  </div>
                  <div className="space-y-2 flex-1 px-1 pb-1">
                    {items.map(({ id, name, status, urgent, visit, cls }) => (
                      <div key={id} className={cn("bg-white border rounded-xl p-2.5 shadow-sm transition-shadow hover:shadow-md", urgent ? "border-red-200" : "border-slate-200", cls)}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div className={cn("relative w-1.5 h-1.5 rounded-full", urgent ? "bg-red-400" : "bg-emerald-400")}>
                            {urgent && <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75" />}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{id}</span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium">{name}</div>
                        <div className="text-xs text-slate-400 leading-tight">{status}</div>
                        <div className={cn("text-xs font-semibold mt-1", urgent ? "text-red-500" : "text-slate-400")}>{visit}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Showcase: Deviations
function ShowcaseDeviations() {
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setResolving(true), 3500);
    const t2 = setTimeout(() => { setResolving(false); setResolved(true); }, 5200);
    const t3 = setTimeout(() => setResolved(false), 8000);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div className="relative mx-auto showcase-tilt" style={{ maxWidth: 860 }}>
      <div className="shadow-glow absolute inset-0 translate-y-8 blur-3xl bg-amber-600/15 rounded-3xl" />
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <WindowChrome title="Deviation Management · ONCO-2024-01" />
        <div className="flex" style={{ minHeight: "min(420px, 60vw)" }}>
          <ShowcaseSidebar active="Deviations" />
          <div className="flex-1 p-5 space-y-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Protocol Deviations</h3>
                <p className="text-xs text-slate-400 mt-0.5">{resolved ? "0 open · 4 resolved" : "1 open · 3 resolved this cycle"}</p>
              </div>
              <button className="bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">+ Log Deviation</button>
            </div>

            {/* Open deviation — animates to resolved */}
            <div className={cn("rounded-xl p-4 space-y-3 transition-all duration-700 border", resolved ? "bg-emerald-50/60 border-emerald-200" : "border-amber-200 bg-amber-50/40")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-bold px-2 py-0.5 rounded-md transition-all duration-500", resolved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                    {resolved ? "DONE" : "OPEN"}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">DEV-004 · Visit Window Exceeded</span>
                </div>
                <span className="text-xs text-slate-400">PT-007</span>
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                Day 84 assessment completed on Day 87. Window ±3 days per Section 6.3 — borderline deviation requiring documentation.
              </div>
              <div className="grid grid-cols-3 gap-2 card-in-1">
                {[
                  { label: "Root Cause", val: "Patient scheduling conflict" },
                  { label: "CAPA", val: "7d early reminder added" },
                  { label: "Sponsor", val: resolved ? "✓ Notified" : "Pending — Due 1d" },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-white border border-slate-200 rounded-lg p-2">
                    <div className="text-xs font-bold text-slate-700">{label}</div>
                    <div className={cn("text-xs mt-0.5", label === "Sponsor" && !resolved ? "text-amber-600 font-semibold" : "text-slate-500")}>{val}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  className={cn("flex-1 text-white text-xs font-semibold py-2 rounded-lg transition-all duration-300", resolving ? "bg-emerald-500 scale-95" : resolved ? "bg-emerald-600" : "bg-slate-900")}
                >
                  {resolving ? "Resolving…" : resolved ? "✓ Resolved" : "Mark Resolved"}
                </button>
                <button className="px-4 bg-white border border-slate-200 text-slate-600 text-xs font-semibold py-2 rounded-lg">Export PDF</button>
              </div>
            </div>

            {/* Resolved list */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Resolved This Cycle</div>
              {[
                { id: "DEV-003", desc: "Missed lab draw — Day 56 window", resolved: "4d ago", cls: "card-in-1" },
                { id: "DEV-002", desc: "Consent re-signing required", resolved: "12d ago", cls: "card-in-2" },
                { id: "DEV-001", desc: "Eligibility re-check missed", resolved: "18d ago", cls: "card-in-3" },
              ].map(({ id, desc, resolved: r, cls }) => (
                <div key={id} className={cn("flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5", cls)}>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md">DONE</span>
                  <span className="text-xs font-medium text-slate-600 flex-1">{id} · {desc}</span>
                  <span className="text-xs text-slate-400">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Showcase: Activity Log — live ticker
function ShowcaseActivityLog() {
  const allEntries = [
    { time: "2:47 PM", user: "S. Patel (CRC)", type: "Visit", msg: "Visit 4 checklist completed for PT-007 — all 12 steps verified", color: "bg-blue-500" },
    { time: "2:31 PM", user: "System", type: "Alert", msg: "Visit window for PT-007 closes in 2 days — Day 84 assessment due", color: "bg-amber-500" },
    { time: "1:15 PM", user: "S. Patel (CRC)", type: "AE", msg: "Grade 2 fatigue logged for PT-003 — causality: possibly related", color: "bg-red-400" },
    { time: "11:52 AM", user: "Dr. J. Chen (PI)", type: "Review", msg: "Adverse event DEV-003 reviewed and signed off by PI", color: "bg-indigo-500" },
    { time: "11:14 AM", user: "S. Patel (CRC)", type: "Consent", msg: "Informed consent re-signed by PT-009 — version 2.1 acknowledged", color: "bg-emerald-500" },
    { time: "10:30 AM", user: "System", type: "Reminder", msg: "3 patients have upcoming visits this week", color: "bg-slate-400" },
    { time: "9:05 AM", user: "S. Patel (CRC)", type: "Screen", msg: "Screening workflow started for PT-022 — eligibility checklist opened", color: "bg-purple-500" },
    { time: "Yesterday", user: "S. Patel (CRC)", type: "Deviation", msg: "DEV-004 logged: Visit window exceeded for PT-007 — CAPA documented", color: "bg-amber-400" },
  ];

  const [visibleCount, setVisibleCount] = useState(3);
  const [newEntryKey, setNewEntryKey] = useState(0);

  useEffect(() => {
    // Reveal entries one by one on mount
    const revealId = setInterval(() => {
      setVisibleCount(c => {
        if (c >= allEntries.length) { clearInterval(revealId); return c; }
        return c + 1;
      });
    }, 500);
    // Occasionally flash a new entry at the top
    const pingId = setInterval(() => setNewEntryKey(k => k + 1), 4000);
    return () => { clearInterval(revealId); clearInterval(pingId); };
  }, []);

  const entries = allEntries.slice(0, visibleCount);

  return (
    <div className="relative mx-auto showcase-tilt" style={{ maxWidth: 860 }}>
      <div className="shadow-glow absolute inset-0 translate-y-8 blur-3xl bg-blue-600/15 rounded-3xl" />
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <WindowChrome title="Audit Log · ONCO-2024-01" right={
          <div className="flex items-center gap-2">
            <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <span className="relative flex w-1.5 h-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Audit-ready
            </div>
            <div className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg">Export</div>
          </div>
        } />
        <div className="flex" style={{ minHeight: "min(420px, 60vw)" }}>
          <ShowcaseSidebar active="Audit Log" />
          <div className="flex-1 p-5 overflow-hidden relative">
            {/* Scanning line */}
            <div className="scan-line" />
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Activity Log</h3>
                <p className="text-xs text-slate-400 mt-0.5">Every action time-stamped and attributed</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
                </span>
                Live feed
              </div>
            </div>
            <div className="space-y-0">
              {entries.map(({ time, user, type, msg, color }, i) => (
                <div
                  key={`${i}-${newEntryKey}`}
                  className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0"
                  style={{ animation: `card-in 0.35s ease forwards ${i * 0.06}s`, opacity: 0 }}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5", color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn("text-xs font-bold px-2 py-0.5 rounded-md text-white", color)}>{type}</span>
                      <span className="text-xs text-slate-700 font-medium">{user}</span>
                      <span className="text-xs text-slate-400 ml-auto flex-shrink-0">{time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stats ───────────────────────────────────────────────────────────────────
function Stats() {
  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {[
          { value: "< 5 min", label: "Protocol import time" },
          { value: "~8 hrs", label: "Saved per week per coordinator" },
          { value: "Zero", label: "Spreadsheets required" },
          { value: "100%", label: "Audit trail coverage" },
        ].map(({ value, label }) => (
          <div key={label} className="space-y-2">
            <div className="text-4xl font-bold text-blue-600">{value}</div>
            <div className="text-sm text-slate-500 font-medium">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────
function Testimonials() {
  const quotes = [
    {
      text: "We used to spend the first hour of every visit prep just reading through the protocol again. With Easi, that time is gone. The checklist is right there.",
      name: "Clinical Research Coordinator",
      site: "Academic Medical Center, Phase II Oncology Trial",
    },
    {
      text: "The AE tracking alone is worth it. We know exactly what needs to be reported, when, and we have the documentation ready before the monitor asks.",
      name: "Site Manager",
      site: "Community Research Site, Phase III Cardiology Study",
    },
    {
      text: "Our last monitoring visit had zero findings. That's never happened. The audit log is just clean — everything is documented exactly how it should be.",
      name: "Principal Investigator",
      site: "University Research Institute",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest">
            From the field
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">What research teams say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map(({ text, name, site }) => (
            <div key={name} className="bg-white border border-slate-200 rounded-2xl p-7 space-y-5 flex flex-col">
              <div className="text-3xl text-blue-200 font-serif leading-none">"</div>
              <p className="text-slate-700 leading-relaxed flex-1 text-sm">
                {text}
              </p>
              <div>
                <div className="font-semibold text-slate-900 text-sm">{name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{site}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Ready to stop running trials from a spreadsheet?
        </h2>
        <p className="text-xl text-blue-200 max-w-xl mx-auto">
          See how Easi turns your next protocol into a workflow your whole site can execute on — starting day one.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://calendly.com/harshita-easitrials/30min"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Book a demo
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-xl border border-white/30 hover:bg-white/10 transition-colors"
          >
            See how it works
          </a>
        </div>
        <p className="text-sm text-blue-300">No commitment required · Works with any protocol PDF</p>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 flex-shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700" />
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none" className="relative z-10">
                  <rect x="10" y="10" width="16" height="3" rx="1.5" fill="white"/>
                  <rect x="10" y="16.5" width="11" height="3" rx="1.5" fill="white" opacity="0.8"/>
                  <rect x="10" y="23" width="16" height="3" rx="1.5" fill="white"/>
                  <circle cx="27" cy="18" r="2" fill="#93c5fd"/>
                </svg>
              </div>
              <span className="text-white font-extrabold text-lg" style={{ letterSpacing: "-0.04em" }}>easi</span>
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered clinical trial operations for sites that can't afford to miss a step.
            </p>
          </div>

          {[
            {
              heading: "Product",
              links: ["Protocol import", "Visit checklists", "AE tracking", "Deviation management", "Audit logs"],
            },
            {
              heading: "For teams",
              links: ["Research coordinators", "Site managers", "Principal investigators", "Sponsor oversight"],
            },
            {
              heading: "Company",
              links: ["About", "Careers", "Privacy policy", "Terms of service", "Contact"],
            },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <div className="text-white font-semibold text-sm mb-4">{heading}</div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2025 Easi Health Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1l1 3h3l-2.5 2 1 3L6 7.5 3.5 9l1-3L2 4h3z" fill="#10b981"/>
              </svg>
              HIPAA-ready
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1l1 3h3l-2.5 2 1 3L6 7.5 3.5 9l1-3L2 4h3z" fill="#10b981"/>
              </svg>
              SOC 2 compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function EasiLandingPage() {
  return (
    <div className="font-sans antialiased text-slate-900">
      <GlobalStyles />
      <Navbar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <Features />
      <AppShowcase />
      <Stats />
      <CTA />
      <Footer />

    </div>
  );
}
