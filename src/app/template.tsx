'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{
          duration: 0.4, // Snappier duration
          ease: [0.25, 1, 0.5, 1], // Smooth but faster curve
        }}
        style={{ willChange: 'opacity, transform' }} // Force GPU acceleration
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
