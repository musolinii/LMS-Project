-- ============================================
-- RLS Policies Reference: enrollments
-- These are applied in migration 004
-- ============================================

-- Students can view their own enrollments
-- Students can enroll themselves
-- Instructors can view enrollments for their courses
-- Admins can read all enrollments

-- Policy: Students can view their own enrollments
-- ON public.enrollments FOR SELECT TO authenticated
-- USING (student_id = auth.uid())

-- Policy: Instructors can view enrollments for their courses
-- ON public.enrollments FOR SELECT TO authenticated
-- USING (EXISTS (SELECT 1 FROM courses WHERE courses.id = course_id AND courses.instructor_id = auth.uid()))

-- Policy: Students can enroll themselves
-- ON public.enrollments FOR INSERT TO authenticated
-- WITH CHECK (student_id = auth.uid())

-- Policy: Admins have full access
-- ON public.enrollments FOR ALL TO authenticated
-- USING (role = 'admin')
