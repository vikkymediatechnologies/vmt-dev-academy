import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLearnerData } from "@/hooks/useLearnerData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  PlayCircle,
  FileText,
  CheckCircle2,
  Lock,
  Crown,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  track: string;
  is_published: boolean;
  modules?: Module[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  is_free_preview: boolean;
  lessons?: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  lesson_type: string;
  order_index: number;
  content?: string;
  video_url?: string;
  file_url?: string;
  file_name?: string;
  assignment_description?: string;
}

const StudentCourses = () => {
  const { user } = useAuth();
  const { enrollment } = useLearnerData();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const isFree = enrollment?.access_type === "free";
  const isPaidActive = enrollment?.access_type === "paid" && enrollment?.status === "active";
  const isPaidLocked = enrollment?.access_type === "paid" && enrollment?.status === "locked";
  const isFreeExpired = isFree && enrollment?.free_expires_at && new Date(enrollment.free_expires_at) < new Date();

  const hasAccess = isPaidActive || (isFree && !isFreeExpired);

  useEffect(() => {
    fetchCourses();
    if (hasAccess) {
      fetchProgress();
    }
  }, [enrollment]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data: coursesData } = await supabase
        .from("courses")
        .select(`
          id,
          title,
          description,
          track,
          is_published,
          modules (
            id,
            title,
            description,
            order_index,
            is_free_preview,
            lessons (
              id,
              title,
              lesson_type,
              order_index,
              content,
              video_url,
              file_url,
              file_name,
              assignment_description
            )
          )
        `)
        .eq("is_published", true)
        .eq("track", enrollment?.learning_track || "foundation")
        .order("created_at");

      // Sort modules and lessons
      const sortedCourses = coursesData?.map((course: any) => ({
        ...course,
        modules: course.modules
          ?.sort((a: any, b: any) => a.order_index - b.order_index)
          .map((module: any) => ({
            ...module,
            lessons: module.lessons?.sort((a: any, b: any) => a.order_index - b.order_index) || [],
          })) || [],
      })) || [];

      setCourses(sortedCourses);
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

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from("student_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("completed", true);

      setCompletedLessons(new Set(data?.map((p) => p.lesson_id) || []));
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const markComplete = async (lessonId: string) => {
    if (!user || !hasAccess) return;

    try {
      const { error } = await supabase.from("student_progress").upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        progress_percentage: 100,
      });

      if (error) throw error;

      setCompletedLessons((prev) => new Set([...prev, lessonId]));
      toast({ title: "Lesson marked as complete!" });
    } catch (error: any) {
      toast({
        title: "Failed to mark complete",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const canAccessModule = (moduleIndex: number, isFreePreview: boolean) => {
    if (isPaidActive) return true;
    if (isFree && !isFreeExpired) {
      return moduleIndex < 5 || isFreePreview;
    }
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {isPaidLocked ? "Upgrade to Access Courses" : "Trial Expired"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {isPaidLocked
            ? "Complete payment to unlock all courses and materials."
            : "Your free trial has ended. Upgrade to continue learning."}
        </p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Courses Yet</h3>
        <p className="text-sm text-muted-foreground">
          Your instructor will add courses soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {courses.map((course) => {
        const totalLessons =
          course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
        const completedCount = course.modules?.reduce(
          (sum, m) =>
            sum + (m.lessons?.filter((l) => completedLessons.has(l.id)).length || 0),
          0
        ) || 0;
        const progressPercent =
          totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        return (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border bg-card p-6"
          >
            {/* Course Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.description}
                  </p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {course.track}
                </Badge>
              </div>

              {/* Progress Bar */}
              {totalLessons > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Your Progress</span>
                    <span className="font-medium">
                      {completedCount}/{totalLessons} lessons • {progressPercent}%
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              )}
            </div>

            {/* Modules */}
            <div className="space-y-3">
              {course.modules?.map((module, moduleIdx) => {
                const accessible = canAccessModule(moduleIdx, module.is_free_preview);
                const moduleLessons = module.lessons || [];
                const moduleCompleted = moduleLessons.filter((l) =>
                  completedLessons.has(l.id)
                ).length;

                return (
                  <div
                    key={module.id}
                    className={`rounded-lg border p-4 ${
                      !accessible ? "opacity-60" : ""
                    }`}
                  >
                    {/* Module Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                          {moduleIdx + 1}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-semibold flex items-center gap-2">
                            {module.title}
                            {!accessible && <Lock className="h-4 w-4 text-muted-foreground" />}
                            {module.is_free_preview && (
                              <Badge variant="outline" className="text-xs">
                                Free Preview
                              </Badge>
                            )}
                          </h4>
                          {module.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {module.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {accessible && moduleLessons.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {moduleCompleted}/{moduleLessons.length}
                        </span>
                      )}
                    </div>

                    {/* Lessons */}
                    {accessible && (
                      <div className="ml-11 space-y-2">
                        {moduleLessons.map((lesson) => {
                          const isCompleted = completedLessons.has(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                setSelectedCourse(course);
                                setSelectedLesson(lesson);
                              }}
                              className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-muted transition-colors"
                            >
                              {lesson.lesson_type === "video" && (
                                <PlayCircle className="h-4 w-4 text-accent flex-shrink-0" />
                              )}
                              {lesson.lesson_type === "text" && (
                                <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              )}
                              {(lesson.lesson_type === "pdf" ||
                                lesson.lesson_type === "slide") && (
                                <FileText className="h-4 w-4 text-green-500 flex-shrink-0" />
                              )}
                              {lesson.lesson_type === "assignment" && (
                                <FileText className="h-4 w-4 text-orange-500 flex-shrink-0" />
                              )}

                              <span className="flex-1 text-sm">{lesson.title}</span>

                              {isCompleted && (
                                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {!accessible && (
                      <div className="ml-11 text-sm text-muted-foreground flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        {isPaidActive
                          ? "This module will be available soon"
                          : "Upgrade to premium to unlock"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {/* Lesson Viewer Dialog */}
      {selectedLesson && (
        <Dialog
          open={!!selectedLesson}
          onOpenChange={() => setSelectedLesson(null)}
        >
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedLesson.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Video Lesson */}
              {selectedLesson.lesson_type === "video" && selectedLesson.video_url && (
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  {selectedLesson.video_url.includes("youtube.com") ||
                  selectedLesson.video_url.includes("youtu.be") ? (
                    <iframe
                      src={selectedLesson.video_url.replace("watch?v=", "embed/")}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video src={selectedLesson.video_url} controls className="w-full h-full" />
                  )}
                </div>
              )}

              {/* Text Lesson */}
              {selectedLesson.lesson_type === "text" && selectedLesson.content && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {selectedLesson.content}
                  </pre>
                </div>
              )}

              {/* PDF / Slides */}
              {(selectedLesson.lesson_type === "pdf" ||
                selectedLesson.lesson_type === "slide") &&
                selectedLesson.file_url && (
                  <div className="rounded-lg border bg-muted/50 p-6 text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <p className="font-medium mb-2">{selectedLesson.file_name}</p>
                    <Button asChild>
                      <a
                        href={selectedLesson.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        Download File
                      </a>
                    </Button>
                  </div>
                )}

              {/* Assignment */}
              {selectedLesson.lesson_type === "assignment" &&
                selectedLesson.assignment_description && (
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <h4 className="font-semibold mb-2">Assignment Instructions:</h4>
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedLesson.assignment_description}
                    </p>
                  </div>
                )}

              {/* Mark Complete Button */}
              <div className="flex justify-end pt-4">
                {completedLessons.has(selectedLesson.id) ? (
                  <Button disabled className="gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Completed
                  </Button>
                ) : (
                  <Button
                    onClick={() => markComplete(selectedLesson.id)}
                    className="gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark as Complete
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StudentCourses;