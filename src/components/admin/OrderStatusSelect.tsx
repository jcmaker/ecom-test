"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const statuses = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

type OrderStatus = (typeof statuses)[number];

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: OrderStatus) {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update status");
    } else {
      setStatus(newStatus);
      toast.success("Order status updated");
    }
    setLoading(false);
  }

  return (
    <Select
      value={status}
      onValueChange={(val) => handleChange(val as OrderStatus)}
      disabled={loading}
    >
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((s) => (
          <SelectItem key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
