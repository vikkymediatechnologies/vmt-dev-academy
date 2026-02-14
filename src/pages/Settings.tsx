import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useLearnerData } from "@/hooks/useLearnerData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, User, Laptop, Target, Clock } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();
  const { profile, techBackground, commitment, loading, refetch } = useLearnerData();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    // Profile
    fullName: "",
    country: "",
    // Tech
    device: "laptop" as "laptop" | "mobile" | "both",
    internetQuality: "good" as "poor" | "fair" | "good",
    // Commitment
    hoursPerWeek: 5,
    studyTime: "flexible" as "morning" | "afternoon" | "night" | "flexible",
    learningGoal: "improvement" as "job" | "freelancing" | "projects" | "improvement",
  });

  // Load data when it's available
  useEffect(() => {
    if (profile) {
      setForm((f) => ({
        ...f,
        fullName: profile.full_name || "",
        country: profile.country || "",
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (techBackground) {
      setForm((f) => ({
        ...f,
        device: techBackground.device || "laptop",
        internetQuality: techBackground.internet_quality || "good",
      }));
    }
  }, [techBackground]);

  useEffect(() => {
    if (commitment) {
      setForm((f) => ({
        ...f,
        hoursPerWeek: commitment.hours_per_week || 5,
        studyTime: (commitment.preferred_time as any) || "flexible",
        learningGoal: commitment.learning_goal || "improvement",
      }));
    }
  }, [commitment]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("learner_profiles")
        .update({
          full_name: form.fullName.trim(),
          country: form.country.trim(),
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      // Update tech background
      const { error: techError } = await supabase
        .from("tech_background")
        .update({
          device: form.device,
          internet_quality: form.internetQuality,
        })
        .eq("user_id", user.id);

      if (techError) throw techError;

      // Update learning commitment
      const hasLaptop = form.device === "laptop" || form.device === "both";
      const hasStableInternet = form.internetQuality === "good";

      const { error: commitError } = await supabase
        .from("learning_commitment")
        .update({
          hours_per_week: form.hoursPerWeek,
          preferred_time: form.studyTime,
          learning_goal: form.learningGoal,
          has_laptop: hasLaptop,
          has_stable_internet: hasStableInternet,
        })
        .eq("user_id", user.id);

      if (commitError) throw commitError;

      toast({
        title: "Settings saved!",
        description: "Your profile has been updated successfully.",
      });

      refetch();
    } catch (error: any) {
      console.error("Settings save error:", error);
      toast({
        title: "Failed to save",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 bg-gradient-to-b from-background to-muted/20 min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Update your profile and learning preferences
            </p>
          </div>

          {/* Settings Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                  <User className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-xl font-semibold">Personal Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="mt-2 opacity-60"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="Nigeria"
                    className="mt-2"
                  />
                </div>
              </div>
            </motion.div>

            {/* Tech Setup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                  <Laptop className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-xl font-semibold">Tech Setup</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Primary Device</Label>
                  <Select
                    value={form.device}
                    onValueChange={(v: any) => setForm({ ...form, device: v })}
                  >
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
                  <Select
                    value={form.internetQuality}
                    onValueChange={(v: any) => setForm({ ...form, internetQuality: v })}
                  >
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
            </motion.div>

            {/* Learning Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                  <Target className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-xl font-semibold">Learning Preferences</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Time Commitment (hours/week)</Label>
                  <Select
                    value={form.hoursPerWeek.toString()}
                    onValueChange={(v) => setForm({ ...form, hoursPerWeek: parseInt(v) })}
                  >
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
                  <Select
                    value={form.studyTime}
                    onValueChange={(v: any) => setForm({ ...form, studyTime: v })}
                  >
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
                  <Select
                    value={form.learningGoal}
                    onValueChange={(v: any) => setForm({ ...form, learningGoal: v })}
                  >
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
            </motion.div>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="gap-2"
              >
                {saving ? "Saving…" : "Save Changes"}
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SettingsPage;