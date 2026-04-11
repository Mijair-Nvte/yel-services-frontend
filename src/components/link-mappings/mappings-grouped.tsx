"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit2,
  Trash2,
  LinkIcon,
  Copy,
  ExternalLink,
  Hash,
} from "lucide-react";
import { toast } from "sonner";

export function MappingsGrouped({ groupedData, onEdit, onDelete }: any) {
  const sellerNames = Object.keys(groupedData);

  if (sellerNames.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
        <p className="text-slate-400 font-medium">
          No se encontraron resultados para tu búsqueda.
        </p>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("ID copiado al portapapeles");
  };

  return (
    <Accordion type="multiple" className="space-y-4">
      {sellerNames.map((name) => {
        const { seller, links } = groupedData[name];
        return (
          <AccordionItem
            key={name}
            value={name}
            className="border rounded-2xl bg-white shadow-sm overflow-hidden border-slate-200 px-4 py-1 transition-all hover:ring-1 hover:ring-indigo-100"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-4 text-left">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                  <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold">
                    {name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-slate-900 leading-none">
                    {name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {links.length}{" "}
                    {links.length === 1
                      ? "enlace asignado"
                      : "enlaces asignados"}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {links.map((link: any) => (
                  <div
                    key={link.uid}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 group hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all relative"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                        <LinkIcon className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-400 hover:text-indigo-600"
                          onClick={() => onEdit(link)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-400 hover:text-red-600"
                          onClick={() => onDelete(link.uid)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">
                      {link.service_name}
                    </h4>

                    <div className="flex items-center gap-2 mb-3">
                     
                      {!link.is_active && (
                        <Badge
                          variant="outline"
                          className="text-[10px] font-bold text-slate-400"
                        >
                          INACTIVO
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between bg-white border border-slate-100 p-2 rounded-lg mt-2">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <Hash className="h-3 w-3 text-slate-300" />
                        <span className="text-[10px] font-mono text-slate-500 truncate">
                          {link.ghl_payment_link_id}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(link.ghl_payment_link_id)
                        }
                        className="p-1 hover:bg-slate-50 rounded transition-colors"
                      >
                        <Copy className="h-3 w-3 text-slate-400 hover:text-indigo-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
