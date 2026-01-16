import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Sparkles, ClipboardList, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useClients } from "@/hooks/useClients";
import { useTreatmentTypes } from "@/hooks/useTreatmentTypes";
import { useTreatmentSessions } from "@/hooks/useTreatmentSessions";
import { AppLayout } from "@/components/layout/AppLayout";
import { SessionCard } from "@/components/sessions/SessionCard";
import { useState } from "react";
import { SessionDetailDialog } from "@/components/sessions/SessionDetailDialog";
import { TreatmentSession } from "@/hooks/useTreatmentSessions";

export default function Dashboard() {
  const { data: clients } = useClients();
  const { data: treatmentTypes } = useTreatmentTypes();
  const { data: sessions } = useTreatmentSessions();
  const [selectedSession, setSelectedSession] = useState<TreatmentSession | null>(null);

  const recentSessions = sessions?.slice(0, 5) || [];

  const stats = [
    {
      title: "Clienti",
      value: clients?.length || 0,
      icon: Users,
      href: "/clients",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Trattamenti",
      value: treatmentTypes?.length || 0,
      icon: Sparkles,
      href: "/treatments",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Sessioni Totali",
      value: sessions?.length || 0,
      icon: ClipboardList,
      href: "/history",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Benvenuto su Spa Manager
          </h1>
          <p className="text-muted-foreground">
            Gestisci i tuoi clienti, trattamenti e lo storico delle sessioni
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/clients">
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Cliente
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/history">
              <Plus className="h-4 w-4 mr-2" />
              Registra Sessione
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Link key={stat.title} to={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Sessioni Recenti</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/history">
                Vedi tutte
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentSessions.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="mt-3 text-muted-foreground">
                  Nessuna sessione registrata
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/history">
                    <Plus className="h-4 w-4 mr-2" />
                    Registra la prima sessione
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onViewDetails={setSelectedSession}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <SessionDetailDialog
        session={selectedSession}
        open={!!selectedSession}
        onOpenChange={(open) => !open && setSelectedSession(null)}
      />
    </AppLayout>
  );
}
