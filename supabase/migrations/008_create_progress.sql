-- ============================================
-- Migration 008: Create lesson_progress table
-- ============================================

CREATE TABLE public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    last_position_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, lesson_id)
);

-- Indexes
CREATE INDEX idx_progress_student ON public.lesson_progress(student_id);
CREATE INDEX idx_progress_lesson ON public.lesson_progress(lesson_id);
CREATE INDEX idx_progress_course ON public.lesson_progress(course_id);
CREATE INDEX idx_progress_student_course ON public.lesson_progress(student_id, course_id);

-- Enable RLS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Students can view their own progress
CREATE POLICY "Students can view their own progress"
    ON public.lesson_progress
    FOR SELECT
    TO authenticated
    USING (student_id = auth.uid());

-- Students can insert their own progress
CREATE POLICY "Students can create progress records"
    ON public.lesson_progress
    FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

-- Students can update their own progress
CREATE POLICY "Students can update their own progress"
    ON public.lesson_progress
    FOR UPDATE
    TO authenticated
    USING (student_id = auth.uid())
    WITH CHECK (student_id = auth.uid());

-- Instructors can view progress for their courses
CREATE POLICY "Instructors can view progress for their courses"
    ON public.lesson_progress
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = course_id AND courses.instructor_id = auth.uid()
        )
    );

-- Admins have full access
CREATE POLICY "Admins have full access to progress"
    ON public.lesson_progress
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Auto-update timestamp
CREATE TRIGGER progress_updated_at
    BEFORE UPDATE ON public.lesson_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
