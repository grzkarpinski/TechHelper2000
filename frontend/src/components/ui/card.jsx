import { cn } from "@/lib/utils.js";

function Card({ className, ...props }) {
  return <div className={cn("min-w-0 break-words rounded-xl border border-border bg-card text-card-foreground shadow-lg", className)} {...props} />;
}

function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return <h2 className={cn("text-lg font-medium", className)} {...props} />;
}

function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-4 pt-0 sm:p-6 sm:pt-0", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle };
