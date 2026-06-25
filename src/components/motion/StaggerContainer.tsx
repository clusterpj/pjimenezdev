"use client";
import { motion, useReducedMotion } from "framer-motion";

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
  style?: React.CSSProperties;
}

const containerVariants = (stagger: number, delay: number, reduced: boolean) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: reduced ? 0 : stagger,
      delayChildren: reduced ? 0 : delay,
    },
  },
});

export const itemVariants = (reduced: boolean) => ({
  hidden: { opacity: 0, y: reduced ? 0 : 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
});

export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  delayChildren = 0,
  className,
  style,
}: StaggerContainerProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      variants={containerVariants(staggerDelay, delayChildren, !!reduced)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}
