import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, MessageSquare, Plus, Trash2, Loader2 } from "lucide-react";
import { TreatmentSession, useSessionAnnotations, useCreateAnnotation, useDeleteAnnotation } from "@/hooks/useTreatmentSessions";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface SessionDetailDialogProps {
  session: TreatmentSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionDetailDialog({ session, open, onOpenChange }: SessionDetailDialogProps) {
  const [newAnnotation, setNewAnnotation] = useState("");
  const { data: annotations, isLoading: loadingAnnotations } = useSessionAnnotations(session?.id);
  const createAnnotation = useCreateAnnotation();
  const deleteAnnotation = useDeleteAnnotation();

  const handleAddAnnotation = () => {
    if (!session || !newAnnotation.trim()) return;
    
    createAnnotation.mutate(
      { sessionId: session.id, annotation: newAnnotation.trim() },
      { onSuccess: () => setNewAnnotation("") }
    );
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dettagli Sessione</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Session Info */}
          <div className="space-y-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {session.treatment_types?.name}
            </Badge>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(new Date(session.session_date), "EEEE d MMMM yyyy 'alle' HH:mm", { locale: it })}
                </span>
              </div>

              {session.clients && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{session.clients.first_name} {session.clients.last_name}</span>
                </div>
              )}

              {session.operator_name && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Operatore: {session.operator_name}</span>
                </div>
              )}

              {session.treatment_types?.price && (
                <div className="text-sm font-medium">
                  Prezzo: €{session.treatment_types.price.toFixed(2)}
                </div>
              )}
            </div>

            {session.notes && (
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex items-start gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span>{session.notes}</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Annotations Section */}
          <div className="space-y-3">
            <h4 className="font-medium">Annotazioni e Modifiche</h4>

            {/* Add new annotation */}
            <div className="space-y-2">
              <Textarea
                placeholder="Aggiungi una nota o modifica..."
                value={newAnnotation}
                onChange={(e) => setNewAnnotation(e.target.value)}
                rows={2}
              />
              <Button
                onClick={handleAddAnnotation}
                disabled={!newAnnotation.trim() || createAnnotation.isPending}
                size="sm"
                className="w-full"
              >
                {createAnnotation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Aggiungi annotazione
              </Button>
            </div>

            {/* Annotations list */}
            <div className="space-y-2">
              {loadingAnnotations ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : annotations?.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nessuna annotazione presente
                </p>
              ) : (
                annotations?.map((annotation) => (
                  <div
                    key={annotation.id}
                    className="flex items-start justify-between gap-2 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{annotation.annotation}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(annotation.created_at), "d MMM yyyy HH:mm", { locale: it })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteAnnotation.mutate(annotation.id)}
                      disabled={deleteAnnotation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
