
-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Letters are publicly readable" ON public.letters;

CREATE POLICY "Letters are publicly readable"
  ON public.letters
  FOR SELECT
  TO anon, authenticated
  USING (true);
