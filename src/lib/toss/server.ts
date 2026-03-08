import crypto from "crypto";

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY!;
const TOSS_WEBHOOK_SECRET = process.env.TOSS_WEBHOOK_SECRET!;
const TOSS_BASE_URL = "https://api.tosspayments.com/v1/payments";

export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
) {
  const encoded = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");

  const response = await fetch(`${TOSS_BASE_URL}/confirm`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Payment confirmation failed");
  }

  return response.json();
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const hmac = crypto
    .createHmac("sha256", TOSS_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("base64");
  return hmac === signature;
}
