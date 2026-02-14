import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface OnboardingData {
  // Step 0: Personal Info
  name: string;
  email: string;
  country: string;
  // Step 1: Tech Background
  experience: string;
  device: string;
  internetQuality: string;
  // Step 2: Commitment
  hoursPerWeek: string;
  studyTime: string;
  learningGoal: string;
  whyLearn: string;
  // Step 3: Discipline
  followsDeadlines: boolean;
  practicesConsistently: boolean;
  openToFeedback: boolean;
  // Step 4: Enrollment
  learningTrack: string;
  learningMode: string;
  accessType: string;
  agreeTerms: boolean;
}

export const useOnboardingSubmit = () => {
  const { user } = useAuth();

  const submit = async (data: OnboardingData) => {
    console.log("🚀 SUBMIT STARTED");
    
    if (!user) {
      console.log("❌ No user");
      toast({ title: "Not authenticated", variant: "destructive" });
      return false;
    }

    console.log("✅ User exists:", user.id);

    // Validate required fields
    if (!data.name || !data.email || !data.country) {
      console.log("❌ Missing required fields");
      toast({ 
        title: "Missing required fields", 
        description: "Please fill in your name, email, and country.",
        variant: "destructive" 
      });
      return false;
    }

    if (!data.experience) {
      console.log("❌ Missing experience");
      toast({ 
        title: "Missing experience level", 
        description: "Please select your experience level.",
        variant: "destructive" 
      });
      return false;
    }

    if (!data.agreeTerms) {
      console.log("❌ Terms not accepted");
      toast({ 
        title: "Terms not accepted", 
        description: "You must accept the terms to continue.",
        variant: "destructive" 
      });
      return false;
    }

    console.log("✅ All validations passed");

    try {
      // Check if user has already completed onboarding
      console.log("📋 Checking existing enrollment...");
      const { data: existingEnrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingEnrollment) {
        console.log("❌ Already enrolled");
        toast({ 
          title: "Already enrolled", 
          description: "You have already completed onboarding.",
          variant: "destructive" 
        });
        return false;
      }

      console.log("✅ No existing enrollment");

      // 1. Learner profile
      console.log("💾 Saving profile...");
      const { error: profileErr } = await supabase
        .from("learner_profiles")
        .upsert({
          user_id: user.id,
          full_name: data.name.trim(),
          email: data.email.trim(),
          country: data.country.trim(),
        }, {
          onConflict: 'user_id'
        });
      
      if (profileErr) {
        console.error("❌ Profile error:", profileErr);
        throw new Error(`Failed to save profile: ${profileErr.message}`);
      }
      console.log("✅ Profile saved");

      // 2. Tech background
      console.log("💾 Saving tech background...");
      const { error: techErr } = await supabase
        .from("tech_background")
        .upsert({
          user_id: user.id,
          experience_level: (data.experience || "none") as "none" | "beginner" | "intermediate",
          device: (data.device || "laptop") as "laptop" | "mobile" | "both",
          internet_quality: (data.internetQuality || "good") as "poor" | "fair" | "good",
        }, {
          onConflict: 'user_id'
        });
      
      if (techErr) {
        console.error("❌ Tech background error:", techErr);
        throw new Error(`Failed to save tech background: ${techErr.message}`);
      }
      console.log("✅ Tech background saved");

      // 3. Learning commitment
      console.log("💾 Saving learning commitment...");
      const hasLaptop = data.device === "laptop" || data.device === "both";
      const hasStableInternet = data.internetQuality === "good";

      const { error: commitErr } = await supabase
        .from("learning_commitment")
        .upsert({
          user_id: user.id,
          hours_per_week: parseInt(data.hoursPerWeek) || 5,
          preferred_time: data.studyTime || "flexible",
          learning_goal: data.learningGoal || "improvement",
          has_laptop: hasLaptop,
          has_stable_internet: hasStableInternet,
        }, {
          onConflict: 'user_id'
        });
      
      if (commitErr) {
        console.error("❌ Commitment error:", commitErr);
        throw new Error(`Failed to save learning commitment: ${commitErr.message}`);
      }
      console.log("✅ Learning commitment saved");

      // 4. Discipline check
      console.log("💾 Saving discipline check...");
      const { error: discErr } = await supabase
        .from("discipline_check")
        .upsert({
          user_id: user.id,
          follows_deadlines: data.followsDeadlines,
          practices_consistently: data.practicesConsistently,
          open_to_feedback: data.openToFeedback,
        }, {
          onConflict: 'user_id'
        });
      
      if (discErr) {
        console.error("❌ Discipline check error:", discErr);
        throw new Error(`Failed to save discipline check: ${discErr.message}`);
      }
      console.log("✅ Discipline check saved");

      // 5. Enrollment - UPDATED LOGIC FOR PAYMENT FLOW
      console.log("💾 Creating enrollment...");
      const isFree = data.accessType === "free";
      const isPaid = data.accessType === "paid";

      // Free trial: Active immediately with 7-day expiry
      // Paid: Locked until payment succeeds
      const enrollmentStatus = isFree ? "active" : "locked";
      const freeExpiresAt = isFree
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      console.log("Access type:", data.accessType);
      console.log("Initial status:", enrollmentStatus);

      const { error: enrollErr } = await supabase
        .from("enrollments")
        .insert({
          user_id: user.id,
          learning_track: (data.learningTrack || "foundation") as "frontend" | "backend" | "fullstack" | "foundation",
          learning_mode: (data.learningMode || "self_paced") as "self_paced" | "live" | "mentorship" | "project" | "hybrid",
          access_type: (data.accessType || "free") as "free" | "paid",
          status: enrollmentStatus,
          free_expires_at: freeExpiresAt,
        });
      
      if (enrollErr) {
        console.error("❌ Enrollment error:", enrollErr);
        throw new Error(`Failed to create enrollment: ${enrollErr.message}`);
      }
      console.log("✅ Enrollment created");

      console.log("🎉 ALL DATA SAVED SUCCESSFULLY!");

      toast({
        title: "Success!",
        description: isFree 
          ? "Your 7-day free trial has started!" 
          : "Redirecting to payment...",
      });

      console.log("✅ RETURNING TRUE");
      return true;
      
    } catch (err: any) {
      console.error("❌ CAUGHT ERROR:", err);
      console.error("❌ Error message:", err.message);
      toast({
        title: "Submission failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.log("❌ RETURNING FALSE");
      return false;
    }
  };

  return { submit };
};