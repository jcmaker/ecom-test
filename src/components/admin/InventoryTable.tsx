"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface InventoryRow {
  id: string;
  product_id: string;
  quantity: number;
  low_stock_threshold: number;
  updated_at: string;
  products: { name: string; slug: string } | null;
}

interface InventoryTableProps {
  items: InventoryRow[];
}

export function InventoryTable({ items: initialItems }: InventoryTableProps) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<Record<string, number>>({});

  async function handleUpdate(itemId: string, productId: string) {
    const newQty = editing[itemId];
    if (newQty === undefined) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("inventory")
      .update({ quantity: newQty })
      .eq("id", itemId);

    if (error) {
      toast.error("Failed to update inventory");
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
      );
      const next = { ...editing };
      delete next[itemId];
      setEditing(next);
      toast.success("Inventory updated");
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Low Stock Threshold</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const isLow = item.quantity <= item.low_stock_threshold;
          const isEditing = editing[item.id] !== undefined;

          return (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.products?.name ?? "Unknown"}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editing[item.id]}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        [item.id]: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-24"
                    min={0}
                  />
                ) : (
                  item.quantity
                )}
              </TableCell>
              <TableCell>{item.low_stock_threshold}</TableCell>
              <TableCell>
                <Badge
                  variant={isLow ? "destructive" : "secondary"}
                >
                  {item.quantity === 0
                    ? "Out of Stock"
                    : isLow
                    ? "Low Stock"
                    : "In Stock"}
                </Badge>
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(item.id, item.product_id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const next = { ...editing };
                        delete next[item.id];
                        setEditing(next);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setEditing({ ...editing, [item.id]: item.quantity })
                    }
                  >
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
