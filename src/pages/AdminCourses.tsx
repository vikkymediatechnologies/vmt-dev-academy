import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  FileText,
  Video,
  FileDown,
  CheckSquare,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  track: string;
  is_published: boolean;
  created_at: string;
}

const AdminCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    track: "foundation" as "foundation" | "frontend" | "backend" | "fullstack",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error loading courses",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!form.title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase.from("courses").insert({
        title: form.title.trim(),
        description: form.description.trim(),
        track: form.track,
        created_by: user?.id,
        is_published: false,
      });

      if (error) throw error;

      toast({ title: "Course created successfully!" });
      setShowCreateDialog(false);
      setForm({ title: "", description: "", track: "foundation" });
      fetchCourses();
    } catch (error: any) {
      toast({
        title: "Failed to create course",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (course: Course) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ is_published: !course.is_published })
        .eq("id", course.id);

      if (error) throw error;

      toast({
        title: course.is_published ? "Course unpublished" : "Course published!",
      });
      fetchCourses();
    } catch (error: any) {
      toast({
        title: "Failed to update course",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm("Delete this course and all its content? This cannot be undone!")) {
      return;
    }

    try {
      const { error } = await supabase.from("courses").delete().eq("id", courseId);

      if (error) throw error;

      toast({ title: "Course deleted" });
      fetchCourses();
    } catch (error: any) {
      toast({
        title: "Failed to delete course",
        description: error.message,
        variant: "destructive",
      });
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
      <section className="py-10 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Course Management</h1>
              <p className="text-muted-foreground mt-1">
                Create and manage courses for all tracks
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Course
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-4 mb-8">
            <StatCard
              label="Total Courses"
              value={courses.length}
              icon={BookOpen}
            />
            <StatCard
              label="Published"
              value={courses.filter((c) => c.is_published).length}
              icon={Eye}
            />
            <StatCard
              label="Drafts"
              value={courses.filter((c) => !c.is_published).length}
              icon={EyeOff}
            />
            <StatCard
              label="Tracks"
              value={new Set(courses.map((c) => c.track)).size}
              icon={BookOpen}
            />
          </div>

          {/* Courses by Track */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Courses</TabsTrigger>
              <TabsTrigger value="foundation">Foundation</TabsTrigger>
              <TabsTrigger value="frontend">Frontend</TabsTrigger>
              <TabsTrigger value="backend">Backend</TabsTrigger>
              <TabsTrigger value="fullstack">Full-Stack</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <CourseGrid
                courses={courses}
                onEdit={setSelectedCourse}
                onTogglePublish={togglePublish}
                onDelete={deleteCourse}
              />
            </TabsContent>

            {["foundation", "frontend", "backend", "fullstack"].map((track) => (
              <TabsContent key={track} value={track} className="mt-6">
                <CourseGrid
                  courses={courses.filter((c) => c.track === track)}
                  onEdit={setSelectedCourse}
                  onTogglePublish={togglePublish}
                  onDelete={deleteCourse}
                />
              </TabsContent>
            ))}
          </Tabs>

          {/* Create Course Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Course Title *</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., React Fundamentals"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Course description..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Track *</Label>
                  <Select
                    value={form.track}
                    onValueChange={(v: any) => setForm({ ...form, track: v })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="foundation">Foundation</SelectItem>
                      <SelectItem value="frontend">Frontend</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                      <SelectItem value="fullstack">Full-Stack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCourse}>Create Course</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Course - Navigate to course detail page */}
          {selectedCourse && (
            <Dialog
              open={!!selectedCourse}
              onOpenChange={() => setSelectedCourse(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedCourse.title}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Use the "Manage Content" button to add modules and lessons
                  </p>
                  <Button
                    onClick={() => {
                      window.location.href = `/admin/courses/${selectedCourse.id}`;
                    }}
                    className="w-full"
                  >
                    Manage Course Content
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </section>
    </Layout>
  );
};

/* ────────────────────────────────────────────────────────────────────── */

const StatCard = ({ label, value, icon: Icon }: any) => (
  <div className="rounded-xl border bg-card p-5 shadow-sm">
    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase mb-2">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const CourseGrid = ({ courses, onEdit, onTogglePublish, onDelete }: any) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No courses found. Create your first course!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course: Course) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
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
              onClick={() => onEdit(course)}
              className="flex-1 gap-1"
            >
              <Edit className="h-3 w-3" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onTogglePublish(course)}
              className="gap-1"
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
              onClick={() => onDelete(course.id)}
              className="gap-1"
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminCoursesPage;