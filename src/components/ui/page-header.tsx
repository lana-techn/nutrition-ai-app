import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  secondaryIcon?: LucideIcon;
  className?: string;
  iconClassName?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  secondaryIcon: SecondaryIcon,
  className,
  iconClassName,
  children
}) => {
  return (
    <div className={cn("text-center mb-12", className)}>
      {Icon && (
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className={cn(
              "w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center shadow-lg",
              iconClassName
            )}>
              <Icon className="h-8 w-8 text-primary" />
            </div>
            {SecondaryIcon && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <SecondaryIcon className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </div>
      )}
      
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
        {title}
      </h1>
      
      {description && (
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
};