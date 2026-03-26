import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Heart, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Charities() {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const { data } = await api.get('/charities');
        setCharities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  if (loading) return <LoadingSpinner text="Loading Charities..." />;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.header variants={itemVariants} className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-red-100/50 text-red-500 rounded-2xl mb-6 shadow-sm">
          <Heart size={40} fill="currentColor" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-darkblue tracking-tight">
          Supported Charities
        </h2>
        <p className="text-gray-500 mt-4 font-semibold text-lg md:text-xl">
          Discover the amazing organizations you can support with your winnings. Pledging is optional, but highly encouraged!
        </p>
      </motion.header>

      <motion.div variants={itemVariants} className="mb-8 relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search charities..." 
          className="w-full bg-white border-2 border-slate-200 rounded-full py-4 pl-12 pr-6 text-darkblue font-bold outline-none focus:border-golf focus:ring-4 focus:ring-golf/10 transition-all shadow-sm"
        />
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charities.map((charity) => (
          <motion.div 
            variants={itemVariants} 
            key={charity.id}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all border-2 border-slate-100 hover:border-golf group flex flex-col h-full"
          >
            <div className="flex-grow">
              <h3 className="text-2xl font-black text-darkblue mb-3 group-hover:text-golf transition-colors">{charity.name}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{charity.description}</p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-sm font-bold">
               <span className="text-slate-400">Total Given</span>
               <span className="text-darkblue bg-slate-100 px-3 py-1 rounded-lg">---</span>
            </div>
          </motion.div>
        ))}
        {charities.length === 0 && (
          <div className="col-span-full text-center p-12 bg-white/50 rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-bold text-lg">No charities listed yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
