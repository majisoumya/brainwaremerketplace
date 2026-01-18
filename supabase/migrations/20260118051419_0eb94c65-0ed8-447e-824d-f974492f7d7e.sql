-- Create a database webhook to trigger the on-user-created edge function when a new profile is inserted
-- Note: This uses pg_net extension to call the edge function

-- First, create a function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user_welcome_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Call the edge function via pg_net
  PERFORM net.http_post(
    url := 'https://mymkzimfzsslqwsvcqpx.supabase.co/functions/v1/on-user-created',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'profiles',
      'record', jsonb_build_object(
        'id', NEW.id,
        'full_name', NEW.full_name,
        'created_at', NEW.created_at
      ),
      'schema', 'public'
    )
  );
  RETURN NEW;
END;
$$;

-- Create the trigger on the profiles table
DROP TRIGGER IF EXISTS on_profile_created_welcome_email ON public.profiles;
CREATE TRIGGER on_profile_created_welcome_email
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_welcome_email();