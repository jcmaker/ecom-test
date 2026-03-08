import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Package, Users, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
}

export function DashboardStats({
  totalOrders,
  totalRevenue,
  totalProducts,
  totalCustomers,
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      description: "Paid orders",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingBag,
      description: "All time",
    },
    {
      title: "Products",
      value: totalProducts.toString(),
      icon: Package,
      description: "Active products",
    },
    {
      title: "Customers",
      value: totalCustomers.toString(),
      icon: Users,
      description: "Registered users",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
