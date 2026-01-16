import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TreatmentType {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number | null;
  price: number | null;
  created_at: string;
  updated_at: string;
}

export interface TreatmentTypeFormData {
  name: string;
  description?: string;
  duration_minutes?: number;
  price?: number;
}

export const useTreatmentTypes = () => {
  return useQuery({
    queryKey: ["treatment_types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("treatment_types")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data as TreatmentType[];
    },
  });
};

export const useCreateTreatmentType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TreatmentTypeFormData) => {
      const { data: newType, error } = await supabase
        .from("treatment_types")
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return newType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatment_types"] });
      toast.success("Trattamento creato con successo");
    },
    onError: () => {
      toast.error("Errore durante la creazione del trattamento");
    },
  });
};

export const useUpdateTreatmentType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TreatmentTypeFormData }) => {
      const { data: updated, error } = await supabase
        .from("treatment_types")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatment_types"] });
      toast.success("Trattamento aggiornato con successo");
    },
    onError: () => {
      toast.error("Errore durante l'aggiornamento del trattamento");
    },
  });
};

export const useDeleteTreatmentType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("treatment_types")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatment_types"] });
      toast.success("Trattamento eliminato con successo");
    },
    onError: () => {
      toast.error("Errore durante l'eliminazione del trattamento");
    },
  });
};
