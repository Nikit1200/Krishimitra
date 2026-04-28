import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  CloudSun,
  ShieldCheck,
  Sparkles,
  Sprout,
  Tractor,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  mode: "login" | "signup";
  eyebrow: string;
  title: string;
  description: string;
  helper: string;
  children: ReactNode;
};

const showcaseItems = [
  {
    icon: BrainCircuit,
    title: "AI crop guidance",
    description: "Smart answers for pests, fertilizer, irrigation, and crop planning.",
  },
  {
    icon: CloudSun,
    title: "Weather-aware decisions",
    description: "Time sprays and irrigation with advice shaped for field conditions.",
  },
  {
    icon: Tractor,
    title: "Farmer-first dashboard",
    description: "Track schemes, mandi insights, and support tools in one place.",
  },
];

const trustStats = [
  { label: "Farming topics", value: "12+" },
  { label: "States supported", value: "28" },
  { label: "Daily-ready UX", value: "24/7" },
];

export default function AuthShell({
  mode,
  eyebrow,
  title,
  description,
  helper,
  children,
}: AuthShellProps) {
  const switchAction =
    mode === "login"
      ? {
          label: "New here?",
          cta: "Create an account",
          href: "/signup",
        }
      : {
          label: "Already registered?",
          cta: "Sign in instead",
          href: "/login",
        };

  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-950 text-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.22),_transparent_32%),radial-gradient(circle_at_85%_18%,_rgba(251,191,36,0.18),_transparent_20%),linear-gradient(180deg,_rgba(10,18,12,0.96),_rgba(9,12,10,1))]" />
      <div className="absolute left-[-12%] top-[14%] h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />
      <div className="absolute bottom-[-4%] right-[-8%] h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-10 px-4 py-6 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:px-8">
        <section className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-stone-100 transition hover:border-emerald-400/40 hover:bg-white/10"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <Sprout className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.24em] text-stone-400">
                    Mitra
                  </span>
                  <span className="block text-base font-semibold">Farmer Access Portal</span>
                </span>
              </Link>

              <Badge className="w-fit border-emerald-300/20 bg-emerald-400/10 px-4 py-1.5 text-emerald-100 hover:bg-emerald-400/10">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Designed for field-ready decisions
              </Badge>
            </div>

            <div className="max-w-2xl space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-emerald-200/80">
                {eyebrow}
              </p>
              <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-xl text-base leading-7 text-stone-300 sm:text-lg">
                {description}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {showcaseItems.map(({ icon: Icon, title: itemTitle, description: itemDescription }) => (
                <div
                  key={itemTitle}
                  className="group rounded-[1.5rem] border border-white/10 bg-white/6 p-4 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-white/10"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300/25 to-lime-200/10 text-emerald-200 transition group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-semibold text-white">{itemTitle}</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{itemDescription}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[1.75rem] border border-emerald-300/15 bg-gradient-to-br from-emerald-400/12 via-emerald-300/5 to-transparent p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
                  <ShieldCheck className="h-4 w-4" />
                  Why farmers stay
                </div>
                <p className="mt-4 text-lg leading-8 text-stone-100">
                  "The experience should feel calm, trustworthy, and practical. Every step should
                  help a farmer get to advice faster."
                </p>
                <p className="mt-4 text-sm text-stone-400">Mitra design direction</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {trustStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-center"
                  >
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-stone-300 sm:flex-row sm:items-center sm:justify-between">
            <p>{helper}</p>
            <Link
              to={switchAction.href}
              className={cn("inline-flex items-center gap-2 font-medium text-emerald-200 transition hover:text-white")}
            >
              <span className="text-stone-400">{switchAction.label}</span>
              {switchAction.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="flex items-center justify-center py-4 lg:py-10">
          <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-stone-950/65 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-4">
            <div className="rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 sm:p-8">
              {children}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
