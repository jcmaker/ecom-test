import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  comparePrice: z.number().positive().optional(),
  categoryId: z.string().uuid("Please select a category"),
  isActive: z.boolean().default(true),
  images: z.array(z.string().url()).default([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
