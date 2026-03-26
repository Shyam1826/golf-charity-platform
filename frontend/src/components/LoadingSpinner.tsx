import { motion } from 'framer-motion';

export default function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 w-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-golf border-r-golf-neon shadow-neon"
      />
      {text && (
        <motion.p 
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
          className="mt-6 font-bold text-darkblue tracking-widest uppercase text-sm"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
