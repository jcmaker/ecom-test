"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { useCart } from "@/hooks/useCart";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, totalAmount, totalItems } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart ({totalItems()})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button variant="outline" render={<Link href="/products" />} onClick={() => onOpenChange(false)}>
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </div>
            </div>
            <div className="border-t border-border pt-4 space-y-4">
              <CartSummary subtotal={totalAmount()} />
              <Button className="w-full" render={<Link href="/checkout" />} onClick={() => onOpenChange(false)}>
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
