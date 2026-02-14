import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOnboardingSubmit, type OnboardingData } from "@/hooks/useOnboardingSubmit";

const steps = [
  { id: 0, name: "About You", icon: "👤" },
  { id: 1, name: "Tech Setup", icon: "💻" },
  { id: 2, name: "Your Goals", icon: "🎯" },
  { id: 3, name: "Commitment", icon: "✅" },
  { id: 4, name: "Get Started", icon: "🚀" },
];

const OnboardingPage = () => {
  const { user } = useAuth();
  const { submit } = useOnboardingSubmit();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<OnboardingData>({
    name: "",
    email: user?.email || "",
    country: "",
    experience: "",
    device: "laptop",
    internetQuality: "good",
    hoursPerWeek: "5",
    studyTime: "flexible",
    learningGoal: "improvement",
    whyLearn: "",
    followsDeadlines: false,
    practicesConsistently: false,
    openToFeedback: false,
    learningTrack: "foundation",
    learningMode: "self_paced",
    accessType: "free",
    agreeTerms: false,
  });

  const update = (key: keyof OnboardingData, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const canProceed = () => {
    switch (step) {
      case 0: return form.name && form.email && form.country;
      case 1: return form.experience;
      case 2: return true;
      case 3: return form.followsDeadlines && form.practicesConsistently && form.openToFeedback;
      case 4: return form.agreeTerms;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const ok = await submit(form);
    
    if (ok) {
      setSubmitted(true);
    }
    
    setSubmitting(false);
  };

  if (submitted) {
    const isPaid = form.accessType === "paid";
    
    return (
      <Layout>
        <section className="flex min-h-[80vh] items-center justify-center bg-background">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-md text-center px-4"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            
            <h2 className="font-display text-3xl font-bold text-foreground">
              You're All Set! 🎉
            </h2>
            
            <p className="mt-4 text-muted-foreground">
              {isPaid 
                ? "Welcome! Visit your dashboard to explore courses and upgrade to premium access."
                : "Your 7-day free trial starts now. Let's begin learning!"}
            </p>
            
            <Button
              size="lg"
              className="mt-8"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </motion.div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 bg-gradient-to-b from-background to-muted/20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display text-4xl font-bold text-foreground">
                Welcome to CodeMastery
              </h1>
              <p className="mt-2 text-muted-foreground">
                Let's personalize your learning journey
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                {steps.map((s, i) => (
                  <div key={s.id} className="flex flex-col items-center flex-1">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl transition-all ${
                        i <= step
                          ? "bg-accent text-white scale-110"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i < step ? "✓" : s.icon}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${i <= step ? "text-accent" : "text-muted-foreground"}`}>
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Form Card */}
            <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {step === 0 && <StepPersonalInfo form={form} update={update} />}
                  {step === 1 && <StepTechBackground form={form} update={update} />}
                  {step === 2 && <StepCommitment form={form} update={update} />}
                  {step === 3 && <StepDiscipline form={form} update={update} />}
                  {step === 4 && <StepEnrollment form={form} update={update} />}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t">
                <Button
                  variant="ghost"
                  onClick={prev}
                  disabled={step === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>

                {step < steps.length - 1 ? (
                  <Button
                    onClick={next}
                    disabled={!canProceed()}
                    className="gap-2"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    disabled={!form.agreeTerms || submitting}
                    onClick={handleSubmit}
                    className="gap-2"
                  >
                    {submitting ? "Submitting…" : "Submit"} <Sparkles className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

/* ── Step Components ── */

interface StepProps {
  form: OnboardingData;
  update: (key: keyof OnboardingData, value: string | boolean) => void;
}

const StepPersonalInfo = ({ form, update }: StepProps) => (
  <div className="space-y-5">
    <h2 className="text-2xl font-bold">Tell us about yourself</h2>
    <div>
      <Label htmlFor="name">Full Name *</Label>
      <Input
        id="name"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        placeholder="John Doe"
        className="mt-2"
      />
    </div>
    <div>
      <Label htmlFor="email">Email Address *</Label>
      <Input
        id="email"
        type="email"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        placeholder="you@example.com"
        className="mt-2"
        disabled
      />
    </div>
    <div>
      <Label htmlFor="country">Country *</Label>
      <Input
        id="country"
        value={form.country}
        onChange={(e) => update("country", e.target.value)}
        placeholder="Nigeria"
        className="mt-2"
      />
    </div>
  </div>
);

const StepTechBackground = ({ form, update }: StepProps) => (
  <div className="space-y-5">
    <h2 className="text-2xl font-bold">Your tech setup</h2>
    <div>
      <Label>Coding Experience *</Label>
      <Select value={form.experience} onValueChange={(v) => update("experience", v)}>
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Select your level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Complete Beginner</SelectItem>
          <SelectItem value="beginner">Some Experience ({"<"} 6 months)</SelectItem>
          <SelectItem value="intermediate">Intermediate (6+ months)</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Primary Device</Label>
      <Select value={form.device} onValueChange={(v) => update("device", v)}>
        <SelectTrigger className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="laptop">Laptop / Desktop</SelectItem>
          <SelectItem value="mobile">Mobile Phone</SelectItem>
          <SelectItem value="both">Both</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Internet Connection</Label>
      <Select value={form.internetQuality} onValueChange={(v) => update("internetQuality", v)}>
        <SelectTrigger className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="poor">Poor (Slow/Unreliable)</SelectItem>
          <SelectItem value="fair">Fair (Moderate)</SelectItem>
          <SelectItem value="good">Good (Fast/Reliable)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const StepCommitment = ({ form, update }: StepProps) => (
  <div className="space-y-5">
    <h2 className="text-2xl font-bold">Your learning goals</h2>
    <div>
      <Label>Time Commitment (hours/week)</Label>
      <Select value={form.hoursPerWeek} onValueChange={(v) => update("hoursPerWeek", v)}>
        <SelectTrigger className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 hours/week</SelectItem>
          <SelectItem value="10">10 hours/week</SelectItem>
          <SelectItem value="20">20 hours/week</SelectItem>
          <SelectItem value="40">40+ hours/week (Full-time)</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Preferred Study Time</Label>
      <Select value={form.studyTime} onValueChange={(v) => update("studyTime", v)}>
        <SelectTrigger className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="morning">Morning</SelectItem>
          <SelectItem value="afternoon">Afternoon</SelectItem>
          <SelectItem value="night">Night</SelectItem>
          <SelectItem value="flexible">Flexible</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Main Goal</Label>
      <Select value={form.learningGoal} onValueChange={(v) => update("learningGoal", v)}>
        <SelectTrigger className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="job">Get a Job</SelectItem>
          <SelectItem value="freelancing">Start Freelancing</SelectItem>
          <SelectItem value="projects">Build Personal Projects</SelectItem>
          <SelectItem value="improvement">Personal Growth</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const StepDiscipline = ({ form, update }: StepProps) => (
  <div className="space-y-5">
    <h2 className="text-2xl font-bold">Commitment pledge</h2>
    <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
      <p>💪 Learning to code requires dedication and consistency</p>
      <p>📅 Regular practice is key to success</p>
      <p>🎯 Your effort determines your progress</p>
    </div>
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Checkbox
          id="deadlines"
          checked={form.followsDeadlines}
          onCheckedChange={(c) => update("followsDeadlines", !!c)}
        />
        <Label htmlFor="deadlines" className="cursor-pointer leading-relaxed">
          I commit to following my study schedule
        </Label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox
          id="practice"
          checked={form.practicesConsistently}
          onCheckedChange={(c) => update("practicesConsistently", !!c)}
        />
        <Label htmlFor="practice" className="cursor-pointer leading-relaxed">
          I will practice consistently, even when it's challenging
        </Label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox
          id="feedback"
          checked={form.openToFeedback}
          onCheckedChange={(c) => update("openToFeedback", !!c)}
        />
        <Label htmlFor="feedback" className="cursor-pointer leading-relaxed">
          I am open to feedback and willing to improve
        </Label>
      </div>
    </div>
  </div>
);

const StepEnrollment = ({ form, update }: StepProps) => (
  <div className="space-y-5">
    <h2 className="text-2xl font-bold">Choose your path</h2>
    <div>
      <Label>Learning Track</Label>
      <Select value={form.learningTrack} onValueChange={(v) => update("learningTrack", v)}>
        <SelectTrigger className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="foundation">Beginner Foundation</SelectItem>
          <SelectItem value="frontend">Frontend Development</SelectItem>
          <SelectItem value="backend">Backend Development</SelectItem>
          <SelectItem value="fullstack">Full-Stack Development</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Learning Mode</Label>
      <Select value={form.learningMode} onValueChange={(v) => update("learningMode", v)}>
        <SelectTrigger className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="self_paced">Self-Paced</SelectItem>
          <SelectItem value="live">Live Sessions</SelectItem>
          <SelectItem value="mentorship">1-on-1 Mentorship</SelectItem>
          <SelectItem value="project">Project-Based</SelectItem>
          <SelectItem value="hybrid">Hybrid (Mix)</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Access Type</Label>
      <Select value={form.accessType} onValueChange={(v) => update("accessType", v)}>
        <SelectTrigger className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Free Trial (7 Days)</span>
            </div>
          </SelectItem>
          <SelectItem value="paid">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Paid Program</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    
    {form.accessType === "paid" && (
      <div className="rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4">
        <div className="flex items-start gap-3">
          <CreditCard className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
              Premium Access
            </p>
            <p className="text-amber-700 dark:text-amber-300">
              You'll need to upgrade to premium from your dashboard to unlock all courses and materials.
            </p>
          </div>
        </div>
      </div>
    )}
    
    <div className="rounded-lg bg-accent/5 border border-accent/20 p-4">
      <div className="flex items-start gap-3">
        <Checkbox
          id="terms"
          checked={form.agreeTerms}
          onCheckedChange={(c) => update("agreeTerms", !!c)}
        />
        <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
          I understand that {form.accessType === "free" ? "free access lasts 7 days and I can upgrade anytime" : "I need to upgrade to premium for full access"}. This training is provided
          by an independent educator. Certificates are for portfolio use only.
        </Label>
      </div>
    </div>
  </div>
);

export default OnboardingPage;