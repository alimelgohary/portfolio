
ALTER TABLE public.page_views 
  ADD COLUMN IF NOT EXISTS browser text DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS os text DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS session_id text,
  ADD COLUMN IF NOT EXISTS session_start timestamp with time zone DEFAULT now(),
  ADD COLUMN IF NOT EXISTS session_duration integer DEFAULT 0;
