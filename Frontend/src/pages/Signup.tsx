import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import AuthShell from "@/components/auth/AuthShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { INDIAN_STATES } from "@/lib/indianStates";
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

  return "Unable to create your account right now. Please try again.";
}

function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 6) score += 25;
  if (password.length >= 10) score += 15;
  if (/[A-Z]/.test(password)) score += 20;
  if (/\d/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;

  return Math.min(score, 100);
}

function getStrengthLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 55) return "Good";
  if (score >= 30) return "Fair";
  return "Weak";
}

export default function Signup() {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    district: "",
    state: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  const passwordStrength = getPasswordStrength(signupData.password);
  const passwordLabel = getStrengthLabel(passwordStrength);
  const passwordsMatch =
    signupData.confirmPassword.length > 0 && signupData.password === signupData.confirmPassword;
  const completedFields = [
    signupData.name,
    signupData.phone,
    signupData.email,
    signupData.state,
    signupData.district,
    signupData.password,
    signupData.confirmPassword,
  ].filter((value) => value.trim()).length;
  const progressValue = Math.round((completedFields / 7) * 100);

  const passwordChecks = [
    { label: "At least 6 characters", valid: signupData.password.length >= 6 },
    { label: "Includes a number", valid: /\d/.test(signupData.password) },
    { label: "Passwords match", valid: passwordsMatch },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!signupData.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (!phoneRegex.test(signupData.phone.trim())) {
      setErrorMsg("Phone number must be 10 digits and start with 6, 7, 8, or 9.");
      return;
    }

    if (!emailRegex.test(signupData.email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!signupData.state.trim()) {
      setErrorMsg("Please choose your state.");
      return;
    }

    if (!signupData.district.trim()) {
      setErrorMsg("Please enter your district.");
      return;
    }

    if (signupData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp(signupData.email.trim(), signupData.password, {
        name: signupData.name.trim(),
        phone: signupData.phone.trim(),
        district: signupData.district.trim(),
        state: signupData.state,
      });

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

  return (
    <AuthShell
      mode="signup"
      eyebrow="Create your farmer profile"
      title="Build an account that feels ready for the field from day one."
      description="The signup flow now guides farmers with clearer steps, live feedback, and a layout that feels easier to complete on any screen."
      helper="Set up your account once and return anytime for AI guidance, schemes, weather, and mandi tools."
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <Badge className="w-fit rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-lime-50 hover:bg-lime-300/10">
            <ShieldCheck className="mr-2 h-3.5 w-3.5" />
            Profile setup takes about 2 minutes
          </Badge>

          <div className="space-y-2">
            <h2 className="font-serif text-3xl text-white">Create your account</h2>
            <p className="text-sm leading-6 text-stone-300">
              Tell us a little about you so the platform can give more relevant support and a smoother dashboard experience.
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">Profile completion</p>
              <p className="mt-1 text-sm text-stone-400">
                {completedFields}/7 key details filled
              </p>
            </div>
            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
              {progressValue}%
            </span>
          </div>
          <Progress value={progressValue} className="h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-lime-300 [&>div]:to-emerald-400" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="signup-name" className="text-stone-200">
                Full name
              </Label>
              <div
                className={cn(
                  "group flex h-14 items-center rounded-2xl border border-white/10 bg-white/[0.035] px-4 transition duration-200",
                  focusedField === "name" && "border-emerald-400/45 bg-emerald-400/8 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]",
                )}
              >
                <User className="mr-3 h-4 w-4 text-stone-500 transition group-focus-within:text-emerald-200" />
                <Input
                  id="signup-name"
                  value={signupData.name}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, name: e.target.value }))}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Your full name"
                  className="h-auto border-0 bg-transparent px-0 text-base text-white placeholder:text-stone-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-phone" className="text-stone-200">
                Phone number
              </Label>
              <div
                className={cn(
                  "group flex h-14 items-center rounded-2xl border border-white/10 bg-white/[0.035] px-4 transition duration-200",
                  focusedField === "phone" && "border-emerald-400/45 bg-emerald-400/8 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]",
                )}
              >
                <Phone className="mr-3 h-4 w-4 text-stone-500 transition group-focus-within:text-emerald-200" />
                <Input
                  id="signup-phone"
                  type="tel"
                  value={signupData.phone}
                  onChange={(e) =>
                    setSignupData((prev) => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="9876543210"
                  className="h-auto border-0 bg-transparent px-0 text-base text-white placeholder:text-stone-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-stone-200">
              Email address
            </Label>
            <div
              className={cn(
                "group flex h-14 items-center rounded-2xl border border-white/10 bg-white/[0.035] px-4 transition duration-200",
                focusedField === "email" && "border-emerald-400/45 bg-emerald-400/8 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]",
              )}
            >
              <Mail className="mr-3 h-4 w-4 text-stone-500 transition group-focus-within:text-emerald-200" />
              <Input
                id="signup-email"
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="farmer@example.com"
                className="h-auto border-0 bg-transparent px-0 text-base text-white placeholder:text-stone-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-stone-200">State</Label>
              <Select
                value={signupData.state}
                onValueChange={(value) => setSignupData((prev) => ({ ...prev, state: value }))}
              >
                <SelectTrigger className="h-14 rounded-2xl border-white/10 bg-white/[0.035] px-4 text-base text-white focus:ring-emerald-400/40 focus:ring-offset-0">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent className="max-h-72 border-white/10 bg-stone-900 text-stone-100">
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state} className="focus:bg-white/10 focus:text-white">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-district" className="text-stone-200">
                District
              </Label>
              <div
                className={cn(
                  "group flex h-14 items-center rounded-2xl border border-white/10 bg-white/[0.035] px-4 transition duration-200",
                  focusedField === "district" && "border-emerald-400/45 bg-emerald-400/8 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]",
                )}
              >
                <MapPin className="mr-3 h-4 w-4 text-stone-500 transition group-focus-within:text-emerald-200" />
                <Input
                  id="signup-district"
                  value={signupData.district}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, district: e.target.value }))}
                  onFocus={() => setFocusedField("district")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Your district"
                  className="h-auto border-0 bg-transparent px-0 text-base text-white placeholder:text-stone-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="signup-password" className="text-stone-200">
                  Password
                </Label>
                <span className="text-xs uppercase tracking-[0.18em] text-stone-500">
                  {passwordLabel}
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
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={signupData.password}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create password"
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

            <div className="space-y-2">
              <Label htmlFor="signup-confirm" className="text-stone-200">
                Confirm password
              </Label>
              <div
                className={cn(
                  "group flex h-14 items-center rounded-2xl border border-white/10 bg-white/[0.035] px-4 transition duration-200",
                  focusedField === "confirmPassword" && "border-emerald-400/45 bg-emerald-400/8 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]",
                )}
              >
                <KeyRound className="mr-3 h-4 w-4 text-stone-500 transition group-focus-within:text-emerald-200" />
                <Input
                  id="signup-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Repeat password"
                  className="h-auto border-0 bg-transparent px-0 text-base text-white placeholder:text-stone-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition hover:bg-white/10 hover:text-white"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-white">Password strength</p>
              <span className="text-sm text-stone-300">{passwordLabel}</span>
            </div>
            <Progress value={passwordStrength} className="h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-amber-300 [&>div]:via-lime-300 [&>div]:to-emerald-400" />
            <div className="mt-4 grid gap-2">
              {passwordChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition",
                      check.valid ? "bg-emerald-300" : "bg-stone-600",
                    )}
                  />
                  <span className={check.valid ? "text-emerald-100" : "text-stone-400"}>
                    {check.label}
                  </span>
                </div>
              ))}
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
            className="h-14 w-full rounded-2xl bg-lime-400 text-base font-semibold text-stone-950 transition hover:bg-lime-300"
          >
            {isSubmitting ? "Creating your account..." : "Create my account"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <span>Already have an account and want to get back in quickly?</span>
          <Link to="/login" className="font-medium text-emerald-200 transition hover:text-white">
            Sign in instead
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
