import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  birth_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientFormData {
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  birth_date?: string;
  notes?: string;
}

export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("last_name", { ascending: true });
      
      if (error) throw error;
      return data as Client[];
    },
  });
};

export const useClient = (id: string | undefined) => {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Client | null;
    },
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ClientFormData) => {
      const { data: newClient, error } = await supabase
        .from("clients")
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return newClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente creato con successo");
    },
    onError: () => {
      toast.error("Errore durante la creazione del cliente");
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ClientFormData }) => {
      const { data: updatedClient, error } = await supabase
        .from("clients")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente aggiornato con successo");
    },
    onError: () => {
      toast.error("Errore durante l'aggiornamento del cliente");
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente eliminato con successo");
    },
    onError: () => {
      toast.error("Errore durante l'eliminazione del cliente");
    },
  });
};
