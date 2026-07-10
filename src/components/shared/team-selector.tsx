"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

export interface TeamMember {
  id: string | number;
  name: string;
  email: string;
  avatar_url?: string;
}

interface TeamSelectorProps {
  label: string;
  members: TeamMember[];
  value: string | string[]; // string para single, string[] para múltiple
  onChange: (value: any) => void;
  multiple?: boolean;
  placeholder?: string;
  className?: string;
}

export function TeamSelector({
  label,
  members,
  value,
  onChange,
  multiple = false,
  placeholder = "Seleccionar usuario...",
  className,
}: TeamSelectorProps) {
  const [open, setOpen] = React.useState(false);

  // Manejador principal de selección
  const handleSelect = (currentId: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(currentId)) {
        onChange(currentValues.filter((id) => id !== currentId));
      } else {
        onChange([...currentValues, currentId]);
      }
    } else {
      // Si es single select y le da al mismo, lo deselecciona. Si no, lo asigna.
      onChange(value === currentId ? "" : currentId);
      setOpen(false); // Cerramos el popover en single select
    }
  };

  // Remover un item específico (para las píldoras del multi-select)
  const handleRemove = (e: React.MouseEvent, idToRemove: string) => {
    e.stopPropagation(); // Evita que se abra el popover al hacer clic en la X
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((id) => id !== idToRemove));
    }
  };

  // Helper para renderizar el interior del botón (Trigger)
  const renderTriggerContent = () => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((selectedId) => {
            const member = members.find(
              (m) => String(m.id) === String(selectedId),
            );
            if (!member) return null;
            return (
              <div
                key={selectedId}
                className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full text-xs font-medium"
              >
                <Avatar className="h-4 w-4">
                  <AvatarImage src={member.avatar_url} />
                  <AvatarFallback className="bg-indigo-200 text-indigo-800 text-[8px]">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {member.name}
                <div
                  role="button"
                  onClick={(e) => handleRemove(e, String(selectedId))}
                  className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (!multiple && value) {
      const member = members.find((m) => String(m.id) === String(value));
      if (member) {
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={member.avatar_url} />
              <AvatarFallback className="bg-slate-200 text-xs text-slate-700">
                {member.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{member.name}</span>
          </div>
        );
      }
    }

    // Placeholder por defecto
    return <span className="text-slate-500 font-normal">{placeholder}</span>;
  };

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <Label className="text-slate-700 font-medium">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between bg-white hover:bg-slate-50 border-slate-200 h-auto min-h-[40px] px-3 py-2",
              !value && "text-muted-foreground",
            )}
          >
            <div className="flex-1 text-left line-clamp-1 overflow-hidden">
              {renderTriggerContent()}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Buscar por nombre..." />
            <CommandList>
              <CommandEmpty>No se encontraron usuarios.</CommandEmpty>
              <CommandGroup>
                {members.map((member) => {
                  const isSelected = multiple
                    ? Array.isArray(value) && value.includes(String(member.id))
                    : value === String(member.id);

                  return (
                    <CommandItem
                      key={member.id}
                      value={member.name} // Importante para que el buscador filtre por nombre
                      onSelect={() => handleSelect(String(member.id))}
                      className="flex items-center gap-3 py-2 cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-1 flex h-4 w-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-300 opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </div>

                      <Avatar className="h-8 w-8 shadow-sm">
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-slate-800">
                          {member.name}
                        </span>
                        <span className="text-slate-500 text-xs">
                          {member.email}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
