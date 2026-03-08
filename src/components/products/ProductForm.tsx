"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/types/database.types";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens"),
  description: z.string().optional(),
  price: z.preprocess((v) => Number(v), z.number().positive("Price must be positive")),
  compare_price: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
    z.number().positive().nullable().optional()
  ),
  category_id: z.string().uuid("Please select a category"),
  is_active: z.boolean().default(true),
});

type ProductFormValues = {
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_price?: number | null;
  category_id: string;
  is_active: boolean;
};

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (data: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    compare_price?: number | null;
    category_id: string;
    is_active: boolean;
    images?: string[];
  }) => Promise<void>;
  loading?: boolean;
}

export function ProductForm({
  product,
  categories,
  onSubmit,
  loading,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      compare_price: product?.compare_price ?? undefined,
      category_id: product?.category_id ?? "",
      is_active: product?.is_active ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>{product ? "Edit Product" : "New Product"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" {...register("slug")} />
              {errors.slug && (
                <p className="text-xs text-destructive">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register("description")}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              value={watch("category_id")}
              onValueChange={(val: string | null) => val && setValue("category_id", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-xs text-destructive">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (KRW) *</Label>
              <Input
                id="price"
                type="number"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="compare_price">Compare Price (KRW)</Label>
              <Input
                id="compare_price"
                type="number"
                {...register("compare_price")}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              {...register("is_active")}
              className="h-4 w-4"
            />
            <Label htmlFor="is_active">Active (visible to customers)</Label>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
