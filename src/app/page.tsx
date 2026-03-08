import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/20 via-background to-accent/20 py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to{" "}
            <span className="text-primary">
              {process.env.NEXT_PUBLIC_SITE_NAME || "School Store"}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your one-stop shop for all school supplies, electronics, apparel, and
            more. Quality products at student-friendly prices.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" render={<Link href="/products" />}>
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" render={<Link href="/products?category=stationery" />}>
              Browse Stationery
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Button variant="ghost" render={<Link href="/products" />}>
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <ProductGrid products={products ?? []} />
      </section>
    </div>
  );
}
