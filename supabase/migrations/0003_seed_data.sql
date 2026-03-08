-- =============================================
-- SEED DATA FOR DEVELOPMENT
-- =============================================

-- Sample categories
INSERT INTO public.categories (id, name, slug, description, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Stationery', 'stationery', 'Pens, notebooks, and writing supplies', true),
  ('22222222-2222-2222-2222-222222222222', 'Electronics', 'electronics', 'Calculators, USB drives, and tech accessories', true),
  ('33333333-3333-3333-3333-333333333333', 'Clothing', 'clothing', 'School branded apparel and uniforms', true),
  ('44444444-4444-4444-4444-444444444444', 'Books', 'books', 'Textbooks, reference books, and study guides', true)
ON CONFLICT (slug) DO NOTHING;

-- Sample products
INSERT INTO public.products (id, category_id, name, slug, description, price, compare_price, images, is_active) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Premium Ballpoint Pen Set',
    'premium-ballpoint-pen-set',
    'A set of 12 premium ballpoint pens in assorted colors. Smooth writing experience for everyday use.',
    8500,
    12000,
    '{}',
    true
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    'A4 Spiral Notebook',
    'a4-spiral-notebook',
    'High-quality 200-page spiral notebook with ruled lines. Perfect for lectures and note-taking.',
    5000,
    NULL,
    '{}',
    true
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '22222222-2222-2222-2222-222222222222',
    'Scientific Calculator',
    'scientific-calculator',
    'Advanced scientific calculator with 240+ functions. Ideal for math, science, and engineering courses.',
    35000,
    42000,
    '{}',
    true
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '33333333-3333-3333-3333-333333333333',
    'School Logo Hoodie',
    'school-logo-hoodie',
    'Comfortable cotton-blend hoodie with embroidered school logo. Available in navy and grey.',
    45000,
    NULL,
    '{}',
    true
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '22222222-2222-2222-2222-222222222222',
    'USB-C 64GB Flash Drive',
    'usb-c-64gb-flash-drive',
    'High-speed USB-C flash drive with 64GB storage. Compatible with laptops, tablets, and smartphones.',
    22000,
    28000,
    '{}',
    true
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '44444444-4444-4444-4444-444444444444',
    'Korean Language Workbook',
    'korean-language-workbook',
    'Comprehensive Korean language workbook for intermediate learners. Includes practice exercises and answer key.',
    18000,
    NULL,
    '{}',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Update inventory for seed products
INSERT INTO public.inventory (product_id, quantity, low_stock_threshold)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 50, 10),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 100, 20),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 30, 5),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 25, 5),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 75, 10),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 40, 10)
ON CONFLICT (product_id) DO UPDATE SET
  quantity = EXCLUDED.quantity,
  low_stock_threshold = EXCLUDED.low_stock_threshold;
