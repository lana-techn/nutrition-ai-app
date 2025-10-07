import React from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
}

const maxWidthMap = {
  'sm': 'max-w-sm',
  'md': 'max-w-md', 
  'lg': 'max-w-lg',
  'xl': 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  'full': 'max-w-full'
};

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className,
  containerClassName,
  maxWidth = '7xl'
}) => {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className={cn(
        "container mx-auto px-4 py-8",
        maxWidthMap[maxWidth],
        containerClassName
      )}>
        {children}
      </div>
    </div>
  );
};