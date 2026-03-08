"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CartSummary } from "@/components/cart/CartSummary";

const TossPaymentWidget = dynamic(
  () => import("@/components/checkout/TossPaymentWidget").then((m) => m.TossPaymentWidget),
  { ssr: false }
);
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { CheckoutFormValues } from "@/lib/validations/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const [shippingInfo, setShippingInfo] = useState<CheckoutFormValues | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);

  const total = totalAmount();

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  async function handleShippingSubmit(data: CheckoutFormValues) {
    setShippingInfo(data);
  }

  async function handlePaymentRequest(tossOrderId: string) {
    if (!shippingInfo) return;

    setCreatingOrder(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to checkout");
      router.push("/login?next=/checkout");
      return;
    }

    const orderNumber = `SCH-${Date.now()}`;

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: "pending",
        total_amount: total,
        shipping_name: shippingInfo.name,
        shipping_phone: shippingInfo.phone,
        shipping_address: shippingInfo.address,
        shipping_detail: shippingInfo.addressDetail,
        payment_order_id: tossOrderId,
      })
      .select()
      .single();

    if (error || !order) {
      toast.error("Failed to create order");
      setCreatingOrder(false);
      return;
    }

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_image: item.image,
      unit_price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    await supabase.from("order_items").insert(orderItems);
    setPendingOrderId(order.id);
    setCreatingOrder(false);
  }

  const orderName =
    items.length === 1
      ? items[0].name
      : `${items[0].name} and ${items.length - 1} more`;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {!shippingInfo ? (
            <CheckoutForm onSubmit={handleShippingSubmit} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <TossPaymentWidget
                  amount={total}
                  orderName={orderName}
                  onPaymentRequest={handlePaymentRequest}
                  disabled={creatingOrder}
                />
              </CardContent>
            </Card>
          )}
        </div>
        <div>
          <div className="sticky top-24 p-6 bg-muted/30 rounded-xl space-y-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span className="text-muted-foreground">
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <CartSummary subtotal={total} />
          </div>
        </div>
      </div>
    </div>
  );
}
