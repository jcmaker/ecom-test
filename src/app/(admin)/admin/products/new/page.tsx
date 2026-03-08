"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProductForm } from "@/components/products/ProductForm";
import { toast } from "sonner";
import { useEffect } from "react";
import type { Database } from "@/types/database.types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  async function handleSubmit(data: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    compare_price?: number | "" | null;
    category_id: string;
    is_active: boolean;
    images?: string[];
  }) {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.from("products").insert({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      price: data.price,
      compare_price: data.compare_price || null,
      category_id: data.category_id,
      is_active: data.is_active,
      images: data.images ?? [],
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Product created");
    router.push("/admin/products");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">New Product</h1>
      <ProductForm
        categories={categories}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
