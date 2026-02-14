import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useAdminData, type LearnerRow } from "@/hooks/useAdminData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Users,
  Shield,
  Eye,
  Lock,
  Unlock,
  CreditCard,
  TrendingUp,
  UserCheck,
  UserX,
  Sparkles,
  DollarSign,
  BookOpen,
} from "lucide-react";

const AdminDashboard = () => {
  const {
    isAdmin,
    loading,
    learners,
    stats,
    updateEnrollmentStatus,
    updateAccessType,
    extendTrial,
  } = useAdminData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [trackFilter, setTrackFilter] = useState<string>("all");
  const [detailLearner, setDetailLearner] = useState<LearnerRow | null>(null);

  const paidLearners = useMemo(() => learners.filter((l) => l.enrollment?.access_type === "paid"), [learners]);
  const freeLearners = useMemo(() => learners.filter((l) => l.enrollment?.access_type === "free"), [learners]);

  const filterLearners = (list: LearnerRow[]) =>
    list.filter((l) => {
      const matchSearch =
        !search ||
        l.profile.full_name.toLowerCase().includes(search.toLowerCase()) ||
        l.profile.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || l.enrollment?.status === statusFilter;
      const matchTrack = trackFilter === "all" || l.enrollment?.learning_track === trackFilter;
      return matchSearch && matchStatus && matchTrack;
    });

  const filteredPaid = useMemo(() => filterLearners(paidLearners), [paidLearners, search, statusFilter, trackFilter]);
  const filteredFree = useMemo(() => filterLearners(freeLearners), [freeLearners, search, statusFilter, trackFilter]);

  const totalRevenue = learners
    .filter((l) => l.payment?.status === "success")
    .reduce((sum, l) => sum + (l.payment?.amount || 0), 0);

  const conversionRate =
    stats.paid + stats.free > 0 ? ((stats.paid / (stats.paid + stats.free)) * 100).toFixed(1) : "0";

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">Access denied.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 bg-background min-h-screen">
        <div className="container mx-auto px-4">

          {/* Header Stats */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6" />
                <div>
                  <h1 className="font-display text-2xl font-bold">Admin Control Panel</h1>
                  <p className="text-sm opacity-80">Platform analytics & learner oversight</p>
                </div>
              </div>
              
              {/* COURSES LINK ADDED HERE */}
              <Link to="/admin/courses">
                <Button variant="secondary" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Manage Courses
                </Button>
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
              {[
                { label: "Total", value: stats.total, icon: Users },
                { label: "Active", value: stats.active, icon: UserCheck },
                { label: "Locked", value: stats.locked, icon: UserX },
                { label: "Paid", value: stats.paid, icon: CreditCard },
                { label: "Free", value: stats.free, icon: Sparkles },
                { label: "Revenue", value: `₦${totalRevenue.toLocaleString()}`, icon: DollarSign },
                { label: "Conversion", value: `${conversionRate}%`, icon: TrendingUp },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-primary-foreground/10 px-4 py-3">
                  <div className="flex items-center gap-1 text-xs opacity-70">
                    <s.icon className="h-3.5 w-3.5" />
                    {s.label}
                  </div>
                  <p className="mt-1 font-display text-xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs for Paid / Free */}
          <Tabs defaultValue="paid">
            <TabsList className="mb-6">
              <TabsTrigger value="paid">Paid ({filteredPaid.length})</TabsTrigger>
              <TabsTrigger value="free">Free Trial ({filteredFree.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="paid">
              <LearnerTable
                learners={filteredPaid}
                showTrack
                setDetailLearner={setDetailLearner}
              />
            </TabsContent>

            <TabsContent value="free">
              <LearnerTable
                learners={filteredFree}
                showExpiry
                setDetailLearner={setDetailLearner}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <LearnerDetailDialog
        learner={detailLearner}
        onClose={() => setDetailLearner(null)}
        updateEnrollmentStatus={updateEnrollmentStatus}
        updateAccessType={updateAccessType}
        extendTrial={extendTrial}
      />
    </Layout>
  );
};

/* ---------------- Learner Table ---------------- */

const LearnerTable = ({ learners, showTrack, showExpiry, setDetailLearner }: any) => (
  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          {showTrack && <TableHead>Track</TableHead>}
          <TableHead>Status</TableHead>
          {showExpiry && <TableHead>Trial</TableHead>}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {learners.map((l: LearnerRow) => {
          const expiry = l.enrollment?.free_expires_at;
          let daysLeft: number | null = null;
          let expired = false;
          if (expiry) {
            const diff = new Date(expiry).getTime() - new Date().getTime();
            daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
            expired = daysLeft < 0;
          }

          return (
            <TableRow key={l.profile.id}>
              <TableCell className="font-medium">{l.profile.full_name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{l.profile.email}</TableCell>
              {showTrack && <TableCell>{l.enrollment?.learning_track}</TableCell>}
              <TableCell>
                {l.enrollment?.status === "active" ? (
                  <span className="text-green-600 text-xs font-medium">Active</span>
                ) : (
                  <span className="text-amber-500 text-xs font-medium">Locked</span>
                )}
              </TableCell>
              {showExpiry && (
                <TableCell>
                  {expiry ? (
                    expired ? (
                      <span className="text-destructive text-sm font-medium">Expired</span>
                    ) : daysLeft !== null && daysLeft <= 2 ? (
                      <span className="text-amber-500 text-sm font-medium">{daysLeft} day{daysLeft !== 1 ? "s" : ""} left</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">{daysLeft} day{daysLeft !== 1 ? "s" : ""} left</span>
                    )
                  ) : "—"}
                </TableCell>
              )}
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setDetailLearner(l)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </div>
);

/* ---------------- Detail Dialog ---------------- */

const LearnerDetailDialog = ({ learner, onClose, updateEnrollmentStatus, updateAccessType, extendTrial }: any) => {
  if (!learner) return null;
  const { profile, enrollment } = learner;

  return (
    <Dialog open={!!learner} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{profile.full_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <p>Email: {profile.email}</p>
          <p>Access: {enrollment?.access_type}</p>
          <p>Status: {enrollment?.status}</p>

          <div className="flex gap-2 pt-4">
            {enrollment?.status === "locked" ? (
              <Button
                size="sm"
                onClick={async () => {
                  await updateEnrollmentStatus(enrollment.id, "active");
                  onClose();
                }}
              >
                <Unlock className="h-4 w-4" /> Activate
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await updateEnrollmentStatus(enrollment.id, "locked");
                  onClose();
                }}
              >
                <Lock className="h-4 w-4" /> Lock
              </Button>
            )}

            {enrollment?.access_type === "free" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await updateAccessType(enrollment.id, "paid");
                    toast({ title: "User upgraded to paid" });
                    onClose();
                  }}
                >
                  <CreditCard className="h-4 w-4" /> Upgrade
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await extendTrial(enrollment.id, 3);
                    toast({ title: "Trial extended by 3 days" });
                    onClose();
                  }}
                >
                  <Sparkles className="h-4 w-4" /> Extend 3 Days
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDashboard;