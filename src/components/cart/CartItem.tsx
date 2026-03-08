"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import type { CartItem as CartItemType } from "@/types/cart";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.name}</p>
        <p className="text-sm text-muted-foreground">
          {formatPrice(item.price)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center text-sm">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={() => removeItem(item.productId)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
