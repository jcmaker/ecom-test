import { createClient } from "@/lib/supabase/server";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: orderCount },
    { data: revenueData },
    { count: productCount },
    { count: customerCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("total_amount")
      .eq("status", "paid"),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "customer"),
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalRevenue =
    revenueData?.reduce((sum, o) => sum + o.total_amount, 0) ?? 0;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <DashboardStats
        totalOrders={orderCount ?? 0}
        totalRevenue={totalRevenue}
        totalProducts={productCount ?? 0}
        totalCustomers={customerCount ?? 0}
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={recentOrders ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
