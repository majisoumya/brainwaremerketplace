-- Fix handle_new_user function to support Google OAuth and handle errors better
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
      NEW.id,
      COALESCE(
        NEW.raw_user_meta_data ->> 'full_name',
        NEW.raw_user_meta_data ->> 'name',
        NEW.raw_user_meta_data ->> 'display_name',
        (NEW.raw_user_meta_data -> 'user_metadata' ->> 'full_name'),
        (NEW.raw_user_meta_data -> 'user_metadata' ->> 'name')
      ),
      COALESCE(
        NEW.raw_user_meta_data ->> 'avatar_url',
        NEW.raw_user_meta_data ->> 'picture',
        (NEW.raw_user_meta_data -> 'user_metadata' ->> 'avatar_url'),
        (NEW.raw_user_meta_data -> 'user_metadata' ->> 'picture')
      )
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = COALESCE(
        EXCLUDED.full_name,
        profiles.full_name
      ),
      avatar_url = COALESCE(
        EXCLUDED.avatar_url,
        profiles.avatar_url
      );
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the trigger
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop and recreate trigger to ensure it's properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
