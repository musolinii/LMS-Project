-- ============================================
-- Migration 004: Create enrollments table
-- ============================================

CREATE TYPE public.enrollment_status AS ENUM ('active', 'completed', 'dropped');

CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    status public.enrollment_status NOT NULL DEFAULT 'active',
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(student_id, course_id)
);

-- Indexes
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_enrollments_status ON public.enrollments(status);

-- Enable RLS
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Students can view their own enrollments
CREATE POLICY "Students can view their own enrollments"
    ON public.enrollments
    FOR SELECT
    TO authenticated
    USING (student_id = auth.uid());

-- Instructors can view enrollments for their courses
CREATE POLICY "Instructors can view enrollments for their courses"
    ON public.enrollments
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = course_id AND courses.instructor_id = auth.uid()
        )
    );

-- Students can enroll themselves
CREATE POLICY "Students can enroll themselves"
    ON public.enrollments
    FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

-- Students can update their own enrollment (e.g., drop)
CREATE POLICY "Students can update their own enrollment"
    ON public.enrollments
    FOR UPDATE
    TO authenticated
    USING (student_id = auth.uid())
    WITH CHECK (student_id = auth.uid());

-- Admins have full access
CREATE POLICY "Admins have full access to enrollments"
    ON public.enrollments
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
