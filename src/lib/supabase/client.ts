import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { createMockClient, isMockMode } from "@/lib/mock-supabase";

export function createClient() {
  if (isMockMode) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createMockClient() as any;
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
