import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount =
    product.compare_price && product.compare_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compare_price! - product.price) / product.compare_price!) *
          100
      )
    : 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
              -{discountPercent}%
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm leading-tight line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-bold">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compare_price!)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
