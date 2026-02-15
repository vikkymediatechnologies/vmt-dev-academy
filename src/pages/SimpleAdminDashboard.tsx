// import { useState, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import Layout from "@/components/Layout";
// import { useAdminData, type LearnerRow } from "@/hooks/useAdminData";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "@/hooks/use-toast";
// import {
//   Users,
//   Shield,
//   Eye,
//   Lock,
//   Unlock,
//   CreditCard,
//   TrendingUp,
//   UserCheck,
//   UserX,
//   Sparkles,
//   DollarSign,
//   BookOpen,
// } from "lucide-react";

// const AdminDashboard = () => {
//   const {
//     isAdmin,
//     loading,
//     learners,
//     stats,
//     updateEnrollmentStatus,
//     updateAccessType,
//     extendTrial,
//   } = useAdminData();

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [trackFilter, setTrackFilter] = useState<string>("all");
//   const [detailLearner, setDetailLearner] = useState<LearnerRow | null>(null);

//   const paidLearners = useMemo(() => learners.filter((l) => l.enrollment?.access_type === "paid"), [learners]);
//   const freeLearners = useMemo(() => learners.filter((l) => l.enrollment?.access_type === "free"), [learners]);

//   const filterLearners = (list: LearnerRow[]) =>
//     list.filter((l) => {
//       const matchSearch =
//         !search ||
//         l.profile.full_name.toLowerCase().includes(search.toLowerCase()) ||
//         l.profile.email.toLowerCase().includes(search.toLowerCase());
//       const matchStatus = statusFilter === "all" || l.enrollment?.status === statusFilter;
//       const matchTrack = trackFilter === "all" || l.enrollment?.learning_track === trackFilter;
//       return matchSearch && matchStatus && matchTrack;
//     });

//   const filteredPaid = useMemo(() => filterLearners(paidLearners), [paidLearners, search, statusFilter, trackFilter]);
//   const filteredFree = useMemo(() => filterLearners(freeLearners), [freeLearners, search, statusFilter, trackFilter]);

//   const totalRevenue = learners
//     .filter((l) => l.payment?.status === "success")
//     .reduce((sum, l) => sum + (l.payment?.amount || 0), 0);

//   const conversionRate =
//     stats.paid + stats.free > 0 ? ((stats.paid / (stats.paid + stats.free)) * 100).toFixed(1) : "0";

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex min-h-[60vh] items-center justify-center">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
//         </div>
//       </Layout>
//     );
//   }

//   if (!isAdmin) {
//     return (
//       <Layout>
//         <div className="flex min-h-[60vh] items-center justify-center">
//           <p className="text-muted-foreground">Access denied.</p>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <section className="py-8 bg-background min-h-screen">
//         <div className="container mx-auto px-4">

//           {/* Header Stats */}
//           <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground shadow-lg">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Shield className="h-6 w-6" />
//                 <div>
//                   <h1 className="font-display text-2xl font-bold">Admin Control Panel</h1>
//                   <p className="text-sm opacity-80">Platform analytics & learner oversight</p>
//                 </div>
//               </div>
              
//               {/* COURSES LINK ADDED HERE */}
//               <Link to="/admin/courses">
//                 <Button variant="secondary" className="gap-2">
//                   <BookOpen className="h-4 w-4" />
//                   Manage Courses
//                 </Button>
//               </Link>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
//               {[
//                 { label: "Total", value: stats.total, icon: Users },
//                 { label: "Active", value: stats.active, icon: UserCheck },
//                 { label: "Locked", value: stats.locked, icon: UserX },
//                 { label: "Paid", value: stats.paid, icon: CreditCard },
//                 { label: "Free", value: stats.free, icon: Sparkles },
//                 { label: "Revenue", value: `₦${totalRevenue.toLocaleString()}`, icon: DollarSign },
//                 { label: "Conversion", value: `${conversionRate}%`, icon: TrendingUp },
//               ].map((s) => (
//                 <div key={s.label} className="rounded-xl bg-primary-foreground/10 px-4 py-3">
//                   <div className="flex items-center gap-1 text-xs opacity-70">
//                     <s.icon className="h-3.5 w-3.5" />
//                     {s.label}
//                   </div>
//                   <p className="mt-1 font-display text-xl font-bold">{s.value}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Tabs for Paid / Free */}
//           <Tabs defaultValue="paid">
//             <TabsList className="mb-6">
//               <TabsTrigger value="paid">Paid ({filteredPaid.length})</TabsTrigger>
//               <TabsTrigger value="free">Free Trial ({filteredFree.length})</TabsTrigger>
//             </TabsList>

//             <TabsContent value="paid">
//               <LearnerTable
//                 learners={filteredPaid}
//                 showTrack
//                 setDetailLearner={setDetailLearner}
//               />
//             </TabsContent>

//             <TabsContent value="free">
//               <LearnerTable
//                 learners={filteredFree}
//                 showExpiry
//                 setDetailLearner={setDetailLearner}
//               />
//             </TabsContent>
//           </Tabs>
//         </div>
//       </section>

//       <LearnerDetailDialog
//         learner={detailLearner}
//         onClose={() => setDetailLearner(null)}
//         updateEnrollmentStatus={updateEnrollmentStatus}
//         updateAccessType={updateAccessType}
//         extendTrial={extendTrial}
//       />
//     </Layout>
//   );
// };

// /* ---------------- Learner Table ---------------- */

// const LearnerTable = ({ learners, showTrack, showExpiry, setDetailLearner }: any) => (
//   <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Name</TableHead>
//           <TableHead>Email</TableHead>
//           {showTrack && <TableHead>Track</TableHead>}
//           <TableHead>Status</TableHead>
//           {showExpiry && <TableHead>Trial</TableHead>}
//           <TableHead>Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {learners.map((l: LearnerRow) => {
//           const expiry = l.enrollment?.free_expires_at;
//           let daysLeft: number | null = null;
//           let expired = false;
//           if (expiry) {
//             const diff = new Date(expiry).getTime() - new Date().getTime();
//             daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
//             expired = daysLeft < 0;
//           }

//           return (
//             <TableRow key={l.profile.id}>
//               <TableCell className="font-medium">{l.profile.full_name}</TableCell>
//               <TableCell className="text-sm text-muted-foreground">{l.profile.email}</TableCell>
//               {showTrack && <TableCell>{l.enrollment?.learning_track}</TableCell>}
//               <TableCell>
//                 {l.enrollment?.status === "active" ? (
//                   <span className="text-green-600 text-xs font-medium">Active</span>
//                 ) : (
//                   <span className="text-amber-500 text-xs font-medium">Locked</span>
//                 )}
//               </TableCell>
//               {showExpiry && (
//                 <TableCell>
//                   {expiry ? (
//                     expired ? (
//                       <span className="text-destructive text-sm font-medium">Expired</span>
//                     ) : daysLeft !== null && daysLeft <= 2 ? (
//                       <span className="text-amber-500 text-sm font-medium">{daysLeft} day{daysLeft !== 1 ? "s" : ""} left</span>
//                     ) : (
//                       <span className="text-muted-foreground text-sm">{daysLeft} day{daysLeft !== 1 ? "s" : ""} left</span>
//                     )
//                   ) : "—"}
//                 </TableCell>
//               )}
//               <TableCell>
//                 <div className="flex gap-2">
//                   <Button size="sm" variant="ghost" onClick={() => setDetailLearner(l)}>
//                     <Eye className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </TableCell>
//             </TableRow>
//           );
//         })}
//       </TableBody>
//     </Table>
//   </div>
// );

// /* ---------------- Detail Dialog ---------------- */

// const LearnerDetailDialog = ({ learner, onClose, updateEnrollmentStatus, updateAccessType, extendTrial }: any) => {
//   if (!learner) return null;
//   const { profile, enrollment } = learner;

//   return (
//     <Dialog open={!!learner} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{profile.full_name}</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-3 text-sm">
//           <p>Email: {profile.email}</p>
//           <p>Access: {enrollment?.access_type}</p>
//           <p>Status: {enrollment?.status}</p>

//           <div className="flex gap-2 pt-4">
//             {enrollment?.status === "locked" ? (
//               <Button
//                 size="sm"
//                 onClick={async () => {
//                   await updateEnrollmentStatus(enrollment.id, "active");
//                   onClose();
//                 }}
//               >
//                 <Unlock className="h-4 w-4" /> Activate
//               </Button>
//             ) : (
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={async () => {
//                   await updateEnrollmentStatus(enrollment.id, "locked");
//                   onClose();
//                 }}
//               >
//                 <Lock className="h-4 w-4" /> Lock
//               </Button>
//             )}

//             {enrollment?.access_type === "free" && (
//               <>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={async () => {
//                     await updateAccessType(enrollment.id, "paid");
//                     toast({ title: "User upgraded to paid" });
//                     onClose();
//                   }}
//                 >
//                   <CreditCard className="h-4 w-4" /> Upgrade
//                 </Button>

//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   onClick={async () => {
//                     await extendTrial(enrollment.id, 3);
//                     toast({ title: "Trial extended by 3 days" });
//                     onClose();
//                   }}
//                 >
//                   <Sparkles className="h-4 w-4" /> Extend 3 Days
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AdminDashboard;






import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  Settings,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Unlock,
  Lock,
  Crown,
  Sparkles,
} from "lucide-react";

type Tab = "overview" | "students" | "courses" | "payments";

const SimpleAdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(false);

  // Students data
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Courses data
  const [courses, setCourses] = useState<any[]>([]);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    track: "foundation",
  });

  // Stats
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalRevenue: 0,
    totalCourses: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch students with enrollments
      const { data: studentsData } = await supabase
        .from("learner_profiles")
        .select(`
          *,
          enrollments (*)
        `);

      setStudents(studentsData || []);

      // Fetch courses
      const { data: coursesData } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      setCourses(coursesData || []);

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from("payments")
        .select("*")
        .eq("status", "success");

      const revenue = paymentsData?.reduce((sum, p) => sum + p.amount, 0) || 0;

      // Calculate stats
      setStats({
        totalStudents: studentsData?.length || 0,
        activeStudents:
          studentsData?.filter((s) => s.enrollments?.[0]?.status === "active")
            .length || 0,
        totalRevenue: revenue,
        totalCourses: coursesData?.length || 0,
      });
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!courseForm.title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase.from("courses").insert({
        title: courseForm.title.trim(),
        description: courseForm.description.trim(),
        track: courseForm.track,
        created_by: user?.id,
        is_published: false,
      });

      if (error) throw error;

      toast({ title: "Course created!" });
      setShowCourseDialog(false);
      setCourseForm({ title: "", description: "", track: "foundation" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Failed to create course",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ is_published: !currentStatus })
        .eq("id", courseId);

      if (error) throw error;

      toast({
        title: currentStatus ? "Course unpublished" : "Course published!",
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Failed to update course",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm("Delete this course?")) return;

    try {
      const { error } = await supabase.from("courses").delete().eq("id", courseId);
      if (error) throw error;
      toast({ title: "Course deleted" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Failed to delete",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleStudentStatus = async (enrollmentId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "locked" : "active";
      const { error } = await supabase
        .from("enrollments")
        .update({ status: newStatus })
        .eq("id", enrollmentId);

      if (error) throw error;

      toast({
        title: newStatus === "active" ? "Student activated!" : "Student locked",
      });
      fetchData();
      setSelectedStudent(null);
    } catch (error: any) {
      toast({
        title: "Failed to update student",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading && activeTab === "overview") {
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
      <div className="flex min-h-screen bg-background">
        {/* SIDEBAR */}
        <div className="w-64 border-r bg-card p-6">
          <h2 className="mb-8 text-xl font-bold">Admin Panel</h2>

          <nav className="space-y-2">
            <SidebarButton
              icon={LayoutDashboard}
              label="Overview"
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
            <SidebarButton
              icon={Users}
              label="Students"
              active={activeTab === "students"}
              onClick={() => setActiveTab("students")}
              badge={stats.totalStudents}
            />
            <SidebarButton
              icon={BookOpen}
              label="Courses"
              active={activeTab === "courses"}
              onClick={() => setActiveTab("courses")}
              badge={stats.totalCourses}
            />
            <SidebarButton
              icon={DollarSign}
              label="Payments"
              active={activeTab === "payments"}
              onClick={() => setActiveTab("payments")}
            />
          </nav>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-8">
          {activeTab === "overview" && (
            <OverviewTab stats={stats} />
          )}

          {activeTab === "students" && (
            <StudentsTab
              students={students}
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              toggleStudentStatus={toggleStudentStatus}
            />
          )}

          {activeTab === "courses" && (
            <CoursesTab
              courses={courses}
              showDialog={showCourseDialog}
              setShowDialog={setShowCourseDialog}
              courseForm={courseForm}
              setCourseForm={setCourseForm}
              handleCreate={handleCreateCourse}
              togglePublish={togglePublish}
              deleteCourse={deleteCourse}
            />
          )}

          {activeTab === "payments" && <PaymentsTab />}
        </div>
      </div>
    </Layout>
  );
};

/* ========== SIDEBAR BUTTON ========== */
const SidebarButton = ({ icon: Icon, label, active, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
      active
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    {badge !== undefined && (
      <Badge variant="secondary" className="ml-auto">
        {badge}
      </Badge>
    )}
  </button>
);

/* ========== OVERVIEW TAB ========== */
const OverviewTab = ({ stats }: any) => (
  <div>
    <h1 className="mb-6 text-3xl font-bold">Dashboard Overview</h1>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Students"
        value={stats.totalStudents}
        icon={Users}
        color="blue"
      />
      <StatCard
        label="Active Students"
        value={stats.activeStudents}
        icon={Sparkles}
        color="green"
      />
      <StatCard
        label="Total Revenue"
        value={`₦${stats.totalRevenue.toLocaleString()}`}
        icon={DollarSign}
        color="amber"
      />
      <StatCard
        label="Courses"
        value={stats.totalCourses}
        icon={BookOpen}
        color="purple"
      />
    </div>
  </div>
);

const StatCard = ({ label, value, icon: Icon, color }: any) => {
  const colors = {
    blue: "from-blue-500/10 to-cyan-500/10 border-blue-200",
    green: "from-green-500/10 to-emerald-500/10 border-green-200",
    amber: "from-amber-500/10 to-orange-500/10 border-amber-200",
    purple: "from-purple-500/10 to-pink-500/10 border-purple-200",
  };

  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-6 ${colors[color as keyof typeof colors]}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-full bg-white dark:bg-gray-800 p-2">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

/* ========== STUDENTS TAB ========== */
const StudentsTab = ({
  students,
  selectedStudent,
  setSelectedStudent,
  toggleStudentStatus,
}: any) => (
  <div>
    <h1 className="mb-6 text-3xl font-bold">Students Management</h1>
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Track</TableHead>
            <TableHead>Access</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student: any) => {
            const enrollment = student.enrollments?.[0];
            return (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.full_name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell className="capitalize">
                  {enrollment?.learning_track || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={enrollment?.access_type === "paid" ? "default" : "secondary"}>
                    {enrollment?.access_type === "paid" ? "Paid" : "Free"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {enrollment?.status === "active" ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-amber-600 font-medium">Locked</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>

    {/* Student Detail Dialog */}
    {selectedStudent && (
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedStudent.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>Email: {selectedStudent.email}</p>
            <p>Country: {selectedStudent.country}</p>
            {selectedStudent.enrollments?.[0] && (
              <>
                <p>Access: {selectedStudent.enrollments[0].access_type}</p>
                <p>Status: {selectedStudent.enrollments[0].status}</p>
                <div className="flex gap-2 pt-4">
                  <Button
                    size="sm"
                    onClick={() =>
                      toggleStudentStatus(
                        selectedStudent.enrollments[0].id,
                        selectedStudent.enrollments[0].status
                      )
                    }
                  >
                    {selectedStudent.enrollments[0].status === "active" ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" /> Lock
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4 mr-2" /> Activate
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )}
  </div>
);

/* ========== COURSES TAB ========== */
const CoursesTab = ({
  courses,
  showDialog,
  setShowDialog,
  courseForm,
  setCourseForm,
  handleCreate,
  togglePublish,
  deleteCourse,
}: any) => (
  <div>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold">Courses Management</h1>
      <Button onClick={() => setShowDialog(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Create Course
      </Button>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course: any) => (
        <div
          key={course.id}
          className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <Badge variant={course.is_published ? "default" : "outline"}>
              {course.is_published ? "Published" : "Draft"}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {course.track}
            </Badge>
          </div>

          <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {course.description || "No description"}
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => togglePublish(course.id, course.is_published)}
              className="flex-1 gap-1"
            >
              {course.is_published ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => deleteCourse(course.id)}
              className="gap-1"
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>

    {/* Create Course Dialog */}
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Course Title *</Label>
            <Input
              value={courseForm.title}
              onChange={(e) =>
                setCourseForm({ ...courseForm, title: e.target.value })
              }
              placeholder="e.g., React Fundamentals"
              className="mt-2"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={courseForm.description}
              onChange={(e) =>
                setCourseForm({ ...courseForm, description: e.target.value })
              }
              placeholder="Course description..."
              rows={4}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Track *</Label>
            <select
              value={courseForm.track}
              onChange={(e) =>
                setCourseForm({ ...courseForm, track: e.target.value })
              }
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="foundation">Foundation</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">Full-Stack</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Course</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
);

/* ========== PAYMENTS TAB ========== */
const PaymentsTab = () => {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const { data } = await supabase
        .from("payments")
        .select(`
          *,
          learner_profiles!inner (full_name, email)
        `)
        .order("created_at", { ascending: false });

      setPayments(data || []);
    };
    fetchPayments();
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Payments</h1>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment: any) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {payment.learner_profiles?.full_name || "Unknown"}
                </TableCell>
                <TableCell className="font-medium">
                  ₦{payment.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payment.status === "success"
                        ? "default"
                        : payment.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(payment.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SimpleAdminDashboard;