import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
  total?: number;
}

export function CartSummary({ subtotal, shipping = 0, total }: CartSummaryProps) {
  const computedTotal = total ?? subtotal + shipping;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Shipping</span>
        <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>{formatPrice(computedTotal)}</span>
      </div>
    </div>
  );
}
