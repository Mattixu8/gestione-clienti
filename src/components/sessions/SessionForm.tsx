import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTreatmentTypes } from "@/hooks/useTreatmentTypes";
import { useClients } from "@/hooks/useClients";
import { TreatmentSessionFormData } from "@/hooks/useTreatmentSessions";

const sessionSchema = z.object({
  client_id: z.string().min(1, "Seleziona un cliente"),
  treatment_type_id: z.string().min(1, "Seleziona un trattamento"),
  session_date: z.string().min(1, "La data è obbligatoria"),
  operator_name: z.string().optional(),
  notes: z.string().optional(),
});

interface SessionFormProps {
  defaultClientId?: string;
  onSubmit: (data: TreatmentSessionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SessionForm({ defaultClientId, onSubmit, onCancel, isLoading }: SessionFormProps) {
  const { data: clients } = useClients();
  const { data: treatmentTypes } = useTreatmentTypes();

  const form = useForm<TreatmentSessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      client_id: defaultClientId || "",
      treatment_type_id: "",
      session_date: new Date().toISOString().slice(0, 16),
      operator_name: "",
      notes: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.first_name} {client.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="treatment_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trattamento *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona trattamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {treatmentTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} {type.price ? `- €${type.price.toFixed(2)}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="session_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data e ora *</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="operator_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operatore</FormLabel>
              <FormControl>
                <Input placeholder="Nome operatore" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Note sulla sessione..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annulla
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvataggio..." : "Registra sessione"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
