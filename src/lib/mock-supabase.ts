// Mock Supabase client used when env vars are not configured
import {
  mockCategories,
  mockProducts,
  mockInventory,
  mockOrders,
} from "./mock-data";

const MOCK_TABLES: Record<string, unknown[]> = {
  categories: mockCategories,
  products: mockProducts,
  inventory: mockInventory,
  orders: mockOrders,
  profiles: [],
  order_items: [],
};

type Filter =
  | { type: "eq"; field: string; value: unknown }
  | { type: "ilike"; field: string; pattern: string };

class MockQueryBuilder {
  private tableData: unknown[];
  private filters: Filter[] = [];
  private sortField?: string;
  private sortAscending = true;
  private limitCount?: number;
  private headOnly = false;
  private withCount = false;
  private returnSingle = false;

  constructor(table: string) {
    this.tableData = MOCK_TABLES[table] ?? [];
  }

  select(_fields: string, options?: { count?: string; head?: boolean }) {
    if (options?.head) this.headOnly = true;
    if (options?.count === "exact") this.withCount = true;
    return this;
  }

  eq(field: string, value: unknown) {
    this.filters.push({ type: "eq", field, value });
    return this;
  }

  ilike(field: string, pattern: string) {
    this.filters.push({ type: "ilike", field, pattern });
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.sortField = field;
    this.sortAscending = options?.ascending ?? true;
    return this;
  }

  limit(n: number) {
    this.limitCount = n;
    return this;
  }

  single() {
    this.returnSingle = true;
    return this.execute();
  }

  private execute(): Promise<{ data: unknown; error: null; count?: number }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any[] = [...this.tableData];

    for (const filter of this.filters) {
      if (filter.type === "eq") {
        result = result.filter((item) => item[filter.field] === filter.value);
      } else if (filter.type === "ilike") {
        const regex = new RegExp(
          filter.pattern.replace(/%/g, ".*"),
          "i"
        );
        result = result.filter((item) =>
          regex.test(String(item[filter.field] ?? ""))
        );
      }
    }

    if (this.sortField) {
      const field = this.sortField;
      const asc = this.sortAscending;
      result.sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av < bv) return asc ? -1 : 1;
        if (av > bv) return asc ? 1 : -1;
        return 0;
      });
    }

    if (this.limitCount) {
      result = result.slice(0, this.limitCount);
    }

    if (this.headOnly) {
      return Promise.resolve({ data: null, error: null, count: result.length });
    }

    if (this.returnSingle) {
      return Promise.resolve({ data: result[0] ?? null, error: null });
    }

    return Promise.resolve({
      data: result,
      error: null,
      count: this.withCount ? result.length : undefined,
    });
  }

  then(
    resolve: (value: { data: unknown; error: null; count?: number }) => unknown
  ) {
    return this.execute().then(resolve);
  }
}

export function createMockClient() {
  return {
    from(table: string) {
      return new MockQueryBuilder(table);
    },
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: { message: "Auth not configured — running in demo mode" },
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: { message: "Auth not configured — running in demo mode" },
      }),
      signOut: async () => ({ error: null }),
    },
  };
}

export const isMockMode =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL === "" ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
