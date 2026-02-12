-- Remove overly broad read access to profiles.
-- This policy exposed all profile rows (including emails) to any client using the anon key.
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;
