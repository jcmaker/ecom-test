-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER: is_admin()
-- =============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- =============================================
-- PROFILES POLICIES
-- =============================================
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- CATEGORIES POLICIES
-- =============================================
CREATE POLICY "categories_select_active" ON public.categories
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "categories_admin_insert" ON public.categories
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "categories_admin_update" ON public.categories
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "categories_admin_delete" ON public.categories
  FOR DELETE USING (public.is_admin());

-- =============================================
-- PRODUCTS POLICIES
-- =============================================
CREATE POLICY "products_select_active" ON public.products
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "products_admin_insert" ON public.products
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "products_admin_update" ON public.products
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "products_admin_delete" ON public.products
  FOR DELETE USING (public.is_admin());

-- =============================================
-- INVENTORY POLICIES (admin only)
-- =============================================
CREATE POLICY "inventory_admin_all" ON public.inventory
  FOR ALL USING (public.is_admin());

-- =============================================
-- ORDERS POLICIES
-- =============================================
CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "orders_insert_own" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_admin" ON public.orders
  FOR UPDATE USING (public.is_admin());

-- =============================================
-- ORDER ITEMS POLICIES
-- =============================================
CREATE POLICY "order_items_select" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "order_items_insert" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );
