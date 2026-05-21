-- ============================================
-- Migration 003: Create lessons table
-- ============================================

CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    video_url TEXT,
    duration_minutes INTEGER DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_free BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_lessons_course ON public.lessons(course_id);
CREATE INDEX idx_lessons_sort_order ON public.lessons(course_id, sort_order);

-- Enable RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view lessons of published courses (or free lessons)
CREATE POLICY "Lessons of published courses are viewable"
    ON public.lessons
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = lessons.course_id
            AND (courses.status = 'published' OR courses.instructor_id = auth.uid())
        )
    );

-- Course instructors can manage lessons
CREATE POLICY "Instructors can insert lessons"
    ON public.lessons
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = course_id AND courses.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can update lessons"
    ON public.lessons
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = course_id AND courses.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can delete lessons"
    ON public.lessons
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = course_id AND courses.instructor_id = auth.uid()
        )
    );

-- Admins have full access
CREATE POLICY "Admins have full access to lessons"
    ON public.lessons
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Auto-update timestamp
CREATE TRIGGER lessons_updated_at
    BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
