type Props = {
  notices: any[];
};

export function DashboardNotices({ notices }: Props) {
  return (
    <div className="rounded-xl border p-4 bg-card">
      <h2 className="font-semibold mb-3">Avisos recientes</h2>

      {notices.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No hay avisos
        </p>
      )}

      <div className="space-y-3">
        {notices.map((notice) => (
          <div key={notice.uid} className="border-b pb-2">
            <div className="font-medium">{notice.title}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(notice.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}