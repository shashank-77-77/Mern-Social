import React from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   ABOUT — DEVELOPER / SYSTEMS / PRODUCT ENGINEERING
   Single-source narrative, production-safe
========================================================= */

export default function About() {
  const navigate = useNavigate();

  return (
    <section
      id="about"
      className="border-b border-slate-800/70 py-14 sm:py-16"
    >
      <div className="section-shell fade-in">
        {/* ===============================
            HEADER
           =============================== */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl bg-gradient-to-r from-slate-50 to-sky-200 bg-clip-text text-transparent">
            About the Developer
          </h2>

          <button
            onClick={() => navigate("/developer")}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[0.7rem] font-medium text-slate-300 hover:border-sky-500/60 hover:bg-sky-500/10 transition-all duration-300 glow-pulse"
          >
            View Developer Page →
          </button>
        </div>

        {/* ===============================
            CONTENT GRID
           =============================== */}
        <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-start">
          {/* ===============================
              NARRATIVE
             =============================== */}
          <div className="space-y-4 text-sm leading-relaxed text-slate-300 sm:text-[0.95rem] stagger-animation">
            <p className="transition-all duration-300 hover:translate-x-1">
              I build systems that remain predictable under pressure — whether that
              pressure comes from real-time users, asynchronous networks, or
              incomplete data. My work focuses on designing software that scales
              cleanly, fails gracefully, and stays understandable months after it
              ships.
            </p>

            <p className="transition-all duration-300 hover:translate-x-1">
              Most of my projects live at the intersection of{" "}
              <span className="text-sky-300">full-stack engineering</span>,{" "}
              <span className="text-sky-300">distributed systems</span>, and{" "}
              <span className="text-sky-300">product-driven development</span>. I
              care deeply about architecture decisions, data flow clarity, and
              building interfaces that communicate intent instead of noise.
            </p>

            <p className="transition-all duration-300 hover:translate-x-1">
              I optimize for long-term maintainability over short-term cleverness.
              That means clear boundaries, explicit state, and tooling that makes
              the right thing the easy thing. Features exist to solve real problems,
              not to inflate surface area.
            </p>

            <p className="transition-all duration-300 hover:translate-x-1">
              Outside of active development, I spend time reviewing system designs,
              studying production failures, and refining how engineering decisions
              translate into user trust and business leverage.
            </p>
          </div>

          {/* ===============================
              STACK + OPERATING PRINCIPLES
             =============================== */}
          <div className="space-y-4">
            {/* Stack */}
            <div className="glass-panel rounded-2xl p-4 text-xs text-slate-200 float-animation hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-500">
              <h3 className="mb-2 text-sm font-semibold text-slate-50 bg-gradient-to-r from-slate-50 to-sky-200 bg-clip-text text-transparent">
                Technical stack
              </h3>

              <dl className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">
                    Frontend
                  </dt>
                  <dd className="mt-1">
                    React · Vite · Tailwind · Framer Motion
                  </dd>
                </div>

                <div>
                  <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">
                    Backend
                  </dt>
                  <dd className="mt-1">
                    Node.js · Express · REST APIs · JWT
                  </dd>
                </div>

                <div>
                  <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">
                    Data
                  </dt>
                  <dd className="mt-1">
                    MongoDB · Mongoose · Schema design
                  </dd>
                </div>

                <div>
                  <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">
                    Tooling
                  </dt>
                  <dd className="mt-1">
                    Git · Linux · Docker · Postman · Swagger 
                  </dd>
                </div>
              </dl>
            </div>

            {/* Principles */}
            <div
              className="glass-panel rounded-2xl p-4 text-xs text-slate-200 float-animation hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-500"
              style={{ animationDelay: "1s" }}
            >
              <h3 className="mb-2 text-sm font-semibold text-slate-50 bg-gradient-to-r from-slate-50 to-sky-200 bg-clip-text text-transparent">
                Operating principles
              </h3>

              <ul className="space-y-2 list-disc pl-4">
                <li className="transition-all duration-300 hover:translate-x-1 hover:text-sky-200">
                  Prefer clarity over abstraction unless scale demands otherwise.
                </li>
                <li className="transition-all duration-300 hover:translate-x-1 hover:text-sky-200">
                  Ship incrementally, measure behavior, then refine.
                </li>
                <li className="transition-all duration-300 hover:translate-x-1 hover:text-sky-200">
                  Treat performance, security, and UX as first-class concerns.
                </li>
                <li className="transition-all duration-300 hover:translate-x-1 hover:text-sky-200">
                  Design systems that future engineers can reason about quickly.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ===============================
            MOBILE CTA
           =============================== */}
        <div className="mt-10 flex justify-center sm:hidden">
          <button
            onClick={() => navigate("/developer")}
            className="rounded-full border border-slate-700/80 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-300 hover:border-sky-500/60 hover:bg-sky-500/10 transition-all duration-300"
          >
            View Developer Details →
          </button>
        </div>
      </div>
    </section>
  );
}
