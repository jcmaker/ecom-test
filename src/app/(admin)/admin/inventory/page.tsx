import { createClient } from "@/lib/supabase/server";
import { InventoryTable } from "@/components/admin/InventoryTable";

export const metadata = { title: "Inventory — Admin" };

export default async function AdminInventoryPage() {
  const supabase = await createClient();

  const { data: inventory } = await supabase
    .from("inventory")
    .select("*, products(name, slug)")
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventory</h1>
      <InventoryTable items={(inventory as any) ?? []} />
    </div>
  );
}
