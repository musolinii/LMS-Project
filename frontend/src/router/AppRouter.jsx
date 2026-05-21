import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';

// Protected layout/routes
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Student pages
import StudentDashboard from '../pages/student/StudentDashboard';
import MyCourses from '../pages/student/MyCourses';
import CourseView from '../pages/student/CourseView';

// Instructor pages
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import ManageInstructorCourses from '../pages/instructor/ManageCourses';
import CreateCourse from '../pages/instructor/CreateCourse';
import EditCourse from '../pages/instructor/EditCourse';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageAdminCourses from '../pages/admin/ManageCourses';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Protected Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses/:courseId"
          element={
            <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
              <CourseView />
            </ProtectedRoute>
          }
        />

        {/* Instructor Protected Routes */}
        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/courses"
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <ManageInstructorCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/courses/create"
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/courses/:courseId/edit"
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <EditCourse />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageAdminCourses />
            </ProtectedRoute>
          }
        />

        {/* Fallbacks */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
