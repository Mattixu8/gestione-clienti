import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TreatmentSession {
  id: string;
  client_id: string;
  treatment_type_id: string;
  session_date: string;
  operator_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  clients?: {
    first_name: string;
    last_name: string;
  };
  treatment_types?: {
    name: string;
    price: number | null;
  };
}

export interface SessionAnnotation {
  id: string;
  treatment_session_id: string;
  annotation: string;
  created_at: string;
}

export interface TreatmentSessionFormData {
  client_id: string;
  treatment_type_id: string;
  session_date: string;
  operator_name?: string;
  notes?: string;
}

export const useTreatmentSessions = (clientId?: string) => {
  return useQuery({
    queryKey: ["treatment_sessions", clientId],
    queryFn: async () => {
      let query = supabase
        .from("treatment_sessions")
        .select(`
          *,
          clients(first_name, last_name),
          treatment_types(name, price)
        `)
        .order("session_date", { ascending: false });
      
      if (clientId) {
        query = query.eq("client_id", clientId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as TreatmentSession[];
    },
  });
};

export const useSessionAnnotations = (sessionId: string | undefined) => {
  return useQuery({
    queryKey: ["session_annotations", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const { data, error } = await supabase
        .from("session_annotations")
        .select("*")
        .eq("treatment_session_id", sessionId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as SessionAnnotation[];
    },
    enabled: !!sessionId,
  });
};

export const useCreateTreatmentSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TreatmentSessionFormData) => {
      const { data: newSession, error } = await supabase
        .from("treatment_sessions")
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return newSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatment_sessions"] });
      toast.success("Sessione creata con successo");
    },
    onError: () => {
      toast.error("Errore durante la creazione della sessione");
    },
  });
};

export const useUpdateTreatmentSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TreatmentSessionFormData> }) => {
      const { data: updated, error } = await supabase
        .from("treatment_sessions")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatment_sessions"] });
      toast.success("Sessione aggiornata con successo");
    },
    onError: () => {
      toast.error("Errore durante l'aggiornamento della sessione");
    },
  });
};

export const useDeleteTreatmentSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("treatment_sessions")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatment_sessions"] });
      toast.success("Sessione eliminata con successo");
    },
    onError: () => {
      toast.error("Errore durante l'eliminazione della sessione");
    },
  });
};

export const useCreateAnnotation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sessionId, annotation }: { sessionId: string; annotation: string }) => {
      const { data, error } = await supabase
        .from("session_annotations")
        .insert({
          treatment_session_id: sessionId,
          annotation,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session_annotations"] });
      toast.success("Annotazione aggiunta");
    },
    onError: () => {
      toast.error("Errore durante l'aggiunta dell'annotazione");
    },
  });
};

export const useDeleteAnnotation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("session_annotations")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session_annotations"] });
      toast.success("Annotazione eliminata");
    },
    onError: () => {
      toast.error("Errore durante l'eliminazione dell'annotazione");
    },
  });
};
