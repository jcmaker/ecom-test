"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validations/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormValues) => void;
  loading?: boolean;
}

export function CheckoutForm({ onSubmit, loading }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" placeholder="Hong Gildong" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              placeholder="010-0000-0000"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              placeholder="123 University St, Seoul"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressDetail">Address Detail</Label>
            <Input
              id="addressDetail"
              placeholder="Apt 101, Building B"
              {...register("addressDetail")}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Continue to Payment"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
