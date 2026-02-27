"use client";

import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CalendarView } from "@/hooks/org_calendar/use-org-calendar";
import { Separator } from "../ui/separator";

interface Props {
  view: CalendarView;
  setView: (view: CalendarView) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  onOpenCreate?: () => void;
}

export function CalendarHeader({
  view,
  setView,
  currentDate,
  setCurrentDate,
  onOpenCreate,
}: Props) {
  const handlePrev = () => {
    const newDate = new Date(currentDate);

    if (view === "month") newDate.setMonth(newDate.getMonth() - 1);
    if (view === "week") newDate.setDate(newDate.getDate() - 7);
    if (view === "day") newDate.setDate(newDate.getDate() - 1);

    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);

    if (view === "month") newDate.setMonth(newDate.getMonth() + 1);
    if (view === "week") newDate.setDate(newDate.getDate() + 7);
    if (view === "day") newDate.setDate(newDate.getDate() + 1);

    setCurrentDate(newDate);
  };

  const formattedDate = currentDate.toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between mb-6">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <CalendarDays className="h-6 w-6 text-muted-foreground" />

        <h2 className="text-xl font-semibold capitalize">
          {formattedDate}
        </h2>

        <div className="flex gap-1">
          <Button size="icon" variant="outline" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button size="icon" variant="outline" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* RIGHT - VIEW SWITCH */}
      <div className="flex gap-2">
        {(["day", "week", "month"] as CalendarView[]).map((v) => (
          <Button
            key={v}
            variant={view === v ? "default" : "outline"}
            size="sm"
            onClick={() => setView(v)}
            className="capitalize"
          >
            {v}
          </Button>
        ))}
      </div>
      {/* Separador visual */}
        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* 🔥 Botón de Nuevo Evento */}
        <Button onClick={onOpenCreate} size="sm" className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Evento
        </Button>
    </div>
  );
}
