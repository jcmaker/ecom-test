"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProductForm } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("products").select("*").eq("id", id).single(),
      supabase.from("categories").select("*").order("name"),
    ]).then(([productRes, categoriesRes]) => {
      setProduct(productRes.data);
      setCategories(categoriesRes.data ?? []);
      setFetching(false);
    });
  }, [id]);

  async function handleSubmit(data: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    compare_price?: number | "" | null;
    category_id: string;
    is_active: boolean;
  }) {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("products")
      .update({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price,
        compare_price: data.compare_price || null,
        category_id: data.category_id,
        is_active: data.is_active,
      })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Product updated");
    router.push("/admin/products");
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Product deleted");
    router.push("/admin/products");
  }

  if (fetching) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <ProductForm
        product={product}
        categories={categories}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
