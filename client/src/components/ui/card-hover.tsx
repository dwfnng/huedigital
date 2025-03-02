
import * as React from "react";
import { cn } from "@/lib/utils";

type CardHoverProps = React.HTMLAttributes<HTMLDivElement> & {
  hoverEffect?: "lift" | "border" | "glow" | "none";
};

const CardHover = React.forwardRef<HTMLDivElement, CardHoverProps>(
  ({ className, hoverEffect = "lift", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          "transition-all duration-300",
          hoverEffect === "lift" && "hover:-translate-y-1 hover:shadow-md",
          hoverEffect === "border" && "hover:border-primary",
          hoverEffect === "glow" && "hover:shadow-lg hover:shadow-primary/20",
          className
        )}
        {...props}
      />
    );
  }
);
CardHover.displayName = "CardHover";

const CardHoverHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHoverHeader.displayName = "CardHoverHeader";

const CardHoverTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardHoverTitle.displayName = "CardHoverTitle";

const CardHoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardHoverDescription.displayName = "CardHoverDescription";

const CardHoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardHoverContent.displayName = "CardHoverContent";

const CardHoverFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardHoverFooter.displayName = "CardHoverFooter";

export {
  CardHover,
  CardHoverHeader,
  CardHoverTitle,
  CardHoverDescription,
  CardHoverContent,
  CardHoverFooter,
};
