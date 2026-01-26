// notice.styles.ts
export const priorityStyles = {
  urgent: {
    icon: "bg-destructive/10 text-destructive",
    border: "border-l-4 border-l-destructive",
    badge: "bg-destructive/10 text-destructive border-destructive/20",
  },
  normal: {
    icon: "bg-primary/10 text-primary",
    border: "",
    badge: "",
  },
  low: {
    icon: "bg-muted text-muted-foreground",
    border: "",
    badge: "bg-muted text-muted-foreground",
  },
};

export const categoryColors: Record<string, string> = {
  Sistema: "bg-blue-100 text-blue-700 border-blue-200",
  RRHH: "bg-purple-100 text-purple-700 border-purple-200",
  General: "bg-gray-100 text-gray-700 border-gray-200",
  Urgente: "bg-red-100 text-red-700 border-red-200",
  Finanzas: "bg-green-100 text-green-700 border-green-200",
};
