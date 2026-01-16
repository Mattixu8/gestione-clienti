import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Euro, Pencil, Trash2 } from "lucide-react";
import { TreatmentType } from "@/hooks/useTreatmentTypes";

interface TreatmentTypeCardProps {
  treatment: TreatmentType;
  onEdit: (treatment: TreatmentType) => void;
  onDelete: (id: string) => void;
}

export function TreatmentTypeCard({ treatment, onEdit, onDelete }: TreatmentTypeCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{treatment.name}</h3>
            {treatment.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {treatment.description}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {treatment.duration_minutes && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{treatment.duration_minutes} min</span>
                </div>
              )}
              {treatment.price && (
                <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                  <Euro className="h-4 w-4" />
                  <span>{treatment.price.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-1 ml-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(treatment)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(treatment.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
