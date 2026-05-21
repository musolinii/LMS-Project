-- ============================================
-- RLS Policies Reference: profiles
-- These are applied in migration 001
-- ============================================

-- Anyone authenticated can view profiles
-- Users can update their own profile
-- Admins can update any profile

-- Policy: Profiles are viewable by authenticated users
-- ON public.profiles FOR SELECT TO authenticated USING (true)

-- Policy: Users can update their own profile
-- ON public.profiles FOR UPDATE TO authenticated
-- USING (auth.uid() = id) WITH CHECK (auth.uid() = id)

-- Policy: Admins can update any profile
-- ON public.profiles FOR UPDATE TO authenticated
-- USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
