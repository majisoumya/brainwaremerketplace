import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Product {
  id: string;
  owner_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  condition: "new" | "like-new" | "good" | "fair" | null;
  image_url: string | null;
  location: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  owner_name?: string | null;
  owner_avatar?: string | null;
  owner_verified?: boolean;
  owner_phone?: string | null;
  owner_whatsapp?: string | null;
  category_name?: string | null;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (name)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []).map((p: any) => ({
        ...p,
        category_name: p.categories?.name || null,
      })) as Product[];
    },
  });
}

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      // Fetch product with category
      const { data: product, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      // Fetch owner info from profiles_public view
      const { data: owner } = await supabase
        .from("profiles_public")
        .select("username, avatar_url, is_verified, full_name, whatsapp")
        .eq("id", product.owner_id)
        .single();

      // Fetch owner phone from profiles (only accessible if authorized)
      const { data: ownerProfile } = await supabase
        .from("profiles")
        .select("phone, full_name")
        .eq("id", product.owner_id)
        .single();

      return {
        ...product,
        category_name: product.categories?.name || null,
        owner_name: ownerProfile?.full_name || owner?.full_name || owner?.username || null,
        owner_avatar: owner?.avatar_url || null,
        owner_verified: owner?.is_verified || false,
        owner_phone: ownerProfile?.phone || null,
        owner_whatsapp: owner?.whatsapp || null,
      } as Product;
    },
    enabled: !!id,
  });
}

export function useSimilarProducts(categoryId: string | null, currentProductId: string) {
  return useQuery({
    queryKey: ["similar-products", categoryId, currentProductId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (name)
        `)
        .eq("is_active", true)
        .neq("id", currentProductId)
        .eq("category_id", categoryId!)
        .limit(4)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []).map((p: any) => ({
        ...p,
        category_name: p.categories?.name || null,
      })) as Product[];
    },
    enabled: !!categoryId,
  });
}

export function useUserProducts(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-products", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (name)
        `)
        .eq("owner_id", userId!)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []).map((p: any) => ({
        ...p,
        category_name: p.categories?.name || null,
      })) as Product[];
    },
    enabled: !!userId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (product: {
      title: string;
      description?: string;
      price: number;
      original_price?: number;
      condition?: "new" | "like-new" | "good" | "fair";
      image_url?: string;
      location?: string;
      category_id?: string;
    }) => {
      if (!user) throw new Error("Must be logged in to create a product");

      const { data, error } = await supabase
        .from("products")
        .insert({
          ...product,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
