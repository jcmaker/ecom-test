import { Suspense } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { createClient } from "@/lib/supabase/server";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchParams {
  category?: string;
  sort?: string;
  q?: string;
}

interface ProductsPageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata = {
  title: "Products",
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name");

  // Build products query
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true);

  if (params.category && params.category !== "all") {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single();
    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  if (params.q) {
    query = query.ilike("name", `%${params.q}%`);
  }

  // Sort
  switch (params.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <Suspense fallback={<div className="h-10" />}>
          <ProductFilters categories={categories ?? []} />
        </Suspense>
      </div>
      <ProductGrid products={products ?? []} />
    </div>
  );
}
