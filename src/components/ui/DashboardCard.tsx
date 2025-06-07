import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: "default" | "outline" | "success" | "warning" | "danger";
  actions?: ReactNode;
  isLoading?: boolean;
}

export function DashboardCard({
  title,
  description,
  className,
  children,
  icon,
  variant = "default",
  actions,
  isLoading = false,
}: DashboardCardProps) {
  const variantStyles = {
    default: "",
    outline: "border-2",
    success: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
    warning: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
    danger: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
  };

  return (
    <Card className={cn("overflow-hidden", variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <div>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center">{actions}</div>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
} 
