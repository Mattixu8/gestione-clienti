import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  IOSModal,
  IOSModalContent,
  IOSModalHeader,
  IOSModalTitle,
  IOSModalBody,
} from "@/components/ui/ios-modal";
import { Search, Plus, ClipboardList, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SessionCard } from "@/components/sessions/SessionCard";
import { SessionForm } from "@/components/sessions/SessionForm";
import { SessionDetailDialog } from "@/components/sessions/SessionDetailDialog";
import {
  useTreatmentSessions,
  useCreateTreatmentSession,
  TreatmentSession,
  TreatmentSessionFormData,
} from "@/hooks/useTreatmentSessions";

export default function History() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TreatmentSession | null>(null);

  const { data: sessions, isLoading } = useTreatmentSessions();
  const createSession = useCreateTreatmentSession();

  const filteredSessions = sessions?.filter((session) => {
    const searchLower = search.toLowerCase();
    const clientName = session.clients
      ? `${session.clients.first_name} ${session.clients.last_name}`.toLowerCase()
      : "";
    const treatmentName = session.treatment_types?.name.toLowerCase() || "";
    
    return (
      clientName.includes(searchLower) ||
      treatmentName.includes(searchLower) ||
      session.operator_name?.toLowerCase().includes(searchLower)
    );
  });

  const handleCreateSession = (data: TreatmentSessionFormData) => {
    createSession.mutate(data, {
      onSuccess: () => setShowForm(false),
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Storico Trattamenti</h1>
            <p className="text-muted-foreground">
              Visualizza e gestisci tutte le sessioni registrate
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuova Sessione
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca per cliente, trattamento o operatore..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sessions List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredSessions?.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="mt-3 text-muted-foreground">
              {search ? "Nessuna sessione trovata" : "Nessuna sessione registrata"}
            </p>
            {!search && (
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Registra la prima sessione
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSessions?.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onViewDetails={setSelectedSession}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Session iOS Modal */}
      <IOSModal open={showForm} onOpenChange={setShowForm}>
        <IOSModalContent>
          <IOSModalHeader onClose={() => setShowForm(false)}>
            <IOSModalTitle>Nuova Sessione</IOSModalTitle>
          </IOSModalHeader>
          <IOSModalBody>
            <SessionForm
              onSubmit={handleCreateSession}
              onCancel={() => setShowForm(false)}
              isLoading={createSession.isPending}
            />
          </IOSModalBody>
        </IOSModalContent>
      </IOSModal>

      {/* Session Detail Dialog */}
      <SessionDetailDialog
        session={selectedSession}
        open={!!selectedSession}
        onOpenChange={(open) => !open && setSelectedSession(null)}
      />
    </AppLayout>
  );
}
