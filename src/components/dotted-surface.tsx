'use client';
import { cn } from '@/lib/utils';
import React, { useRef } from 'react';

export function DottedSurface({ className, ...props }: Omit<React.ComponentProps<'div'>, 'ref'>) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-0', className)}
      {...props}
    />
  );
}
