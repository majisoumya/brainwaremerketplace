-- Add whatsapp column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp text;

-- Update profiles_public view to include whatsapp
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public AS
SELECT 
  id,
  username,
  avatar_url,
  is_verified,
  created_at,
  full_name,
  whatsapp
FROM public.profiles;