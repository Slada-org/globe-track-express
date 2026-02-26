
-- Drop the overly permissive policy
DROP POLICY "Anon can request insurance" ON public.shipments;

-- Create a function to handle insurance requests securely
CREATE OR REPLACE FUNCTION public.request_insurance(p_shipment_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.shipments
  SET insurance_status = 'requested',
      insurance_requested_at = now()
  WHERE id = p_shipment_id
    AND insurance_status = 'none';
END;
$$;
