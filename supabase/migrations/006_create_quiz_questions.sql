-- ============================================
-- Migration 006: Create quiz_questions table
-- ============================================

CREATE TYPE public.question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer');

CREATE TABLE public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type public.question_type NOT NULL DEFAULT 'multiple_choice',
    options JSONB DEFAULT '[]'::jsonb,
    correct_answer TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- Indexes
CREATE INDEX idx_quiz_questions_quiz ON public.quiz_questions(quiz_id);
CREATE INDEX idx_quiz_questions_sort ON public.quiz_questions(quiz_id, sort_order);

-- Enable RLS
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Students can view questions for published quizzes they're enrolled in
CREATE POLICY "Students can view quiz questions"
    ON public.quiz_questions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.enrollments e ON e.course_id = q.course_id
            WHERE q.id = quiz_id
            AND q.is_published = true
            AND e.student_id = auth.uid()
            AND e.status = 'active'
        )
    );

-- Instructors can manage questions for their quizzes
CREATE POLICY "Instructors can view their quiz questions"
    ON public.quiz_questions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.courses c ON c.id = q.course_id
            WHERE q.id = quiz_id AND c.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can create quiz questions"
    ON public.quiz_questions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.courses c ON c.id = q.course_id
            WHERE q.id = quiz_id AND c.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can update quiz questions"
    ON public.quiz_questions
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.courses c ON c.id = q.course_id
            WHERE q.id = quiz_id AND c.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can delete quiz questions"
    ON public.quiz_questions
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.courses c ON c.id = q.course_id
            WHERE q.id = quiz_id AND c.instructor_id = auth.uid()
        )
    );

-- Admins have full access
CREATE POLICY "Admins have full access to quiz questions"
    ON public.quiz_questions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
