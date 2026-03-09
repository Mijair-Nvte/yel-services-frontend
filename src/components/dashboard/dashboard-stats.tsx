type Props = {
  stats: any;
};

export function DashboardStats({ stats }: Props) {
  const items = [
    { label: "Usuarios", value: stats.users },
    { label: "Eventos", value: stats.events_total },
    { label: "Eventos este mes", value: stats.events_this_month },
    { label: "Documentos", value: stats.documents_total },
    { label: "Carpetas", value: stats.folders_total },
    { label: "Avisos", value: stats.notices_total },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border p-4 bg-card shadow-sm"
        >
          <div className="text-sm text-muted-foreground">{item.label}</div>
          <div className="text-2xl font-bold">{item.value}</div>
        </div>
      ))}
    </div>
  );
}