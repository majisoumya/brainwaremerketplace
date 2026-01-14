import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Service {
  id: string;
  owner_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  price: string;
  image_url: string | null;
  location: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  owner_name?: string | null;
  owner_avatar?: string | null;
  owner_verified?: boolean;
  category_name?: string | null;
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Service[];
    },
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (service: {
      title: string;
      description?: string;
      price: string;
      image_url?: string;
      location?: string;
      category_id?: string;
    }) => {
      if (!user) throw new Error("Must be logged in to create a service");

      const { data, error } = await supabase
        .from("services")
        .insert({
          ...service,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
