-- Fix profile creation to work properly with RLS policies
-- This ensures new users can have profiles created and can save data

-- 1. Update ensure_user_profile to handle RLS properly
-- The function uses SECURITY DEFINER so it bypasses RLS, but we need to ensure it works correctly
CREATE OR REPLACE FUNCTION public.ensure_user_profile(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_profile_exists BOOLEAN;
  v_full_name TEXT;
  v_avatar_url TEXT;
  v_user_record RECORD;
BEGIN
  -- Verify the user_id matches the authenticated user (security check)
  IF user_id IS NULL OR user_id != auth.uid() THEN
    RAISE EXCEPTION 'User ID does not match authenticated user';
  END IF;

  -- Check if profile exists
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = user_id) INTO v_profile_exists;
  
  IF v_profile_exists THEN
    RETURN TRUE;
  END IF;

  -- Profile doesn't exist, try to create it from auth.users
  -- Using SECURITY DEFINER, we can access auth.users and bypass RLS
  BEGIN
    SELECT 
      raw_user_meta_data
    INTO v_user_record
    FROM auth.users
    WHERE id = user_id;

    IF NOT FOUND THEN
      -- User not found, create profile with minimal data
      -- SECURITY DEFINER allows us to bypass RLS
      INSERT INTO public.profiles (id, full_name, avatar_url, username, phone, is_verified, is_admin)
      VALUES (user_id, NULL, NULL, NULL, NULL, false, false)
      ON CONFLICT (id) DO NOTHING;
      RETURN TRUE;
    END IF;

    -- Extract metadata
    v_full_name := COALESCE(
      v_user_record.raw_user_meta_data ->> 'full_name',
      v_user_record.raw_user_meta_data ->> 'name',
      v_user_record.raw_user_meta_data ->> 'display_name',
      (v_user_record.raw_user_meta_data -> 'user_metadata' ->> 'full_name'),
      (v_user_record.raw_user_meta_data -> 'user_metadata' ->> 'name'),
      (v_user_record.raw_user_meta_data -> 'user_metadata' ->> 'display_name')
    );

    v_avatar_url := COALESCE(
      v_user_record.raw_user_meta_data ->> 'avatar_url',
      v_user_record.raw_user_meta_data ->> 'picture',
      (v_user_record.raw_user_meta_data -> 'user_metadata' ->> 'avatar_url'),
      (v_user_record.raw_user_meta_data -> 'user_metadata' ->> 'picture')
    );

    -- Create profile with all required fields
    -- SECURITY DEFINER allows us to bypass RLS
    INSERT INTO public.profiles (id, full_name, avatar_url, username, phone, is_verified, is_admin)
    VALUES (user_id, v_full_name, v_avatar_url, NULL, NULL, false, false)
    ON CONFLICT (id) DO NOTHING;

    RETURN TRUE;
  EXCEPTION WHEN OTHERS THEN
    -- If we can't read from auth.users, create minimal profile
    -- SECURITY DEFINER allows us to bypass RLS
    INSERT INTO public.profiles (id, full_name, avatar_url, username, phone, is_verified, is_admin)
    VALUES (user_id, NULL, NULL, NULL, NULL, false, false)
    ON CONFLICT (id) DO NOTHING;
    RETURN TRUE;
  END;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to ensure profile for user %: %', user_id, SQLERRM;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Update handle_new_user trigger to include all required fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_avatar_url TEXT;
BEGIN
  -- Extract full_name from various possible locations in raw_user_meta_data
  v_full_name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'name',
    NEW.raw_user_meta_data ->> 'display_name',
    (NEW.raw_user_meta_data -> 'user_metadata' ->> 'full_name'),
    (NEW.raw_user_meta_data -> 'user_metadata' ->> 'name'),
    (NEW.raw_user_meta_data -> 'user_metadata' ->> 'display_name')
  );

  -- Extract avatar_url from various possible locations
  v_avatar_url := COALESCE(
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.raw_user_meta_data ->> 'picture',
    (NEW.raw_user_meta_data -> 'user_metadata' ->> 'avatar_url'),
    (NEW.raw_user_meta_data -> 'user_metadata' ->> 'picture')
  );

  -- Insert profile with all required fields
  -- SECURITY DEFINER allows us to bypass RLS
  INSERT INTO public.profiles (id, full_name, avatar_url, username, phone, is_verified, is_admin)
  VALUES (NEW.id, v_full_name, v_avatar_url, NULL, NULL, false, false)
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the trigger
  RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Ensure the INSERT policy allows users to insert their own profile
-- Drop and recreate to ensure it's correct
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 4. Ensure the UPDATE policy allows users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id OR is_admin());

-- 5. Grant execute permission on ensure_user_profile to authenticated users
GRANT EXECUTE ON FUNCTION public.ensure_user_profile(UUID) TO authenticated;
