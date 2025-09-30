import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type RecordType = "vaccination" | "treatment" | "checkup" | "emergency";

interface MedicalRecordCardProps {
  type: RecordType;
  title: string;
  date: string;
  veterinarian: string;
  notes: string;
  attachments?: number;
}

const typeConfig = {
  vaccination: { label: "Vaccination", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  treatment: { label: "Treatment", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  checkup: { label: "Checkup", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  emergency: { label: "Emergency", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
};

export default function MedicalRecordCard({
  type,
  title,
  date,
  veterinarian,
  notes,
  attachments,
}: MedicalRecordCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="p-6" data-testid={`card-record-${type}`}>
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="font-semibold text-lg" data-testid="text-record-title">{title}</h3>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span data-testid="text-record-date">{date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span data-testid="text-record-vet">{veterinarian}</span>
                </div>
              </div>
            </div>
            <Badge className={typeConfig[type].className} data-testid="badge-record-type">
              {typeConfig[type].label}
            </Badge>
          </div>
          
          {expanded && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{notes}</p>
              {attachments && attachments > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{attachments} attachment{attachments > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 -ml-2"
            onClick={() => setExpanded(!expanded)}
            data-testid="button-toggle-details"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show Details
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
