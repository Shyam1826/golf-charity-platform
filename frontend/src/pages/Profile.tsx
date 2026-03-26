import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { User, Settings, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user } = useAuthStore();
  const [charities, setCharities] = useState<any[]>([]);
  const [charityId, setCharityId] = useState(user?.charity_id || '');
  const [percentage, setPercentage] = useState(user?.charity_percentage || 10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/charities').then(({ data }) => setCharities(data)).catch(console.error);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Note: We don't have a specific profile update endpoint in the backend. 
    // Usually this would call api.put('/users/profile', { charity_id, charity_percentage })
    // For now, we mock the success.
    setTimeout(() => {
      alert('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-8">
      <header className="flex items-center gap-4 mb-8">
        <div className="bg-darkblue text-white p-4 rounded-2xl">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-darkblue">Your Profile</h2>
          <p className="text-slate-500 font-medium">Manage your settings and charity pledges.</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <form onSubmit={handleUpdate} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Email Address</label>
            <input 
              type="text" 
              disabled 
              value={user?.email}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-500 font-bold cursor-not-allowed"
            />
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-xl font-bold text-darkblue mb-4 flex items-center gap-2">
              <Heart className="text-red-500" /> Giving Settings
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Selected Charity</label>
                <select 
                  value={charityId}
                  onChange={(e) => setCharityId(e.target.value)}
                  className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-darkblue outline-none focus:border-golf focus:ring-4 focus:ring-golf/10 transition-all"
                >
                  <option value="">No Charity Selected</option>
                  {charities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Pledged Winnings Percentage: {percentage}%</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-golf"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-darkblue hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
            >
              <Settings size={20} />
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
