import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order {order.order_number}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date(order.created_at).toLocaleString("ko-KR")}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status as any} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Shipping Info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{order.shipping_name}</p>
            <p className="text-muted-foreground">{order.shipping_phone}</p>
            <p className="text-muted-foreground">{order.shipping_address}</p>
            {order.shipping_detail && (
              <p className="text-muted-foreground">{order.shipping_detail}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Payment Info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>
              Method:{" "}
              <span className="font-medium">
                {order.payment_method ?? "—"}
              </span>
            </p>
            <p>
              Total:{" "}
              <span className="font-bold">{formatPrice(order.total_amount)}</span>
            </p>
            {order.paid_at && (
              <p className="text-muted-foreground">
                Paid: {new Date(order.paid_at).toLocaleString("ko-KR")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {(items ?? []).map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.unit_price)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total_amount)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
