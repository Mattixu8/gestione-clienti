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
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { Search, Plus, Users, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ClientCard } from "@/components/clients/ClientCard";
import { ClientForm } from "@/components/clients/ClientForm";
import { useClients, useCreateClient, ClientFormData } from "@/hooks/useClients";
import { useQueryClient } from "@tanstack/react-query";

export default function Clients() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const queryClient = useQueryClient();

  const filteredClients = clients?.filter((client) => {
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    const searchLower = search.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      client.phone?.includes(search) ||
      client.email?.toLowerCase().includes(searchLower)
    );
  });

  const handleCreateClient = (data: ClientFormData) => {
    createClient.mutate(data, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["clients"] });
  };

  return (
    <AppLayout>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Clienti</h1>
              <p className="text-muted-foreground">
                Gestisci l'anagrafica dei tuoi clienti
              </p>
            </div>
            <Button onClick={() => setShowForm(true)} className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Cliente
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca per nome, telefono o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>

          {/* Client List */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredClients?.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="mt-3 text-muted-foreground">
                {search ? "Nessun cliente trovato" : "Nessun cliente registrato"}
              </p>
              {!search && (
                <Button className="mt-4 rounded-xl" onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi il primo cliente
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredClients?.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          )}
        </div>
      </PullToRefresh>

      {/* Create Client iOS Modal */}
      <IOSModal open={showForm} onOpenChange={setShowForm}>
        <IOSModalContent>
          <IOSModalHeader onClose={() => setShowForm(false)}>
            <IOSModalTitle>Nuovo Cliente</IOSModalTitle>
          </IOSModalHeader>
          <IOSModalBody>
            <ClientForm
              onSubmit={handleCreateClient}
              onCancel={() => setShowForm(false)}
              isLoading={createClient.isPending}
            />
          </IOSModalBody>
        </IOSModalContent>
      </IOSModal>
    </AppLayout>
  );
}
