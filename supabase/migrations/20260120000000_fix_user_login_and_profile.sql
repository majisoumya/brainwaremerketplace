-- Comprehensive fix for user login and profile creation
-- This migration ensures profiles are created properly and provides fallback mechanisms

-- 1. Fix the handle_new_user function to properly read metadata from all sources
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

  -- Insert profile with extracted values
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, v_full_name, v_avatar_url)
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

-- 2. Create a function to ensure profile exists (fallback mechanism)
-- This function can be called by authenticated users to ensure their profile exists
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
  -- Using SECURITY DEFINER, we can access auth.users
  BEGIN
    SELECT 
      raw_user_meta_data
    INTO v_user_record
    FROM auth.users
    WHERE id = user_id;

    IF NOT FOUND THEN
      -- User not found, create profile with minimal data
      INSERT INTO public.profiles (id, full_name, avatar_url)
      VALUES (user_id, NULL, NULL)
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

    -- Create profile
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (user_id, v_full_name, v_avatar_url)
    ON CONFLICT (id) DO NOTHING;

    RETURN TRUE;
  EXCEPTION WHEN OTHERS THEN
    -- If we can't read from auth.users, create minimal profile
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (user_id, NULL, NULL)
    ON CONFLICT (id) DO NOTHING;
    RETURN TRUE;
  END;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to ensure profile for user %: %', user_id, SQLERRM;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Ensure trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Grant execute permission on ensure_user_profile to authenticated users
GRANT EXECUTE ON FUNCTION public.ensure_user_profile(UUID) TO authenticated;

-- 5. Create a policy to allow users to call ensure_user_profile for themselves
-- (This is handled by SECURITY DEFINER, but we ensure the function is accessible)
