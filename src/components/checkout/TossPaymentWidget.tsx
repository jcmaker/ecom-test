"use client";

import { useEffect, useRef, useState } from "react";
import { loadTossPayments, type TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { TOSS_CLIENT_KEY } from "@/lib/toss/client";
import { Button } from "@/components/ui/button";
import { generateOrderId } from "@/lib/utils";

interface TossPaymentWidgetProps {
  amount: number;
  orderName: string;
  onPaymentRequest: (orderId: string) => Promise<void>;
  disabled?: boolean;
}

export function TossPaymentWidget({
  amount,
  orderName,
  onPaymentRequest,
  disabled,
}: TossPaymentWidgetProps) {
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const orderIdRef = useRef(generateOrderId());

  useEffect(() => {
    async function initWidgets() {
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const w = tossPayments.widgets({ customerKey: "ANONYMOUS" });
      setWidgets(w);

      await w.setAmount({ currency: "KRW", value: amount });
      await w.renderPaymentMethods({
        selector: "#payment-method",
        variantKey: "DEFAULT",
      });
      await w.renderAgreement({
        selector: "#agreement",
        variantKey: "AGREEMENT",
      });

      setReady(true);
    }

    initWidgets().catch(console.error);
  }, [amount]);

  useEffect(() => {
    if (widgets) {
      widgets.setAmount({ currency: "KRW", value: amount });
    }
  }, [amount, widgets]);

  async function handlePayment() {
    if (!widgets || !ready) return;
    setLoading(true);

    try {
      await onPaymentRequest(orderIdRef.current);

      await widgets.requestPayment({
        orderId: orderIdRef.current,
        orderName,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout`,
      });
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div id="payment-method" className="min-h-[200px]" />
      <div id="agreement" />
      <Button
        onClick={handlePayment}
        className="w-full"
        disabled={!ready || loading || disabled}
        size="lg"
      >
        {loading ? "Processing payment..." : "Pay Now"}
      </Button>
    </div>
  );
}
