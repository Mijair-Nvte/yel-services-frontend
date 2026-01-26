"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DepartmentForm } from "./department-form";

export function DepartmentSheet({
  open,
  onClose,
  title,
  onSubmit,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: any) => void;
  initialData?: any;
}) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <DepartmentForm
            initialData={initialData}
            onSubmit={(data) => {
              onSubmit(data);
              onClose();
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
