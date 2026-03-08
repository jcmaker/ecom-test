"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { Database } from "@/types/database.types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    setCategories(data ?? []);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from("categories").insert({
      name: newName,
      slug: newSlug,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Category created");
      setNewName("");
      setNewSlug("");
      fetchCategories();
    }
    setLoading(false);
  }

  async function handleToggle(id: string, isActive: boolean) {
    const supabase = createClient();
    await supabase
      .from("categories")
      .update({ is_active: !isActive })
      .eq("id", id);
    fetchCategories();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Categories</h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Add Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setNewSlug(
                    e.target.value.toLowerCase().replace(/\s+/g, "-")
                  );
                }}
                placeholder="Electronics"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="electronics"
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </form>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell className="font-medium">{cat.name}</TableCell>
              <TableCell className="font-mono text-sm">{cat.slug}</TableCell>
              <TableCell>
                <Badge variant={cat.is_active ? "default" : "secondary"}>
                  {cat.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggle(cat.id, cat.is_active)}
                >
                  {cat.is_active ? "Deactivate" : "Activate"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
