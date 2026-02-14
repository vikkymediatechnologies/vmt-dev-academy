




import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import Index from "./pages/Index";
import Tracks from "./pages/Tracks";
import Modes from "./pages/Modes";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import AdminAuthPage from "./pages/AdminAuthPage";
import Settings from "./pages/Settings";
import AdminCourses from "./pages/AdminCourses";
import AdminCourseContent from "./pages/AdminCourseContent";
import StudentCourseView from "./pages/StudentCourseView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tracks" element={<Tracks />} />
            <Route path="/modes" element={<Modes />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-auth" element={<AdminAuthPage />} />

            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            // Admin Routes
<Route
  path="/admin/courses"
  element={
    <AdminRoute>
      <AdminCourses />
    </AdminRoute>
  }
/>
<Route
  path="/admin/courses/:courseId"
  element={
    <AdminRoute>
      <AdminCourseContent />
    </AdminRoute>
  }
/>

// Student Routes
<Route
  path="/courses/:courseId"
  element={
    <ProtectedRoute>
      <StudentCourseView />
    </ProtectedRoute>
  }
/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
