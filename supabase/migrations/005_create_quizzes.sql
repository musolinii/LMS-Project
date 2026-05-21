-- ============================================
-- Migration 005: Create quizzes table
-- ============================================

CREATE TABLE public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    time_limit_minutes INTEGER DEFAULT NULL,
    pass_percentage INTEGER NOT NULL DEFAULT 60,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_quizzes_course ON public.quizzes(course_id);
CREATE INDEX idx_quizzes_lesson ON public.quizzes(lesson_id);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Published quizzes are viewable by enrolled students
CREATE POLICY "Published quizzes are viewable by enrolled students"
    ON public.quizzes
    FOR SELECT
    TO authenticated
    USING (
        is_published = true AND
        EXISTS (
            SELECT 1 FROM public.enrollments
            WHERE enrollments.course_id = quizzes.course_id
            AND enrollments.student_id = auth.uid()
            AND enrollments.status = 'active'
        )
    );

-- Instructors can view their own quizzes
CREATE POLICY "Instructors can view their course quizzes"
    ON public.quizzes
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = course_id AND courses.instructor_id = auth.uid()
        )
    );

-- Instructors can manage quizzes for their courses
CREATE POLICY "Instructors can create quizzes"
    ON public.quizzes
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = course_id AND courses.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can update their quizzes"
    ON public.quizzes
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = course_id AND courses.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can delete their quizzes"
    ON public.quizzes
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = course_id AND courses.instructor_id = auth.uid()
        )
    );

-- Admins have full access
CREATE POLICY "Admins have full access to quizzes"
    ON public.quizzes
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
