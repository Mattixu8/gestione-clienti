import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TreatmentTypeCard } from "@/components/treatments/TreatmentTypeCard";
import { TreatmentTypeForm } from "@/components/treatments/TreatmentTypeForm";
import {
  useTreatmentTypes,
  useCreateTreatmentType,
  useUpdateTreatmentType,
  useDeleteTreatmentType,
  TreatmentType,
  TreatmentTypeFormData,
} from "@/hooks/useTreatmentTypes";

export default function Treatments() {
  const [showForm, setShowForm] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<TreatmentType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: treatments, isLoading } = useTreatmentTypes();
  const createTreatment = useCreateTreatmentType();
  const updateTreatment = useUpdateTreatmentType();
  const deleteTreatment = useDeleteTreatmentType();

  const handleCreate = (data: TreatmentTypeFormData) => {
    createTreatment.mutate(data, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleUpdate = (data: TreatmentTypeFormData) => {
    if (!editingTreatment) return;
    updateTreatment.mutate({ id: editingTreatment.id, data }, {
      onSuccess: () => setEditingTreatment(null),
    });
  };

  const handleDelete = () => {
    if (!deletingId) return;
    deleteTreatment.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
    });
  };

  const handleEdit = (treatment: TreatmentType) => {
    setEditingTreatment(treatment);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trattamenti</h1>
            <p className="text-muted-foreground">
              Gestisci il catalogo dei trattamenti offerti
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuovo Trattamento
          </Button>
        </div>

        {/* Treatment List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : treatments?.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="mt-3 text-muted-foreground">
              Nessun trattamento configurato
            </p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi il primo trattamento
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {treatments?.map((treatment) => (
              <TreatmentTypeCard
                key={treatment.id}
                treatment={treatment}
                onEdit={handleEdit}
                onDelete={setDeletingId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Treatment Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuovo Trattamento</DialogTitle>
          </DialogHeader>
          <TreatmentTypeForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isLoading={createTreatment.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Treatment Dialog */}
      <Dialog open={!!editingTreatment} onOpenChange={(open) => !open && setEditingTreatment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifica Trattamento</DialogTitle>
          </DialogHeader>
          {editingTreatment && (
            <TreatmentTypeForm
              treatment={editingTreatment}
              onSubmit={handleUpdate}
              onCancel={() => setEditingTreatment(null)}
              isLoading={updateTreatment.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare il trattamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione eliminerà definitivamente il trattamento dal catalogo.
              Non potrai eliminarlo se è già stato usato in sessioni.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
