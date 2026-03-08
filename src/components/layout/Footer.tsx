import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-lg">
              {process.env.NEXT_PUBLIC_SITE_NAME || "School Store"}
            </p>
            <p className="text-sm text-muted-foreground">
              Your departmental school store
            </p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/products" className="hover:text-foreground transition-colors">
              Products
            </Link>
            <Link href="/cart" className="hover:text-foreground transition-colors">
              Cart
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} School Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
