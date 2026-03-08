"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Product not found</h1>
        <p className="text-muted-foreground">
          This product may have been removed or is no longer available.
        </p>
      </div>
    );
  }

  const hasDiscount =
    product.compare_price && product.compare_price > product.price;

  function handleAddToCart() {
    addItem({
      productId: product!.id,
      name: product!.name,
      price: product!.price,
      image: product!.images[0] ?? null,
      slug: product!.slug,
      quantity,
    });
    toast.success(`${product!.name} added to cart`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <ProductImageGallery images={product.images} name={product.name} />

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-2xl font-bold">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.compare_price!)}
                  </span>
                  <Badge variant="destructive">
                    -
                    {Math.round(
                      ((product.compare_price! - product.price) /
                        product.compare_price!) *
                        100
                    )}
                    %
                  </Badge>
                </>
              )}
            </div>
          </div>

          <Separator />

          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
