import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  Upload,
  Video,
  FileText,
  FileDown,
  CheckSquare,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";

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
  video_url?: string;
  content?: string;
  file_url?: string;
  file_name?: string;
}

const AdminCourseContentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Module form
  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    isFreePreview: false,
  });

  // Lesson form
  const [lessonForm, setLessonForm] = useState({
    title: "",
    lessonType: "video" as "video" | "text" | "pdf" | "slide" | "assignment",
    videoUrl: "",
    content: "",
    assignmentDesc: "",
    file: null as File | null,
  });

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch modules with lessons
      const { data: modulesData, error: modulesError } = await supabase
        .from("modules")
        .select(`
          *,
          lessons (*)
        `)
        .eq("course_id", courseId)
        .order("order_index");

      if (modulesError) throw modulesError;
      setModules(modulesData || []);
    } catch (error: any) {
      console.error("Error fetching course data:", error);
      toast({
        title: "Error loading course",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = async () => {
    if (!moduleForm.title.trim()) {
      toast({ title: "Module title required", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase.from("modules").insert({
        course_id: courseId,
        title: moduleForm.title.trim(),
        description: moduleForm.description.trim(),
        order_index: modules.length + 1,
        is_free_preview: moduleForm.isFreePreview,
      });

      if (error) throw error;

      toast({ title: "Module created!" });
      setShowModuleDialog(false);
      setModuleForm({ title: "", description: "", isFreePreview: false });
      fetchCourseData();
    } catch (error: any) {
      toast({
        title: "Failed to create module",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `course-content/${courseId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("course-files")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("course-files")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleCreateLesson = async () => {
    if (!lessonForm.title.trim() || !selectedModule) {
      toast({ title: "Title and module required", variant: "destructive" });
      return;
    }

    try {
      setUploadingFile(true);

      let fileUrl = "";
      let fileName = "";

      // Upload file if needed
      if (
        lessonForm.file &&
        (lessonForm.lessonType === "pdf" ||
          lessonForm.lessonType === "slide" ||
          lessonForm.lessonType === "video")
      ) {
        fileUrl = await handleFileUpload(lessonForm.file);
        fileName = lessonForm.file.name;
      }

      // Get lesson count for order_index
      const module = modules.find((m) => m.id === selectedModule);
      const lessonCount = module?.lessons?.length || 0;

      const lessonData: any = {
        module_id: selectedModule,
        title: lessonForm.title.trim(),
        lesson_type: lessonForm.lessonType,
        order_index: lessonCount + 1,
      };

      if (lessonForm.lessonType === "video") {
        lessonData.video_url = lessonForm.videoUrl || fileUrl;
      } else if (lessonForm.lessonType === "text") {
        lessonData.content = lessonForm.content;
      } else if (lessonForm.lessonType === "pdf" || lessonForm.lessonType === "slide") {
        lessonData.file_url = fileUrl;
        lessonData.file_name = fileName;
        lessonData.is_downloadable = true;
      } else if (lessonForm.lessonType === "assignment") {
        lessonData.assignment_description = lessonForm.assignmentDesc;
      }

      const { error } = await supabase.from("lessons").insert(lessonData);

      if (error) throw error;

      toast({ title: "Lesson added!" });
      setShowLessonDialog(false);
      setLessonForm({
        title: "",
        lessonType: "video",
        videoUrl: "",
        content: "",
        assignmentDesc: "",
        file: null,
      });
      fetchCourseData();
    } catch (error: any) {
      toast({
        title: "Failed to create lesson",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm("Delete this module and all its lessons?")) return;

    try {
      const { error } = await supabase.from("modules").delete().eq("id", moduleId);
      if (error) throw error;
      toast({ title: "Module deleted" });
      fetchCourseData();
    } catch (error: any) {
      toast({
        title: "Failed to delete",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleFreePreview = async (module: Module) => {
    try {
      const { error } = await supabase
        .from("modules")
        .update({ is_free_preview: !module.is_free_preview })
        .eq("id", module.id);

      if (error) throw error;
      fetchCourseData();
    } catch (error: any) {
      toast({
        title: "Failed to update",
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
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/courses")}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Button>
            <h1 className="text-3xl font-bold">{course?.title}</h1>
            <p className="text-muted-foreground mt-1">
              Manage modules and lessons
            </p>
          </div>

          {/* Add Module Button */}
          <div className="mb-6">
            <Button onClick={() => setShowModuleDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Module
            </Button>
          </div>

          {/* Modules List */}
          <div className="space-y-4">
            {modules.length === 0 ? (
              <div className="text-center py-12 rounded-xl border border-dashed">
                <p className="text-muted-foreground">
                  No modules yet. Add your first module!
                </p>
              </div>
            ) : (
              modules.map((module, idx) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border bg-card p-6"
                >
                  {/* Module Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GripVertical className="h-5 w-5" />
                        <span className="font-mono text-sm">#{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{module.title}</h3>
                        {module.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {module.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleFreePreview(module)}
                        className="gap-1"
                      >
                        {module.is_free_preview ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Free
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Paid
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteModule(module.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="ml-8 space-y-2">
                    {module.lessons?.map((lesson: Lesson, lessonIdx) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 text-sm"
                      >
                        <span className="font-mono text-xs text-muted-foreground">
                          {lessonIdx + 1}
                        </span>
                        {lesson.lesson_type === "video" && (
                          <Video className="h-4 w-4 text-accent" />
                        )}
                        {lesson.lesson_type === "text" && (
                          <FileText className="h-4 w-4 text-blue-500" />
                        )}
                        {(lesson.lesson_type === "pdf" ||
                          lesson.lesson_type === "slide") && (
                          <FileDown className="h-4 w-4 text-green-500" />
                        )}
                        {lesson.lesson_type === "assignment" && (
                          <CheckSquare className="h-4 w-4 text-orange-500" />
                        )}
                        <span className="flex-1">{lesson.title}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {lesson.lesson_type}
                        </span>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedModule(module.id);
                        setShowLessonDialog(true);
                      }}
                      className="gap-2 mt-2"
                    >
                      <Plus className="h-3 w-3" />
                      Add Lesson
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Create Module Dialog */}
          <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Module</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Module Title *</Label>
                  <Input
                    value={moduleForm.title}
                    onChange={(e) =>
                      setModuleForm({ ...moduleForm, title: e.target.value })
                    }
                    placeholder="e.g., Introduction to React"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={moduleForm.description}
                    onChange={(e) =>
                      setModuleForm({ ...moduleForm, description: e.target.value })
                    }
                    placeholder="Module overview..."
                    rows={3}
                    className="mt-2"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="freePreview"
                    checked={moduleForm.isFreePreview}
                    onCheckedChange={(checked) =>
                      setModuleForm({ ...moduleForm, isFreePreview: !!checked })
                    }
                  />
                  <Label htmlFor="freePreview" className="cursor-pointer">
                    Mark as free preview (free trial users can access)
                  </Label>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowModuleDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateModule}>Create Module</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create Lesson Dialog */}
          <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Lesson</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Lesson Title *</Label>
                  <Input
                    value={lessonForm.title}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, title: e.target.value })
                    }
                    placeholder="e.g., What is React?"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Lesson Type *</Label>
                  <Select
                    value={lessonForm.lessonType}
                    onValueChange={(v: any) =>
                      setLessonForm({ ...lessonForm, lessonType: v })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">📹 Video Lesson</SelectItem>
                      <SelectItem value="text">📝 Text Lesson</SelectItem>
                      <SelectItem value="pdf">📄 PDF Resource</SelectItem>
                      <SelectItem value="slide">🖼️ Slides</SelectItem>
                      <SelectItem value="assignment">✅ Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Video Lesson */}
                {lessonForm.lessonType === "video" && (
                  <div>
                    <Label>Video URL or Upload File</Label>
                    <Input
                      type="url"
                      value={lessonForm.videoUrl}
                      onChange={(e) =>
                        setLessonForm({ ...lessonForm, videoUrl: e.target.value })
                      }
                      placeholder="https://youtube.com/... or upload below"
                      className="mt-2 mb-2"
                    />
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          file: e.target.files?.[0] || null,
                        })
                      }
                      className="mt-2"
                    />
                  </div>
                )}

                {/* Text Lesson */}
                {lessonForm.lessonType === "text" && (
                  <div>
                    <Label>Lesson Content (Code, Tutorial, etc.)</Label>
                    <Textarea
                      value={lessonForm.content}
                      onChange={(e) =>
                        setLessonForm({ ...lessonForm, content: e.target.value })
                      }
                      placeholder="Write your lesson content here..."
                      rows={8}
                      className="mt-2 font-mono text-sm"
                    />
                  </div>
                )}

                {/* PDF / Slides */}
                {(lessonForm.lessonType === "pdf" ||
                  lessonForm.lessonType === "slide") && (
                  <div>
                    <Label>
                      Upload {lessonForm.lessonType === "pdf" ? "PDF" : "Slides"}
                    </Label>
                    <Input
                      type="file"
                      accept={
                        lessonForm.lessonType === "pdf"
                          ? ".pdf"
                          : ".pdf,.ppt,.pptx"
                      }
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          file: e.target.files?.[0] || null,
                        })
                      }
                      className="mt-2"
                    />
                  </div>
                )}

                {/* Assignment */}
                {lessonForm.lessonType === "assignment" && (
                  <div>
                    <Label>Assignment Instructions</Label>
                    <Textarea
                      value={lessonForm.assignmentDesc}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          assignmentDesc: e.target.value,
                        })
                      }
                      placeholder="Describe the assignment..."
                      rows={6}
                      className="mt-2"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowLessonDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateLesson} disabled={uploadingFile}>
                    {uploadingFile ? "Uploading..." : "Add Lesson"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </Layout>
  );
};

export default AdminCourseContentPage;