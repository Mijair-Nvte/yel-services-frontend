type Props = {
  events: any[];
};

export function DashboardEvents({ events }: Props) {
  return (
    <div className="rounded-xl border p-4 bg-card">
      <h2 className="font-semibold mb-3">Próximos eventos</h2>

      {events.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No hay eventos próximos
        </p>
      )}

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.uid} className="border-b pb-2">
            <div className="font-medium">{event.title}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(event.starts_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}