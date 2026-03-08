import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { verifyWebhookSignature } from "@/lib/toss/server";
import type { TossWebhookPayload } from "@/types/toss";
import type { Database } from "@/types/database.types";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("toss-signature") ?? "";

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload: TossWebhookPayload = JSON.parse(rawBody);
    const { data } = payload;

    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: order } = await supabase
      .from("orders")
      .select("id, status")
      .eq("payment_order_id", data.orderId)
      .single();

    if (!order) {
      // Return 200 to prevent Toss retries for unknown orders
      return NextResponse.json({ received: true });
    }

    if (data.status === "DONE" && order.status !== "paid") {
      await supabase
        .from("orders")
        .update({
          status: "paid",
          payment_key: data.paymentKey,
          payment_method: data.method ?? null,
          paid_at: new Date().toISOString(),
        })
        .eq("id", order.id);
    } else if (
      (data.status === "CANCELED" || data.status === "PARTIAL_CANCELED") &&
      order.status !== "refunded"
    ) {
      await supabase
        .from("orders")
        .update({ status: "refunded" })
        .eq("id", order.id);

      // Restore inventory
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", order.id);

      if (orderItems) {
        for (const item of orderItems) {
          await supabase.rpc("increment_inventory", {
            p_product_id: item.product_id,
            p_quantity: item.quantity,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    // Always return 200 to Toss
    return NextResponse.json({ received: true });
  }
}
