-- ============================================
-- Migration 007: Create quiz_attempts table
-- ============================================

CREATE TABLE public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    score INTEGER NOT NULL DEFAULT 0,
    total_points INTEGER NOT NULL DEFAULT 0,
    passed BOOLEAN NOT NULL DEFAULT false,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_quiz_attempts_quiz ON public.quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_student ON public.quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_quiz_student ON public.quiz_attempts(quiz_id, student_id);

-- Enable RLS
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Students can view their own attempts
CREATE POLICY "Students can view their own quiz attempts"
    ON public.quiz_attempts
    FOR SELECT
    TO authenticated
    USING (student_id = auth.uid());

-- Students can insert their own attempts
CREATE POLICY "Students can submit quiz attempts"
    ON public.quiz_attempts
    FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

-- Instructors can view attempts for their course quizzes
CREATE POLICY "Instructors can view quiz attempts for their courses"
    ON public.quiz_attempts
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.courses c ON c.id = q.course_id
            WHERE q.id = quiz_id AND c.instructor_id = auth.uid()
        )
    );

-- Admins have full access
CREATE POLICY "Admins have full access to quiz attempts"
    ON public.quiz_attempts
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
