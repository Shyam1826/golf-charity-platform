import { motion } from 'framer-motion';
import { Flag, Play, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-golf-neon/10 text-golf border border-golf-neon/20 font-bold mb-4 shadow-sm">
          <Flag size={18} />
          <span>Play Golf. Win Prizes. Support Charities.</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-darkblue tracking-tight leading-tight">
          The Ultimate <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-golf to-golf-dark">
            Golf Charity Platform
          </span>
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
          Subscribe for just $10/month. Log your scores, join the monthly draws, and seamlessly donate a percentage of your winnings to your favorite causes.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4"
      >
        <Link 
          to="/register"
          className="bg-gradient-to-r from-golf to-golf-dark hover:from-golf-dark hover:to-golf text-white px-8 py-4 rounded-full font-black text-lg transition-all shadow-lg hover:shadow-neon hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          <Play size={22} fill="currentColor" /> Subscribe Now
        </Link>
        <Link 
          to="/how-it-works"
          className="bg-white border-2 border-slate-200 hover:border-darkblue text-darkblue px-8 py-4 rounded-full font-bold text-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
        >
          Learn More
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-12"
      >
        <div className="bg-white/60 p-8 rounded-3xl border border-white shadow-sm flex flex-col items-center text-center">
          <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 mb-4">
            <Trophy size={32} />
          </div>
          <h3 className="text-xl font-black text-darkblue mb-2">Monthly Draws</h3>
          <p className="text-slate-500 font-medium">Win big with our monthly jackpot draw. Track your 5 best scores points to participate.</p>
        </div>
        <div className="bg-white/60 p-8 rounded-3xl border border-white shadow-sm flex flex-col items-center text-center">
          <div className="bg-green-100 p-4 rounded-2xl text-green-600 mb-4">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-black text-darkblue mb-2">Support Charities</h3>
          <p className="text-slate-500 font-medium">Choose a charity and pledge a percentage of your winnings automatically.</p>
        </div>
        <div className="bg-white/60 p-8 rounded-3xl border border-white shadow-sm flex flex-col items-center text-center">
          <div className="bg-purple-100 p-4 rounded-2xl text-purple-600 mb-4">
            <Flag size={32} />
          </div>
          <h3 className="text-xl font-black text-darkblue mb-2">Fair Play</h3>
          <p className="text-slate-500 font-medium">Scores must be between 1-45. Track your history and improve your game!</p>
        </div>
      </motion.div>
    </div>
  );
}
