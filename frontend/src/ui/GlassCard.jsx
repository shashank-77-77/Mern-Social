import { motion } from "framer-motion";

export default function GlassCard({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ scale: 1.02, rotateX: 3, rotateY: -3 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className={`
        relative
        bg-white/70
        backdrop-blur-xl
        rounded-3xl
        shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        border border-white/40
        transform-gpu
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
