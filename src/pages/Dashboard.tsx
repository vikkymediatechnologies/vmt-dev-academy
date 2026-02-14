import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useLearnerData } from "@/hooks/useLearnerData";
import { useAuth } from "@/hooks/useAuth";
import { usePayment } from "@/hooks/usePayment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  Target,
  CalendarDays,
  AlertTriangle,
  Settings,
  Zap,
  Crown,
  Clock,
  Sparkles,
  PartyPopper,
  X,
  Lock,
} from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const {
    profile,
    enrollment,
    loading,
    isExpired,
    daysRemaining,
    refetch,
  } = useLearnerData();

  const {
    initializePayment,
    verifyPayment,
    loading: paymentLoading,
    amount,
  } = usePayment();

  const [searchParams, setSearchParams] = useSearchParams();
  const [showCongrats, setShowCongrats] = useState(false);

  // Check if user was just activated (paid account)
  useEffect(() => {
    if (enrollment?.access_type === "paid" && enrollment?.status === "active") {
      const hasSeenCongrats = localStorage.getItem(`congrats_shown_${user?.id}`);
      if (!hasSeenCongrats) {
        setShowCongrats(true);
        localStorage.setItem(`congrats_shown_${user?.id}`, "true");
        setTimeout(() => setShowCongrats(false), 10000);
      }
    }
  }, [enrollment, user]);

  /* ---------------- PAYMENT VERIFICATION ---------------- */
  useEffect(() => {
    const shouldVerify = searchParams.get("verify_payment");
    const reference =
      searchParams.get("reference") || searchParams.get("trxref");

    if (shouldVerify && reference) {
      searchParams.delete("verify_payment");
      searchParams.delete("reference");
      searchParams.delete("trxref");
      setSearchParams(searchParams, { replace: true });

      verifyPayment(reference).then((ok) => {
        if (ok) refetch();
      });
    }
  }, []);

  /* ---------------- LOADING STATE ---------------- */
  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      </Layout>
    );
  }

  /* ---------------- NO ENROLLMENT ---------------- */
  if (!enrollment) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center text-center">
          <div>
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-bold">
              Complete Your Application
            </h2>
            <Link to="/onboarding">
              <Button className="mt-6">Start Onboarding</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  /* ---------------- ACCESS LOGIC ---------------- */
  const isFree = enrollment.access_type === "free";
  const isPaid = enrollment.access_type === "paid";
  const isLocked = enrollment.status === "locked";
  const isActive = enrollment.status === "active";

  // 4 States:
  const isFreeActive = isFree && isActive && !isExpired;
  const isFreeExpired = isFree && isExpired;
  const isPaidLocked = isPaid && isLocked;
  const isPaidActive = isPaid && isActive;

  const showUrgency = isFreeActive && daysRemaining !== null && daysRemaining <= 2;

  return (
    <Layout>
      <section className="py-10 bg-gradient-to-b from-background to-muted/20 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* CONGRATULATIONS BANNER - Newly Activated Paid Account */}
          {showCongrats && isPaidActive && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 rounded-2xl border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-8 text-center relative overflow-hidden"
            >
              <button
                onClick={() => setShowCongrats(false)}
                className="absolute top-4 right-4 text-green-700 hover:text-green-900"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <PartyPopper className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                🎉 Payment Successful! 🎉
              </h2>
              <p className="text-green-700 dark:text-green-300 mb-4">
                You now have premium access to all courses, materials, and unlimited learning!
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                <Crown className="h-4 w-4" />
                <span className="font-medium">Welcome to Premium!</span>
              </div>
            </motion.div>
          )}

          {/* HEADER */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {profile?.full_name || user?.email?.split("@")[0]}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Ready to continue your learning journey?
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isPaidActive && (
                <Badge className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2">
                  <Crown className="h-4 w-4" />
                  Premium
                </Badge>
              )}
              <Link to="/settings">
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* STATE 1: ACTIVE FREE TRIAL */}
          {isFreeActive && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 rounded-2xl p-6 border-2 ${
                showUrgency
                  ? "border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50"
                  : "border-accent/30 bg-gradient-to-r from-accent/5 to-accent/10"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm">
                    <Sparkles className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Free Trial • {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {showUrgency 
                        ? "⚡ Act fast! Upgrade now to keep your progress and unlock everything."
                        : "Upgrade anytime to unlock all courses, materials, and premium features."}
                    </p>
                  </div>
                </div>

                <Button
                  size="lg"
                  disabled={paymentLoading}
                  onClick={initializePayment}
                  className="gap-2 whitespace-nowrap"
                >
                  {paymentLoading ? "Processing…" : `Upgrade - ₦${amount.toLocaleString()}`}
                  <Zap className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STATE 2: EXPIRED TRIAL */}
          {isFreeExpired && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-2xl border-2 border-destructive bg-gradient-to-r from-destructive/5 to-destructive/10 p-8 text-center"
            >
              <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
              <h3 className="mt-4 text-xl font-bold text-destructive">
                Your Free Trial Has Ended
              </h3>
              <p className="mt-2 text-muted-foreground">
                Upgrade to premium now to continue your learning journey and access all courses
              </p>
              <Button
                size="lg"
                className="mt-6 gap-2"
                disabled={paymentLoading}
                onClick={initializePayment}
              >
                {paymentLoading ? "Processing…" : `Upgrade Now - ₦${amount.toLocaleString()}`}
                <Crown className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* STATE 3: PAID BUT LOCKED (Need to Pay) */}
          {isPaidLocked && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-2xl border-2 border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 p-8 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                <Lock className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-amber-900 dark:text-amber-100">
                Unlock Premium Access 🔓
              </h3>
              <p className="mt-2 text-amber-700 dark:text-amber-300 max-w-md mx-auto">
                Upgrade to premium to unlock all courses, materials, and lifetime access to everything!
              </p>
              <Button
                size="lg"
                className="mt-6 gap-2"
                disabled={paymentLoading}
                onClick={initializePayment}
              >
                {paymentLoading ? "Processing…" : `Upgrade to Premium - ₦${amount.toLocaleString()}`}
                <Crown className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* STATS CARDS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              label="Track"
              value={enrollment.learning_track || "Foundation"}
              icon={BookOpen}
              gradient="from-blue-500/10 to-cyan-500/10"
            />
            <StatCard
              label="Mode"
              value={enrollment.learning_mode || "Self-Paced"}
              icon={Target}
              gradient="from-purple-500/10 to-pink-500/10"
            />
            <StatCard
              label="Access"
              value={
                isPaidActive
                  ? "Premium"
                  : isPaidLocked
                  ? "Locked"
                  : "Free Trial"
              }
              icon={Zap}
              gradient="from-orange-500/10 to-red-500/10"
            />
            <StatCard
              label="Time Left"
              value={
                isFree && daysRemaining !== null
                  ? `${daysRemaining} days`
                  : isPaidActive
                  ? "Unlimited"
                  : "Upgrade"
              }
              icon={CalendarDays}
              gradient="from-green-500/10 to-emerald-500/10"
            />
          </div>

          {/* COURSES SECTION - Only show if active (free or paid) */}
          {isPaidActive || isFreeActive ? (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-accent" />
                Your Courses
              </h3>
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Courses will appear here once your instructor adds them</p>
                <p className="text-sm mt-2">
                  {isFreeActive && "Free trial: Access to first 5 modules"}
                  {isPaidActive && "Premium: Full access to all courses"}
                </p>
              </div>
            </div>
          ) : (
            /* LOCKED STATE - Show upgrade message */
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {isFreeExpired ? "Trial Expired - Courses Locked" : "Upgrade to Access Courses"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {isFreeExpired
                  ? "Your free trial has ended. Upgrade to premium to continue learning."
                  : "Unlock all courses and materials by upgrading to premium."}
              </p>
              <Button
                onClick={initializePayment}
                disabled={paymentLoading}
                className="gap-2"
              >
                {paymentLoading ? "Processing…" : `Upgrade to Premium - ₦${amount.toLocaleString()}`}
                <Crown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

/* ---------- STAT CARD COMPONENT ---------- */
const StatCard = ({ label, value, icon: Icon, gradient }: any) => (
  <div className={`rounded-xl border bg-gradient-to-br ${gradient} p-5 shadow-sm`}>
    <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-medium mb-2">
      <Icon className="h-4 w-4 text-accent" />
      {label}
    </div>
    <p className="text-xl font-bold capitalize">{value}</p>
  </div>
);

export default DashboardPage;