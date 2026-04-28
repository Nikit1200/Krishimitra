import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  ShieldCheck,
  Sprout,
} from "lucide-react";

import AuthShell from "@/components/auth/AuthShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

function getReadableError(error: unknown) {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }

  return "Unable to sign in right now. Please try again.";
}

const accessHighlights = [
  "Personal dashboard for crops, prices, and advisories",
  "Fast access to AI farming help in one place",
  "Simple account flow designed for mobile-first use",
];

export default function Login() {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const result = await signIn(loginData.email.trim(), loginData.password);

      if (!result.error) {
        navigate("/dashboard");
        return;
      }

      setErrorMsg(getReadableError(result.error));
    } catch (error) {
      setErrorMsg(getReadableError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filledFields = [loginData.email, loginData.password].filter((value) => value.trim()).length;
  const readinessText =
    filledFields === 0
      ? "Start by entering your account details."
      : filledFields === 1
        ? "Almost there. Add your password to continue."
        : "Everything looks ready. You can sign in now.";

  return (
    <AuthShell
      mode="login"
      eyebrow="Secure sign in"
      title="Step into a calmer, smarter farming workspace."
      description="The login experience now focuses on speed and clarity, so farmers can move from sign in to action without confusion."
      helper="Fast access to your dashboard, AI assistant, schemes, and mandi insights."
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <Badge className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-100 hover:bg-emerald-400/10">
            <ShieldCheck className="mr-2 h-3.5 w-3.5" />
            Protected farmer login
          </Badge>

          <div className="space-y-2">
            <h2 className="font-serif text-3xl text-white">Welcome back</h2>
            <p className="text-sm leading-6 text-stone-300">
              Sign in to continue with your advisory tools, saved profile, and personalized farming support.
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">Access readiness</p>
              <p className="mt-1 text-sm text-stone-400">{readinessText}</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200">
              <Sprout className="h-6 w-6" />
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-stone-200">
              Email or phone
            </Label>
            <div
              className={cn(
                "group flex h-14 items-center rounded-2xl border border-white/10 bg-white/[0.035] px-4 transition duration-200",
                focusedField === "email" && "border-emerald-400/45 bg-emerald-400/8 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]",
              )}
            >
              <Mail className="mr-3 h-4 w-4 text-stone-500 transition group-focus-within:text-emerald-200" />
              <Input
                id="login-email"
                type="text"
                value={loginData.email}
                onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com or 9876543210"
                className="h-auto border-0 bg-transparent px-0 text-base text-white placeholder:text-stone-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" className="text-stone-200">
                Password
              </Label>
              <span className="text-xs uppercase tracking-[0.18em] text-stone-500">
                Secure access
              </span>
            </div>
            <div
              className={cn(
                "group flex h-14 items-center rounded-2xl border border-white/10 bg-white/[0.035] px-4 transition duration-200",
                focusedField === "password" && "border-emerald-400/45 bg-emerald-400/8 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]",
              )}
            >
              <KeyRound className="mr-3 h-4 w-4 text-stone-500 transition group-focus-within:text-emerald-200" />
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={loginData.password}
                onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your password"
                className="h-auto border-0 bg-transparent px-0 text-base text-white placeholder:text-stone-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition hover:bg-white/10 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {errorMsg ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {errorMsg}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-14 w-full rounded-2xl bg-emerald-500 text-base font-semibold text-white transition hover:bg-emerald-400"
          >
            {isSubmitting ? "Signing you in..." : "Sign in to dashboard"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm text-stone-300">
            <p className="font-medium text-white">What opens after login</p>
            <div className="grid gap-2">
              {accessHighlights.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <span>No account yet? Your signup takes under two minutes.</span>
          <Link to="/signup" className="font-medium text-emerald-200 transition hover:text-white">
            Create an account
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
