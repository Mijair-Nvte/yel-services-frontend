"use client";

import { useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CountryCode = "EC" | "US" | "MX" | "ALL";

const COUNTRY_COLORS: Record<Exclude<CountryCode, "ALL">, string> = {
  EC: "#22C55E", // Ecuador
  US: "#3B82F6", // USA
  MX: "#A855F7", // México
};

const COUNTRY_BUTTON_STYLES: Record<CountryCode, string> = {
  ALL: "bg-slate-900 text-white hover:bg-slate-800",
  EC: "bg-green-500 text-white hover:bg-green-600",
  US: "bg-blue-500 text-white hover:bg-blue-600",
  MX: "bg-emerald-600 text-white hover:bg-emerald-700",
};

const HOLIDAYS = [
  // ================= ECUADOR 🇪🇨 =================
  { id: "ec-1", title: "Año Nuevo", start: "2026-01-01", country: "EC" },
  { id: "ec-2", title: "Carnaval", start: "2026-02-16", end: "2026-02-17", country: "EC" },
  { id: "ec-3", title: "Viernes Santo", start: "2026-04-03", country: "EC" },
  { id: "ec-4", title: "Día del Trabajo", start: "2026-05-01", country: "EC" },
  { id: "ec-5", title: "Batalla de Pichincha", start: "2026-05-24", country: "EC" },
  { id: "ec-6", title: "Grito de la Independencia", start: "2026-08-10", country: "EC" },
  { id: "ec-7", title: "Independencia de Guayaquil", start: "2026-10-09", country: "EC" },
  { id: "ec-8", title: "Día de los Difuntos", start: "2026-11-02", end: "2026-11-03", country: "EC" },
  { id: "ec-9", title: "Independencia de Cuenca", start: "2026-11-04", country: "EC" },
  { id: "ec-10", title: "Navidad", start: "2026-12-25", country: "EC" },

  // ================= USA 🇺🇸 =================
  { id: "us-1", title: "New Year's Day", start: "2026-01-01", country: "US" },
  { id: "us-2", title: "Martin Luther King Day", start: "2026-01-19", country: "US" },
  { id: "us-3", title: "Presidents Day", start: "2026-02-16", country: "US" },
  { id: "us-4", title: "Memorial Day", start: "2026-05-25", country: "US" },
  { id: "us-5", title: "Independence Day", start: "2026-07-04", country: "US" },
  { id: "us-6", title: "Labor Day", start: "2026-09-07", country: "US" },
  { id: "us-7", title: "Veterans Day", start: "2026-11-11", country: "US" },
  { id: "us-8", title: "Thanksgiving", start: "2026-11-26", country: "US" },
  { id: "us-9", title: "Christmas Day", start: "2026-12-25", country: "US" },

  // ================= MÉXICO 🇲🇽 =================
  { id: "mx-1", title: "Año Nuevo", start: "2026-01-01", country: "MX" },
  { id: "mx-2", title: "Día de la Candelaria", start: "2026-02-02", country: "MX" },
  { id: "mx-3", title: "Natalicio de Benito Juárez", start: "2026-03-16", country: "MX" },
  { id: "mx-4", title: "Viernes Santo", start: "2026-04-03", country: "MX" },
  { id: "mx-5", title: "Día del Trabajo", start: "2026-05-01", country: "MX" },
  { id: "mx-6", title: "Batalla de Puebla", start: "2026-05-05", country: "MX" },
  { id: "mx-7", title: "Día de la Independencia", start: "2026-09-16", country: "MX" },
  { id: "mx-8", title: "Día de la Revolución", start: "2026-11-16", country: "MX" },
  { id: "mx-9", title: "Virgen de Guadalupe", start: "2026-12-12", country: "MX" },
  { id: "mx-10", title: "Navidad", start: "2026-12-25", country: "MX" },
];

export default function CalendarPage() {
  const [countryFilter, setCountryFilter] = useState<CountryCode>("ALL");

  const events = useMemo(() => {
    return HOLIDAYS
      .filter(
        (holiday) =>
          countryFilter === "ALL" || holiday.country === countryFilter
      )
      .map((holiday) => ({
        id: holiday.id,
        title: holiday.title,
        start: holiday.start,
        end: holiday.end,
        editable: false,
        color: COUNTRY_COLORS[holiday.country as Exclude<CountryCode, "ALL">],
        extendedProps: {
          type: "holiday",
          country: holiday.country,
        },
      }));
  }, [countryFilter]);

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Calendario de feriados</CardTitle>
        <p className="text-sm text-muted-foreground">
          Feriados oficiales por país (2026)
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ===== Filtros ===== */}
        <div className="flex flex-wrap gap-2">
          {(["ALL", "EC", "US", "MX"] as CountryCode[]).map((code) => (
            <Button
              key={code}
              variant="secondary"
              onClick={() => setCountryFilter(code)}
              className={`rounded-full ${
                countryFilter === code
                  ? COUNTRY_BUTTON_STYLES[code]
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {code === "ALL"
                ? "Todos"
                : code === "EC"
                ? "Ecuador 🇪🇨"
                : code === "US"
                ? "USA 🇺🇸"
                : "México 🇲🇽"}
            </Button>
          ))}
        </div>

        {/* ===== Calendario ===== */}
        <div className="rounded-lg border overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="es"
            events={events}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            height="auto"
            eventClick={(info) => {
              console.log("Evento:", info.event.title);
              console.log("País:", info.event.extendedProps.country);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
