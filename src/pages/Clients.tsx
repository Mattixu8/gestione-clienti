import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, Users, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ClientCard } from "@/components/clients/ClientCard";
import { ClientForm } from "@/components/clients/ClientForm";
import { useClients, useCreateClient, ClientFormData } from "@/hooks/useClients";

export default function Clients() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();

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

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Clienti</h1>
            <p className="text-muted-foreground">
              Gestisci l'anagrafica dei tuoi clienti
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
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
            className="pl-10"
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
              <Button className="mt-4" onClick={() => setShowForm(true)}>
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

      {/* Create Client Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuovo Cliente</DialogTitle>
          </DialogHeader>
          <ClientForm
            onSubmit={handleCreateClient}
            onCancel={() => setShowForm(false)}
            isLoading={createClient.isPending}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
