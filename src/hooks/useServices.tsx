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
  owner_phone?: string | null;
  category_name?: string | null;
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`
          *,
          categories (name)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []).map((s: any) => ({
        ...s,
        category_name: s.categories?.name || null,
      })) as Service[];
    },
  });
}

export function useServiceDetail(id: string) {
  return useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const { data: service, error } = await supabase
        .from("services")
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
        .eq("id", service.owner_id)
        .single();

      const { data: ownerProfile } = await supabase
        .from("profiles")
        .select("phone, full_name")
        .eq("id", service.owner_id)
        .single();

      return {
        ...service,
        category_name: service.categories?.name || null,
        owner_name: ownerProfile?.full_name || owner?.username || null,
        owner_avatar: owner?.avatar_url || null,
        owner_verified: owner?.is_verified || false,
        owner_phone: ownerProfile?.phone || null,
      } as Service;
    },
    enabled: !!id,
  });
}

export function useUserServices(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-services", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`
          *,
          categories (name)
        `)
        .eq("owner_id", userId!)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []).map((s: any) => ({
        ...s,
        category_name: s.categories?.name || null,
      })) as Service[];
    },
    enabled: !!userId,
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
