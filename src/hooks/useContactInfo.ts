import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ContactInfo {
  id: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  cv_url: string | null;
}

export const useContactInfo = () => {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('contact_info')
      .select('id, email, phone, location, linkedin_url, github_url, cv_url')
      .limit(1)
      .single();
    if (data) setContact(data as ContactInfo);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const update = async (fields: Partial<Omit<ContactInfo, 'id'>>) => {
    if (!contact) return;
    const { error } = await supabase
      .from('contact_info')
      .update(fields)
      .eq('id', contact.id);
    if (!error) await fetch();
    return error;
  };

  return { contact, loading, update, refetch: fetch };
};
