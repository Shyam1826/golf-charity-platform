import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Users, PlaySquare, Trophy, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Admin() {
  const [users, setUsers] = useState<any[]>([]);
  const [drawResult, setDrawResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleRunDraw = async () => {
    if (!confirm('Are you sure you want to run the monthly draw?')) return;
    setLoading(true);
    try {
      const { data } = await api.post('/admin/draws/run');
      setDrawResult(data);
      alert('Draw completed successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to run draw');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner text="Loading users map..." />;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.header variants={itemVariants} className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-darkblue tracking-tight">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-golf to-golf-dark">Control Panel</span>
          </h2>
          <p className="text-gray-500 mt-3 font-semibold text-lg">Manage the platform and execute monthly draws.</p>
        </div>
        <button
          onClick={handleRunDraw}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-extrabold text-lg py-4 px-8 rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
        >
          {loading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <AlertCircle size={24} />
            </motion.div>
          ) : (
            <PlaySquare size={24} />
          )}
          {loading ? 'Running Draw...' : 'Force Monthly Draw'}
        </button>
      </motion.header>

      <AnimatePresence>
        {drawResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-gradient-to-br from-gold/20 to-orange-100/50 backdrop-blur-md border border-gold/40 rounded-[2rem] p-8 mb-8 shadow-glass relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy size={150} className="text-gold" />
            </div>
            <h3 className="text-3xl font-black text-yellow-900 mb-8 flex items-center gap-3 relative z-10">
              <div className="bg-gold p-2 rounded-xl text-white shadow-md">
                <Trophy size={28} />
              </div>
              Latest Draw Results
            </h3>

            <div className="grid md:grid-cols-2 gap-8 relative z-10">
              <div className="bg-white/60 p-6 rounded-3xl border border-white/50">
                <p className="text-sm text-yellow-800 font-bold uppercase tracking-wider mb-4">Winning Numbers</p>
                <div className="flex flex-wrap gap-4">
                  {drawResult.draw.winning_numbers.map((n: number, i: number) => (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: i * 0.1 }}
                      key={i}
                      className="bg-gradient-to-br from-white to-gray-50 text-darkblue font-black text-3xl w-16 h-16 rounded-2xl flex items-center justify-center shadow-md border-b-4 border-gold"
                    >
                      {n}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-white/60 p-6 rounded-3xl border border-white/50 flex flex-col justify-center">
                <p className="text-sm text-yellow-800 font-bold uppercase tracking-wider mb-4">Prizes Summary</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                    <span className="font-bold text-gray-500">Total Winners</span>
                    <span className="font-black text-2xl text-darkblue">{drawResult.winners_count}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-2 border-golf/20">
                    <span className="font-bold text-gray-500">Jackpot Rollover</span>
                    <span className="font-black text-2xl text-golf">${parseFloat(drawResult.draw.jackpot_rollover).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-glass border border-white/50">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-darkblue flex items-center gap-3">
            <div className="bg-darkblue/5 p-3 rounded-2xl text-darkblue">
              <Users size={28} />
            </div>
            User Directory
          </h3>
          <span className="bg-slate-100 text-slate-500 font-bold px-4 py-2 rounded-xl text-sm">
            {users.length} Total Registered
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50/50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-500 text-xs uppercase tracking-widest border-b-2 border-slate-200">
                <th className="p-5 font-black rounded-tl-2xl">User ID</th>
                <th className="p-5 font-black">Email Address</th>
                <th className="p-5 font-black">Access Role</th>
                <th className="p-5 font-black text-right">Chosen Charity</th>
                <th className="p-5 font-black text-right rounded-tr-2xl">Pledged %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u, i) => (
                <motion.tr
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={u.id}
                  className="hover:bg-white transition-colors bg-white/40 group"
                >
                  <td className="p-5 text-sm text-slate-400 font-mono font-medium">{u.id.split('-')[0]}...{u.id.split('-')[4]}</td>
                  <td className="p-5 font-bold text-darkblue">{u.email}</td>
                  <td className="p-5">
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-wider ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-200' : 'bg-slate-200 text-slate-700 border-b-2 border-slate-300'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-5 text-sm font-semibold text-slate-600 text-right group-hover:text-golf transition-colors">{u.charities?.name || '---'}</td>
                  <td className="p-5 text-base font-black text-golf-dark text-right">{u.charity_percentage}%</td>
                </motion.tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 font-semibold text-lg">No user records found in the system.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-red-500 text-white p-4">
          Test UI
        </div>
      </motion.div>
    </motion.div>
  );
}
