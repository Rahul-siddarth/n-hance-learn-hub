import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Material Pages
import SemesterSelect from "./pages/materials/SemesterSelect";
import SubjectSelect from "./pages/materials/SubjectSelect";
import MaterialView from "./pages/materials/MaterialView";

// Reference Pages
import ReferenceSemesterSelect from "./pages/references/ReferenceSemesterSelect";
import ReferenceSubjectSelect from "./pages/references/ReferenceSubjectSelect";
import ReferenceBookView from "./pages/references/ReferenceBookView";

// Quiz Pages
import QuizSemesterSelect from "./pages/quiz/QuizSemesterSelect";
import QuizSubjectSelect from "./pages/quiz/QuizSubjectSelect";
import QuizModuleSelect from "./pages/quiz/QuizModuleSelect";
import QuizPlaceholder from "./pages/quiz/QuizPlaceholder";

// Admin
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />

            {/* Material Routes */}
            <Route path="/materials" element={
              <ProtectedRoute>
                <SemesterSelect />
              </ProtectedRoute>
            } />
            <Route path="/materials/semester/:semester" element={
              <ProtectedRoute>
                <SubjectSelect />
              </ProtectedRoute>
            } />
            <Route path="/materials/semester/:semester/subject/:subjectId" element={
              <ProtectedRoute>
                <MaterialView />
              </ProtectedRoute>
            } />

            {/* Reference Routes */}
            <Route path="/references" element={
              <ProtectedRoute>
                <ReferenceSemesterSelect />
              </ProtectedRoute>
            } />
            <Route path="/references/semester/:semester" element={
              <ProtectedRoute>
                <ReferenceSubjectSelect />
              </ProtectedRoute>
            } />
            <Route path="/references/semester/:semester/subject/:subjectId" element={
              <ProtectedRoute>
                <ReferenceBookView />
              </ProtectedRoute>
            } />

            {/* Quiz Routes */}
            <Route path="/quiz" element={
              <ProtectedRoute>
                <QuizSemesterSelect />
              </ProtectedRoute>
            } />
            <Route path="/quiz/semester/:semester" element={
              <ProtectedRoute>
                <QuizSubjectSelect />
              </ProtectedRoute>
            } />
            <Route path="/quiz/semester/:semester/subject/:subjectId" element={
              <ProtectedRoute>
                <QuizModuleSelect />
              </ProtectedRoute>
            } />
            <Route path="/quiz/semester/:semester/subject/:subjectId/module/:moduleId" element={
              <ProtectedRoute>
                <QuizPlaceholder />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
