import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { confirmPayment } from "@/lib/toss/server";
import type { Database } from "@/types/database.types";

export async function POST(request: Request) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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

    // Find the pending order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_order_id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.total_amount !== amount) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // Already confirmed (idempotent)
    if (order.status === "paid") {
      return NextResponse.json({ orderNumber: order.order_number });
    }

    // Confirm with Toss
    const tossResponse = await confirmPayment(paymentKey, orderId, amount);

    // Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "paid",
        payment_key: paymentKey,
        payment_method: tossResponse.method ?? null,
        paid_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      throw updateError;
    }

    // Decrement inventory for each order item
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", order.id);

    if (orderItems) {
      for (const item of orderItems) {
        await supabase.rpc("decrement_inventory", {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });
      }
    }

    return NextResponse.json({ orderNumber: order.order_number });
  } catch (error) {
    console.error("Payment confirm error:", error);
    return NextResponse.json({ error: "Payment confirmation failed" }, { status: 500 });
  }
}
