import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Demand {
  id: string;
  owner_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  budget: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  owner_name?: string | null;
  owner_avatar?: string | null;
  owner_verified?: boolean;
  owner_phone?: string | null;
  category_name?: string | null;
}

export function useDemands() {
  return useQuery({
    queryKey: ["demands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("demands")
        .select(`
          *,
          categories (name)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []).map((d: any) => ({
        ...d,
        category_name: d.categories?.name || null,
      })) as Demand[];
    },
  });
}

export function useDemandDetail(id: string) {
  return useQuery({
    queryKey: ["demand", id],
    queryFn: async () => {
      const { data: demand, error } = await supabase
        .from("demands")
        .select(`
          *,
          categories (name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      // Fetch owner info
      const { data: owner } = await supabase
        .from("profiles_public")
        .select("username, avatar_url, is_verified")
        .eq("id", demand.owner_id)
        .single();

      const { data: ownerProfile } = await supabase
        .from("profiles")
        .select("phone, full_name")
        .eq("id", demand.owner_id)
        .single();

      return {
        ...demand,
        category_name: demand.categories?.name || null,
        owner_name: ownerProfile?.full_name || owner?.username || null,
        owner_avatar: owner?.avatar_url || null,
        owner_verified: owner?.is_verified || false,
        owner_phone: ownerProfile?.phone || null,
      } as Demand;
    },
    enabled: !!id,
  });
}

export function useCreateDemand() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (demand: {
      title: string;
      description?: string;
      budget?: string;
      category_id?: string;
    }) => {
      if (!user) throw new Error("Must be logged in to create a demand");

      const { data, error } = await supabase
        .from("demands")
        .insert({
          ...demand,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demands"] });
    },
  });
}
