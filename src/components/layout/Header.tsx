"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut, Settings, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CartSheet } from "@/components/cart/CartSheet";
import { useState } from "react";

export function Header() {
  const { totalItems } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">🏫</span>
          <span className="font-bold text-lg">
            {process.env.NEXT_PUBLIC_SITE_NAME || "School Store"}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Products
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems() > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {totalItems()}
              </Badge>
            )}
          </Button>

          {/* Auth */}
          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                    <User className="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => router.push("/orders")}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Package className="h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/admin")}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-destructive cursor-pointer"
                      variant="destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button size="sm" render={<Link href="/login" />}>
                  Sign In
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
