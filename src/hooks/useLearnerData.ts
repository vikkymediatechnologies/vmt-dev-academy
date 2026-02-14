import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";

interface LearnerData {
  profile: Tables<"learner_profiles"> | null;
  enrollment: Tables<"enrollments"> | null;
  techBackground: Tables<"tech_background"> | null;
  commitment: Tables<"learning_commitment"> | null;
  discipline: Tables<"discipline_check"> | null;
  loading: boolean;
  hasEnrollment: boolean;
  isExpired: boolean;
  daysRemaining: number | null;
  refetch: () => void;
}

export const useLearnerData = (): LearnerData => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Tables<"learner_profiles"> | null>(null);
  const [enrollment, setEnrollment] = useState<Tables<"enrollments"> | null>(null);
  const [techBackground, setTechBackground] = useState<Tables<"tech_background"> | null>(null);
  const [commitment, setCommitment] = useState<Tables<"learning_commitment"> | null>(null);
  const [discipline, setDiscipline] = useState<Tables<"discipline_check"> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) {
      console.log("No user, clearing learner data");
      setProfile(null);
      setEnrollment(null);
      setTechBackground(null);
      setCommitment(null);
      setDiscipline(null);
      setLoading(false);
      return;
    }

    console.log("Fetching learner data for user:", user.id);
    setLoading(true);

    try {
      // Add timeout to prevent infinite loading
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timeout")), 10000)
      );

      const fetchPromise = Promise.all([
        supabase.from("learner_profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("enrollments").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("tech_background").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("learning_commitment").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("discipline_check").select("*").eq("user_id", user.id).maybeSingle(),
      ]);

      const [profileRes, enrollRes, techRes, commitRes, discRes] = await Promise.race([
        fetchPromise,
        timeout
      ]) as any;

      // Log any errors
      if (profileRes.error) console.error("Profile error:", profileRes.error);
      if (enrollRes.error) console.error("Enrollment error:", enrollRes.error);
      if (techRes.error) console.error("Tech error:", techRes.error);
      if (commitRes.error) console.error("Commitment error:", commitRes.error);
      if (discRes.error) console.error("Discipline error:", discRes.error);

      setProfile(profileRes.data);
      setEnrollment(enrollRes.data);
      setTechBackground(techRes.data);
      setCommitment(commitRes.data);
      setDiscipline(discRes.data);

      console.log("Learner data loaded:", {
        hasProfile: !!profileRes.data,
        hasEnrollment: !!enrollRes.data
      });

    } catch (error) {
      console.error("Error fetching learner data:", error);
      // Set loading to false even on error to prevent infinite spinner
      setProfile(null);
      setEnrollment(null);
      setTechBackground(null);
      setCommitment(null);
      setDiscipline(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]); // Only re-fetch when user ID changes

  const isExpired =
    enrollment?.access_type === "free" &&
    enrollment?.free_expires_at != null &&
    new Date(enrollment.free_expires_at) < new Date();

  const daysRemaining =
    enrollment?.access_type === "free" && enrollment?.free_expires_at
      ? Math.max(0, Math.ceil((new Date(enrollment.free_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : null;

  return {
    profile,
    enrollment,
    techBackground,
    commitment,
    discipline,
    loading,
    hasEnrollment: !!enrollment,
    isExpired,
    daysRemaining,
    refetch: fetchData,
  };
};