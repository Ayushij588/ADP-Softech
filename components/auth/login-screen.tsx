"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export type LoginPortal = "admin" | "super-admin";

const portalContent = {
  admin: {
    eyebrow: "Recruitment operations",
    panelName: "Recruitment Admin",
    title: "Welcome back",
    description: "Sign in to manage your hiring pipeline and connect great talent with opportunity.",
    badge: "Recruitment workspace",
    featureTitle: "Everything hiring, in one place.",
    featureDescription: "A focused workspace for the people, roles and decisions that move your hiring forward.",
    features: ["Manage jobs and applications", "Review candidates and ATS reports", "Track recruiting activity"],
    prompt: "Your next great hire starts here.",
    dashboardHref: "/admin/dashboard",
  },
  "super-admin": {
    eyebrow: "Platform administration",
    panelName: "Super Admin",
    title: "Administrator access",
    description: "Sign in to manage platform users, access policies and recruitment operations.",
    badge: "Restricted access · MFA ready",
    featureTitle: "The platform, at your fingertips.",
    featureDescription: "A secure control center for configuring and overseeing your ADP Softech environment.",
    features: ["Manage users and permissions", "Review platform settings and content", "Monitor audit activity"],
    prompt: "Built for confident platform oversight.",
    dashboardHref: "/super-admin/dashboard",
  },
} as const;

function BrandMark() {
  return (
    <div aria-label="ADP Softech" className="flex items-center gap-3">
      <span className="flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-sm font-bold tracking-tight text-white shadow-lg backdrop-blur-xl">ADP</span>
      <span className="text-sm font-bold tracking-[0.18em] text-white">SOFTECH</span>
    </div>
  );
}

export function LoginScreen({ portal }: { portal: LoginPortal }) {
  const router = useRouter();
  const content = portalContent[portal];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [feedback, setFeedback] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setFeedback("Enter both email address and password to continue.");
      return;
    }
    if (portal === "super-admin" && mfaCode.trim() && !/^\d{6}$/.test(mfaCode.trim())) {
      setFeedback("Enter a valid 6-digit MFA verification code or leave blank in demo mode.");
      return;
    }
    router.push(content.dashboardHref);
  }

  function handleForgotPassword() {
    setFeedback("Password reset is not connected in this frontend demo.");
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
        <section className="relative isolate flex min-h-[255px] flex-col justify-between overflow-hidden bg-[var(--brand-primary)] px-6 py-7 text-white sm:px-10 sm:py-9 lg:min-h-screen lg:px-14 lg:py-12 xl:px-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.24),transparent_48%)]" />
            <div className="absolute -left-36 top-1/3 size-[30rem] rounded-full border border-white/[0.07]" />
            <div className="absolute -left-20 top-[38%] size-[22rem] rounded-full border border-sky-300/[0.10]" />
            <div className="absolute -bottom-48 right-[-8rem] size-[27rem] rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex items-center justify-between gap-4">
            <BrandMark />
            <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-100 backdrop-blur-xl sm:text-xs">{content.badge}</span>
          </div>

          <div className="relative z-10 mt-9 max-w-xl lg:mt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">{content.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl xl:text-5xl">{content.featureTitle}</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-blue-100/80 sm:text-base sm:leading-7">{content.featureDescription}</p>

            <div className="mt-7 hidden max-w-md rounded-2xl border border-white/15 bg-white/[0.08] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:block lg:mt-10">
              <p className="text-sm font-semibold text-white">{content.prompt}</p>
              <ul className="mt-4 space-y-3">
                {content.features.map((feature) => <li className="flex items-center gap-3 text-sm text-blue-100/90" key={feature}><span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-[11px] font-bold text-sky-300">✓</span>{feature}</li>)}
              </ul>
            </div>
          </div>

          <div className="relative z-10 mt-8 hidden items-center justify-between text-xs text-blue-100/60 lg:flex">
            <span>ADP Softech · Recruitment platform</span>
            <span>Designed for people-first hiring</span>
          </div>
        </section>

        <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:min-h-screen lg:px-12 xl:px-16">
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-sky-200/40 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-28 size-96 rounded-full bg-blue-100/70 blur-3xl" />

          <div className="relative w-full max-w-md rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,35,70,0.12)] backdrop-blur-2xl sm:p-9">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-800">
              <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
                <path d="M7 10V7a5 5 0 0 1 10 0v3m-11 0h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                <path d="M12 14v3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
              </svg>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">{content.panelName}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{content.title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{content.description}</p>

            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-slate-700" htmlFor={`${portal}-email`}>Email address
                <input autoComplete="username" className="mt-2 w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100" id={`${portal}-email`} name="email" onChange={(event) => { setEmail(event.currentTarget.value); setFeedback(""); }} placeholder="you@company.com" required type="email" value={email} />
              </label>

              <label className="block text-sm font-medium text-slate-700" htmlFor={`${portal}-password`}>Password
                <input autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100" id={`${portal}-password`} name="password" onChange={(event) => { setPassword(event.currentTarget.value); setFeedback(""); }} placeholder="Enter your password" required type="password" value={password} />
              </label>

              {portal === "super-admin" && (
                <label className="block text-sm font-medium text-slate-700" htmlFor="super-admin-mfa">MFA code (optional in demo)
                  <input autoComplete="one-time-code" className="mt-2 w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100" id="super-admin-mfa" inputMode="numeric" maxLength={6} name="mfaCode" onChange={(event) => { setMfaCode(event.currentTarget.value); setFeedback(""); }} placeholder="6-digit authenticator code" value={mfaCode} />
                </label>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-slate-600" htmlFor={`${portal}-remember`}>
                  <input checked={rememberMe} className="size-4 rounded border-slate-300 text-blue-700 accent-blue-700 focus:ring-blue-600" id={`${portal}-remember`} onChange={(event) => setRememberMe(event.currentTarget.checked)} type="checkbox" />
                  Remember me
                </label>
                <button className="text-sm font-semibold text-blue-700 transition hover:text-blue-900" onClick={handleForgotPassword} type="button">Forgot password?</button>
              </div>

              <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/15 transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200" type="submit">
                Sign In
                <svg aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 20 20"><path d="M4.167 10h11.666m0 0-5-5m5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>
              </button>
            </form>

            {feedback && <p aria-live="polite" className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-3 text-sm leading-5 text-blue-900" role="status">{feedback}</p>}

            <div className="mt-7 space-y-2 border-t border-slate-100 pt-5 text-center">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link className="text-xs font-semibold text-blue-700 transition hover:text-blue-900" href={content.dashboardHref}>
                  Enter demo workspace →
                </Link>
                <Link className="text-xs font-medium text-slate-500 transition hover:text-blue-700" href="/">
                  Return to website
                </Link>
              </div>
              <p className="text-[11px] text-slate-400">Frontend demonstration only · Authentication is not connected</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
