-- ============================================
-- Migration 001: Create profiles table
-- ============================================

-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'instructor', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT,
    role public.user_role NOT NULL DEFAULT 'student',
    bio TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on role for filtering
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone authenticated can view profiles
CREATE POLICY "Profiles are viewable by authenticated users"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student')
    );
    RETURN NEW;
END;
$$;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
