
CREATE TABLE public.contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  phone text,
  location text,
  linkedin_url text,
  github_url text,
  cv_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read contact info"
  ON public.contact_info FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert contact info"
  ON public.contact_info FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact info"
  ON public.contact_info FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact info"
  ON public.contact_info FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert a default empty row
INSERT INTO public.contact_info (email, phone, location, linkedin_url, github_url, cv_url)
VALUES (null, null, null, null, null, null);
