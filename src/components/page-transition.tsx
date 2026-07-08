'use client';

import { motion } from 'framer-motion';
import React from 'react';

/* -------------------------------------------------------------------------- */
/*  PageTransition — standard route-entry animation                          */
/*  Timings: 0.4s easeOut opacity+y offset — matches DESIGN_SYSTEM.md.      */
/* -------------------------------------------------------------------------- */

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
