
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL DEFAULT '/',
  referrer text,
  visitor_id text NOT NULL,
  country text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Admin can read all page views
CREATE POLICY "Admins can read page views"
  ON public.page_views FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Edge function inserts via service role, so no insert policy needed for anon
