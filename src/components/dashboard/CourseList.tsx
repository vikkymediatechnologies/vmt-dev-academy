// import { useState } from "react";
// import { motion } from "framer-motion";
// import { trackCourses } from "@/data/courses";
// import {
//   Clock,
//   Layers,
//   Lock,
//   PlayCircle,
//   CreditCard,
//   Eye,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { usePayment } from "@/hooks/usePayment";

// interface CourseListProps {
//   track: string;
//   accessType: "free" | "paid";
//   isTrialExpired?: boolean;
// }

// const levelColor: Record<string, string> = {
//   Beginner:
//     "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//   Intermediate:
//     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
//   Advanced:
//     "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
// };

// const CourseList = ({
//   track,
//   accessType,
//   isTrialExpired = false,
// }: CourseListProps) => {
//   const courses = trackCourses[track] || trackCourses["foundation"];
//   const [lockedLesson, setLockedLesson] = useState<any | null>(null);
//   const { initializePayment, amount, loading } = usePayment();

//   const hasFullAccess =
//     accessType === "paid" || (accessType === "free" && !isTrialExpired);

//   const canAccessLesson = (lesson: any) => {
//     if (hasFullAccess) return true;
//     return lesson.isPreview === true;
//   };

//   return (
//     <>
//       <div className="space-y-6">
//         {courses.map((course, i) => (
//           <motion.div
//             key={course.id}
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.05 }}
//             className="rounded-xl border border-border bg-card p-6 shadow-sm"
//           >
//             {/* Course Header */}
//             <div className="flex items-center justify-between mb-3">
//               <div>
//                 <h4 className="font-display text-lg font-semibold text-foreground">
//                   {course.title}
//                 </h4>
//                 <p className="text-sm text-muted-foreground">
//                   {course.description}
//                 </p>
//               </div>
//               <Badge className={levelColor[course.level]}>
//                 {course.level}
//               </Badge>
//             </div>

//             {/* Lessons */}
//             <div className="mt-4 space-y-3">
//               {course.lessons.map((lesson) => {
//                 const accessible = canAccessLesson(lesson);

//                 return (
//                   <div
//                     key={lesson.id}
//                     className="relative flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent/5 transition"
//                   >
//                     <div
//                       className={`flex items-center gap-3 ${
//                         !accessible ? "opacity-50" : ""
//                       }`}
//                     >
//                       <Layers className="h-4 w-4" />
//                       <span className="text-sm">{lesson.title}</span>
//                       <Clock className="h-3.5 w-3.5 text-muted-foreground" />
//                       <span className="text-xs text-muted-foreground">
//                         {lesson.duration}
//                       </span>

//                       {lesson.isPreview && !hasFullAccess && (
//                         <Badge variant="secondary" className="ml-2">
//                           Preview
//                         </Badge>
//                       )}
//                     </div>

//                     {accessible ? (
//                       <Button size="sm" variant="outline" className="gap-1.5">
//                         <PlayCircle className="h-4 w-4" />
//                         Start
//                       </Button>
//                     ) : (
//                       <Button
//                         size="sm"
//                         variant="secondary"
//                         className="gap-1.5"
//                         onClick={() => setLockedLesson({ course, lesson })}
//                       >
//                         <Lock className="h-4 w-4" />
//                         Unlock
//                       </Button>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Upgrade Modal */}
//       <Dialog open={!!lockedLesson} onOpenChange={() => setLockedLesson(null)}>
//         <DialogContent className="max-w-md text-center">
//           <Lock className="mx-auto h-10 w-10 text-muted-foreground" />

//           <h3 className="mt-4 font-display text-lg font-semibold">
//             Unlock Full Access
//           </h3>

//           <p className="mt-2 text-sm text-muted-foreground">
//             Upgrade to access all lessons, projects, mentorship, and
//             downloadable resources.
//           </p>

//           <Button
//             variant="secondary"
//             className="mt-6 w-full gap-2"
//             onClick={initializePayment}
//             disabled={loading}
//           >
//             <CreditCard className="h-4 w-4" />
//             {loading ? "Processing…" : `Upgrade — ₦${amount.toLocaleString()}`}
//           </Button>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default CourseList;







// This is an EXAMPLE - Update your actual CourseList.tsx to match this pattern

import { Lock, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseListProps {
  track: string;
  accessType: "free" | "paid";
  isTrialExpired: boolean;
  isLocked: boolean;
  canAccess: boolean;
}

const CourseList = ({ 
  track, 
  accessType, 
  isTrialExpired, 
  isLocked,
  canAccess 
}: CourseListProps) => {
  
  // Sample courses - replace with your actual course data
  const courses = [
    { id: 1, title: "HTML Fundamentals", track: "foundation", free: true },
    { id: 2, title: "CSS Styling", track: "foundation", free: true },
    { id: 3, title: "JavaScript Basics", track: "foundation", free: false },
    { id: 4, title: "React Framework", track: "frontend", free: false },
    // ... more courses
  ];

  const relevantCourses = courses.filter(c => 
    c.track === track || track === "fullstack"
  );

  // Show message if user can't access courses
  if (!canAccess) {
    if (isTrialExpired) {
      return (
        <div className="mt-4 rounded-xl border border-destructive bg-destructive/5 p-8 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
          <p className="mt-3 font-semibold">Trial Expired</p>
          <p className="text-sm text-muted-foreground">
            Upgrade to access your courses
          </p>
        </div>
      );
    }

    if (isLocked) {
      return (
        <div className="mt-4 rounded-xl border border-amber-500 bg-amber-50 dark:bg-amber-950 p-8 text-center">
          <Clock className="mx-auto h-8 w-8 text-amber-600" />
          <p className="mt-3 font-semibold text-amber-900 dark:text-amber-100">
            Awaiting Approval
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Your courses will be available once your application is approved
          </p>
        </div>
      );
    }
  }

  // User can access - show courses
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {relevantCourses.map((course) => {
        const isAccessible = accessType === "paid" || course.free;

        return (
          <div
            key={course.id}
            className={`relative rounded-xl border bg-card p-6 shadow-sm transition-opacity ${
              !isAccessible ? "opacity-60" : ""
            }`}
          >
            {!isAccessible && (
              <div className="absolute top-2 right-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            
            <h4 className="font-semibold">{course.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {course.free ? "Free Preview" : "Premium Content"}
            </p>

            {isAccessible ? (
              <Button size="sm" className="mt-4 w-full">
                Start Learning
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="mt-4 w-full" disabled>
                Locked
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseList;