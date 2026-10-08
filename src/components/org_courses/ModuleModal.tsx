import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => Promise<void>;
  isSubmitting: boolean;
  initialData?: { title: string; description: string } | null;
}

export function ModuleModal({ isOpen, onClose, onSubmit, isSubmitting, initialData }: ModuleModalProps) {
  const [form, setForm] = useState({ title: "", description: "" });

  // Sincronizar datos si es edición
  useEffect(() => {
    if (isOpen) {
      setForm(initialData || { title: "", description: "" });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-900">
            {initialData ? "Editar Módulo" : "Crear Nuevo Módulo"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" disabled={isSubmitting}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mod_title">Título del Módulo</Label>
            <Input 
              id="mod_title" 
              value={form.title} 
              onChange={(e) => setForm({...form, title: e.target.value})} 
              placeholder="Ej: Introducción a las Inversiones" 
              autoFocus 
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mod_desc">Descripción (Opcional)</Label>
            <Textarea 
              id="mod_desc" 
              value={form.description} 
              onChange={(e) => setForm({...form, description: e.target.value})} 
              placeholder="Breve explicación de lo que se verá en este módulo..." 
              className="resize-none"
              disabled={isSubmitting}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || !form.title} className="bg-indigo-600 hover:bg-indigo-700">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {initialData ? "Guardar Cambios" : "Guardar Módulo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}