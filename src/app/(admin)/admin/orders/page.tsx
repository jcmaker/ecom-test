import { createClient } from "@/lib/supabase/server";
import { OrdersTable } from "@/components/admin/OrdersTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const metadata = { title: "Orders — Admin" };

interface SearchParams {
  status?: string;
}

interface AdminOrdersPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (params.status && params.status !== "all") {
    const validStatus = params.status as "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
    query = query.eq("status", validStatus);
  }

  const { data: orders } = await query;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>

      <OrdersTable orders={orders ?? []} />
    </div>
  );
}
