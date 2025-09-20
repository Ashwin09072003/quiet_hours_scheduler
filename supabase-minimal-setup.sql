-- Minimal Supabase setup for Quiet Hours Scheduler
-- This only creates the essential functions needed for authentication

-- Create a function to get the current user ID
CREATE OR REPLACE FUNCTION auth.user_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
  )::uuid
$$;

-- Create a function to check if a user is authenticated
CREATE OR REPLACE FUNCTION auth.is_authenticated()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT auth.user_id() IS NOT NULL
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
GRANT EXECUTE ON FUNCTION auth.user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.is_authenticated() TO authenticated;
