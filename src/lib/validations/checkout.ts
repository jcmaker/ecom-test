import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^010-\d{4}-\d{4}$/, "Phone must be in format 010-0000-0000"),
  address: z.string().min(5, "Please enter a valid address"),
  addressDetail: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
