import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Calendar, ChevronRight } from "lucide-react";
import { Client } from "@/hooks/useClients";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {client.first_name} {client.last_name}
            </h3>
            <div className="mt-2 space-y-1">
              {client.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}
              {client.birth_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {format(new Date(client.birth_date), "d MMM yyyy", { locale: it })}
                  </span>
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/clients/${client.id}`}>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
