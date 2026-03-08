-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES (1:1 with auth.users)
-- =============================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================
-- PRODUCTS
-- =============================================
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  compare_price numeric(10, 2) CHECK (compare_price >= 0),
  images text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================
-- INVENTORY (1:1 with products, auto-created)
-- =============================================
CREATE TABLE public.inventory (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  low_stock_threshold integer NOT NULL DEFAULT 5,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-create inventory when product is created
CREATE OR REPLACE FUNCTION public.handle_new_product()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.inventory (product_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_product_created
  AFTER INSERT ON public.products
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_product();

-- =============================================
-- ORDERS
-- =============================================
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  order_number text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
  ),
  total_amount numeric(10, 2) NOT NULL CHECK (total_amount >= 0),
  shipping_name text NOT NULL,
  shipping_phone text NOT NULL,
  shipping_address text NOT NULL,
  shipping_detail text,
  payment_key text,
  payment_order_id text NOT NULL UNIQUE,
  payment_method text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================
-- ORDER ITEMS (price snapshot)
-- =============================================
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_name text NOT NULL,
  product_image text,
  unit_price numeric(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity integer NOT NULL CHECK (quantity > 0),
  subtotal numeric(10, 2) NOT NULL CHECK (subtotal >= 0)
);

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_order_id ON public.orders(payment_order_id);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
