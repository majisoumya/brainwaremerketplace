-- Fix PUBLIC_DATA_EXPOSURE: Restrict profiles table access

-- 1. Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- 2. Create restricted policies - users can only see their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- 3. Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin());

-- 4. Create a public view with only safe fields for listing displays
-- This view excludes: phone, full_name, is_admin
CREATE OR REPLACE VIEW public.profiles_public 
WITH (security_invoker = on) AS
SELECT 
  id,
  username,
  avatar_url,
  is_verified,
  created_at
FROM public.profiles;