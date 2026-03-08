
CREATE TABLE public.letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  relationship TEXT NOT NULL,
  raw_input_1 TEXT NOT NULL,
  raw_input_2 TEXT NOT NULL,
  raw_input_3 TEXT NOT NULL,
  sender_name TEXT,
  generated_letter TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

-- Anyone can read a letter by its ID (for shared links)
CREATE POLICY "Letters are publicly readable" ON public.letters
  FOR SELECT USING (true);

-- Allow anonymous inserts from edge functions (service role)
CREATE POLICY "Service role can insert letters" ON public.letters
  FOR INSERT WITH CHECK (true);
