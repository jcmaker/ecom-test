export interface TossPaymentSuccess {
  paymentKey: string;
  orderId: string;
  amount: string;
}

export interface TossPaymentMethod {
  type: "CARD" | "VIRTUAL_ACCOUNT" | "EASY_PAY" | "MOBILE_PHONE";
}

export interface TossWebhookPayload {
  eventType: "PAYMENT_STATUS_CHANGED";
  createdAt: string;
  data: {
    paymentKey: string;
    orderId: string;
    status: "DONE" | "CANCELED" | "PARTIAL_CANCELED" | "ABORTED" | "EXPIRED";
    totalAmount: number;
    method?: string;
  };
}
