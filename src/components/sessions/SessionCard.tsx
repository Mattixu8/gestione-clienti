import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, MessageSquare, ChevronRight } from "lucide-react";
import { TreatmentSession } from "@/hooks/useTreatmentSessions";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface SessionCardProps {
  session: TreatmentSession;
  onViewDetails: (session: TreatmentSession) => void;
  showClient?: boolean;
}

export function SessionCard({ session, onViewDetails, showClient = true }: SessionCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDetails(session)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {session.treatment_types?.name}
              </Badge>
              {session.treatment_types?.price && (
                <span className="text-sm font-medium text-muted-foreground">
                  €{session.treatment_types.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {format(new Date(session.session_date), "d MMMM yyyy 'alle' HH:mm", { locale: it })}
                </span>
              </div>
              
              {showClient && session.clients && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span>{session.clients.first_name} {session.clients.last_name}</span>
                </div>
              )}
              
              {session.operator_name && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span>Operatore: {session.operator_name}</span>
                </div>
              )}
              
              {session.notes && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5 mt-0.5" />
                  <span className="line-clamp-2">{session.notes}</span>
                </div>
              )}
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="ml-2">
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
