-- ============================================
-- RLS Policies Reference: courses
-- These are applied in migration 002
-- ============================================

-- Anyone can read published courses
-- Instructors can CRUD their own courses
-- Admins can CRUD any course

-- Policy: Published courses are viewable by everyone
-- ON public.courses FOR SELECT
-- USING (status = 'published' OR instructor_id = auth.uid())

-- Policy: Instructors can create courses
-- ON public.courses FOR INSERT TO authenticated
-- WITH CHECK (instructor_id = auth.uid() AND role IN ('instructor','admin'))

-- Policy: Instructors can update their own courses
-- ON public.courses FOR UPDATE TO authenticated
-- USING (instructor_id = auth.uid())

-- Policy: Instructors can delete their own courses
-- ON public.courses FOR DELETE TO authenticated
-- USING (instructor_id = auth.uid())

-- Policy: Admins have full access to courses
-- ON public.courses FOR ALL TO authenticated
-- USING (role = 'admin')
