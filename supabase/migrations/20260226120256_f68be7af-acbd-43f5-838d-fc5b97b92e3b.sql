
-- Allow anonymous users to update insurance_status and insurance_requested_at on shipments
CREATE POLICY "Anon can request insurance" ON public.shipments
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
