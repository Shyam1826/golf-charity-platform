import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [charities, setCharities] = useState<any[]>([]);
  const [selectedCharity, setSelectedCharity] = useState('');
  const [charityPercentage, setCharityPercentage] = useState<number>(10);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/charities').then(res => setCharities(res.data)).catch(console.error);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (charityPercentage < 10) return setError('Minimum charity contribution is 10%');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { 
        email, password, charity_id: selectedCharity, charity_percentage: charityPercentage 
      });
      setAuth(data, data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white/90 backdrop-blur-2xl p-10 border border-white/50 rounded-[2rem] shadow-glass"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-gradient-to-br from-golf-neon to-golf p-5 rounded-2xl text-darkblue shadow-neon">
            <UserPlus size={40} className="text-darkblue-light" />
          </div>
        </motion.div>

        <h2 className="text-4xl font-extrabold text-center text-darkblue mb-8 tracking-tight">Create Account</h2>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center font-bold border border-red-200"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <label className="block text-sm font-bold text-darkblue-light mb-2">Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-golf/20 focus:border-golf focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400" placeholder="Enter your email" />
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <label className="block text-sm font-bold text-darkblue-light mb-2">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-golf/20 focus:border-golf focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400" placeholder="Create a password" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <label className="block text-sm font-bold text-darkblue-light mb-2">Select Charity</label>
            <select required value={selectedCharity} onChange={e => setSelectedCharity(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-golf/20 focus:border-golf focus:bg-white transition-all outline-none appearance-none font-bold text-gray-700">
              <option value="">Choose a charity...</option>
              {charities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-gray-50/80 p-5 rounded-2xl border-2 border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-bold text-darkblue-light">Donation Amount</label>
              <span className="text-golf-dark font-black text-xl">{charityPercentage}%</span>
            </div>
            <input type="range" min="10" max="100" value={charityPercentage} onChange={e => setCharityPercentage(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-golf transition-all hover:h-4" />
            <p className="text-xs text-gray-500 mt-3 font-semibold text-center">A minimum of 10% from subscriptions goes to charity.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <button type="submit" disabled={loading} 
              className="w-full bg-gradient-to-r from-golf to-darkblue-light text-white font-extrabold text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-neon hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:-translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </motion.div>
        </form>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 text-center text-gray-500 font-semibold">
          Already have an account? <Link to="/login" className="text-darkblue font-bold hover:text-golf transition-colors ml-1 underline decoration-2 underline-offset-4 decoration-golf/30 hover:decoration-golf">Sign In</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
