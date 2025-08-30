import * as React from "react";
import { cn } from "./utils";

function PopupCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popup-card"
      className={cn(
        "bg-navy-900 text-card-foreground flex flex-col gap-6 rounded-xl border animate-slideIn",
        className,
      )}
      {...props}
    />
  );
}

function PopupCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popup-card-header"
      className={cn(
        "@container/popup-card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=popup-card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function PopupCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="popup-card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

function PopupCardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="popup-card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function PopupCardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popup-card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function PopupCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popup-card-content"
      className={cn("bg-navy-800 px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

function PopupCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popup-card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  PopupCard,
  PopupCardHeader,
  PopupCardFooter,
  PopupCardTitle,
  PopupCardAction,
  PopupCardDescription,
  PopupCardContent,
};