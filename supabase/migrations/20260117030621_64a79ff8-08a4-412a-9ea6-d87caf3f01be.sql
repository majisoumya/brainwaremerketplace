-- Fix the security definer view issue by using security_invoker
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public
WITH (security_invoker=on) AS
SELECT 
  id,
  username,
  avatar_url,
  is_verified,
  created_at,
  full_name,
  whatsapp
FROM public.profiles;