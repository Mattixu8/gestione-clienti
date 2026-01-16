import { useState, useEffect } from "react";
import {
  IOSModal,
  IOSModalContent,
  IOSModalHeader,
  IOSModalTitle,
  IOSModalBody,
  IOSModalFooter,
} from "@/components/ui/ios-modal";
import { IOSAlert } from "@/components/ui/ios-alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, MessageSquare, Plus, Trash2, Loader2, Pencil, X, Check } from "lucide-react";
import { TreatmentSession, useSessionAnnotations, useCreateAnnotation, useDeleteAnnotation, useDeleteTreatmentSession, useUpdateTreatmentSession } from "@/hooks/useTreatmentSessions";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface SessionDetailDialogProps {
  session: TreatmentSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionDetailDialog({ session, open, onOpenChange }: SessionDetailDialogProps) {
  const [newAnnotation, setNewAnnotation] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");
  const [editedOperator, setEditedOperator] = useState("");
  
  const { data: annotations, isLoading: loadingAnnotations } = useSessionAnnotations(session?.id);
  const createAnnotation = useCreateAnnotation();
  const deleteAnnotation = useDeleteAnnotation();
  const deleteSession = useDeleteTreatmentSession();
  const updateSession = useUpdateTreatmentSession();

  // Reset edit state when session changes or dialog opens
  useEffect(() => {
    if (session) {
      setEditedNotes(session.notes || "");
      setEditedOperator(session.operator_name || "");
    }
    setIsEditing(false);
  }, [session, open]);

  const handleAddAnnotation = () => {
    if (!session || !newAnnotation.trim()) return;
    
    createAnnotation.mutate(
      { sessionId: session.id, annotation: newAnnotation.trim() },
      { onSuccess: () => setNewAnnotation("") }
    );
  };

  const handleSaveEdit = () => {
    if (!session) return;
    
    updateSession.mutate(
      {
        id: session.id,
        data: {
          notes: editedNotes.trim() || null,
          operator_name: editedOperator.trim() || null,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    if (session) {
      setEditedNotes(session.notes || "");
      setEditedOperator(session.operator_name || "");
    }
    setIsEditing(false);
  };

  if (!session) return null;

  return (
    <IOSModal open={open} onOpenChange={onOpenChange}>
      <IOSModalContent className="max-h-[90vh]">
        <IOSModalHeader onClose={() => onOpenChange(false)}>
          <IOSModalTitle>Dettagli Sessione</IOSModalTitle>
        </IOSModalHeader>
        <IOSModalBody className="overflow-y-auto">
          <div className="space-y-4">
            {/* Session Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-primary/10 text-primary rounded-full">
                  {session.treatment_types?.name}
                </Badge>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-8 rounded-xl"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Modifica
                  </Button>
                )}
              </div>

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

                {isEditing ? (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="operator">Operatore</Label>
                      <Input
                        id="operator"
                        placeholder="Nome operatore"
                        value={editedOperator}
                        onChange={(e) => setEditedOperator(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Note</Label>
                      <Textarea
                        id="notes"
                        placeholder="Aggiungi note sulla sessione..."
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        rows={3}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="flex-1 h-10 rounded-xl"
                        disabled={updateSession.isPending}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Annulla
                      </Button>
                      <Button
                        onClick={handleSaveEdit}
                        className="flex-1 h-10 rounded-xl"
                        disabled={updateSession.isPending}
                      >
                        {updateSession.isPending ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-1" />
                        )}
                        Salva
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
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

                    {session.notes && (
                      <div className="p-3 rounded-xl bg-muted">
                        <div className="flex items-start gap-2 text-sm">
                          <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <span>{session.notes}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {!isEditing && (
              <>
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
                      className="rounded-xl"
                    />
                    <Button
                      onClick={handleAddAnnotation}
                      disabled={!newAnnotation.trim() || createAnnotation.isPending}
                      size="sm"
                      className="w-full h-11 rounded-xl"
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
                          className="flex items-start justify-between gap-2 p-3 rounded-xl bg-muted/50"
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
                            className="h-8 w-8 text-destructive hover:text-destructive rounded-xl"
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
              </>
            )}
          </div>
        </IOSModalBody>
        {!isEditing && (
          <IOSModalFooter>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteAlert(true)}
              className="w-full h-12 rounded-xl"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Elimina Sessione
            </Button>
          </IOSModalFooter>
        )}
      </IOSModalContent>

      {/* Delete Session Confirmation */}
      <IOSAlert
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
        title="Eliminare la sessione?"
        description="Questa azione eliminerà definitivamente la sessione e tutte le sue annotazioni. L'operazione non può essere annullata."
        confirmText="Elimina"
        onConfirm={() => {
          deleteSession.mutate(session.id, {
            onSuccess: () => {
              setShowDeleteAlert(false);
              onOpenChange(false);
            },
          });
        }}
        destructive
      />
    </IOSModal>
  );
}
