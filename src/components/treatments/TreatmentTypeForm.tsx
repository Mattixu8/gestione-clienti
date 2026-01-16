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
import { TreatmentType, TreatmentTypeFormData } from "@/hooks/useTreatmentTypes";

const treatmentSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  description: z.string().optional(),
  duration_minutes: z.coerce.number().min(1).optional(),
  price: z.coerce.number().min(0).optional(),
});

interface TreatmentTypeFormProps {
  treatment?: TreatmentType;
  onSubmit: (data: TreatmentTypeFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TreatmentTypeForm({ treatment, onSubmit, onCancel, isLoading }: TreatmentTypeFormProps) {
  const form = useForm<TreatmentTypeFormData>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      name: treatment?.name || "",
      description: treatment?.description || "",
      duration_minutes: treatment?.duration_minutes || 60,
      price: treatment?.price || undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome trattamento *</FormLabel>
              <FormControl>
                <Input placeholder="Massaggio rilassante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrizione del trattamento..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durata (minuti)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prezzo (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="50.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annulla
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvataggio..." : treatment ? "Salva modifiche" : "Crea trattamento"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
