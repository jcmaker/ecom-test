"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { items, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Add some products to get started.
        </p>
        <Button render={<Link href="/products" />}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="divide-y divide-border">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4 p-6 bg-muted/30 rounded-xl">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <CartSummary subtotal={totalAmount()} />
            <Button className="w-full" size="lg" render={<Link href="/checkout" />}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
