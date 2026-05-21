-- ============================================
-- Migration 002: Create courses table
-- ============================================

-- Create enums
CREATE TYPE public.course_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.course_status AS ENUM ('draft', 'published', 'archived');

-- Create courses table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    thumbnail_url TEXT,
    category TEXT DEFAULT 'general',
    difficulty public.course_difficulty NOT NULL DEFAULT 'beginner',
    status public.course_status NOT NULL DEFAULT 'draft',
    price DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_courses_category ON public.courses(category);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read published courses
CREATE POLICY "Published courses are viewable by everyone"
    ON public.courses
    FOR SELECT
    USING (status = 'published' OR instructor_id = auth.uid());

-- Instructors can insert their own courses
CREATE POLICY "Instructors can create courses"
    ON public.courses
    FOR INSERT
    TO authenticated
    WITH CHECK (
        instructor_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('instructor', 'admin')
        )
    );

-- Instructors can update their own courses
CREATE POLICY "Instructors can update their own courses"
    ON public.courses
    FOR UPDATE
    TO authenticated
    USING (instructor_id = auth.uid())
    WITH CHECK (instructor_id = auth.uid());

-- Instructors can delete their own courses
CREATE POLICY "Instructors can delete their own courses"
    ON public.courses
    FOR DELETE
    TO authenticated
    USING (instructor_id = auth.uid());

-- Admins can do everything
CREATE POLICY "Admins have full access to courses"
    ON public.courses
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Auto-update timestamp
CREATE TRIGGER courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
