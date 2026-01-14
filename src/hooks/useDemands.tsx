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
  category_name?: string | null;
}

export function useDemands() {
  return useQuery({
    queryKey: ["demands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("demands")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Demand[];
    },
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
