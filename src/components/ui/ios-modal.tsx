import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const IOSModal = ({
  shouldScaleBackground = true,
  dismissible = false,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root> & { 
  dismissible?: boolean;
}) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    dismissible={dismissible}
    {...props}
  />
);
IOSModal.displayName = "IOSModal";

const IOSModalTrigger = DrawerPrimitive.Trigger;

const IOSModalPortal = DrawerPrimitive.Portal;

const IOSModalClose = DrawerPrimitive.Close;

const IOSModalOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-sm", className)}
    {...props}
  />
));
IOSModalOverlay.displayName = "IOSModalOverlay";

const IOSModalContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <IOSModalPortal>
    <IOSModalOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col rounded-t-[20px] bg-background shadow-xl",
        className
      )}
      {...props}
    >
      {/* iOS-style handle */}
      <div className="mx-auto mt-3 mb-2 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/40" />
      {children}
    </DrawerPrimitive.Content>
  </IOSModalPortal>
));
IOSModalContent.displayName = "IOSModalContent";

const IOSModalHeader = ({
  className,
  children,
  onClose,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) => (
  <div
    className={cn(
      "relative px-4 pb-4 pt-2 border-b border-border/50",
      className
    )}
    {...props}
  >
    {children}
    {onClose && (
      <button
        onClick={onClose}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-muted flex items-center justify-center"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
    )}
  </div>
);
IOSModalHeader.displayName = "IOSModalHeader";

const IOSModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "p-4 pt-2 pb-safe flex flex-col gap-2 border-t border-border/50 bg-background",
      className
    )}
    {...props}
  />
);
IOSModalFooter.displayName = "IOSModalFooter";

const IOSModalTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold text-center text-foreground",
      className
    )}
    {...props}
  />
));
IOSModalTitle.displayName = "IOSModalTitle";

const IOSModalDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground text-center mt-1", className)}
    {...props}
  />
));
IOSModalDescription.displayName = "IOSModalDescription";

const IOSModalBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex-1 overflow-y-auto px-4 py-4 touch-action-auto", className)}
    {...props}
  />
);
IOSModalBody.displayName = "IOSModalBody";

export {
  IOSModal,
  IOSModalPortal,
  IOSModalOverlay,
  IOSModalTrigger,
  IOSModalClose,
  IOSModalContent,
  IOSModalHeader,
  IOSModalFooter,
  IOSModalTitle,
  IOSModalDescription,
  IOSModalBody,
};
