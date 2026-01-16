import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface IOSAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText: string;
  onConfirm: () => void;
  destructive?: boolean;
}

export function IOSAlert({
  open,
  onOpenChange,
  title,
  description,
  cancelText = "Annulla",
  confirmText,
  onConfirm,
  destructive = false,
}: IOSAlertProps) {
  return (
    <DrawerPrimitive.Root open={open} onOpenChange={onOpenChange} dismissible={false}>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <DrawerPrimitive.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[20px] bg-background shadow-xl">
          {/* iOS-style handle */}
          <div className="mx-auto mt-3 mb-2 h-1 w-10 shrink-0 rounded-full bg-muted-foreground/30" />
          
          <div className="px-6 py-4 text-center">
            <DrawerPrimitive.Title className="text-lg font-semibold text-foreground">
              {title}
            </DrawerPrimitive.Title>
            <DrawerPrimitive.Description className="text-sm text-muted-foreground mt-2">
              {description}
            </DrawerPrimitive.Description>
          </div>
          
          <div className="p-4 pt-0 pb-safe flex flex-col gap-2">
            <Button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className={cn(
                "w-full h-12 text-base font-medium rounded-xl",
                destructive && "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              )}
            >
              {confirmText}
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full h-12 text-base font-medium rounded-xl"
            >
              {cancelText}
            </Button>
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}
