-- Ensure handle_new_user function works correctly for both email and OAuth signups
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

-- Verify trigger exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
