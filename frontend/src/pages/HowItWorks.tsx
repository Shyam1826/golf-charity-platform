import { motion } from 'framer-motion';
import { Target, Search, Heart, Trophy } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Target size={32} />,
      title: '1. Register & Subscribe',
      desc: 'Create an account and set up your monthly $10 subscription to enter the platform.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Search size={32} />,
      title: '2. Log Your Scores',
      desc: 'Play your rounds and submit your stableford scores (1-45 points). Only your last 5 scores are kept.',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: <Heart size={32} />,
      title: '3. Pledge a Charity',
      desc: 'Select a charity from our list and pledge a percentage of your potential winnings to them.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: <Trophy size={32} />,
      title: '4. Monthly Draw',
      desc: 'At the end of the month, the admins run the draw. If you win, your pledged percentage goes to charity automatically!',
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black text-darkblue tracking-tight">How It Works</h2>
        <p className="text-slate-500 font-medium text-lg md:text-xl">Combine your love for golf with your passion for giving back.</p>
      </div>

      <div className="grid gap-8">
        {steps.map((step, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            key={idx}
            className="bg-white rounded-[2rem] p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 border-2 border-slate-100 hover:border-slate-200 transition-colors"
          >
            <div className={`${step.color} p-5 rounded-2xl shrink-0`}>
              {step.icon}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-black text-darkblue mb-2">{step.title}</h3>
              <p className="text-slate-500 font-medium text-lg">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
