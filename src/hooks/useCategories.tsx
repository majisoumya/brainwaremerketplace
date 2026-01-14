import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: "product" | "service" | "demand";
  created_at: string;
}

export function useCategories(type?: "product" | "service" | "demand") {
  return useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      let query = supabase.from("categories").select("*");
      
      if (type) {
        query = query.eq("type", type);
      }
      
      const { data, error } = await query.order("name");

      if (error) throw error;
      return data as Category[];
    },
  });
}
