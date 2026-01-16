import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, Phone, Mail, Calendar, Pencil, Trash2, Plus, ClipboardList, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ClientForm } from "@/components/clients/ClientForm";
import { SessionCard } from "@/components/sessions/SessionCard";
import { SessionForm } from "@/components/sessions/SessionForm";
import { SessionDetailDialog } from "@/components/sessions/SessionDetailDialog";
import { useClient, useUpdateClient, useDeleteClient, ClientFormData } from "@/hooks/useClients";
import { useTreatmentSessions, useCreateTreatmentSession, TreatmentSession, TreatmentSessionFormData } from "@/hooks/useTreatmentSessions";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TreatmentSession | null>(null);
  
  const { data: client, isLoading } = useClient(id);
  const { data: sessions } = useTreatmentSessions(id);
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const createSession = useCreateTreatmentSession();

  const handleUpdate = (data: ClientFormData) => {
    if (!id) return;
    updateClient.mutate({ id, data }, {
      onSuccess: () => setShowEditForm(false),
    });
  };

  const handleDelete = () => {
    if (!id) return;
    deleteClient.mutate(id, {
      onSuccess: () => navigate("/clients"),
    });
  };

  const handleCreateSession = (data: TreatmentSessionFormData) => {
    createSession.mutate(data, {
      onSuccess: () => setShowSessionForm(false),
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!client) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cliente non trovato</p>
          <Button className="mt-4" asChild>
            <Link to="/clients">Torna ai clienti</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/clients">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {client.first_name} {client.last_name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Cliente dal {format(new Date(client.created_at), "d MMMM yyyy", { locale: it })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setShowEditForm(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => setShowDeleteAlert(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Client Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informazioni</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${client.phone}`} className="text-primary hover:underline">
                  {client.phone}
                </a>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                  {client.email}
                </a>
              </div>
            )}
            {client.birth_date && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(client.birth_date), "d MMMM yyyy", { locale: it })}</span>
              </div>
            )}
            {client.notes && (
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground mb-1">Note:</p>
                <p className="text-sm">{client.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Treatment History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Storico Trattamenti</CardTitle>
            <Button size="sm" onClick={() => setShowSessionForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuova sessione
            </Button>
          </CardHeader>
          <CardContent>
            {sessions?.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground text-sm">
                  Nessun trattamento registrato
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions?.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onViewDetails={setSelectedSession}
                    showClient={false}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Client Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifica Cliente</DialogTitle>
          </DialogHeader>
          <ClientForm
            client={client}
            onSubmit={handleUpdate}
            onCancel={() => setShowEditForm(false)}
            isLoading={updateClient.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare il cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione eliminerà definitivamente il cliente e tutto il suo storico trattamenti.
              L'operazione non può essere annullata.
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

      {/* New Session Dialog */}
      <Dialog open={showSessionForm} onOpenChange={setShowSessionForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuova Sessione</DialogTitle>
          </DialogHeader>
          <SessionForm
            defaultClientId={id}
            onSubmit={handleCreateSession}
            onCancel={() => setShowSessionForm(false)}
            isLoading={createSession.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Session Detail Dialog */}
      <SessionDetailDialog
        session={selectedSession}
        open={!!selectedSession}
        onOpenChange={(open) => !open && setSelectedSession(null)}
      />
    </AppLayout>
  );
}
