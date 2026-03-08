"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type Order = Database["public"]["Tables"]["orders"]["Row"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Date</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-mono text-sm">
              {order.order_number}
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <p className="font-medium">{order.shipping_name}</p>
                <p className="text-muted-foreground">{order.shipping_phone}</p>
              </div>
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  statusColors[order.status] ?? "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </TableCell>
            <TableCell>{formatPrice(order.total_amount)}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString("ko-KR")}
            </TableCell>
            <TableCell>
              <Link
                href={`/admin/orders/${order.id}`}
                className="text-sm text-primary hover:underline"
              >
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
