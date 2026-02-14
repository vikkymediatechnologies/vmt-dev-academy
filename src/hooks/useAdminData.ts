// import { useEffect, useState, useCallback } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import { useAuth } from "@/hooks/useAuth";
// import type { Tables } from "@/integrations/supabase/types";

// export interface LearnerRow {
//   profile: Tables<"learner_profiles">;
//   enrollment: Tables<"enrollments"> | null;
//   payment: Tables<"payments"> | null;
// }

// interface AdminStats {
//   total: number;
//   active: number;
//   locked: number;
//   free: number;
//   paid: number;
// }

// interface AdminData {
//   isAdmin: boolean;
//   loading: boolean;
//   learners: LearnerRow[];
//   stats: AdminStats;
//   refetch: () => void;
//   updateEnrollmentStatus: (enrollmentId: string, status: "active" | "locked") => Promise<boolean>;
//   updateAccessType: (enrollmentId: string, accessType: "free" | "paid") => Promise<boolean>;
//   extendTrial: (enrollmentId: string, days: number) => Promise<boolean>;
// }

// export const useAdminData = (): AdminData => {
//   const { user } = useAuth();
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [learners, setLearners] = useState<LearnerRow[]>([]);

//   const fetchData = useCallback(async () => {
//     if (!user) {
//       setLoading(false);
//       return;
//     }

//     // Check admin role
//     const { data: roleData } = await supabase
//       .from("user_roles")
//       .select("role")
//       .eq("user_id", user.id)
//       .eq("role", "admin")
//       .maybeSingle();

//     const admin = !!roleData;
//     setIsAdmin(admin);

//     if (!admin) {
//       setLoading(false);
//       return;
//     }

//     // Fetch all profiles, enrollments, payments
//     const [profilesRes, enrollmentsRes, paymentsRes] = await Promise.all([
//       supabase.from("learner_profiles").select("*").order("created_at", { ascending: false }),
//       supabase.from("enrollments").select("*"),
//       supabase.from("payments").select("*"),
//     ]);

//     const profiles = profilesRes.data || [];
//     const enrollments = enrollmentsRes.data || [];
//     const payments = paymentsRes.data || [];

//     const rows: LearnerRow[] = profiles.map((p) => ({
//       profile: p,
//       enrollment: enrollments.find((e) => e.user_id === p.user_id) || null,
//       payment: payments.find((pay) => pay.user_id === p.user_id) || null,
//     }));

//     setLearners(rows);
//     setLoading(false);
//   }, [user]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const stats: AdminStats = {
//     total: learners.length,
//     active: learners.filter((l) => l.enrollment?.status === "active").length,
//     locked: learners.filter((l) => l.enrollment?.status === "locked").length,
//     free: learners.filter((l) => l.enrollment?.access_type === "free").length,
//     paid: learners.filter((l) => l.enrollment?.access_type === "paid").length,
//   };

//   const updateEnrollmentStatus = async (enrollmentId: string, status: "active" | "locked") => {
//     const { error } = await supabase
//       .from("enrollments")
//       .update({ status })
//       .eq("id", enrollmentId);
//     if (!error) await fetchData();
//     return !error;
//   };

//   const updateAccessType = async (enrollmentId: string, accessType: "free" | "paid") => {
//     const { error } = await supabase
//       .from("enrollments")
//       .update({ access_type: accessType })
//       .eq("id", enrollmentId);
//     if (!error) await fetchData();
//     return !error;
//   };

//   const extendTrial = async (enrollmentId: string, days: number) => {
//     const { data: enrollment } = await supabase
//       .from("enrollments")
//       .select("free_expires_at")
//       .eq("id", enrollmentId)
//       .single();

//     const currentExpiry = enrollment?.free_expires_at ? new Date(enrollment.free_expires_at) : new Date();
//     const newExpiry = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);

//     const { error } = await supabase
//       .from("enrollments")
//       .update({ free_expires_at: newExpiry.toISOString() })
//       .eq("id", enrollmentId);
//     if (!error) await fetchData();
//     return !error;
//   };

//   return { isAdmin, loading, learners, stats, refetch: fetchData, updateEnrollmentStatus, updateAccessType, extendTrial };
// };





import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";

export interface LearnerRow {
  profile: Tables<"learner_profiles">;
  enrollment: Tables<"enrollments"> | null;
  payment: Tables<"payments"> | null;
}

interface AdminStats {
  total: number;
  active: number;
  locked: number;
  free: number;
  paid: number;
}

interface AdminData {
  isAdmin: boolean;
  loading: boolean;
  learners: LearnerRow[];
  stats: AdminStats;
  refetch: () => void;
  updateEnrollmentStatus: (enrollmentId: string, status: "active" | "locked") => Promise<boolean>;
  updateAccessType: (enrollmentId: string, accessType: "free" | "paid") => Promise<boolean>;
  extendTrial: (enrollmentId: string, days: number) => Promise<boolean>;
}

export const useAdminData = (): AdminData => {
  const { user, isAdmin: isAdminFromAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [learners, setLearners] = useState<LearnerRow[]>([]);

  const fetchData = useCallback(async () => {
    if (!user || !isAdminFromAuth) {
      setLoading(false);
      return;
    }

    try {
      // Fetch all profiles, enrollments, payments
      // Note: This will only work if admin has proper access
      // You may need to disable RLS temporarily or use service role
      const [profilesRes, enrollmentsRes, paymentsRes] = await Promise.all([
        supabase.from("learner_profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("enrollments").select("*"),
        supabase.from("payments").select("*"),
      ]);

      const profiles = profilesRes.data || [];
      const enrollments = enrollmentsRes.data || [];
      const payments = paymentsRes.data || [];

      const rows: LearnerRow[] = profiles.map((p) => ({
        profile: p,
        enrollment: enrollments.find((e) => e.user_id === p.user_id) || null,
        payment: payments.find((pay) => pay.user_id === p.user_id) || null,
      }));

      setLearners(rows);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setLearners([]);
    } finally {
      setLoading(false);
    }
  }, [user, isAdminFromAuth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats: AdminStats = {
    total: learners.length,
    active: learners.filter((l) => l.enrollment?.status === "active").length,
    locked: learners.filter((l) => l.enrollment?.status === "locked").length,
    free: learners.filter((l) => l.enrollment?.access_type === "free").length,
    paid: learners.filter((l) => l.enrollment?.access_type === "paid").length,
  };

  const updateEnrollmentStatus = async (enrollmentId: string, status: "active" | "locked") => {
    if (!isAdminFromAuth) return false;
    
    try {
      const { error } = await supabase
        .from("enrollments")
        .update({ status })
        .eq("id", enrollmentId);
      if (!error) await fetchData();
      return !error;
    } catch (error) {
      console.error("Error updating enrollment status:", error);
      return false;
    }
  };

  const updateAccessType = async (enrollmentId: string, accessType: "free" | "paid") => {
    if (!isAdminFromAuth) return false;
    
    try {
      const { error } = await supabase
        .from("enrollments")
        .update({ access_type: accessType })
        .eq("id", enrollmentId);
      if (!error) await fetchData();
      return !error;
    } catch (error) {
      console.error("Error updating access type:", error);
      return false;
    }
  };

  const extendTrial = async (enrollmentId: string, days: number) => {
    if (!isAdminFromAuth) return false;
    
    try {
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("free_expires_at")
        .eq("id", enrollmentId)
        .single();

      const currentExpiry = enrollment?.free_expires_at ? new Date(enrollment.free_expires_at) : new Date();
      const newExpiry = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);

      const { error } = await supabase
        .from("enrollments")
        .update({ free_expires_at: newExpiry.toISOString() })
        .eq("id", enrollmentId);
      if (!error) await fetchData();
      return !error;
    } catch (error) {
      console.error("Error extending trial:", error);
      return false;
    }
  };

  return { 
    isAdmin: isAdminFromAuth, 
    loading, 
    learners, 
    stats, 
    refetch: fetchData, 
    updateEnrollmentStatus, 
    updateAccessType, 
    extendTrial 
  };
};