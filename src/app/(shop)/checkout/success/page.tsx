"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setError("Invalid payment response");
      setLoading(false);
      return;
    }

    fetch("/api/payments/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentKey, orderId, amount: parseInt(amount) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.orderNumber) {
          setOrderNumber(data.orderNumber);
        } else {
          setError(data.error || "Payment confirmation failed");
        }
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Confirming your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <p className="text-destructive font-medium">{error}</p>
        <Button variant="outline" render={<Link href="/checkout" />}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <CheckCircle className="h-16 w-16 text-primary mx-auto" />
      <h1 className="text-3xl font-bold">Payment Successful!</h1>
      {orderNumber && (
        <p className="text-muted-foreground">
          Order number: <span className="font-mono font-medium">{orderNumber}</span>
        </p>
      )}
      <div className="flex gap-4 justify-center pt-4">
        <Button render={<Link href="/products" />}>Continue Shopping</Button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 flex items-center justify-center">
          <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
            <SuccessContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
