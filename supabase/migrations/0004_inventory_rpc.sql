-- =============================================
-- INVENTORY RPC FUNCTIONS
-- =============================================

-- Atomically decrement inventory (with floor at 0 check)
CREATE OR REPLACE FUNCTION public.decrement_inventory(
  p_product_id uuid,
  p_quantity integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.inventory
  SET quantity = quantity - p_quantity,
      updated_at = now()
  WHERE product_id = p_product_id
    AND quantity >= p_quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient inventory for product %', p_product_id;
  END IF;
END;
$$;

-- Atomically increment inventory (for refunds/cancellations)
CREATE OR REPLACE FUNCTION public.increment_inventory(
  p_product_id uuid,
  p_quantity integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.inventory
  SET quantity = quantity + p_quantity,
      updated_at = now()
  WHERE product_id = p_product_id;
END;
$$;
